#!/usr/bin/env node
/**
 * @prettier
 *
 * Field-level diff of two OpenAPI Specification versions, read from the Fixed Fields and
 * Patterned Fields tables of the official markdown. Prints a draft field map for the tracking
 * document: every row is a fact about the tables; deciding what a row means for Swagger UI
 * (UI impact, breaking or not, which PR) stays with the reader.
 */
import { readFileSync, existsSync } from "node:fs"

import { parseCli } from "./lib/cli.mjs"

const USAGE = `
Usage:
  node diff-spec-versions.mjs <old> <new> [--rename "<Old Object>=<New Object>"]... [--all]
                               [--timeout <ms>]

<old> and <new> are versions (3.1.2, 2.0) fetched from
https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{version}.md,
or paths to local copies of those files.

Reads every Fixed Fields / Patterned Fields table under an "... Object" heading and compares
the two versions per object and field:

  NEW              field (or object) only in <new>
  REMOVED          field (or object) only in <old>; "moved?" names objects of <new> that have
                   a field of the same name
  CHANGED-TYPE     the Type column differs
  CHANGED-REQUIRED the field became required or optional
  REVIEW           same type and required flag, different description: triage it to INHERITED
                   or CHANGED-TYPE. Added or removed \`code\` and "quoted" tokens are listed,
                   because widened value sets (a new allowed value) only show up there
  INHERITED        unchanged (printed with --all)

Output: markdown with an objects table, a field map draft (columns of the tracking document's
field map; UI impact, Breaking and Scope left empty) and the descriptions of REVIEW rows.

  --rename    compare an object that was renamed under its new name, e.g.
              --rename "Swagger Object=OpenAPI Object" (2.0 → 3.0); repeatable
  --all       include INHERITED rows in the field map draft
  --timeout   per-request timeout in milliseconds (default 30000)

Specification extension rows (^x-) are skipped: 2.0 lists them per object, 3.x once.

Exit codes: 0 diff printed, 2 usage error or a version that could not be read.
`

const { values, positionals } = parseCli(USAGE, {
  allowPositionals: true,
  options: {
    all: { type: "boolean", default: false },
    rename: { type: "string", multiple: true, default: [] },
    timeout: { type: "string", default: "30000" },
  },
  validate: ({ values: v, positionals: p }) => {
    if (p.length !== 2) return "two versions or files required"
    if (!/^\d+$/.test(v.timeout)) return "--timeout must be milliseconds"
    const bad = v.rename.find(
      (pair) => !/^[^=]+ Object=[^=]+ Object$/.test(pair)
    )
    if (bad) return `--rename "${bad}": expected "<Old> Object=<New> Object"`
    return undefined
  },
})

const RAW =
  "https://raw.githubusercontent.com/OAI/OpenAPI-Specification/main/versions/{version}.md"

const load = async (source) => {
  if (existsSync(source))
    return { label: source, text: readFileSync(source, "utf8") }
  if (!/^\d+\.\d+(\.\d+)?$/.test(source)) {
    console.error(`error: ${source} is neither a file nor a version`)
    process.exit(2)
  }
  const url = RAW.replace("{version}", source)
  try {
    const res = await fetch(url, {
      signal: AbortSignal.timeout(Number(values.timeout)),
    })
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return { label: url, text: await res.text() }
  } catch (error) {
    console.error(`error: ${url}: ${error.message}`)
    process.exit(2)
  }
}

// cells split on unescaped pipes; a leading/trailing pipe is optional (2.0 has none)
const cells = (line) =>
  line
    .trim()
    .replace(/^\|/, "")
    .replace(/\|$/, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim())

const plain = (text) =>
  text
    .replace(/<a name="[^"]*"\s*\/?>(<\/a>)?/g, "")
    .replace(/\[([^[\]]*)\]\([^)]*\)/g, "$1")
    .replace(/\\\|/g, "|")
    .replace(/\s+/g, " ")
    .trim()

const normalType = (type) =>
  plain(type)
    .replace(/`/g, "")
    .replace(/\s*\|\s*/g, " | ")
    .toLowerCase()

// `"query"` (3.x) and "query" (2.0) are the same token
const tokens = (description) =>
  new Set(
    [...description.matchAll(/`([^`]+)`|"([^"]+)"/g)].map(([, code, quoted]) =>
      (code ?? quoted).replace(/^"(.*)"$/, "$1")
    )
  )

/**
 * Map "Object" -> Map field -> { type, required, description }. A table belongs to the
 * nearest preceding "... Object" heading; only tables under a "Fixed Fields" or "Patterned
 * Fields" heading are read, so examples and other tables are ignored.
 */
const parse = (markdown) => {
  const objects = new Map()
  let object
  let inFieldTable = false
  for (const line of markdown.split("\n")) {
    const heading = line.match(/^#{2,6}\s+(.*?)\s*$/)
    if (heading) {
      const title = heading[1].replace(/`/g, "")
      if (/ Object$/.test(title)) {
        object = title
        if (!objects.has(object)) objects.set(object, new Map())
        inFieldTable = false
      } else {
        inFieldTable =
          Boolean(object) && /Fixed Fields|Patterned Fields/.test(title)
      }
      continue
    }
    if (!inFieldTable || !line.includes('<a name="')) continue
    // Security Scheme tables have an extra column (Validity / Applies To) before Description
    const [name, type = "", ...rest] = cells(line)
    const description = rest.join(" | ")
    const field = plain(name).replace(/`/g, "")
    if (!field || /^\^x-/.test(field)) continue
    objects.get(object).set(field, {
      type: plain(type),
      required: /\*\*REQUIRED\*\*|\*\*Required\.?\*\*/i.test(description),
      description: plain(description),
    })
  }
  return objects
}

const [oldDoc, newDoc] = await Promise.all(positionals.map(load))
const renames = new Map(values.rename.map((pair) => pair.split("=")))
const before = new Map(
  [...parse(oldDoc.text)].map(([name, fields]) => [
    renames.get(name) ?? name,
    fields,
  ])
)
const after = parse(newDoc.text)
const fieldCount = (objects) =>
  [...objects.values()].reduce((sum, fields) => sum + fields.size, 0)
if (fieldCount(before) === 0 || fieldCount(after) === 0) {
  console.error(
    "error: no Fixed Fields tables found; is this OpenAPI Specification markdown?"
  )
  process.exit(2)
}

const objectsWithField = (objects, field) =>
  [...objects].filter(([, fields]) => fields.has(field)).map(([name]) => name)

const rows = []
const review = []
for (const name of new Set([...before.keys(), ...after.keys()])) {
  const old = before.get(name) ?? new Map()
  const cur = after.get(name) ?? new Map()
  for (const field of new Set([...old.keys(), ...cur.keys()])) {
    const a = old.get(field)
    const b = cur.get(field)
    const shown = b ?? a
    const row = { name, field, type: shown.type, required: shown.required }
    if (!a) row.status = "NEW"
    else if (!b) {
      const elsewhere = objectsWithField(after, field).filter((o) => o !== name)
      row.status = elsewhere.length
        ? `REMOVED (moved? ${elsewhere.join(", ")})`
        : "REMOVED"
    } else if (normalType(a.type) !== normalType(b.type)) {
      row.status = "CHANGED-TYPE"
      row.type = `${a.type} → ${b.type}`
    } else if (a.required !== b.required)
      row.status = `CHANGED-REQUIRED (${a.required ? "required → optional" : "optional → required"})`
    else if (a.description !== b.description) {
      row.status = "REVIEW"
      const ta = tokens(a.description)
      const tb = tokens(b.description)
      review.push({
        name,
        field,
        added: [...tb].filter((t) => !ta.has(t)),
        removed: [...ta].filter((t) => !tb.has(t)),
        old: a.description,
        cur: b.description,
      })
    } else row.status = "INHERITED"
    rows.push(row)
  }
}

const count = (status) => rows.filter((r) => r.status.startsWith(status)).length
const esc = (text) => text.replace(/\|/g, "\\|")

console.log(`# OpenAPI ${positionals[0]} → ${positionals[1]}\n`)
console.log(`- Old: ${oldDoc.label} (${fieldCount(before)} fields)`)
console.log(`- New: ${newDoc.label} (${fieldCount(after)} fields)`)
console.log(
  `- Fields: ${count("NEW")} NEW, ${count("REMOVED")} REMOVED, ${count("CHANGED-TYPE")} CHANGED-TYPE, ${count("CHANGED-REQUIRED")} CHANGED-REQUIRED, ${count("REVIEW")} REVIEW, ${count("INHERITED")} INHERITED`
)
console.log(
  "- Tables only: changes in prose (new MUSTs, changed defaults, value sets described outside the tables) need the spec text.\n"
)

// headings of examples ("No XML Object") also end in "Object"; real objects have fields
const withFields = (objects) =>
  new Set(
    [...objects].filter(([, fields]) => fields.size).map(([name]) => name)
  )
const objectsBefore = withFields(before)
const objectsAfter = withFields(after)

console.log("## Objects\n")
console.log("| Object | Status |")
console.log("|--------|--------|")
for (const name of objectsAfter)
  if (!objectsBefore.has(name)) console.log(`| ${name} | NEW |`)
for (const name of objectsBefore)
  if (!objectsAfter.has(name)) console.log(`| ${name} | REMOVED |`)

console.log("\n## Field map draft\n")
console.log(
  "| Object | Field | Type | Required | Status | Breaking | UI impact | Scope |"
)
console.log(
  "|--------|-------|------|----------|--------|----------|-----------|-------|"
)
for (const r of rows) {
  if (r.status === "INHERITED" && !values.all) continue
  console.log(
    `| ${r.name.replace(/ Object$/, "")} | ${esc(r.field)} | ${esc(r.type)} | ${r.required ? "yes" : "no"} | ${r.status} | | | |`
  )
}

if (review.length) {
  console.log("\n## REVIEW rows: description changed\n")
  for (const r of review) {
    console.log(`### ${r.name.replace(/ Object$/, "")}.${r.field}\n`)
    if (r.added.length)
      console.log(
        `- added tokens: ${r.added.map((t) => `\`${t}\``).join(", ")}`
      )
    if (r.removed.length)
      console.log(
        `- removed tokens: ${r.removed.map((t) => `\`${t}\``).join(", ")}`
      )
    console.log(`- old: ${r.old}`)
    console.log(`- new: ${r.cur}\n`)
  }
}

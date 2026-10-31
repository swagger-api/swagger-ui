#!/usr/bin/env node
/**
 * @prettier
 *
 * Reads the field map (OAS) or keyword map (JSON Schema) of a tracking document and checks that
 * every in-scope row that needs code (NEW, CHANGED-TYPE, MOVED; for keywords also CHANGED-SHAPE
 * and RENAMED) is mentioned in source, in a test and in a fixture.
 * A mention is not proof of correct rendering; a missing mention is proof of a gap. Generic names
 * (parent, kind, summary) match unrelated code, so check those rows by hand.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { basename, join } from "node:path"

import { parseCli } from "./lib/cli.mjs"
import { changedFiles } from "./lib/git.mjs"

const USAGE = `
Usage:
  node check-field-coverage.mjs <tracking-doc.md> --plugin <dir> [--plugin <dir>...]
                                [--scope <PR>] [--base <ref>]

Reads every markdown table of the tracking document that has a "Field" (or "Keyword") and a
"Status" column. Rows with status NEW, CHANGED-TYPE, MOVED, CHANGED-SHAPE or RENAMED are checked
unless their "Scope" column contains "deferred" or "out".

For each row the field name must appear (as a whole word, $ and - included) in:
  src      a file under one of the --plugin directories, or a src/ file changed since <ref>
  test     a test under test/unit/**/<plugin> or test/e2e-playwright/**/<plugin>*, or a test
           file changed since <ref>
  fixture  a document under test/e2e-playwright/static/documents whose path contains <plugin>, or
           a changed fixture, as a key ("field:" in YAML, "field": in JSON)

  --scope   only rows whose Scope names this PR, e.g. --scope "PR 3" (not "PR 30"); the gate
            of a feature PR checks its own rows
  --base    git ref for "changed since" (default: main)

Exit codes: 0 every row covered, 1 a row is missing somewhere, 2 usage error.
`

const { values, positionals } = parseCli(USAGE, {
  allowPositionals: true,
  options: {
    plugin: { type: "string", multiple: true, default: [] },
    base: { type: "string", default: "main" },
    scope: { type: "string" },
  },
  validate: ({ values: v, positionals: p }) => {
    if (p.length !== 1) return "exactly one tracking document required"
    if (!existsSync(p[0])) return `${p[0]} not found`
    if (v.plugin.length === 0) return "at least one --plugin directory required"
    const absent = v.plugin.find((dir) => !existsSync(dir))
    return absent ? `${absent} not found` : undefined
  },
})

const cells = (line) =>
  line
    .trim()
    .replace(/^\||\|$/g, "")
    .split(/(?<!\\)\|/)
    .map((cell) => cell.trim().replace(/\\\|/g, "|"))

const parseRows = (markdown) => {
  const rows = []
  let header
  for (const line of markdown.split("\n")) {
    if (!line.trim().startsWith("|")) {
      header = undefined
      continue
    }
    const row = cells(line)
    if (row.every((cell) => /^:?-+:?$/.test(cell))) continue
    if (!header) {
      header = row.map((cell) => cell.toLowerCase())
      continue
    }
    const at = (name) => row[header.indexOf(name)] ?? ""
    const field = at("field") || at("keyword")
    if (!field || !header.includes("status")) continue
    rows.push({
      object: at("object") || at("vocabulary") || at("dialect"),
      field: field.replace(/`/g, ""),
      status: at("status").toUpperCase(),
      scope: at("scope").toLowerCase(),
    })
  }
  return rows
}

// "PR 3" matches "PR 3" and "PR 3 (query)", not "PR 30"
const wanted = values.scope
  ? new RegExp(
      `(^|[^\\w])${values.scope.trim().replace(/[.*+?^${}()|[\]\\]/g, "\\$&")}(?![\\w])`,
      "i"
    )
  : undefined
const inScope = ({ status, scope, field }) =>
  /^(NEW|CHANGED-TYPE|MOVED|CHANGED-SHAPE|RENAMED)\b/.test(status) &&
  !/\b(deferred|out)\b/.test(scope) &&
  (!wanted || wanted.test(scope)) &&
  !/^[{<]/.test(field)

const walk = (path) => {
  if (!existsSync(path)) return []
  if (!statSync(path).isDirectory()) return [path]
  return readdirSync(path)
    .filter((name) => name !== "node_modules" && !name.startsWith("."))
    .flatMap((name) => walk(join(path, name)))
}

const pluginNames = values.plugin.map((dir) => basename(dir.replace(/\/$/, "")))
const changed = changedFiles(values.base)
  .filter(({ status }) => status !== "D")
  .map(({ path }) => path)
  .filter(existsSync)

const CODE = /\.(js|jsx|ts|tsx)$/
const DOC = /\.(ya?ml|json)$/
const uniq = (list) => [...new Set(list)]

const srcFiles = uniq([
  ...values.plugin.flatMap(walk),
  ...changed.filter((path) => path.startsWith("src/")),
]).filter((path) => CODE.test(path))

const testFiles = uniq([
  ...pluginNames.flatMap((name) => walk(`test/unit/core/plugins/${name}`)),
  ...walk("test/e2e-playwright").filter((path) =>
    pluginNames.some((name) => path.includes(name))
  ),
  ...changed.filter((path) => path.startsWith("test/")),
]).filter((path) => CODE.test(path))

const fixtureFiles = uniq([
  ...walk("test/e2e-playwright/static/documents").filter((path) =>
    pluginNames.some((name) => path.includes(name))
  ),
  ...changed.filter((path) => path.startsWith("test/")),
]).filter((path) => DOC.test(path))

// comments don't count: "itemSchema (not yet implemented)" in a JSDoc is not support
const stripComments = (code) =>
  code.replace(/\/\*[\s\S]*?\*\//g, "").replace(/(^|[^:"'`])\/\/.*$/gm, "$1")
const contents = new Map()
const read = (path) => {
  if (!contents.has(path)) {
    const text = readFileSync(path, "utf8")
    contents.set(path, CODE.test(path) ? stripComments(text) : text)
  }
  return contents.get(path)
}
const escape = (text) => text.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
const word = (field) => new RegExp(`(?<![\\w$-])${escape(field)}(?![\\w$-])`)
const key = (field) =>
  new RegExp(`(^|[\\s{,-])["']?${escape(field)}["']?\\s*:`, "m")
const firstHit = (files, re) => files.find((path) => re.test(read(path)))

const allRows = parseRows(readFileSync(positionals[0], "utf8"))
const rows = allRows.filter(inScope)
if (rows.length === 0 && wanted && allRows.some(({ scope }) => wanted.test(scope))) {
  console.log(
    `n/a: "${values.scope}" has rows but none with a NEW / CHANGED-TYPE / MOVED / CHANGED-SHAPE / RENAMED status (SAME, NOT-IN-DRAFT and INHERITED rows need no coverage)`
  )
  process.exit(0)
}
if (rows.length === 0) {
  console.error(
    `error: no NEW / CHANGED-TYPE / MOVED / CHANGED-SHAPE / RENAMED rows in scope${values.scope ? ` for "${values.scope}"` : ""}; check the table headers (Field/Keyword, Status, Scope)`
  )
  process.exit(2)
}

let missing = 0
for (const row of rows) {
  const name = row.object ? `${row.object}.${row.field}` : row.field
  const hits = {
    src: firstHit(srcFiles, word(row.field)),
    test: firstHit(testFiles, word(row.field)),
    fixture: firstHit(fixtureFiles, key(row.field)),
  }
  const gaps = Object.entries(hits).filter(([, hit]) => !hit)
  if (gaps.length > 0) missing += 1
  const status = gaps.length
    ? `MISSING ${gaps.map(([kind]) => kind).join(", ")}`
    : "ok"
  console.log(`${status.padEnd(30)}  ${name}  [${row.status}]`)
}

console.log(
  `\n${rows.length} row(s) in scope, ${missing} with gaps. src: ${srcFiles.length} file(s), tests: ${testFiles.length}, fixtures: ${fixtureFiles.length}.`
)
process.exit(missing > 0 ? 1 : 0)

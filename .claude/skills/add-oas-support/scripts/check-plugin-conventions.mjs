#!/usr/bin/env node
/**
 * @prettier
 *
 * Checks a branch against the Swagger UI conventions that reviews of the OAS 3.2 work
 * (PR #10721, #11090) kept finding. Run from the repository root.
 */
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs"
import { dirname, join, normalize } from "node:path"

import { parseCli } from "./lib/cli.mjs"
import { changedFiles } from "./lib/git.mjs"

const USAGE = `
Usage:
  node check-plugin-conventions.mjs [--base <ref>]

Checks files changed relative to the merge base of <ref> (default: main), plus untracked files:
  DIST          build output (dist/, flavors/*/dist/) is part of the change                   error
  NOT-TS        new source or test file is .js/.jsx instead of .ts/.tsx (CLAUDE.md, #11000),
  PRAGMA        new .js/.jsx/.ts/.tsx file has no @prettier pragma                            error
  CROSS-IMPORT  file in src/core/plugins/<a> imports from src/core/plugins/<b>                error
  HAND-GUARD    hand-written isOAS3x() check in a wrapper; use the createOnlyOAS3x* factory  warning
  CORE-TOUCH    shared file outside the new plugin changed; prove other versions unaffected  note

Checks changed files only, so findings already on the base branch don't fail the PR:
  DIALECT       default$schema points at an OpenAPI document schema (/schema/), not a dialect  error

Checks the whole tree:
  PRESET-ORDER  newest OpenAPI plugin is not the last OpenAPI plugin in presets/apis          error
  EXPORT        an OpenAPI plugin directory has no SwaggerUI.plugins entry in src/core/index.js note
  UNRELEASED    package.json takes a dependency from a tarball, path, git or URL (an       warning
                unreleased upstream PR, references/unreleased-upstream.md): fine on a branch,
                replace it with the release before merging

Exit codes: 0 no errors (warnings and notes may remain), 1 errors, 2 usage error.
`

const { values } = parseCli(USAGE, {
  options: { base: { type: "string", default: "main" } },
})

if (!existsSync("src/core/plugins")) {
  console.error("error: run from the swagger-ui repository root")
  process.exit(2)
}

const findings = { error: [], warning: [], note: [] }
const report = (level, code, message) =>
  findings[level].push(`${code.padEnd(12)}  ${message}`)

const changes = changedFiles(values.base)
const present = changes.filter(
  ({ path, status }) => status !== "D" && existsSync(path)
)
const added = present.filter(({ status }) => status === "A" || status === "?")
const read = (path) => readFileSync(path, "utf8")

// DIST
for (const { path } of changes) {
  if (/^(dist|flavors\/[^/]+\/dist)\//.test(path))
    report("error", "DIST", `${path}: build output must not be committed`)
}

// NOT-TS: new code files under src/ and test/ (fixtures and docs are fine)
for (const { path } of added) {
  if (!/^(src|test)\/.*\.(js|jsx)$/.test(path)) continue
  report(
    "error",
    "NOT-TS",
    `${path}: new files are TypeScript (.ts, .tsx, .test.ts, .spec.ts)`
  )
}

// PRAGMA: only new files; some older files predate the pragma
for (const { path } of added) {
  if (!/^(src|test|flavors)\/.*\.(js|jsx|ts|tsx)$/.test(path)) continue
  if (/\/dist\//.test(path)) continue
  const head = read(path).split("\n").slice(0, 8).join("\n")
  if (!head.includes("@prettier"))
    report(
      "error",
      "PRAGMA",
      `${path}: add the /** @prettier */ pragma at the top`
    )
}

// CROSS-IMPORT
const IMPORT_RE =
  /(?:import\s[^"']*?from\s*|import\s*\(\s*|require\s*\(\s*)["']([^"']+)["']/g
const pluginOf = (path) => path.match(/^src\/core\/plugins\/([^/]+)\//)?.[1]
const resolveSpecifier = (file, specifier) => {
  if (specifier.startsWith("core/")) return `src/${specifier}`
  if (specifier.startsWith("."))
    return normalize(join(dirname(file), specifier))
  return undefined
}
for (const { path } of present) {
  const own = pluginOf(path)
  if (!own || !/\.(js|jsx|ts|tsx)$/.test(path)) continue
  for (const [, specifier] of read(path).matchAll(IMPORT_RE)) {
    const target = resolveSpecifier(path, specifier)
    const other = target && pluginOf(`${target}/`)
    if (other && other !== own)
      report(
        "error",
        "CROSS-IMPORT",
        `${path}: imports "${specifier}" from plugin ${other}; copy it into ${own} or use getComponent/fn from the system`
      )
  }
}

// HAND-GUARD: version checks belong in the createOnlyOAS3x* factories of the plugin's fn.js.
// The isOAS3 widening wrapper and the VersionPragmaFilter wrapper legitimately read them.
for (const { path } of present) {
  if (!/^src\/core\/plugins\/oas\d+\//.test(path)) continue
  if (/\/fn\.(js|ts)$|version-pragma-filter\.(jsx|tsx)$/.test(path)) continue
  const lines = read(path).split("\n")
  lines.forEach((line, i) => {
    if (!/\bisOAS3\d+\(\)/.test(line)) return
    const context = lines.slice(Math.max(0, i - 4), i + 1).join("\n")
    if (/export const isOAS3\s*=/.test(context)) return
    report(
      "warning",
      "HAND-GUARD",
      `${path}:${i + 1}: ${line.trim()}  (use createOnlyOAS{V}ComponentWrapper / createOnlyOAS{V}SelectorWrapper / wrapOAS{V}Fn)`
    )
  })
}

// CORE-TOUCH: changed code outside the version plugins that the branch adds
const newPlugins = new Set(
  added.map(({ path }) => pluginOf(path)).filter(Boolean)
)
for (const { path } of present) {
  if (!/^(src|flavors\/swagger-ui-react)\/.*\.(js|jsx|ts|tsx)$/.test(path))
    continue
  const own = pluginOf(path)
  if (own && newPlugins.has(own)) continue
  report(
    "note",
    "CORE-TOUCH",
    `${path}: shared file; a test must show older versions render as before`
  )
}

// DIALECT
const walk = (dir) =>
  readdirSync(dir).flatMap((name) => {
    const path = join(dir, name)
    return statSync(path).isDirectory() ? walk(path) : [path]
  })
const changedPaths = new Set(present.map(({ path }) => path))
for (const path of walk("src/core/plugins")) {
  if (!changedPaths.has(path) || !/\.(js|jsx|ts|tsx)$/.test(path)) continue
  read(path)
    .split("\n")
    .forEach((line, i) => {
      const url = line.match(
        /default\$schema:\s*["'](https:\/\/spec\.openapis\.org\/[^"']+)["']/
      )?.[1]
      if (url && /\/schema\//.test(url))
        report(
          "error",
          "DIALECT",
          `${path}:${i + 1}: ${url} is the OpenAPI document schema; default$schema takes the Schema Object dialect (…/dialect/…)`
        )
    })
}

// PRESET-ORDER
const presetPath = "src/core/presets/apis/index.js"
const presetFile = ["js", "ts"]
  .map((ext) => presetPath.replace(/\.js$/, `.${ext}`))
  .find(existsSync)
if (presetFile) {
  const body = read(presetFile).match(/return\s*\[([\s\S]*?)\]/)?.[1] ?? ""
  const order = [...body.matchAll(/OpenAPI(\d)(\d+)Plugin/g)].map(
    ([, major, minor]) => Number(`${major}.${minor}`)
  )
  const newest = Math.max(...order)
  if (order.length && order.at(-1) !== newest)
    report(
      "error",
      "PRESET-ORDER",
      `${presetFile}: OpenAPI plugins load as ${order.join(", ")}; the newest must be last`
    )
}

// EXPORT
const index = existsSync("src/core/index.js") ? read("src/core/index.js") : ""
for (const name of readdirSync("src/core/plugins")) {
  const version = name.match(/^oas(\d)(\d+)$/)
  if (!version) continue
  const exportName = `OpenAPI${version[1]}${version[2]}`
  if (!new RegExp(`\\b${exportName}:`).test(index))
    report(
      "note",
      "EXPORT",
      `src/core/plugins/${name}: no ${exportName} entry in SwaggerUI.plugins (src/core/index.js)`
    )
}

// UNRELEASED: dependency fields and overrides, nested ones included
const UNRELEASED_SPEC = /^(file:|link:|git\+|git:|github:|https?:)|\.tgz$/
const manifest = JSON.parse(read("package.json"))
const reportUnreleased = (label, entries) =>
  Object.entries(entries ?? {}).forEach(([name, spec]) => {
    if (typeof spec !== "string") reportUnreleased(`${label} ${name} >`, spec)
    else if (UNRELEASED_SPEC.test(spec))
      report(
        "warning",
        "UNRELEASED",
        `package.json: ${label} ${name} is ${spec}; replace it with the release before merging`
      )
  })
for (const field of [
  "dependencies",
  "devDependencies",
  "optionalDependencies",
  "overrides",
])
  reportUnreleased(field, manifest[field])

for (const level of ["note", "warning", "error"])
  for (const line of findings[level])
    console.log(`${level.toUpperCase().padEnd(7)}  ${line}`)
console.log(
  `\n${findings.error.length} error(s), ${findings.warning.length} warning(s), ${findings.note.length} note(s) (base: ${values.base}, ${changes.length} changed file(s))`
)
process.exit(findings.error.length > 0 ? 1 : 0)

#!/usr/bin/env node
/**
 * @prettier
 *
 * Verifies that URLs (including #anchors) referenced in source files resolve.
 * Ported from the ApiDOM monorepo (.claude/skills/add-spec-version/scripts/verify-urls.mjs).
 */
import { execFileSync } from "node:child_process"
import { readFileSync, readdirSync, statSync, existsSync } from "node:fs"
import { join } from "node:path"

import { parseCli } from "./lib/cli.mjs"

const USAGE = `
Usage:
  node verify-urls.mjs [--timeout <ms>] <file-or-dir>...
      check URLs in the given files/directories (*.js, *.jsx, *.ts, *.tsx, *.mjs, *.md, *.json, *.yaml, *.yml)
  node verify-urls.mjs [--timeout <ms>] --diff [base]
      check URLs on lines added relative to the merge base of \`base\` (default: main) and the
      working tree: committed, staged and unstaged changes, plus all lines of untracked files
      (git ls-files --others --exclude-standard)

  --timeout   per-request timeout in milliseconds (default 15000); a timeout is UNVERIFIED
  -h, --help  show this help

Checks:
  - HTTP status is 2xx (after redirects)
  - anchor exists on the target page: \`id="x"\` / \`name="x"\` in HTML, or for GitHub markdown
    blobs an explicit \`<a name="x">\` or a heading whose GitHub slug is \`x\`. A missing anchor
    is BROKEN on markdown sources and on HTML pages with server-rendered ids (e.g.
    a2a-protocol.org); UNVERIFIED only on pages that may render anchors client-side.

Skipped: placeholder URLs containing \`{...}\` (https://{host}/), localhost, RFC 2606 example
domains, and *.patch files. URLs may contain balanced parentheses; a trailing \`)\` closing a
markdown link \`[x](url)\` is not part of the URL.

Exit codes: 0 nothing BROKEN (UNVERIFIED may remain), 1 BROKEN URL or anchor, 2 usage error.
`

const { values, positionals } = parseCli(USAGE, {
  allowPositionals: true,
  options: {
    diff: { type: "boolean", default: false },
    timeout: { type: "string", default: "15000" },
  },
  validate: ({ values: v, positionals: p }) => {
    if (!/^\d+$/.test(v.timeout) || Number(v.timeout) <= 0)
      return "--timeout must be milliseconds"
    if (v.diff && p.length > 1) return "--diff takes at most one base ref"
    if (!v.diff && p.length === 0) return "files/directories or --diff required"
    const absent = v.diff ? undefined : p.find((path) => !existsSync(path))
    return absent ? `${absent} not found` : undefined
  },
})
const TIMEOUT_MS = Number(values.timeout)

// parentheses are allowed inside URLs (balanced, e.g. wiki/Foo_(bar)); see trimUrl
const URL_RE = /https?:\/\/[^\s'"`<>\]\\]+/g
const trimUrl = (raw) => {
  let url = raw
  for (;;) {
    const before = url
    url = url.replace(/[.,;:!?*]+$/, "")
    const opens = (url.match(/\(/g) ?? []).length
    const closes = (url.match(/\)/g) ?? []).length
    if (url.endsWith(")") && closes > opens) url = url.slice(0, -1)
    if (url === before) return url
  }
}
const isPlaceholder = (url) => /[{}]|%7B.*%7D/i.test(url)
const SKIPPED_FILE = /\.patch$/
const SKIP_HOSTS = new Set(["localhost", "127.0.0.1"])
// RFC 2606 reserved example domains appear in sample values, not real links
const isExampleHost = (hostname) =>
  /(^|\.)example\.(com|org|net)$/.test(hostname)

const walk = (path) => {
  if (statSync(path).isDirectory()) {
    return readdirSync(path)
      .filter(
        (name) =>
          name !== "node_modules" && name !== "dist" && !name.startsWith(".")
      )
      .flatMap((name) => walk(join(path, name)))
  }
  return /\.(js|jsx|ts|tsx|mjs|md|json|yaml|yml)$/.test(path) &&
    !SKIPPED_FILE.test(path)
    ? [path]
    : []
}

const collectFromFiles = (paths) => {
  const found = new Map()
  for (const file of paths.flatMap(walk)) {
    readFileSync(file, "utf8")
      .split("\n")
      .forEach((line, i) => {
        for (const [raw] of line.matchAll(URL_RE)) {
          const url = trimUrl(raw)
          if (!found.has(url)) found.set(url, `${file}:${i + 1}`)
        }
      })
  }
  return found
}

const git = (args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 })

const collectFromDiff = (base) => {
  let mergeBase
  try {
    mergeBase = git(["merge-base", base, "HEAD"]).trim()
  } catch {
    console.error(`error: cannot find merge base of ${base} and HEAD`)
    process.exit(2)
  }
  // merge base vs working tree: committed + staged + unstaged changes
  const diff = git([
    "diff",
    "--unified=0",
    mergeBase,
    "--",
    ".",
    ":(exclude)*.patch",
  ])
  const found = new Map()
  let file = ""
  let line = 0
  for (const text of diff.split("\n")) {
    if (text.startsWith("+++ ")) file = text.slice(6)
    else if (text.startsWith("@@"))
      line = Number(text.match(/\+(\d+)/)?.[1] ?? 0) - 1
    else if (text.startsWith("+")) {
      line += 1
      for (const [raw] of text.matchAll(URL_RE)) {
        const url = trimUrl(raw)
        if (!found.has(url)) found.set(url, `${file}:${line}`)
      }
    }
  }
  const untracked = git(["ls-files", "--others", "--exclude-standard"])
    .split("\n")
    .filter(
      (path) =>
        path &&
        /\.(js|jsx|ts|tsx|mjs|md|json|yaml|yml)$/.test(path) &&
        !SKIPPED_FILE.test(path)
    )
  for (const [url, where] of collectFromFiles(untracked))
    if (!found.has(url)) found.set(url, where)
  return found
}

const githubSlug = (heading) =>
  heading
    .trim()
    .toLowerCase()
    .replace(/<[^>]+>/g, "")
    .replace(/[^\p{L}\p{N}\s_-]/gu, "")
    .replace(/\s/g, "-")

const pageCache = new Map()
const fetchPage = async (pageUrl) => {
  if (!pageCache.has(pageUrl)) {
    pageCache.set(
      pageUrl,
      (async () => {
        const blob = pageUrl.match(
          /^https:\/\/github\.com\/([^/]+\/[^/]+)\/blob\/(.+\.md)$/
        )
        const fetchUrl = blob
          ? `https://raw.githubusercontent.com/${blob[1]}/${blob[2]}`
          : pageUrl
        try {
          const signal = AbortSignal.timeout(TIMEOUT_MS)
          const res = await fetch(fetchUrl, { redirect: "follow", signal })
          const text = res.ok ? await res.text() : ""
          return { status: res.status, text, markdown: Boolean(blob) }
        } catch (error) {
          const timedOut =
            error.name === "TimeoutError" || error.name === "AbortError"
          return {
            status: 0,
            text: "",
            error: timedOut ? `timeout after ${TIMEOUT_MS} ms` : error.message,
          }
        }
      })()
    )
  }
  return pageCache.get(pageUrl)
}

const hasAnchor = ({ text, markdown }, anchor) => {
  const escaped = anchor.replace(/[.*+?^${}()|[\]\\]/g, "\\$&")
  if (new RegExp(`(id|name)=["']${escaped}["']`).test(text)) return true
  if (!markdown) return false
  return text
    .split("\n")
    .filter((line) => /^#{1,6}\s/.test(line))
    .some((line) => githubSlug(line.replace(/^#+\s*/, "")) === anchor)
}

// enough heading ids in the HTML to trust that anchors are rendered server-side
const SERVER_RENDERED_ID_THRESHOLD = 20
const hasServerRenderedIds = ({ text }) =>
  (text.match(/\sid=["'][^"']+["']/g) ?? []).length >=
  SERVER_RENDERED_ID_THRESHOLD

const urls = values.diff
  ? collectFromDiff(positionals[0] ?? "main")
  : collectFromFiles(positionals)

const RETRYABLE = new Set([429, 502, 503, 504])
const results = { broken: [], unverified: [] }

const checkUrl = async ([raw, where]) => {
  const url = trimUrl(raw)
  // skip templated example URLs such as https://{username}.server.com:{port}/
  if (isPlaceholder(url) || !URL.canParse(url)) return
  const { hostname } = new URL(url)
  if (SKIP_HOSTS.has(hostname) || isExampleHost(hostname)) return
  const [pageUrl, anchor] = url.split("#")
  const page = await fetchPage(pageUrl)
  if (page.status === 0 || RETRYABLE.has(page.status)) {
    const reason = page.status ? `HTTP ${page.status}` : page.error
    results.unverified.push(`${url}  (${reason})  ${where}`)
  } else if (page.status < 200 || page.status >= 300) {
    results.broken.push(`${url}  (HTTP ${page.status})  ${where}`)
  } else if (anchor && !hasAnchor(page, decodeURIComponent(anchor))) {
    // Markdown sources are authoritative. HTML pages that already carry server-rendered anchors
    // (static site generators such as MkDocs) are too: a missing anchor there is a broken link.
    // Only pages without server-rendered ids may add anchors client-side.
    const bucket =
      page.markdown || hasServerRenderedIds(page)
        ? results.broken
        : results.unverified
    bucket.push(`${url}  (anchor #${anchor} not found)  ${where}`)
  }
}

// small worker pool: avoids GitHub rate limiting (HTTP 429/503)
const queue = [...urls]
await Promise.all(
  Array.from({ length: 6 }, async () => {
    while (queue.length > 0) await checkUrl(queue.shift())
  })
)

for (const line of results.unverified.sort()) console.log(`UNVERIFIED  ${line}`)
for (const line of results.broken.sort()) console.log(`BROKEN      ${line}`)
console.log(
  `\nChecked ${urls.size} URL(s): ${results.broken.length} broken, ` +
    `${results.unverified.length} unverified (rate limited, timeout, network error, or ` +
    "client-rendered anchor)."
)
process.exit(results.broken.length > 0 ? 1 : 0)

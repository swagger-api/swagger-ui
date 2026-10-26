/**
 * @prettier
 */
import { execFileSync } from "node:child_process"

export const git = (args) =>
  execFileSync("git", args, { encoding: "utf8", maxBuffer: 256 * 1024 * 1024 })

export const mergeBaseOf = (base) => {
  try {
    return git(["merge-base", base, "HEAD"]).trim()
  } catch {
    console.error(`error: cannot find merge base of ${base} and HEAD`)
    process.exit(2)
  }
}

/**
 * Files changed between the merge base of `base` and the working tree (committed, staged and
 * unstaged), plus untracked files. Each entry is { path, status } where status is the git
 * name-status letter (A, M, D, R...) or "?" for untracked files.
 */
export const changedFiles = (base) => {
  const mergeBase = mergeBaseOf(base)
  const tracked = git(["diff", "--name-status", "--no-renames", mergeBase])
    .split("\n")
    .filter(Boolean)
    .map((line) => {
      const [status, path] = line.split("\t")
      return { path, status: status[0] }
    })
  const untracked = git(["ls-files", "--others", "--exclude-standard"])
    .split("\n")
    .filter(Boolean)
    .map((path) => ({ path, status: "?" }))
  return [...tracked, ...untracked]
}

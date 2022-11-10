/**
 * @prettier
 */

import { gitDescribeSync } from "git-describe"

export function getRepoInfo() {
  try {
    return gitDescribeSync(__dirname)
  } catch (e) {
    console.error(e)
    return {
      hash: "noGit",
      dirty: false,
    }
  }
}

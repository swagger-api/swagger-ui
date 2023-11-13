/**
 * @prettier
 */

const { gitDescribeSync } = require("git-describe")

function getRepoInfo() {
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

module.exports = {
  getRepoInfo,
}

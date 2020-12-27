import { isFunc } from "../../utils"

export default function(taggedOps, phrase, filterConfig = {
  isRegexFilter: false,
  matchCase: true,
  matchWords: false,
}) {
  if(isFunc(filterConfig.toJS)) {
    filterConfig = filterConfig.toJS()
  }
  if(phrase === "") {
    return taggedOps
  }
  if (filterConfig.isRegexFilter) {
    let expr
    try {
      expr = new RegExp(
        filterConfig.matchWords
          ? `\\b${phrase}\\b`
          : phrase,
        !filterConfig.matchCase ? "i" : "",
      )
    } catch {
      // noop
    }
    if (expr) {
      return taggedOps.filter((tagObj, tag) => expr.test(tag))
    }
  }
  let isMatch = (tag) => tag.indexOf(phrase) !== -1
  if (filterConfig.matchWords) {
    isMatch = (tag) => {
      const index = tag.indexOf(phrase)
      if (index !== -1) {
        return (index === 0 || tag[index - 1] === " ") &&
          (index + phrase.length === tag.length || tag[index + phrase.length] === " ")
      }
      return false
    }
  }
  if (!filterConfig.matchCase) {
    phrase = phrase.toLowerCase()
  }
  return taggedOps
    .filter((tagObj, tag) => isMatch(!filterConfig.matchCase
      ? tag.toLowerCase()
      : tag))
}

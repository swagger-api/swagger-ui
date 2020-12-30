import { isFunc } from "../../utils"

export default function(taggedOps, phrase, filterConfig = {
  isRegexFilter: false,
  matchCase: true,
  matchWords: false,
  searchLocation: "tag"
}) {
  if(isFunc(filterConfig.toJS)) {
    filterConfig = filterConfig.toJS()
  }
  filterConfig.searchLocation ??= "tag"
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
      switch (filterConfig.searchLocation) {
        case "tag":
          return taggedOps.filter((tagObj, tag) => expr.test(tag))
        case "route":
          return taggedOps.mapEntries(([k,v]) => {
            const newValue = v.set(
              "operations",
              v.get("operations")
                .filter(op => expr.test(op.get("path")))
            )
            return [k, newValue]
          }).filter((tagObj) => tagObj.get("operations").size !== 0)
      }
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
  switch (filterConfig.searchLocation) {
    case "tag":
      return taggedOps
        .filter((tagObj, tag) => isMatch(!filterConfig.matchCase
          ? tag.toLowerCase()
          : tag))
    case "route":
      return taggedOps.mapEntries(([k,v]) => {
        const newValue = v.set(
          "operations",
          v.get("operations")
            .filter(op => isMatch(!filterConfig.matchCase
              ? op.get("path").toLowerCase()
              : op.get("path")))
        )
        return [k, newValue]
      }).filter((tagObj) => tagObj.get("operations").size !== 0)
  }
}

export function canJsonParse(str) {
  try {
    let testValueForJson = JSON.parse(str)
    return testValueForJson ? true : false
  } catch (e) {
    // exception: string is not valid json
    return null
  }
}

export function getKnownSyntaxHighlighterLanguage(val) {
  // to start, only check for json. can expand as needed in future
  const isValidJson = canJsonParse(val)
  return isValidJson ? "json" : null
}

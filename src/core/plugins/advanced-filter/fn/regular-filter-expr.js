export const getRegularFilterExpr = (options, phrase) => {
  let expr
  try {
    expr = new RegExp(
      options.get("matchWholeWord")
        ? `\\b${phrase}\\b`
        : phrase,
      !options.get("matchCase") ? "i" : "",
    )
  } catch {
    // TODO: add errors to state
  }
  return expr
}

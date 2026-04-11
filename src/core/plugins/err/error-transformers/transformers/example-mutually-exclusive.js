export function transform(errors) {
  // Filter out false-positive "mutually exclusive" errors for ExampleElement
  // that occur when path-level $ref is used with examples containing externalValue.
  // This is a known issue in the upstream apidom-reference library where
  // the resolver incorrectly reports value and externalValue as mutually exclusive
  // after resolving a path-level $ref.
  // See: https://github.com/swagger-api/swagger-ui/issues/10418
  return errors.filter((err) => {
    if (err.get("source") !== "resolver") {
      return true
    }
    const message = err.get("message") || ""
    return (
      message.indexOf(
        "ExampleElement value and externalValue fields are mutually exclusive"
      ) === -1
    )
  })
}

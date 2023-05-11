/**
 * @prettier
 */
export const makeIsExpandable = (original, { fn }) => {
  if (typeof original !== "function") {
    return null
  }

  const { hasKeyword } = fn.jsonSchema202012

  return (schema) =>
    original(schema) || hasKeyword(schema, "example") || schema?.xml
}

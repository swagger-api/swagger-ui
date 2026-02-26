/**
 * @prettier
 */
export const makeGetSchemaKeywords = (original) => {
  if (typeof original !== "function") {
    return null
  }

  const jsonSchema202012Keywords = original()

  return () => [
    ...jsonSchema202012Keywords,
    "discriminator",
    "xml",
    "externalDocs",
    "example",
    // $$ref is an internal keyword used for dereferencing
    "$$ref",
  ]
}

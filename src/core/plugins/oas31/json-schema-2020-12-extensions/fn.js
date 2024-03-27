/**
 * @prettier
 */
export const makeIsExpandable = (original, getSystem) => {
  const { fn } = getSystem()

  if (typeof original !== "function") {
    return null
  }

  const { hasKeyword } = fn.jsonSchema202012

  return (schema) =>
    original(schema) ||
    hasKeyword(schema, "example") ||
    schema?.xml ||
    schema?.discriminator ||
    schema?.externalDocs
}

export const getProperties = (
  schema,
  { includeReadOnly, includeWriteOnly }
) => {
  // shortcut
  if (!schema?.properties) return {}

  const properties = Object.entries(schema.properties)
  const filteredProperties = properties.filter(([, value]) => {
    const isReadOnly = value?.readOnly === true
    const isWriteOnly = value?.writeOnly === true

    return (
      (!isReadOnly || includeReadOnly) && (!isWriteOnly || includeWriteOnly)
    )
  })

  return Object.fromEntries(filteredProperties)
}

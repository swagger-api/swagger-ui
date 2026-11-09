/**
 * @prettier
 */

/**
 * The slot of a keyword the instance's dialect does not have (e.g. 2020-12
 * `const` in an OpenAPI 3.0 schema): it renders nothing, and the keyword is
 * listed with the extension keywords instead (it is not in the dialect's
 * keyword list).
 */
const Unsupported = () => null

Unsupported.displayName = "JSONSchemaUnifiedUnsupportedKeyword"

export default Unsupported

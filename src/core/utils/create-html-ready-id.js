/**
 * Replace invalid characters from a string to create an html-ready ID
 *
 * @param {string} id A string that may contain invalid characters for the HTML ID attribute
 * @param {string} [replacement=_] The string to replace invalid characters with; "_" by default
 * @return {string} Information about the parameter schema
 */
export default function createHtmlReadyId(id, replacement = "_") {
  return id.replace(/[^\w-]/g, replacement)
}

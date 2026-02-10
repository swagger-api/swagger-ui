/**
 * @prettier
 */

/**
 * afterLoad hook for OAS 3.2 plugin
 *
 * This hook runs after all plugins are loaded and allows
 * modification of the system's functions and behaviors.
 *
 * OAS 3.2 is a minor version update with backward-compatible additions,
 * so minimal modifications are needed.
 */
function afterLoad() {
  // TODO: OAS 3.2 should use the new JSON Schema version from
  // https://spec.openapis.org/oas/3.2/schema/2025-09-17.html
  // Currently using JSON Schema 2020-12 from OAS 3.1 for basic implementation.
  // This needs to be updated to properly support OAS 3.2 schema validation.

  // Future: If any function wrapping is needed for OAS 3.2 specific behavior,
  // it can be added here using wrapOAS32Fn
}

export default afterLoad

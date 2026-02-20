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
  // OAS 3.2 uses JSON Schema 2020-12 (same as OAS 3.1), as indicated by the
  // "$schema": "https://json-schema.org/draft/2020-12/schema" field.
  // The OAS 3.2 meta-schema is at https://spec.openapis.org/oas/3.2/schema/2025-09-17.html
  // but it describes the OAS 3.2 document structure, not a new JSON Schema dialect.
  // Future: If any function wrapping is needed for OAS 3.2 specific behavior,
  // it can be added here using wrapOAS32Fn
}

export default afterLoad

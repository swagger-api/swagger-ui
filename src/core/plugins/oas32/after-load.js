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
  // OAS 3.2 uses the same JSON Schema version (2020-12) as OAS 3.1,
  // so no sample generation overrides are needed.
  // Future: If any function wrapping is needed for OAS 3.2 specific behavior,
  // it can be added here using wrapOAS32Fn
}

export default afterLoad

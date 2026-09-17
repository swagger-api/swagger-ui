/**
 * Wraps a user-provided parameterMacro function to handle undefined return values.
 *
 * When parameterMacro returns undefined (e.g., for parameters the user doesn't
 * want to modify), swagger-client would attempt to set the parameter's default
 * to undefined, which causes a "Invalid value used as weak map key" error in
 * OpenAPI 3.1.x resolution.
 *
 * This wrapper ensures that undefined return values are replaced with the
 * parameter's existing default value, preventing the error.
 */
const wrapParameterMacro = (parameterMacro) => {
  if (typeof parameterMacro !== "function") return parameterMacro
  return (operation, parameter) => {
    const result = parameterMacro(operation, parameter)
    if (typeof result === "undefined") {
      return parameter.default
    }
    return result
  }
}

export default wrapParameterMacro

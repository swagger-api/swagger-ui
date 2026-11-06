/**
 * @prettier
 */
import { makeUnifiedViewWrapper } from "./gate"

/**
 * `Models` (the Schemas section). Every property is shown and the schemas
 * expand to `defaultModelsExpandDepth - 1` levels, as in oas31's Models
 * wrapper.
 */
const ModelsWrapper = makeUnifiedViewWrapper("Models", (props, configs) => ({
  includeReadOnly: true,
  includeWriteOnly: true,
  defaultExpandedLevels:
    typeof configs.defaultModelsExpandDepth === "number"
      ? configs.defaultModelsExpandDepth - 1
      : undefined,
  showExtensions:
    typeof configs.showExtensions === "boolean"
      ? configs.showExtensions
      : undefined,
}))

export default ModelsWrapper

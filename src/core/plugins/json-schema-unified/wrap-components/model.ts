/**
 * @prettier
 */
import { makeUnifiedViewWrapper } from "./gate"

const asNumber = (value: unknown): number | undefined =>
  typeof value === "number" ? value : undefined

const asBoolean = (value: unknown): boolean | undefined =>
  typeof value === "boolean" ? value : undefined

/**
 * `Model` (the Schema tab: modelExample -> ModelWrapper -> Model). Request
 * schemas pass `includeWriteOnly`, response schemas `includeReadOnly`; the
 * expansion depth is `defaultModelExpandDepth`, as in oas31's Model wrapper.
 */
const ModelWrapper = makeUnifiedViewWrapper("Model", (props, configs) => ({
  includeReadOnly: Boolean(props.includeReadOnly),
  includeWriteOnly: Boolean(props.includeWriteOnly),
  defaultExpandedLevels: asNumber(configs.defaultModelExpandDepth),
  showExtensions: asBoolean(configs.showExtensions),
}))

export default ModelWrapper

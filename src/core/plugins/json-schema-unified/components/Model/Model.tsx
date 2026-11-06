/**
 * @prettier
 */
import React, { useCallback } from "react"
import PropTypes from "prop-types"
import { isImmutable } from "immutable"

import { toPlainSchema } from "../../schemas"
import { MODEL } from "../../styles"

type AnyComponent = React.ComponentType<Record<string, unknown>>

const decodeRefName = (uri: string): string => {
  const unescaped = uri.replace(/~1/g, "/").replace(/~0/g, "~")
  try {
    return decodeURIComponent(unescaped)
  } catch {
    return unescaped
  }
}

/** The schema name of a `#/components/schemas/<name>` reference, else `undefined`. */
export const getModelName = (uri: unknown): string | undefined => {
  if (typeof uri === "string" && uri.includes("#/components/schemas/")) {
    return decodeRefName(uri.replace(/^.*#\/components\/schemas\//, ""))
  }
  return undefined
}

const toArray = (value: unknown): unknown[] => {
  if (Array.isArray(value)) return value
  if (isImmutable(value))
    return (value as { toArray: () => unknown[] }).toArray()
  return []
}

export interface ModelProps {
  /** Immutable Schema Object (as ModelWrapper passes it) or a plain one. */
  schema: unknown
  getComponent: (name: string, container?: boolean) => AnyComponent | null
  onToggle?: (name: string | undefined, expanded: boolean) => void
  specPath: unknown
}

/**
 * The Schema tab's schema (copy of oas31's `OAS31Model`): the schema rendered
 * by `JSONSchemaUnified`, named after its `$$ref`, with an identifier derived
 * from its spec path. The enclosing instance (see `../../views`) carries the
 * dialect, readOnly/writeOnly flags and expansion depth.
 */
const Model = ({
  schema,
  getComponent,
  onToggle = () => {},
  specPath,
}: ModelProps) => {
  const JSONSchemaUnified = getComponent("JSONSchemaUnified")
  const plainSchema = toPlainSchema(schema ?? {})
  const name = getModelName(
    plainSchema && typeof plainSchema === "object"
      ? plainSchema.$$ref
      : undefined
  )

  const handleExpand = useCallback(
    (e: unknown, expanded: boolean) => {
      onToggle(name, expanded)
    },
    [name, onToggle]
  )

  return (
    <div data-json-schema-unified-model="" className={MODEL}>
      <JSONSchemaUnified
        name={name}
        schema={plainSchema}
        onExpand={handleExpand}
        identifier={toArray(specPath).join("_")}
      />
    </div>
  )
}

Model.propTypes = {
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  getComponent: PropTypes.func.isRequired,
  onToggle: PropTypes.func,
  specPath: PropTypes.oneOfType([PropTypes.object, PropTypes.array]).isRequired,
}

export default Model

/**
 * @prettier
 */
import React, { useCallback, useMemo } from "react"
import PropTypes from "prop-types"
import { List } from "immutable"

import type { Schema } from "../../types"

type AnyComponent = React.ComponentType<Record<string, unknown>>

export interface SchemaItemProps {
  schemaName: string
  schema: Schema
  name: string
  schemasPath: string[]
  specSelectors: {
    specResolvedSubtree: (path: string[]) => unknown
  }
  specActions: {
    requestResolvedSubtree: (path: string[]) => void
  }
  layoutActions: {
    show: (path: string[], value: boolean) => void
    readyToScroll: (path: string[], node: HTMLElement) => void
  }
  getComponent: (name: string, container?: boolean) => AnyComponent | null
}

/**
 * One schema of the Schemas section (copy of oas31's `SchemaItem`): expanding
 * it requests its resolved subtree and records the expansion in the layout
 * state at `[...schemasPath, schemaName]`; its element is the deep-link
 * scroll target of that key. The title carries `JumpToPath` with the schema's
 * spec path, as json-schema-5's model item does.
 */
const SchemaItem = React.memo(
  ({
    schemaName,
    schema,
    name,
    schemasPath,
    specSelectors,
    specActions,
    layoutActions,
    getComponent,
  }: SchemaItemProps) => {
    const JSONSchemaUnified = getComponent("JSONSchemaUnified")
    const JumpToPath = getComponent("JumpToPath", true)
    const schemaPath = useMemo(
      () => [...schemasPath, schemaName],
      [schemasPath, schemaName]
    )
    const specPath = useMemo(() => List(schemaPath), [schemaPath])

    const handleExpand = useCallback(
      (e: unknown, expanded: boolean) => {
        if (expanded) {
          const isResolved =
            specSelectors.specResolvedSubtree(schemaPath) != null
          if (!isResolved) specActions.requestResolvedSubtree(schemaPath)
          layoutActions.show(schemaPath, true)
        } else {
          layoutActions.show(schemaPath, false)
        }
      },
      [schemaPath, specSelectors, specActions, layoutActions]
    )

    const handleRef = useCallback(
      (node: HTMLElement) => {
        if (node !== null) layoutActions.readyToScroll(schemaPath, node)
      },
      [schemaPath, layoutActions]
    )

    if (!JSONSchemaUnified) return null

    return (
      <JSONSchemaUnified
        ref={handleRef}
        schema={schema}
        name={name}
        onExpand={handleExpand}
        titleAddon={JumpToPath ? <JumpToPath path={specPath} /> : null}
      />
    )
  }
)

SchemaItem.displayName = "JSONSchemaUnifiedSchemaItem"

SchemaItem.propTypes = {
  schemaName: PropTypes.string.isRequired,
  schema: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]).isRequired,
  name: PropTypes.string.isRequired,
  schemasPath: PropTypes.arrayOf(PropTypes.string).isRequired,
  specSelectors: PropTypes.shape({
    specResolvedSubtree: PropTypes.func.isRequired,
  }).isRequired,
  specActions: PropTypes.shape({
    requestResolvedSubtree: PropTypes.func.isRequired,
  }).isRequired,
  layoutActions: PropTypes.shape({
    show: PropTypes.func.isRequired,
    readyToScroll: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default SchemaItem

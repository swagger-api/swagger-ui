/**
 * @prettier
 */
import React, { useCallback } from "react"

const SCHEMAS_PATH = ["components", "schemas"]

interface SchemaItemProps {
  schemaName: string
  schema: object
  name: string
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
  getComponent: (
    name: string,
    required?: boolean
  ) => React.ComponentType<Record<string, unknown>> | null
}

const SchemaItem = React.memo(
  ({
    schemaName,
    schema,
    name,
    specSelectors,
    specActions,
    layoutActions,
    getComponent,
  }: SchemaItemProps) => {
    const JSONSchema202012 = getComponent("JSONSchema202012")

    const handleJSONSchema202012Expand = useCallback(
      (e: unknown, expanded: boolean) => {
        const schemaPath = [...SCHEMAS_PATH, schemaName]
        if (expanded) {
          const isResolved =
            specSelectors.specResolvedSubtree(schemaPath) != null
          if (!isResolved) specActions.requestResolvedSubtree(schemaPath)
          layoutActions.show(schemaPath, true)
        } else {
          layoutActions.show(schemaPath, false)
        }
      },
      [schemaName, specSelectors, specActions, layoutActions]
    )

    const handleJSONSchema202012Ref = useCallback(
      (node: HTMLElement) => {
        if (node !== null)
          layoutActions.readyToScroll([...SCHEMAS_PATH, schemaName], node)
      },
      [schemaName, layoutActions]
    )

    if (!JSONSchema202012) return null

    return (
      <JSONSchema202012
        ref={handleJSONSchema202012Ref}
        schema={schema}
        name={name}
        onExpand={handleJSONSchema202012Expand}
      />
    )
  }
)

SchemaItem.displayName = "SchemaItem"

export default SchemaItem

/**
 * @prettier
 */
import React from "react"
import { Map, List, is } from "immutable"

interface ModelItemProps {
  name: string
  schema: Map<string, unknown>
  rawSchema: Map<string, unknown>
  isShown: boolean
  specPathBase: string[]
  defaultModelsExpandDepth: number
  getComponent: (
    componentName: string,
    container?: boolean,
    config?: object
  ) => React.ComponentType<Record<string, unknown>> | null
  specSelectors: object
  getConfigs: () => Record<string, unknown>
  layoutSelectors: object
  layoutActions: object
  specActions: {
    requestResolvedSubtree: (path: string[]) => void
  }
  getCollapsedContent: (name: string) => React.ReactNode
  handleToggle: (name: string, isExpanded: boolean) => void
  onLoadModel: (ref: HTMLElement | null) => void
}

const ModelItem = React.memo(
  ({
    name,
    schema,
    rawSchema,
    isShown,
    specPathBase,
    defaultModelsExpandDepth,
    getComponent,
    specSelectors,
    getConfigs,
    layoutSelectors,
    layoutActions,
    specActions,
    getCollapsedContent,
    handleToggle,
    onLoadModel,
  }: ModelItemProps) => {
    const fullPath = [...specPathBase, name]
    const specPath = List(fullPath)

    const displayName =
      (schema.get("title") as string | undefined) ||
      (rawSchema.get("title") as string | undefined) ||
      name

    if (isShown && schema.size === 0 && rawSchema.size > 0) {
      // Firing an action in a container render is not great,
      // but it works for now.
      specActions.requestResolvedSubtree(fullPath)
    }

    const ModelWrapper = getComponent("ModelWrapper")
    const ModelCollapse = getComponent("ModelCollapse")
    const JumpToPath = getComponent("JumpToPath", true)

    const content = (
      <ModelWrapper
        name={name}
        expandDepth={defaultModelsExpandDepth}
        schema={schema || Map<string, unknown>()}
        displayName={displayName}
        fullPath={fullPath}
        specPath={specPath}
        getComponent={getComponent}
        specSelectors={specSelectors}
        getConfigs={getConfigs}
        layoutSelectors={layoutSelectors}
        layoutActions={layoutActions}
        includeReadOnly={true}
        includeWriteOnly={true}
      />
    )

    const title = (
      <span className="model-box">
        <strong className="model model-title">{displayName}</strong>
      </span>
    )

    return (
      <div
        id={`model-${name}`}
        className="model-container"
        data-name={name}
        ref={onLoadModel}
      >
        <span className="models-jump-to-path">
          <JumpToPath path={specPath} />
        </span>
        <ModelCollapse
          classes="model-box"
          collapsedContent={getCollapsedContent(name)}
          onToggle={handleToggle}
          title={title}
          displayName={displayName}
          modelName={name}
          specPath={specPath}
          layoutSelectors={layoutSelectors}
          layoutActions={layoutActions}
          hideSelfOnExpand={true}
          expanded={defaultModelsExpandDepth > 0 && isShown}
        >
          {content}
        </ModelCollapse>
      </div>
    )
  },
  (prev: ModelItemProps, next: ModelItemProps) =>
    prev.name === next.name &&
    prev.isShown === next.isShown &&
    prev.defaultModelsExpandDepth === next.defaultModelsExpandDepth &&
    prev.specPathBase === next.specPathBase &&
    is(prev.schema, next.schema) &&
    is(prev.rawSchema, next.rawSchema)
)

ModelItem.displayName = "ModelItem"

export default ModelItem

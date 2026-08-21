/**
 * @prettier
 */
import React, { useRef, useMemo, useCallback, useEffect } from "react"
import Im, { Map } from "immutable"
import PropTypes from "prop-types"
import { useVirtualizer } from "@tanstack/react-virtual"
import { VIRTUALIZE_MODELS_THRESHOLD } from "core/utils"

/* eslint-disable  react/jsx-no-bind */

const Models = ({
  getComponent,
  specSelectors,
  specActions,
  layoutSelectors,
  layoutActions,
  getConfigs,
}) => {
  const definitions = specSelectors.definitions()
  const { docExpansion, defaultModelsExpandDepth } = getConfigs()

  const isOAS3 = specSelectors.isOAS3()
  const specPathBase = useMemo(
    () => (isOAS3 ? ["components", "schemas"] : ["definitions"]),
    [isOAS3]
  )

  const getCollapsedContent = useCallback(() => " ", [])

  const handleToggle = useCallback(
    (name, isExpanded) => {
      layoutActions.show([...specPathBase, name], isExpanded)
      if (isExpanded) {
        specActions.requestResolvedSubtree([...specPathBase, name])
      }
    },
    [layoutActions, specActions, specPathBase]
  )

  const onLoadModels = useCallback(
    (ref) => {
      if (ref) {
        layoutActions.readyToScroll(specPathBase, ref)
      }
    },
    [layoutActions, specPathBase]
  )

  const onLoadModel = useCallback(
    (ref) => {
      if (ref) {
        const name = ref.getAttribute("data-name")
        layoutActions.readyToScroll([...specPathBase, name], ref)
      }
    },
    [layoutActions, specPathBase]
  )

  const definitionEntries = useMemo(
    () => definitions.entrySeq().toArray(),
    [definitions]
  )

  const parentRef = useRef(null)
  const measurementsCache = useRef([])

  const virtualizer = useVirtualizer({
    count: definitionEntries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 71,
    overscan: 5,
    getItemKey: (index) => `models-section-${definitionEntries[index][0]}`,
    initialMeasurementsCache: measurementsCache.current,
    onChange: (instance) => {
      measurementsCache.current = instance.takeSnapshot()
    },
  })

  const isVirtualized = definitionEntries.length >= VIRTUALIZE_MODELS_THRESHOLD
  const pendingVirtualizedSchemaScroll =
    layoutSelectors.getScrollToVirtualizedSchema()

  useEffect(() => {
    if (!pendingVirtualizedSchemaScroll || !isVirtualized) return

    const idx = definitionEntries.findIndex(
      ([name]) => name === pendingVirtualizedSchemaScroll
    )

    if (idx !== -1) {
      virtualizer.scrollToIndex(idx, { align: "start" })
      layoutActions.scrollToElement(parentRef.current)
    }

    layoutActions.clearScrollToVirtualizedSchema()
  }, [
    pendingVirtualizedSchemaScroll,
    definitionEntries,
    virtualizer,
    isVirtualized,
    layoutActions,
  ])

  if (!definitions.size || defaultModelsExpandDepth < 0) return null

  const showModels = layoutSelectors.isShown(
    specPathBase,
    defaultModelsExpandDepth > 0 && docExpansion !== "none"
  )

  const ModelWrapper = getComponent("ModelWrapper")
  const Collapse = getComponent("Collapse")
  const ModelCollapse = getComponent("ModelCollapse")
  const JumpToPath = getComponent("JumpToPath", true)
  const ArrowUpIcon = getComponent("ArrowUpIcon")
  const ArrowDownIcon = getComponent("ArrowDownIcon")

  const renderModelItem = (name, key) => {
    const fullPath = [...specPathBase, name]
    const specPath = Im.List(fullPath)

    const schemaValue = specSelectors.specResolvedSubtree(fullPath)
    const rawSchemaValue = specSelectors.specJson().getIn(fullPath)

    const schema = Map.isMap(schemaValue) ? schemaValue : Im.Map()
    const rawSchema = Map.isMap(rawSchemaValue) ? rawSchemaValue : Im.Map()

    const displayName = schema.get("title") || rawSchema.get("title") || name
    const isShown = layoutSelectors.isShown(fullPath, false)

    if (isShown && schema.size === 0 && rawSchema.size > 0) {
      // Firing an action in a container render is not great,
      // but it works for now.
      specActions.requestResolvedSubtree(fullPath)
    }

    const content = (
      <ModelWrapper
        name={name}
        expandDepth={defaultModelsExpandDepth}
        schema={schema || Im.Map()}
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
        key={key}
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
  }

  return (
    <section
      className={`${showModels ? "models is-open" : "models"}${isVirtualized ? " models--virtualized" : ""}`}
      ref={onLoadModels}
    >
      <h4>
        <button
          aria-expanded={showModels}
          className="models-control"
          onClick={() => layoutActions.show(specPathBase, !showModels)}
        >
          <span>{isOAS3 ? "Schemas" : "Models"}</span>
          {showModels ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </button>
      </h4>
      <Collapse isOpened={showModels}>
        {isVirtualized ? (
          <div ref={parentRef} className="models-scroll">
            <div
              style={{
                paddingTop: virtualizer.getVirtualItems()[0]?.start ?? 0,
                paddingBottom:
                  virtualizer.getTotalSize() -
                  (virtualizer.getVirtualItems().at(-1)?.end ?? 0),
              }}
            >
              {virtualizer.getVirtualItems().map((vItem) => {
                const [name] = definitionEntries[vItem.index]
                return (
                  <div
                    key={vItem.key}
                    data-index={vItem.index}
                    ref={virtualizer.measureElement}
                    style={{ paddingBottom: 15 }}
                  >
                    {renderModelItem(name)}
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          definitionEntries.map(([name]) =>
            renderModelItem(name, `models-section-${name}`)
          )
        )}
      </Collapse>
    </section>
  )
}

Models.propTypes = {
  getComponent: PropTypes.func,
  specSelectors: PropTypes.object,
  specActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object,
  layoutActions: PropTypes.object,
  getConfigs: PropTypes.func.isRequired,
}

export default Models

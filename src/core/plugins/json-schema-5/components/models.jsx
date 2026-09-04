/**
 * @prettier
 */
import React, { useRef, useMemo, useCallback, useEffect } from "react"
import { Map } from "immutable"
import PropTypes from "prop-types"
import { useVirtualizer } from "@tanstack/react-virtual"
import {
  VIRTUALIZE_MODELS_THRESHOLD,
  VIRTUALIZE_MODELS_ESTIMATE_SIZE,
  VIRTUALIZE_MODELS_OVERSCAN,
} from "core/utils/virtualization"
import ModelItem from "./model-item"

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
    estimateSize: () => VIRTUALIZE_MODELS_ESTIMATE_SIZE,
    overscan: VIRTUALIZE_MODELS_OVERSCAN,
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
      if (document.querySelector(".operations-virtual")) {
        // scroll instantly to avoid recomputing virtualized operations
        parentRef.current?.scrollIntoView({
          behavior: "instant",
          block: "start",
        })
      } else {
        layoutActions.scrollToElement(parentRef.current)
      }
      virtualizer.scrollToIndex(idx, { align: "start" })
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

  const handleModelsExpand = useCallback(() => {
    layoutActions.show(specPathBase, !showModels)
  }, [layoutActions, specPathBase, showModels])

  const Collapse = getComponent("Collapse")
  const ArrowUpIcon = getComponent("ArrowUpIcon")
  const ArrowDownIcon = getComponent("ArrowDownIcon")

  const getModelItemProps = (name) => {
    const fullPath = [...specPathBase, name]
    const schemaValue = specSelectors.specResolvedSubtree(fullPath)
    const rawSchemaValue = specSelectors.specJson().getIn(fullPath)

    const schema = Map.isMap(schemaValue) ? schemaValue : Map()
    const rawSchema = Map.isMap(rawSchemaValue) ? rawSchemaValue : Map()
    const isShown = layoutSelectors.isShown(fullPath, false)

    return {
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
    }
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
          onClick={handleModelsExpand}
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
                    className="models-virtual-item"
                  >
                    <ModelItem name={name} {...getModelItemProps(name)} />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          definitionEntries.map(([name]) => (
            <ModelItem
              key={`models-section-${name}`}
              name={name}
              {...getModelItemProps(name)}
            />
          ))
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

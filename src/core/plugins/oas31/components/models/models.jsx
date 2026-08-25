/**
 * @prettier
 */
import React, { useRef, useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import { useVirtualizer } from "@tanstack/react-virtual"
import { VIRTUALIZE_MODELS_THRESHOLD } from "core/utils"

const SCHEMAS_PATH = ["components", "schemas"]

const SchemaItem = React.memo(
  ({
    schemaName,
    schema,
    name,
    specSelectors,
    specActions,
    layoutActions,
    getComponent,
  }) => {
    const JSONSchema202012 = getComponent("JSONSchema202012")

    const handleJSONSchema202012Expand = useCallback(
      (e, expanded) => {
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
      (node) => {
        if (node !== null)
          layoutActions.readyToScroll([...SCHEMAS_PATH, schemaName], node)
      },
      [schemaName, layoutActions]
    )

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

SchemaItem.propTypes = {
  schemaName: PropTypes.string.isRequired,
  schema: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
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

const Models = ({
  specActions,
  specSelectors,
  layoutSelectors,
  layoutActions,
  getComponent,
  getConfigs,
  fn,
}) => {
  const schemas = specSelectors.selectSchemas()
  const { docExpansion, defaultModelsExpandDepth } = getConfigs()
  const isOpenDefault = defaultModelsExpandDepth > 0 && docExpansion !== "none"
  const isOpen = layoutSelectors.isShown(SCHEMAS_PATH, isOpenDefault)
  const Collapse = getComponent("Collapse")
  const ArrowUpIcon = getComponent("ArrowUpIcon")
  const ArrowDownIcon = getComponent("ArrowDownIcon")
  const { getTitle } = fn.jsonSchema202012.useFn()

  const schemaEntries = Object.entries(schemas)

  const parentRef = useRef(null)
  const measurementsCache = useRef([])

  const virtualizer = useVirtualizer({
    count: schemaEntries.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => 48,
    overscan: 5,
    getItemKey: (index) => `models-section-${schemaEntries[index][0]}`,
    initialMeasurementsCache: measurementsCache.current,
    onChange: (instance) => {
      measurementsCache.current = instance.takeSnapshot()
    },
  })

  const isVirtualized = schemaEntries.length >= VIRTUALIZE_MODELS_THRESHOLD

  /**
   * Effects.
   */
  useEffect(() => {
    const includesExpandedSchema = schemaEntries.some(([schemaName]) =>
      layoutSelectors.isShown([...SCHEMAS_PATH, schemaName], false)
    )
    const isOpenAndExpanded =
      isOpen && (defaultModelsExpandDepth > 1 || includesExpandedSchema)
    const isResolved = specSelectors.specResolvedSubtree(SCHEMAS_PATH) != null
    if (isOpenAndExpanded && !isResolved) {
      specActions.requestResolvedSubtree(SCHEMAS_PATH)
    }
  }, [isOpen, defaultModelsExpandDepth])

  /**
   * Event handlers.
   */

  const handleModelsExpand = useCallback(() => {
    layoutActions.show(SCHEMAS_PATH, !isOpen)
  }, [isOpen])
  const handleModelsRef = useCallback((node) => {
    if (node !== null) {
      layoutActions.readyToScroll(SCHEMAS_PATH, node)
    }
  }, [])

  /**
   * Rendering.
   */

  if (!schemaEntries.length || defaultModelsExpandDepth < 0) {
    return null
  }

  return (
    <section
      className={classNames("models", {
        "is-open": isOpen,
        "models--virtualized": isVirtualized,
      })}
      ref={handleModelsRef}
    >
      <h4>
        <button
          aria-expanded={isOpen}
          className="models-control"
          onClick={handleModelsExpand}
        >
          <span>Schemas</span>
          {isOpen ? <ArrowUpIcon /> : <ArrowDownIcon />}
        </button>
      </h4>
      <Collapse isOpened={isOpen}>
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
                const [schemaName, schema] = schemaEntries[vItem.index]
                const name = getTitle(schema, { lookup: "basic" }) || schemaName

                return (
                  <div
                    key={vItem.key}
                    data-index={vItem.index}
                    ref={virtualizer.measureElement}
                    style={{ paddingBottom: 15 }}
                  >
                    <SchemaItem
                      schemaName={schemaName}
                      schema={schema}
                      name={name}
                      specSelectors={specSelectors}
                      specActions={specActions}
                      layoutActions={layoutActions}
                      getComponent={getComponent}
                    />
                  </div>
                )
              })}
            </div>
          </div>
        ) : (
          schemaEntries.map(([schemaName, schema]) => {
            const name = getTitle(schema, { lookup: "basic" }) || schemaName

            return (
              <SchemaItem
                key={schemaName}
                schemaName={schemaName}
                schema={schema}
                name={name}
                specSelectors={specSelectors}
                specActions={specActions}
                layoutActions={layoutActions}
                getComponent={getComponent}
              />
            )
          })
        )}
      </Collapse>
    </section>
  )
}

Models.propTypes = {
  getComponent: PropTypes.func.isRequired,
  getConfigs: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    selectSchemas: PropTypes.func.isRequired,
    specResolvedSubtree: PropTypes.func.isRequired,
  }).isRequired,
  specActions: PropTypes.shape({
    requestResolvedSubtree: PropTypes.func.isRequired,
  }).isRequired,
  layoutSelectors: PropTypes.shape({
    isShown: PropTypes.func.isRequired,
  }).isRequired,
  layoutActions: PropTypes.shape({
    show: PropTypes.func.isRequired,
    readyToScroll: PropTypes.func.isRequired,
  }).isRequired,
  fn: PropTypes.shape({
    jsonSchema202012: PropTypes.func.shape({
      useFn: PropTypes.func.isRequired,
    }).isRequired,
  }).isRequired,
}

export default Models

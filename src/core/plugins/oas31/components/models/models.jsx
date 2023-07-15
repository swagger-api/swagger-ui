/**
 * @prettier
 */
import React, { useCallback, useEffect } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

const Models = ({
  specActions,
  specSelectors,
  layoutSelectors,
  layoutActions,
  getComponent,
  getConfigs,
}) => {
  const schemas = specSelectors.selectSchemas()
  const hasSchemas = Object.keys(schemas).length > 0
  const schemasPath = ["components", "schemas"]
  const { docExpansion, defaultModelsExpandDepth } = getConfigs()
  const isOpenDefault = defaultModelsExpandDepth > 0 && docExpansion !== "none"
  const isOpen = layoutSelectors.isShown(schemasPath, isOpenDefault)
  const Collapse = getComponent("Collapse")
  const JSONSchema202012 = getComponent("JSONSchema202012")

  /**
   * Effects.
   */
  useEffect(() => {
    const isOpenAndExpanded = isOpen && defaultModelsExpandDepth > 1
    const isResolved = specSelectors.specResolvedSubtree(schemasPath) != null
    if (isOpenAndExpanded && !isResolved) {
      specActions.requestResolvedSubtree(schemasPath)
    }
  }, [isOpen, defaultModelsExpandDepth])

  /**
   * Event handlers.
   */

  const handleModelsExpand = useCallback(() => {
    layoutActions.show(schemasPath, !isOpen)
  }, [isOpen])
  const handleModelsRef = useCallback((node) => {
    if (node !== null) {
      layoutActions.readyToScroll(schemasPath, node)
    }
  }, [])
  const handleJSONSchema202012Ref = (schemaName) => (node) => {
    if (node !== null) {
      layoutActions.readyToScroll([...schemasPath, schemaName], node)
    }
  }
  const handleJSONSchema202012Expand = (schemaName) => (e, expanded) => {
    if (expanded) {
      const schemaPath = [...schemasPath, schemaName]
      const isResolved = specSelectors.specResolvedSubtree(schemaPath) != null
      if (!isResolved) {
        specActions.requestResolvedSubtree([...schemasPath, schemaName])
      }
    }
  }

  /**
   * Rendering.
   */

  if (!hasSchemas || defaultModelsExpandDepth < 0) {
    return null
  }

  return (
    <section
      className={classNames("models", { "is-open": isOpen })}
      ref={handleModelsRef}
    >
      <h4>
        <button
          aria-expanded={isOpen}
          className="models-control"
          onClick={handleModelsExpand}
        >
          <span>Schemas</span>
          <svg width="20" height="20" aria-hidden="true" focusable="false">
            <use xlinkHref={isOpen ? "#large-arrow-up" : "#large-arrow-down"} />
          </svg>
        </button>
      </h4>
      <Collapse isOpened={isOpen}>
        {Object.entries(schemas).map(([schemaName, schema]) => (
          <JSONSchema202012
            key={schemaName}
            ref={handleJSONSchema202012Ref(schemaName)}
            schema={schema}
            name={schemaName}
            onExpand={handleJSONSchema202012Expand(schemaName)}
          />
        ))}
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
}

export default Models

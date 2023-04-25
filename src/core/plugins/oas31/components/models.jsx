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
  fn,
}) => {
  const schemas = specSelectors.selectSchemas()
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
    if (isOpen && specSelectors.specResolvedSubtree(schemasPath) == null) {
      specActions.requestResolvedSubtree(schemasPath)
    }
  }, [isOpen])

  /**
   * Event handlers.
   */
  const handleCollapse = useCallback(() => {
    layoutActions.show(schemasPath, !isOpen)
  }, [layoutActions, schemasPath, isOpen])

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

  return (
    <section
      className={classNames("models", { "is-open": isOpen })}
      ref={handleModelsRef}
    >
      <h4>
        <button
          aria-expanded={isOpen}
          className="models-control"
          onClick={handleCollapse}
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
            name={fn.upperFirst(schemaName)}
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
  }).isRequired,
  specActions: PropTypes.shape({
    requestResolvedSubtree: PropTypes.func.isRequired,
  }).isRequired,
  layoutSelectors: PropTypes.shape({
    isShown: PropTypes.func.isRequired,
  }).isRequired,
  layoutActions: PropTypes.shape({
    show: PropTypes.func.isRequired,
  }).isRequired,
  fn: PropTypes.shape({
    upperFirst: PropTypes.func.isRequired,
  }).isRequired,
}

export default Models

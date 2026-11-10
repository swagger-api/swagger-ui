/**
 * @prettier
 */
import React, { useMemo, useEffect, useCallback, useRef } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import randomBytes from "randombytes"
import { immutableToJS } from "core/utils"

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const useTabs = ({
  initialTab,
  isExecute,
  schema,
  example,
  specPath,
  layoutActions,
  layoutSelectors,
}) => {
  const tabs = useMemo(() => ({ example: "example", model: "model" }), [])
  const tabKey = useMemo(
    () => [...immutableToJS(specPath), "show-model-tab"],
    [specPath]
  )

  const showModelByDefault = !!(
    initialTab === tabs.model &&
    schema &&
    !isExecute
  )
  const showModel = layoutSelectors.isShown(tabKey, showModelByDefault)
  const activeTab = showModel ? tabs.model : tabs.example

  const prevIsExecute = usePrevious(isExecute)
  const isFirstRender = useRef(true)

  const handleTabChange = useCallback(
    (e) => {
      layoutActions.show(tabKey, e.target.dataset.name === tabs.model)
    },
    [layoutActions, tabKey, tabs.model]
  )

  useEffect(() => {
    if (isFirstRender.current) {
      isFirstRender.current = false
      return
    }

    const enteredExecute = !prevIsExecute && isExecute
    const leftExecuteWithExample = prevIsExecute && !isExecute && example

    if (enteredExecute || leftExecuteWithExample) {
      layoutActions.show(tabKey, false)
    }
  }, [prevIsExecute, isExecute, example, layoutActions, tabKey])

  return { activeTab, onTabChange: handleTabChange, tabs }
}

const ModelExample = ({
  schema,
  example,
  isExecute = false,
  specPath,
  includeWriteOnly = false,
  includeReadOnly = false,
  getComponent,
  getConfigs,
  specSelectors,
  layoutActions,
  layoutSelectors,
}) => {
  const { defaultModelRendering, defaultModelExpandDepth } = getConfigs()
  const ModelWrapper = getComponent("ModelWrapper")
  const HighlightCode = getComponent("HighlightCode", true)
  const exampleTabId = randomBytes(5).toString("base64")
  const examplePanelId = randomBytes(5).toString("base64")
  const modelTabId = randomBytes(5).toString("base64")
  const modelPanelId = randomBytes(5).toString("base64")
  const isOAS3 = specSelectors.isOAS3()
  const { activeTab, tabs, onTabChange } = useTabs({
    initialTab: defaultModelRendering,
    isExecute,
    schema,
    example,
    specPath,
    layoutActions,
    layoutSelectors,
  })

  return (
    <div className="model-example">
      <ul className="tab" role="tablist">
        <li
          className={cx("tabitem", { active: activeTab === tabs.example })}
          role="presentation"
        >
          <button
            aria-controls={examplePanelId}
            aria-selected={activeTab === tabs.example}
            className="tablinks"
            data-name="example"
            id={exampleTabId}
            onClick={onTabChange}
            role="tab"
          >
            {isExecute ? "Edit Value" : "Example Value"}
          </button>
        </li>
        {schema && (
          <li
            className={cx("tabitem", { active: activeTab === tabs.model })}
            role="presentation"
          >
            <button
              aria-controls={modelPanelId}
              aria-selected={activeTab === tabs.model}
              className={cx("tablinks", { inactive: isExecute })}
              data-name="model"
              id={modelTabId}
              onClick={onTabChange}
              role="tab"
            >
              {isOAS3 ? "Schema" : "Model"}
            </button>
          </li>
        )}
      </ul>
      {activeTab === tabs.example && (
        <div
          aria-hidden={activeTab !== tabs.example}
          aria-labelledby={exampleTabId}
          data-name="examplePanel"
          id={examplePanelId}
          role="tabpanel"
          tabIndex="0"
        >
          {example ? (
            example
          ) : (
            <HighlightCode>(no example available</HighlightCode>
          )}
        </div>
      )}

      {activeTab === tabs.model && (
        <div
          className="model-container"
          aria-hidden={activeTab === tabs.example}
          aria-labelledby={modelTabId}
          data-name="modelPanel"
          id={modelPanelId}
          role="tabpanel"
          tabIndex="0"
        >
          <ModelWrapper
            schema={schema}
            getComponent={getComponent}
            getConfigs={getConfigs}
            specSelectors={specSelectors}
            expandDepth={defaultModelExpandDepth}
            specPath={specPath}
            fullPath={immutableToJS(specPath)}
            layoutActions={layoutActions}
            layoutSelectors={layoutSelectors}
            includeReadOnly={includeReadOnly}
            includeWriteOnly={includeWriteOnly}
          />
        </div>
      )}
    </div>
  )
}

ModelExample.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({ isOAS3: PropTypes.func.isRequired })
    .isRequired,
  layoutActions: PropTypes.object.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  example: PropTypes.any.isRequired,
  isExecute: PropTypes.bool,
  getConfigs: PropTypes.func.isRequired,
  specPath: ImPropTypes.list.isRequired,
  includeReadOnly: PropTypes.bool,
  includeWriteOnly: PropTypes.bool,
}

export default ModelExample

/**
 * @prettier
 */
import React, { useMemo, useState, useEffect, useCallback, useRef } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import randomBytes from "randombytes"

const usePrevious = (value) => {
  const ref = useRef()
  useEffect(() => {
    ref.current = value
  })
  return ref.current
}

const useTabs = ({ initialTab, isExecute, schema, example }) => {
  const tabs = useMemo(() => ({ example: "example", model: "model" }), [])
  const allowedTabs = useMemo(() => Object.keys(tabs), [tabs])
  const tab =
    !allowedTabs.includes(initialTab) || !schema || isExecute
      ? tabs.example
      : initialTab
  const prevIsExecute = usePrevious(isExecute)
  const [activeTab, setActiveTab] = useState(tab)
  const handleTabChange = useCallback((e) => {
    setActiveTab(e.target.dataset.name)
  }, [])

  useEffect(() => {
    if (prevIsExecute && !isExecute && example) {
      setActiveTab(tabs.example)
    }
  }, [prevIsExecute, isExecute, example])

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
}) => {
  const { defaultModelRendering, defaultModelExpandDepth } = getConfigs()
  const ModelWrapper = getComponent("ModelWrapper")
  const HighlightCode = getComponent("highlightCode")
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
            <HighlightCode
              value="(no example available)"
              getConfigs={getConfigs}
            />
          )}
        </div>
      )}

      {activeTab === tabs.model && (
        <div
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
  schema: PropTypes.object.isRequired,
  example: PropTypes.any.isRequired,
  isExecute: PropTypes.bool,
  getConfigs: PropTypes.func.isRequired,
  specPath: ImPropTypes.list.isRequired,
  includeReadOnly: PropTypes.bool,
  includeWriteOnly: PropTypes.bool,
}

export default ModelExample

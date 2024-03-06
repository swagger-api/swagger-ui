/**
 * @prettier
 */
import React, { useEffect, useState } from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"
import cx from "classnames"
import randomBytes from "randombytes"

const ModelExample = ({
  getComponent,
  specSelectors,
  schema,
  example,
  isExecute,
  getConfigs,
  specPath,
  includeReadOnly,
  includeWriteOnly,
}) => {
  const { defaultModelExpandDepth, defaultModelRendering } = getConfigs()
  const ModelWrapper = getComponent("ModelWrapper")
  const HighlightCode = getComponent("highlightCode")
  const exampleTabId = randomBytes(5).toString("base64")
  const examplePanelId = randomBytes(5).toString("base64")
  const modelTabId = randomBytes(5).toString("base64")
  const modelPanelId = randomBytes(5).toString("base64")
  const isOAS3 = specSelectors.isOAS3()

  const [activeTab, setActiveTab] = useState(
    !isExecute && defaultModelRendering === "model" && schema
      ? "model"
      : "example"
  )

  useEffect(() => {
    if (isExecute && example) {
      setActiveTab("example")
    }
  }, [isExecute, example])

  const changeActiveTab = (e) => {
    const {
      target: {
        dataset: { name },
      },
    } = e

    setActiveTab(name)
  }

  return (
    <div className="model-example">
      <ul className="tab" role="tablist">
        <li
          className={cx("tabitem", {
            active: activeTab === "example",
          })}
          role="presentation"
        >
          <button
            aria-controls={examplePanelId}
            aria-selected={activeTab === "example"}
            className="tablinks"
            data-name="example"
            id={exampleTabId}
            onClick={changeActiveTab}
            role="tab"
          >
            {isExecute ? "Edit Value" : "Example Value"}
          </button>
        </li>
        {schema && (
          <li
            className={cx("tabitem", {
              active: activeTab === "model",
            })}
            role="presentation"
          >
            <button
              aria-controls={modelPanelId}
              aria-selected={activeTab === "model"}
              className={cx("tablinks", { inactive: isExecute })}
              data-name="model"
              id={modelTabId}
              onClick={changeActiveTab}
              role="tab"
            >
              {isOAS3 ? "Schema" : "Model"}
            </button>
          </li>
        )}
      </ul>
      {activeTab === "example" && (
        <div
          aria-hidden={activeTab !== "example"}
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
      {activeTab === "model" && (
        <div
          aria-hidden={activeTab === "example"}
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
  specSelectors: PropTypes.object.isRequired,
  schema: PropTypes.object.isRequired,
  example: PropTypes.any.isRequired,
  isExecute: PropTypes.bool,
  getConfigs: PropTypes.func.isRequired,
  specPath: ImPropTypes.list.isRequired,
  includeReadOnly: PropTypes.bool,
  includeWriteOnly: PropTypes.bool,
}

export default ModelExample

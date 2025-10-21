/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { List, Map } from "immutable"

const Webhooks = ({ specSelectors, getComponent, layoutSelectors, layoutActions, getConfigs, oas3Selectors }) => {
  const taggedWebhooks = specSelectors.taggedWebhooks()

  if (taggedWebhooks.size === 0) return null

  const OperationTag = getComponent("OperationTag")
  const OperationContainer = getComponent("OperationContainer", true)

  return (
    <div className="webhooks">
      <h2>Webhooks</h2>

      {taggedWebhooks.map((tagObj, tag) => {
        const operations = tagObj.get("operations")
        
        return (
          <OperationTag
            key={`webhook-${tag}`}
            tagObj={tagObj}
            tag={tag}
            oas3Selectors={oas3Selectors}
            layoutSelectors={layoutSelectors}
            layoutActions={layoutActions}
            getConfigs={getConfigs}
            getComponent={getComponent}
            specUrl={specSelectors.url()}>
            <div className="operation-tag-content">
              {
                operations.map(op => {
                  const path = op.get("path")
                  const method = op.get("method")
                  const operation = op.get("operation")
                  const specPath = List(["webhooks", path, method])

                  return (
                    <OperationContainer
                      key={`${path}-${method}-webhook`}
                      specPath={specPath}
                      op={operation}
                      path={path}
                      method={method}
                      tag={tag}
                      allowTryItOut={false}
                    />
                  )
                }).toArray()
              }
            </div>
          </OperationTag>
        )
      }).toArray()}
    </div>
  )
}

Webhooks.propTypes = {
  specSelectors: PropTypes.shape({
    taggedWebhooks: PropTypes.func.isRequired,
    url: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
  layoutSelectors: PropTypes.object.isRequired,
  layoutActions: PropTypes.object.isRequired,
  getConfigs: PropTypes.func.isRequired,
  oas3Selectors: PropTypes.func.isRequired
}

export default Webhooks

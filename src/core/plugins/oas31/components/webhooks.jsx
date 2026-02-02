/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { List } from "immutable"

const Webhooks = ({ specSelectors, getComponent }) => {
  const operationDTOs = specSelectors.selectWebhooksOperations()
  if (!operationDTOs) {
    return null
  }
  const pathItemNames = Object.keys(operationDTOs)

  const OperationContainer = getComponent("OperationContainer", true)

  if (pathItemNames.length === 0) return null

  return (
    <div className="webhooks">
      <h2>Webhooks</h2>

      {pathItemNames.map((pathItemName) => (
        <div key={`${pathItemName}-webhook`}>
          {operationDTOs[pathItemName].map((operationDTO) => (
            <OperationContainer
              key={`${pathItemName}-${operationDTO.method}-webhook`}
              op={operationDTO.operation}
              tag="webhooks"
              method={operationDTO.method}
              path={pathItemName}
              specPath={List(operationDTO.specPath)}
              allowTryItOut={false}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

Webhooks.propTypes = {
  specSelectors: PropTypes.shape({
    selectWebhooksOperations: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default Webhooks

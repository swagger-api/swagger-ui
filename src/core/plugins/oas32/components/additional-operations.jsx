/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import { List } from "immutable"

/**
 * AdditionalOperations component for OAS 3.2
 *
 * Renders custom HTTP methods defined in Path Item Object's additionalOperations field.
 * These operations support methods beyond the standard set (GET, POST, PUT, DELETE, etc.),
 * such as COPY, MOVE, LOCK, UNLOCK, PATCH, PROPFIND, etc.
 *
 * Reference: https://spec.openapis.org/oas/v3.2.0.html#path-item-object
 */
const AdditionalOperations = ({ specSelectors, getComponent }) => {
  const operationDTOs = specSelectors.selectAdditionalOperations()
  if (!operationDTOs) {
    return null
  }
  const pathItemNames = Object.keys(operationDTOs)

  const OperationContainer = getComponent("OperationContainer", true)

  if (pathItemNames.length === 0) return null

  return (
    <div className="additional-operations">
      <h2>Additional Operations</h2>
      <div className="additional-operations__description">
        <p>
          Custom HTTP methods defined for specific resources. These operations
          may not be executable in the Try It Out interface.
        </p>
      </div>

      {pathItemNames.map((pathItemName) => (
        <div key={`${pathItemName}-additional-operations`}>
          {operationDTOs[pathItemName].map((operationDTO) => (
            <OperationContainer
              key={`${pathItemName}-${operationDTO.method}-additional-operation`}
              op={operationDTO.operation}
              tag="additional-operations"
              method={operationDTO.method.toLowerCase()}
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

AdditionalOperations.propTypes = {
  specSelectors: PropTypes.shape({
    selectAdditionalOperations: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default AdditionalOperations

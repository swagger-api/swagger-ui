/**
 * @prettier
 */
import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const Callbacks = ({ callbacks, specPath, specSelectors, getComponent }) => {
  const operationDTOs = specSelectors.callbacksOperations({
    callbacks,
    specPath,
  })
  const callbackNames = Object.keys(operationDTOs)

  const OperationContainer = getComponent("OperationContainer", true)

  if (callbackNames.length === 0) return <span>No callbacks</span>

  return (
    <div>
      {callbackNames.map((callbackName) => (
        <div key={`${callbackName}`}>
          <h2>{callbackName}</h2>

          {operationDTOs[callbackName].map((operationDTO) => (
            <OperationContainer
              key={`${callbackName}-${operationDTO.path}-${operationDTO.method}`}
              op={operationDTO.operation}
              tag="callbacks"
              method={operationDTO.method}
              path={operationDTO.path}
              specPath={operationDTO.specPath}
              allowTryItOut={false}
            />
          ))}
        </div>
      ))}
    </div>
  )
}

Callbacks.propTypes = {
  getComponent: PropTypes.func.isRequired,
  specSelectors: PropTypes.shape({
    callbacksOperations: PropTypes.func.isRequired,
  }).isRequired,
  callbacks: ImPropTypes.iterable.isRequired,
  specPath: ImPropTypes.list.isRequired,
}

export default Callbacks

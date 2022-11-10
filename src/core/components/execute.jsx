import React, { Component } from "react"
import PropTypes from "prop-types"

export default class Execute extends Component {

  static propTypes = {
    specSelectors: PropTypes.object.isRequired,
    specActions: PropTypes.object.isRequired,
    operation: PropTypes.object.isRequired,
    path: PropTypes.string.isRequired,
    method: PropTypes.string.isRequired,
    oas3Selectors: PropTypes.object.isRequired,
    oas3Actions: PropTypes.object.isRequired,
    onExecute: PropTypes.func,
    disabled: PropTypes.bool
  }

  handleValidateParameters = () => {
    let { specSelectors, specActions, path, method } = this.props
    specActions.validateParams([path, method])
    return specSelectors.validateBeforeExecute([path, method])
  }

  handleValidateRequestBody = () => {
    let { path, method, specSelectors, oas3Selectors, oas3Actions } = this.props
    let validationErrors = {
      missingBodyValue: false,
      missingRequiredKeys: []
    }
    // context: reset errors, then (re)validate
    oas3Actions.clearRequestBodyValidateError({ path, method })
    let oas3RequiredRequestBodyContentType = specSelectors.getOAS3RequiredRequestBodyContentType([path, method])
    let oas3RequestBodyValue = oas3Selectors.requestBodyValue(path, method)
    let oas3ValidateBeforeExecuteSuccess = oas3Selectors.validateBeforeExecute([path, method])
    let oas3RequestContentType = oas3Selectors.requestContentType(path, method)

    if (!oas3ValidateBeforeExecuteSuccess) {
      validationErrors.missingBodyValue = true
      oas3Actions.setRequestBodyValidateError({ path, method, validationErrors })
      return false
    }
    if (!oas3RequiredRequestBodyContentType) {
      return true
    }
    let missingRequiredKeys = oas3Selectors.validateShallowRequired({
      oas3RequiredRequestBodyContentType,
      oas3RequestContentType,
      oas3RequestBodyValue
    })
    if (!missingRequiredKeys || missingRequiredKeys.length < 1) {
      return true
    }
    missingRequiredKeys.forEach((missingKey) => {
      validationErrors.missingRequiredKeys.push(missingKey)
    })
    oas3Actions.setRequestBodyValidateError({ path, method, validationErrors })
    return false
  }

  handleValidationResultPass = () => {
    let { specActions, operation, path, method } = this.props
    if (this.props.onExecute) {
      // loading spinner
      this.props.onExecute()
    }
    specActions.execute({ operation, path, method })
  }

  handleValidationResultFail = () => {
    let { specActions, path, method } = this.props
    // deferred by 40ms, to give element class change time to settle.
    specActions.clearValidateParams([path, method])
    setTimeout(() => {
      specActions.validateParams([path, method])
    }, 40)
  }

  handleValidationResult = (isPass) => {
    if (isPass) {
      this.handleValidationResultPass()
    } else {
      this.handleValidationResultFail()
    }
  }

  onClick = () => {
    let paramsResult = this.handleValidateParameters()
    let requestBodyResult = this.handleValidateRequestBody()
    let isPass = paramsResult && requestBodyResult
    this.handleValidationResult(isPass)
  }

  onChangeProducesWrapper = ( val ) => this.props.specActions.changeProducesValue([this.props.path, this.props.method], val)

  render(){
    const { disabled } = this.props
    return (
        <button className="btn execute opblock-control__btn" onClick={ this.onClick } disabled={disabled}>
          Execute
        </button>
    )
  }
}

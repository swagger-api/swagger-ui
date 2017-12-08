import KongOperations from "../../kongComponents/Operations"
import KongOperationsContainer from "../../kongComponents/OperationContainer"
import KongOperation from "../../kongComponents/Operation"
import KongParameters from "../../kongComponents/Parameters"
import KongParameterRow from "../../kongComponents/Parameter-row"
import KongModelExample from "../../kongComponents/model-example"
import KongParamBody from "../../kongComponents/param-body"
import KongContentType from "../../kongComponents/content-type"

export default function () {

  let kongComponents = {
    components: {
      KongOperations,
      KongOperationsContainer,
      KongOperation,
      KongParameters,
      KongParameterRow,
      KongModelExample,
      KongParamBody,
      KongContentType,
    }
  }

  return [
    kongComponents
  ]
}

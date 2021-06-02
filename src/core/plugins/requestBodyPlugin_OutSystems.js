//OutSystems change: replace the request-body component by the customized request-body component
import requestBodyComponent_OutSystems from "./requestBodyComponent_OutSystems";
const SwitchRequestBody = () => ({
  components: {
    requestBody: requestBodyComponent_OutSystems
  }
});

export default SwitchRequestBody;

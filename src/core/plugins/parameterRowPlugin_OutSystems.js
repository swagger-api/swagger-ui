//OutSystems change: replace the request-body component by the customized info component
import parameterRowComponent_OutSystems from "./parameterRowComponent_OutSystems";
const SwitchParameterRow = () => ({
  components: {
    parameterRow: parameterRowComponent_OutSystems
  }
});

export default SwitchParameterRow;

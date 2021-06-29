// OutSystems change: create a plugin that disables the Schemes selection
const DisableSchemesPlugin = () => {
  return {
    wrapComponents: {
      schemes: () => () => null
    }
  };
};
export default DisableSchemesPlugin;


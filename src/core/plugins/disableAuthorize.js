// OutSystems change: create a plugin that disables the Authorize button 
const DisableAuthorizePlugin = () => {
  return {
	  wrapComponents: {
		  authorizeBtn: () => () => null
		}
	};
};
export default DisableAuthorizePlugin;

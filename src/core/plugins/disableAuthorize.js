// OutSystems change: create a plugin that disables the Authorize button 
	const DisableAuthorizePlugin = function() {
		return {
			wrapComponents: {
				authorizeBtn: () => () => null
			}
		};
  };
export default DisableAuthorizePlugin;

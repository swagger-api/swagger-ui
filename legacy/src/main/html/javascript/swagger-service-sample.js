jQuery(function($) {
	// create and initialize SwaggerService
	var swaggerService = new SwaggerService("http://swagr.api.wordnik.com/v4/list.json");
	swaggerService.init();

	// Create convenience references to Spine models
	var ApiResource = swaggerService.ApiResource();

	// Register a callback for when apis are loaded
	ApiResource.bind("refresh", apisLoaded);

	function apisLoaded() {
        for(var i = 0; i < ApiResource.all().length; i++) {
            var apiResource = ApiResource.all()[i];
            log("---------------------------------------------");
            log("------------- apiResource : " + apiResource.name);
            apiResource.apiList.logAll();
            apiResource.modelList.logAll();
        }

		if (window.console) console.log("apis loaded");
	}

});

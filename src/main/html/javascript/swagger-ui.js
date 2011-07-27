jQuery(function($) {
    // create and initialize SwaggerService
    var swaggerService = new SwaggerService("http://swagr.api.wordnik.com/v4");
    swaggerService.init();

    // Create convenience references to Spine models
    var ApiResource = swaggerService.ApiResource();

    // Register a callback for when apis are loaded
    ApiResource.bind("refresh", apisLoaded);

    function apisLoaded() {
        for (var i = 0; i < ApiResource.all().length; i++) {
            var apiResource = ApiResource.all()[i];
            log("------------- apiResource : " + apiResource.name);

            $("#resourceTemplate").tmpl(apiResource).appendTo("#resources");

//            apiResource.apiList.logAll();
            var resourceApisContainer = "#" + apiResource.name + "_endpoint_list";
            log("resourceApisContainer = " + resourceApisContainer);
            for (var j = 0; j < apiResource.apiList.all().length; j++) {
                var api = apiResource.apiList.all()[j];
                $("#apiTemplate").tmpl(api).appendTo(resourceApisContainer);
                renderOperations(api);
            }

//            apiResource.modelList.logAll();
            for (var k = 0; k < apiResource.modelList.all().length; k++) {
                var apiModel = apiResource.modelList.all()[k];
            }
        }

        if (window.console) console.log("apis loaded");
    }

    function renderOperations(api) {
        if (api.operations && api.operations.count() > 0) {
            var operationsContainer = "#" + api.name + "_endpoint_" + api.id + "_operations";
            for (var o = 0; o < api.operations.all().length; o++) {
                var operation = api.operations.all()[o];
                $("#operationTemplate").tmpl(operation).appendTo(operationsContainer);
                renderParameters(operation, $);
            }
        }
    }

    function renderParameters(operation) {
        if(operation.parameters && operation.parameters.count() > 0) {
            var isGetOpetation = (operation.httpMethodLowercase == "get");

            var operationParamsContainer = "#" + operation.apiName + "_" + operation.nickname + "_" + operation.id + "_params";
            log("operationParamsContainer= " + operationParamsContainer);
            for (var p = 0; p < operation.parameters.all().length; p++) {
                var param = operation.parameters.all()[p];

                var templateName = "#paramTemplate";
                if (param.required)
                    templateName += "Required";

                if (!isGetOpetation)
                    templateName += "ReadOnly";

                $(templateName).tmpl(param).appendTo(operationParamsContainer);

                if (!isGetOpetation) {
                    var submitButtonId = "#" + operation.apiName + "_" + operation.nickname + "_" + operation.id + "_content_sandbox_response_button";
                    $(submitButtonId).hide();

                    var valueHeader = "#" + operation.apiName + "_" + operation.nickname + "_" + operation.id + "_value_header";
                    $(valueHeader).html("Default Value");

                }


            }
        }
    }

});


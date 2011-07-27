jQuery(function($) {

    // The following heirarchy is followed by these view controllers
    // ResourceListController
    //     >>> ResourceController
    //         >>> ApiController
    //             >>> OperationController

    var ResourceListController = Spine.Controller.create({
        proxied: ["addAll", "addOne"],

        ApiResource: null,

        init: function() {

            // create and initialize SwaggerService
            var hostUrl = "http://swagr.api.wordnik.com/v4";

            $("#api_host_url").html(hostUrl);
            var swaggerService = new SwaggerService(hostUrl);
            swaggerService.init();

            // Create convenience references to Spine models
            this.ApiResource = swaggerService.ApiResource();
            
            this.ApiResource.bind("refresh", this.addAll);
        },

        addAll: function() {
            this.ApiResource.each(this.addOne);
        },

        addOne: function(apiResource) {
            ResourceController.init({item: apiResource, container: "#resources"});
        }
    });

    var ResourceController = Spine.Controller.create({
        proxied: ["renderApi", "renderOperation"],

        templateName: "#resourceTemplate",
        apiResource: null,
        apiList: null,
        modelList: null,

        init: function() {
            this.render();

            this.apiResource = this.item;
            this.apiList = this.apiResource.apiList;
            this.modelList = this.apiResource.modelList;

//            log("------------- apiResource : " + this.apiResource.name);
//            this.apiList.logAll();
//            this.modelList.logAll();

            this.apiList.each(this.renderApi);

        },

        render: function() {
            $(this.templateName).tmpl(this.item).appendTo(this.container);
        },

        renderApi: function(api) {
            var resourceApisContainer = "#" + this.apiResource.name + "_endpoint_list";
            ApiController.init({item: api, container: resourceApisContainer});
        }

    });


    var ApiController = Spine.Controller.create({
        proxied: ["renderOperation"],

        api: null,
        templateName: "#apiTemplate",

        init: function() {
            this.render();

            this.api = this.item;

            this.api.operations.each(this.renderOperation);
        },

        render: function() {
            $(this.templateName).tmpl(this.item).appendTo(this.container);
        },

        renderOperation: function(operation) {
            var operationsContainer = "#" + this.api.name + "_endpoint_" + this.api.id + "_operations";
            OperationController.init({item: operation, container: operationsContainer});
        }
    });

    var OperationController = Spine.Controller.create({
        operation: null,
        templateName: "#operationTemplate",

        init: function() {
            this.render();

            this.operation = this.item;
            this.renderParams();
        },

        render: function() {
            $(this.templateName).tmpl(this.item).appendTo(this.container);
        },

        renderParams: function() {
            if (this.operation.parameters && this.operation.parameters.count() > 0) {
                var isGetOpetation = (this.operation.httpMethodLowercase == "get");

                var operationParamsContainer = "#" + this.operation.apiName + "_" + this.operation.nickname + "_" + this.operation.id + "_params";
                log("operationParamsContainer = " + operationParamsContainer);
                for (var p = 0; p < this.operation.parameters.count(); p++) {
                    var param = this.operation.parameters.all()[p];

                    var templateName = "#paramTemplate";
                    if (param.required)
                        templateName += "Required";

                    if (!isGetOpetation)
                        templateName += "ReadOnly";

                    $(templateName).tmpl(param).appendTo(operationParamsContainer);
                    log("adding " + $(templateName).tmpl(param) + " TO " + operationParamsContainer);

                    if (!isGetOpetation) {
                        var submitButtonId = "#" + this.operation.apiName + "_" + this.operation.nickname + "_" + this.operation.id + "_content_sandbox_response_button";
                        $(submitButtonId).hide();

                        var valueHeader = "#" + this.operation.apiName + "_" + this.operation.nickname + "_" + this.operation.id + "_value_header";
                        $(valueHeader).html("Default Value");

                    }


                }
            }
        }
    });

    var resourceListController = ResourceListController.init();

});


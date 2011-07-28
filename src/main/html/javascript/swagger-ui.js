jQuery(function($) {

    this.baseUrl = "http://swagr.api.wordnik.com/v4/list.json";

    var ApiSelectionController = Spine.Controller.create({
        proxied: ["showApi"],

        baseUrlList: new Array(),

        init: function() {
            if(this.supportsLocalStorage()) {
                var baseUrls = localStorage.getItem("com.wordnik.swagger.ui.baseUrls");
                if(baseUrls && jQuery.trim(baseUrls).length > 0) {
                    this.baseUrlList = baseUrls.split(",");
                }

            } else {
                log("local storage not supported, user will need to specifiy the api url")
            }

            this.render();

            $("#button_explore").click(this.showApi);
        },

        slapOn: function() {
            messageController.showMessage("Please enter a base url for the api that you wish to explore.");
            $("#resources_container").hide();
        },

        supportsLocalStorage: function() {
            try {
                return 'localStorage' in window && window['localStorage'] !== null;
            } catch (e) {
                return false;
            }
        },

        render: function() {
//            $("#baseUrlSelector").chosen();
        },

        showApi: function() {
            var baseUrl = jQuery.trim($("#input_baseUrl").val());
            if(baseUrl.length == 0) {
                $("#input_baseUrl").wiggle();
            } else {
                var resourceListController = ResourceListController.init({baseUrl: baseUrl})
            }
        }
    });

    var MessageController = Spine.Controller.create({
        showMessage: function(msg) {
            if(msg) {
                $("#content_message").html(msg);
                $("#content_message").show();
            } else {
                $("#content_message").html("");
                $("#content_message").hide();
            }

        },

        clearMessage: function() {
            this.showMessage();
        }
    });
    var messageController = MessageController.init();

    // The following heirarchy is followed by these view controllers
    // ResourceListController
    //     >>> ResourceController
    //         >>> ApiController
    //             >>> OperationController

    var ResourceListController = Spine.Controller.create({
        proxied: ["addAll", "addOne"],

        ApiResource: null,

        init: function() {
            if(this.baseUrl == null) {
                throw new Error("A baseUrl must be passed to ResourceListController");
            }

            $("#content_message").hide();
            $("#resources_container").hide();
            $("#resources").html("");

            var hostUrl = this.baseUrl.substr(0, this.baseUrl.lastIndexOf("/"));
            var resourceListApi = this.baseUrl.substr(this.baseUrl.lastIndexOf("/") + 1, this.baseUrl.length);
            log("resourceListApi=" + resourceListApi);
            log("hostUrl=" + hostUrl);

            // create and initialize SwaggerService
            $("#api_host_url").html(hostUrl);
            var swaggerService = new SwaggerService(hostUrl, "list", function(msg) {
                if(msg)
                    messageController.showMessage(msg);
                else
                    messageController.showMessage("Rendering page...");
            });
            swaggerService.init();

            // Create convenience references to Spine models
            this.ApiResource = swaggerService.ApiResource();

            this.ApiResource.bind("refresh", this.addAll);
        },

        addAll: function() {
            this.ApiResource.each(this.addOne);
            messageController.clearMessage();
            $("#resources_container").slideDown();
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
        proxied: ["submitOperation"],

        operation: null,
        templateName: "#operationTemplate",
        elementScope: "#operationTemplate",

        init: function() {
            this.render();

            this.operation = this.item;
            this.isGetOperation = (this.operation.httpMethodLowercase == "get");
            this.elementScope = "#" + this.operation.apiName + "_" + this.operation.nickname + "_" + this.operation.id;

            this.renderParams();

        },

        render: function() {
            $(this.templateName).tmpl(this.item).appendTo(this.container);
        },

        renderParams: function() {
            if (this.operation.parameters && this.operation.parameters.count() > 0) {
                var operationParamsContainer = this.elementScope + "_params";
                log("operationParamsContainer = " + operationParamsContainer);
                for (var p = 0; p < this.operation.parameters.count(); p++) {
                    var param = this.operation.parameters.all()[p];

                    var templateName = "#paramTemplate";
                    if (param.required)
                        templateName += "Required";

                    if (!this.isGetOperation)
                        templateName += "ReadOnly";

                    $(templateName).tmpl(param).appendTo(operationParamsContainer);
//                    log("adding " + $(templateName).tmpl(param) + " TO " + operationParamsContainer);
                }
            }

            var submitButtonId = this.elementScope + "_content_sandbox_response_button";
            if (this.isGetOperation) {
                $(submitButtonId).click(this.submitOperation);
            } else {
                $(submitButtonId).hide();

                var valueHeader = this.elementScope + "_value_header";
                $(valueHeader).html("Default Value");
            }

        },

        submitOperation: function() {
            var form = $(this.elementScope + "_form");

            var error_free = true;
            var missing_input = null;

            // Cycle through the forms required inputs
            form.find("input.required").each(function() {

                // Remove any existing error styles from the input
                $(this).removeClass('error');

                // Tack the error style on if the input is empty..
                if ($(this).val() == '') {
                    if(missing_input == null)
                        missing_input = $(this);
                    $(this).addClass('error');
                    $(this).wiggle();
                    error_free = false;
                }

            });

            log("error_free = " + error_free);


        }

    });


    var apiSelectionController = ApiSelectionController.init();
    if(this.baseUrl) {
        var resourceListController = ResourceListController.init({baseUrl: this.baseUrl});
    } else {
        apiSelectionController.slapOn();
    }

});


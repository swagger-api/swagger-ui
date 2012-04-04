jQuery(function($) {

  // this.baseUrl = "http://petstore.swagger.wordnik.com/api/resources.json";
  // this.apiKey = "special-key";
  
  var ApiSelectionController = Spine.Controller.create({
    proxied: ["showApi"],

    baseUrlList: new Array(),

    init: function() {
      if (this.supportsLocalStorage()) {
        var baseUrl = localStorage.getItem("com.wordnik.swagger.ui.baseUrl");
        var apiKey = localStorage.getItem("com.wordnik.swagger.ui.apiKey");

        if (baseUrl && baseUrl.length > 0)
        $("#input_baseUrl").val(baseUrl);

        if (apiKey && apiKey.length > 0)
        $("#input_apiKey").val(apiKey);

      } else {
        log("localStorage not supported, user will need to specifiy the api url");
      }

      $("a#explore").click(this.showApi);

      this.adaptToScale();
      $(window).resize(function() {
      	apiSelectionController.adaptToScale();
      });

      this.handleEnter();
    },
    
    handleEnter: function(){
      var self = this;
      var submit = function() {
        self.showApi();
      };
      $('#input_baseUrl').keydown(function(e) {
        if(e.which != 13) return;
        submit();
      });
      $('#input_apiKey').keydown(function(e) {
        if(e.which != 13) return;
        submit();
      });
    },
    
    adaptToScale: function() {
      // var form_width = $('form#api_selector').width();
      // var inputs_width = 0;
      // $('form#api_selector div.input').each( function(){ inputs_width += $(this).outerWidth(); });
      // 
      // // Update with of baseUrl input
      // var free_width = form_width - inputs_width;
      // $('#input_baseUrl').width($('#input_baseUrl').width() + free_width - 50);
    },

    
    slapOn: function() {
      // messageController.showMessage("Please enter the base URL of the API that you wish to explore.");
      $("#content_message").show();
      $("#resources_container").hide();
      this.showApi();
    },

    supportsLocalStorage: function() {
      try {
        return 'localStorage' in window && window['localStorage'] !== null;
      } catch(e) {
        return false;
      }
    },

    showApi: function() {
      var baseUrl = jQuery.trim($("#input_baseUrl").val());
      var apiKey = jQuery.trim($("#input_apiKey").val());
      if (baseUrl.length == 0) {
        $("#input_baseUrl").wiggle();
      } else {
        if (this.supportsLocalStorage()) {
          localStorage.setItem("com.wordnik.swagger.ui.apiKey", apiKey);
          localStorage.setItem("com.wordnik.swagger.ui.baseUrl", baseUrl);
        }
        var resourceListController = ResourceListController.init({
          baseUrl: baseUrl,
          apiKey: apiKey
        });
      }
    }
  });

  var MessageController = Spine.Controller.create({
    showMessage: function(msg) {
      if (msg) {
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
  //   >>> ResourceController
  // >>> ApiController
  //  >>> OperationController
  var ResourceListController = Spine.Controller.create({
    proxied: ["addAll", "addOne"],

    ApiResource: null,

    init: function() {
      if (this.baseUrl == null) {
        throw new Error("A baseUrl must be passed to ResourceListController");
      }

      $("#content_message").hide();
      $("#resources_container").hide();
      $("#resources").html("");

      // create and initialize SwaggerService
      var swaggerService = new SwaggerService(this.baseUrl, this.apiKey,
      function(msg) {
        if (msg)
        messageController.showMessage(msg);
        else
        messageController.showMessage("Fetching remote JSON...");
      });

      // $("#api_host_url").html(swaggerService.apiHost());
      
      swaggerService.init();

      // Create convenience references to Spine models
      this.ApiResource = swaggerService.ApiResource();

      this.ApiResource.bind("refresh", this.addAll);
    },

    addAll: function() {
      this.ApiResource.each(this.addOne);
      messageController.clearMessage();
      $("#resources_container").slideDown(function() {
        setTimeout(function() {
          Docs.shebang();
        },
        400);
      });
    },

    addOne: function(apiResource) {
      ResourceController.init({
        item: apiResource,
        container: "#resources"
      });
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
      this.apiList.each(this.renderApi);
    },

    render: function() {
      $(this.templateName).tmpl(this.item).appendTo(this.container);
      $('#colophon').fadeIn();
    },

    renderApi: function(api) {
      var resourceApisContainer = "#" + this.apiResource.name + "_endpoint_list";
      ApiController.init({
        item: api,
        container: resourceApisContainer
      });

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
      var operationsContainer = "#" + this.api.name + "_endpoint_operations";
      OperationController.init({
        item: operation,
        container: operationsContainer
      });
    }
  });

  
  // Param Model
  // ----------------------------------------------------------------------------------------------
  var Param = Spine.Model.setup(
    "Param",
    ["name", "defaultValue", 'description', 'required', 'dataType', 'allowableValues', 'paramType', 'allowMultiple', "readOnly"]
  );
  
  Param.include({

    cleanup: function() {
      this.defaultValue = this.defaultValue || '';
    },

    templateName: function(){
      var n = "#paramTemplate";
      
      if (this.allowableValues && this.allowableValues.valueType == "LIST") {
        n += "Select";
      } else {
        if (this.required) n += "Required";
        if (this.readOnly) n += "ReadOnly";
      }
      
      return(n);
    }

  });
  
  
  var OperationController = Spine.Controller.create({
    proxied: ["submitOperation", "showResponse", "showErrorStatus", "showCompleteStatus"],

    operation: null,
    templateName: "#operationTemplate",
    elementScope: "#operationTemplate",

    init: function() {
      this.render();

      this.operation = this.item;
      this.isGetOperation = (this.operation.httpMethodLowercase == "get");
      this.elementScope = "#" + this.operation.apiName + "_" + this.operation.nickname + "_" + this.operation.httpMethod;

      this.renderParams();
    },

    render: function() {
      $(this.templateName).tmpl(this.item).appendTo(this.container);
    },

    renderParams: function() {
      if (this.operation.parameters && this.operation.parameters.count() > 0) {
        var operationParamsContainer = this.elementScope + "_params";

        for (var p = 0; p < this.operation.parameters.count(); p++) {
          var param = Param.init(this.operation.parameters.all()[p]);
          param.cleanup();
          
          $(param.templateName()).tmpl(param).appendTo(operationParamsContainer);
        }
      }

      var submitButtonId = this.elementScope + "_content_sandbox_response_button";
      $(submitButtonId).click(this.submitOperation);

    },

    submitOperation: function() {
      var form = $(this.elementScope + "_form");
      var error_free = true;
      var missing_input = null;

      // Cycle through the form's required inputs
      form.find("input.required").each(function() {

        // Remove any existing error styles from the input
        $(this).removeClass('error');

        // Tack the error style on if the input is empty..
        if ($(this).val() == '') {
          if (missing_input == null)
          missing_input = $(this);
          $(this).addClass('error');
          $(this).wiggle();
          error_free = false;
        }

      });
      
      if (error_free) {
        var invocationData = this.operation.invocationData(form.serializeArray());
        $(".request_url", this.elementScope + "_content_sandbox_response").html("<pre>" + invocationData.url + "</pre>");
        $.ajax({
          url: invocationData.url,
          dataType: 'json',
          data: invocationData.queryParams,
          success: this.showResponse,
          type: this.operation.httpMethod.toUpperCase()
        }).complete(this.showCompleteStatus).error(this.showErrorStatus);
      }

    },

    showResponse: function(response) {
      // log(response);
      var prettyJson = JSON.stringify(response, null, "\t").replace(/\n/g, "<br>");
      // log(prettyJson);
      $(".response_body", this.elementScope + "_content_sandbox_response").html(prettyJson);

      $(this.elementScope + "_content_sandbox_response").slideDown();
    },

    showErrorStatus: function(data) {
      // log("error " + data.status);
      this.showStatus(data);
      $(this.elementScope + "_content_sandbox_response").slideDown();
    },

    showCompleteStatus: function(data) {
      // log("complete " + data.status);
      this.showStatus(data);
    },

    showStatus: function(data) {
      // log(data);
      // log(data.getAllResponseHeaders());
      var response_body = "<pre>" + JSON.stringify(JSON.parse(data.responseText), null, 2).replace(/\n/g, "<br>") + "</pre>";
      $(".response_code", this.elementScope + "_content_sandbox_response").html("<pre>" + data.status + "</pre>");
      $(".response_body", this.elementScope + "_content_sandbox_response").html(response_body);
      $(".response_headers", this.elementScope + "_content_sandbox_response").html("<pre>" + data.getAllResponseHeaders() + "</pre>");
    }

  });

  // Attach controller to window*
  window.apiSelectionController = ApiSelectionController.init();
  
  if (this.baseUrl) {
    window.resourceListController = ResourceListController.init({
      baseUrl: this.baseUrl,
      apiKey: this.apiKey
    });
  } else {
    apiSelectionController.slapOn();
  }

});


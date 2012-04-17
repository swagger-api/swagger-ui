function SwaggerService(discoveryUrl, _apiKey, statusCallback) {
  if (!discoveryUrl)
  throw new Error("discoveryUrl must be passed while creating SwaggerService");

  // constants
  discoveryUrl = jQuery.trim(discoveryUrl);
  if (discoveryUrl.length == 0)
  throw new Error("discoveryUrl must be passed while creating SwaggerService");

  if ( discoveryUrl.indexOf("/")!=0 && ! (discoveryUrl.toLowerCase().indexOf("http:") == 0 || discoveryUrl.toLowerCase().indexOf("https:") == 0)) {
    discoveryUrl = ("http://" + discoveryUrl);
  }

  var globalBasePath = null;
  var formatString = ".{format}";
  var statusListener = statusCallback;
  var apiKey = _apiKey;

  var apiKeySuffix = "";
  if (apiKey) {
    apiKey = jQuery.trim(apiKey);
    if (apiKey.length > 0)
    apiKeySuffix = "?api_key=" + apiKey;
  }

  function log() {
    if (window.console) console.log.apply(console,arguments);
  }

  function error(m) {
    log("ERROR: " + m);
  }

  function updateStatus(status) {
    statusListener(status);
  }

  function endsWith(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
  }

  // make some models public
  this.ApiResource = function() {
    return ApiResource;
  };

  this.apiHost = function() {
    return globalBasePath;
  };

  this.formatString = function() {
    return formatString;
  };

  // Model: ApiResource
  var ApiResource = Spine.Model.setup("ApiResource", ["name", "baseUrl", "path", "path_json", "path_xml", "description", "apiLists", "modelList"]);
  ApiResource.include({
    path_json: null,
    path_xml: null,
    init: function(atts) {
      if (atts) this.load(atts);
      this.name = this.path.replace(".{format}", "").replace(/\//g, "_");
      this.path_json = this.path.replace("{format}", "json");
      this.path_xml = this.path.replace("{format}", "xml");
      this.baseUrl = globalBasePath;
      this.apiList = Api.sub();
      this.modelList = ApiModel.sub();
    },

    addApis: function(apiObjects, basePath) {
      // log("apiObjects: %o", apiObjects);
      this.apiList.createAll(apiObjects);
	  this.apiList.each(function(api) {
		api.setBaseUrl(basePath);
	  });
    },
    
    addModel: function(modelObject) {
      this.modelList.create(modelObject);
    },

    toString: function() {
      return this.path_json + ": " + this.description;
    }
  });

  // Model: Api
  var Api = Spine.Model.setup("Api", ["baseUrl", "path", "path_json", "path_xml", "name", "description", "operations", "path_json", "path_xml"]);
  Api.include({
    init: function(atts) {
      if (atts) this.load(atts);

      var sep = this.path.lastIndexOf("/");
      this.name = (sep!==0?this.path.substr(0, sep):this.path).replace(".{format}", "").replace(/\//g, "_");

      var secondPathSeperatorIndex = this.path.indexOf("/", 1);
      if (secondPathSeperatorIndex > 0) {
        var prefix = this.path.substr(0, secondPathSeperatorIndex);
        var suffix = this.path.substr(secondPathSeperatorIndex, this.path.length);
        // log(this.path + ":: " + prefix + "..." + suffix);
        this.path_json = prefix.replace("{format}", "json") + suffix;
        this.path_xml = prefix.replace("{format}", "xml") + suffix;;
      } else {
        this.path_json = this.path.replace("{format}", "json");
        this.path_xml = this.path.replace("{format}", "xml");
      }

      var value = this.operations;

      this.operations = ApiOperation.sub();
      if (value) {
        for (var i = 0; i < value.length; i++) {
          var obj = value[i];
          obj.apiName = this.name;
          obj.path = this.path;
          obj.path_json = this.path_json;
          obj.path_xml = this.path_xml;

        }

        this.operations.refresh(value);
      }

      updateStatus("Loading " + this.path + "...");

    },

    setBaseUrl: function(u) {
		this.baseUrl = u;
		this.operations.each(function(o) {
			o.baseUrl = u;
		});
    },

    toString: function() {
      var opsString = "";
      for (var i = 0; i < this.operations.all().length; i++) {
        var e = this.operations.all()[i];

        if (opsString.length > 0)
        opsString += ", ";

        opsString += e.toString();
      }
      return this.path_json + "- " + this.operations.all().length + " operations: " + opsString;
    }

  });

  // Model: ApiOperation
  var ApiOperation = Spine.Model.setup("ApiOperation", ["baseUrl", "path", "path_json", "path_xml", "summary", "notes", "deprecated", "open", "httpMethod", "httpMethodLowercase", "nickname", "responseClass", "parameters", "apiName"]);
  ApiOperation.include({
    init: function(atts) {
      if (atts) this.load(atts);

      this.httpMethodLowercase = this.httpMethod.toLowerCase();

      var value = this.parameters;
      this.parameters = ApiParameter.sub();
      if (value) this.parameters.refresh(value);
    },

    toString: function() {
      var paramsString = "(";
      for (var i = 0; i < this.parameters.all().length; i++) {
        var e = this.parameters.all()[i];

        if (paramsString.length > 1)
        paramsString += ", ";

        paramsString += e.toString();
      }
      paramsString += ")";

      return "{" + this.path_json + "| " + this.nickname + paramsString + ": " + this.summary + "}";
    },

    invocationData: function(formValues) {
      var formValuesMap = new Object();
      for (var i = 0; i < formValues.length; i++) {
        var formValue = formValues[i];
        if (formValue.value && jQuery.trim(formValue.value).length > 0)
        formValuesMap[formValue.name] = formValue.value;
      }

      var urlTemplateText = this.path_json.split("{").join("${");
      // log("url template = " + urlTemplateText);
      var urlTemplate = $.template(null, urlTemplateText);
      var url = $.tmpl(urlTemplate, formValuesMap)[0].data;
      // log("url with path params = " + url);

      var queryParams = {};
      if (apiKey) {
        apiKey = jQuery.trim(apiKey);
        if (apiKey.length > 0)
          queryParams['api_key'] = apiKey;
      }
      this.parameters.each(function(param) {
        var paramValue = jQuery.trim(formValuesMap[param.name]);
        if (param.paramType == "query" && paramValue.length > 0) {
          queryParams[param.name] = formValuesMap[param.name];
        }
      });

      url = this.baseUrl + url;
      // log("final url with query params and base url = " + url);

      return {url: url, queryParams: queryParams};
    }

  });

  // Model: ApiParameter
  var ApiParameter = Spine.Model.setup("ApiParameter", ["name", "description", "required", "dataType", "allowableValues", "paramType", "allowMultiple"]);
  ApiParameter.include({
    init: function(atts) {
      if (atts) this.load(atts);

      this.name = this.name || this.dataType;

      if(this.allowableValues){
          var value = this.allowableValues;
          if(value.valueType == "LIST"){
              this.allowableValues = AllowableListValues.sub();
          } else if (value.valueType == "RANGE"){
              this.allowableValues = AllowableRangeValues.sub();
          }
          if (value) this.allowableValues = this.allowableValues.create(value);
      }
    },

    toString: function() {
      if (this.allowableValues)
      return this.name + ": " + this.dataType + " " + this.allowableValues;
      else
      return this.name + ": " + this.dataType;
    }

  });

  var AllowableListValues = Spine.Model.setup("AllowableListValues", ["valueType", "values"]);
  AllowableListValues.include({
    init: function(atts) {
      if (atts) this.load(atts);
      this.name = "allowableValues";
    },
    toString: function() {
      if (this.values)
      return  "["+this.values+"]";
      else
      return "";
    }
  });

  var AllowableRangeValues = Spine.Model.setup("AllowableRangeValues", ["valueType", "inclusive", "min", "max"]);
  AllowableRangeValues.include({
    init: function(atts) {
      if (atts) this.load(atts);
      this.name = "allowableValues";
    },

    toString: function() {
      if (this.min && this.max)
      return "[" + min + "," + max + "]";
      else
      return "";
    }
  });
  

  // Model: ApiModel
  var ApiModel = Spine.Model.setup("ApiModel", ["id", "fields"]);
  ApiModel.include({
    init: function(atts) {
      if (atts) this.load(atts);

      if (!this.fields) {
        var propertiesListObject = this.properties;
        this.fields = ApiModelProperty.sub();

        for (var propName in propertiesListObject) {
          if (propName != "parent") {
            var p = propertiesListObject[propName];
            p.name = propName;
            p.id = Spine.guid();
            // log(p);
            this.fields.create(p);
          }
        }
        //log("got " + this.fields.count() + " fields for " + this.id);
      }
    },

    toString: function() {
      var propsString = "";

      propsString += "(";
      for (var i = 0; i < this.fields.all().length; i++) {
        var e = this.fields.all()[i];

        if (propsString.length > 1)
        propsString += ", ";

        propsString += e.toString();
      }
      propsString += ")";

      if (this.required)
      return this.id + " (required): " + propsString;
      else
      return this.id + ": " + propsString;
    }

  });


  // Model: ApiModelProperty
  var ApiModelProperty = Spine.Model.setup("ApiModelProperty", ["name", "required", "dataType"]);
  ApiModelProperty.include({
    init: function(atts) {
      if (atts) this.load(atts);

      if (!this.dataType) {
        if (atts.type == "any")
        this.dataType = "object";
        else if (atts.type == "array") {
          if (atts.items) {
            if (atts.items.$ref) {
              this.dataType = "array[" + atts.items.$ref + "]";
            } else {
              this.dataType = "array[" + atts.items.type + "]";
            }
          } else {
            this.dataType = "array";
          }
        } else
        this.dataType = atts.type;

      }
    },

    toString: function() {
      if (this.required)
      return this.name + ": " + this.dataType + " (required)";
      else
      return this.name + ": " + this.dataType;
    }

  });

  // Controller
  var ModelController = Spine.Controller.create({
    countLoaded: 0,
    proxied: ["fetchResources", "loadResources", "apisLoaded", "modelsLoaded"],
    discoveryUrlList: [],
	discoveryUrlListCursor: 0,

    init: function() {
      // log("ModelController.init");

      this.fetchEndpoints();
    },

    fetchEndpoints: function() {
      updateStatus("Fetching API List...");
	  var baseDiscoveryUrl = endsWith(discoveryUrl, "/") ? discoveryUrl.substr(0, discoveryUrl.length - 1) : discoveryUrl;
	  if(endsWith(baseDiscoveryUrl, "/resources.json"))
		baseDiscoveryUrl = baseDiscoveryUrl.substr(0, baseDiscoveryUrl.length - "/resources.json".length);
	  else if(endsWith(baseDiscoveryUrl, "/resources"))
		baseDiscoveryUrl = baseDiscoveryUrl.substr(0, baseDiscoveryUrl.length - "/resources".length);
	
	  this.discoveryUrlList.push(discoveryUrl);
	  this.discoveryUrlList.push(baseDiscoveryUrl);
	  this.discoveryUrlList.push(baseDiscoveryUrl + "/resources.json");
	  this.discoveryUrlList.push(baseDiscoveryUrl + "/resources");
	  
	  log("Will try the following urls to discover api endpoints:")
	  for(var i = 0; i < this.discoveryUrlList.length; i++)
		log(" > " + this.discoveryUrlList[i]);
	
	  this.fetchEndpointsSeq();
    },

    fetchEndpointsSeq: function() {
      var controller = this;

	  if(this.discoveryUrlListCursor < this.discoveryUrlList.length) {
		  var url = this.discoveryUrlList[this.discoveryUrlListCursor++]
	      updateStatus("Fetching API List from " + url);
		  log("Trying url " + url);
	      $.getJSON(url + apiKeySuffix, function(response) {
	      })
	      .success(function(response) {
		      log("Setting globalBasePath to " + response.basePath);
		      globalBasePath = response.basePath;
		      ApiResource.createAll(response.apis);  
	          controller.fetchResources(response.basePath);
	      })
	   	  .error(function(response) { 
	          controller.fetchEndpointsSeq();
		  });
	  } else {
	      log ('Error with resource discovery. Exhaused all possible endpoint urls');
	
		  var urlsTried = "";
		  for(var i = 0; i < this.discoveryUrlList.length; i++) {
			urlsTried = urlsTried + "<br/>" + this.discoveryUrlList[i];
		  }
			
	      updateStatus("Unable to fetch API Listing. Tried the following urls:" + urlsTried);
	  }
    },

    fetchResources: function(basePath) {
      log("fetchResources: basePath = " + basePath);
      //ApiResource.logAll();
      for (var i = 0; i < ApiResource.all().length; i++) {
        var apiResource = ApiResource.all()[i];
        this.fetchResource(apiResource);
      }
    },

    fetchResource: function(apiResource) {
      var controller = this;
      updateStatus("Fetching " + apiResource.name + "...");
      var resourceUrl = globalBasePath + apiResource.path_json + apiKeySuffix;
      log("resourceUrl: %o", resourceUrl);
      $.getJSON(resourceUrl,
      function(response) {
        controller.loadResources(response, apiResource);
      });
    },

    loadResources: function(response, apiResource) {
      try {
        this.countLoaded++;
        //    log(response);
        if (response.apis) {
          apiResource.addApis(response.apis, response.basePath);  
        }
        //        updateStatus("Parsed Apis");
        //log(response.models);
        if (response.models) {
          // log("response.models.length = " + response.models.length);
          for (var modeName in response.models) {
            var m = response.models[modeName];
            // log("creating " + m.id);
            apiResource.addModel(m);
            //      apiResource.modelList.create(m);
          }
        }

        updateStatus();
      } finally {
        if (this.countLoaded == ApiResource.count()) {
          // log("all models/api loaded");
          ApiResource.trigger("refresh");
        }
      }
    }

  });

  this.init = function() {
    this.modelController = ModelController.init();
  };
};



function SwaggerService(hostUrl) {
	// constants
	var apiHost = hostUrl || "http://swagr.api.wordnik.com/v4";

	// utility functions
	function log(m) {
	    if (window.console) console.log(m);
	}

	function error(m) {
	    if (window.console) console.log("ERROR: " + m);
	}
	
    // make some models public
	this.Api = function() {return Api;}
	this.ApiModel = function() {return ApiModel;}

	// Model: ApiEndpoint
	var ApiEndpoint = Spine.Model.setup("ApiEndpoint", ["path", "description"]);
    ApiEndpoint.include({
		path_json: null,
		path_xml: null,
		
		init: function(atts) {
	        if (atts) this.load(atts);
			this.path_json = this.path + ".json";
			this.path_xml = this.path + ".xml";
		},
		
		toString: function() {
			return this.path_json +  ": " + this.description;
		}
    });

	// Model: Api
	var Api = Spine.Model.setup("Api", ["path", "description", "operations", "path_json", "path_xml"]);;
    Api.include({
		init: function(atts) {
	        if (atts) this.load(atts);

			if(this.path.indexOf("/", 1) > 0) {
				var prefix = this.path.substr(0, this.path.indexOf("/", 1));
				var suffix = this.path.substr(this.path.indexOf("/", 1), this.path.length);
				// log(this.path + ":: " + prefix + "..." + suffix);

				this.path_json = prefix + ".json" + suffix;
				this.path_xml = prefix + ".xml" + suffix;;
			} else {
				this.path_json = this.path + ".json";
				this.path_xml = this.path + ".xml";
			}

	        var value  = this.operations;
	        this.operations = ApiOperation.sub();
	        if (value) this.operations.refresh(value);
		},
		
		toString: function() {
			var opsString = "";
			for(var i = 0; i < this.operations.all().length; i++) {
				var e = this.operations.all()[i];
				
				if(opsString.length > 0)
					opsString += ", ";

				opsString += e.toString();
			}
			return this.path_json +  "- " + this.operations.all().length + " operations: " + opsString;
		}
		
    });

	// Model: ApiOperation
	var ApiOperation = Spine.Model.setup("ApiOperation", ["summary", "deprecated", "open", "httpMethod", "nickname", "responseClass", "parameters"]);
    ApiOperation.include({
		init: function(atts) {
	        if (atts) this.load(atts);

	        var value  = this.parameters;
	        this.parameters = ApiParameter.sub();
	        if (value) this.parameters.refresh(value);
		},

		toString: function() {
			var paramsString = "(";
			for(var i = 0; i < this.parameters.all().length; i++) {
				var e = this.parameters.all()[i];
				
				if(paramsString.length > 1)
					paramsString += ", ";

				paramsString += e.toString();
			}
			paramsString += ")";

			return "{" + this.nickname  + paramsString + ": " + this.summary + "}";
		}
		
    });

	// Model: ApiParameter
	var ApiParameter = Spine.Model.setup("ApiParameter", ["name", "description", "required", "dataType", "allowableValues", "paramType", "allowMultiple"]);
	ApiParameter.include({
		init: function(atts) {
	        if (atts) this.load(atts);
		},

		toString: function() {
			if(this.allowableValues && this.allowableValues.length > 0)
				return this.name +  ": " + this.dataType + " [" + this.allowableValues + "]";
			else
				return this.name +  ": " + this.dataType;
		}
		
    });

	// Model: ApiModel
	var ApiModel = Spine.Model.setup("ApiModel", ["id", "fields"]);;
	ApiModel.include({
		init: function(atts) {
	        if (atts) this.load(atts);
			
			if(!this.fields) {
		        var propertiesListObject  = this.properties;
		        this.fields = ApiModelProperty.sub();

				for(var propName in propertiesListObject) {
					if(propName != "parent") {
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
			for(var i = 0; i < this.fields.all().length; i++) {
				var e = this.fields.all()[i];
				
				if(propsString.length > 1)
					propsString += ", ";
			
				propsString += e.toString();
			}
			propsString += ")";

			if(this.required)
				return this.id + " (required): " + propsString;
			else
				return this.id +  ": " + propsString;
		}
		
    });


	// Model: ApiModelProperty
	var ApiModelProperty = Spine.Model.setup("ApiModelProperty", ["name", "required", "dataType"]);
	ApiModelProperty.include({
		init: function(atts) {
	        if (atts) this.load(atts);

			if(!this.dataType) {
				if(atts.type == "any")
					this.dataType = "object";
				else if(atts.type == "array") {
					if(atts.items) {
						if(atts.items.$ref) {
							this.dataType = "array[" + atts.items.$ref + "]";
						} else {
							this.dataType = "array[" + atts.items.type + "]"
						}
					} else {
						this.dataType = "array";
					}
				} else
					this.dataType = atts.type;
			}
		},

		toString: function() {
			if(this.required)
				return this.name +  ": " + this.dataType + " (required)";
			else
				return this.name +  ": " + this.dataType;
		}
		
    });

	// Controller
    var ModelController = Spine.Controller.create({
		countLoaded: 0,
	    proxied: ["fetchResources", "loadResources", "apisLoaded", "modelsLoaded"],
	
        init: function() {
			log("ModelController.init");

			ApiEndpoint.bind("refresh", this.fetchResources);

			this.fetchEndpoints();
        },

		fetchEndpoints: function() {
            $.getJSON(apiHost + "/list.json", function(response) {
				//log(response);
				ApiEndpoint.refresh(response.apis);
			});
		},
		
		fetchResources: function() {
			//log("fetchResources");
			ApiEndpoint.logAll();
			
			for(var i = 0; i < ApiEndpoint.all().length; i++) {
				var e = ApiEndpoint.all()[i];
	            $.getJSON(apiHost + e.path_json, this.loadResources);
			}			
		}, 
		
		loadResources: function(response) {
			try {
				this.countLoaded++;
				//log(response);
				
				Api.createAll(response.apis);

				//log(response.models);
				if(response.models) {
					// log("response.models.length = " + response.models.length);

					for(var modeName in response.models) {
						var m = response.models[modeName];
						// log("creating " + m.id);

						ApiModel.create(m);
					}
				}
			} finally {
				if(this.countLoaded == ApiEndpoint.count()) {
					log("all models/api loaded");
					Api.trigger("refresh");
					ApiModel.trigger("refresh");
				}
			}
		}

    });

   	this.init = function() {
		this.modelController = ModelController.init();
	}
};

jQuery(function($) {
	// create and initialize SwaggerService
	var swaggerService = new SwaggerService();
	swaggerService.init();
	
	// Create convenience references to Spine models
	var ApiModel = swaggerService.ApiModel();
	var Api = swaggerService.Api();
	
	// Register a callback for when apis are loaded
	Api.bind("refresh", apisLoaded);
	
	function apisLoaded() {
		Api.logAll();
		ApiModel.logAll();
		if (window.console) console.log("apis loaded");
	}
	
});


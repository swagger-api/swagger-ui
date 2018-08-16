# Configuration

### How to configure

Swagger-UI accepts configuration parameters in four locations.

From lowest to highest precedence:
- The `swagger-config.yaml` in the project root directory, if it exists, is baked into the application
- configuration object passed as an argument to Swagger-UI (`SwaggerUI({ ... })`)
- configuration document fetched from a specified `configUrl`
- configuration items passed as key/value pairs in the URL query string


### Parameters

Parameters with dots in their names are single strings used to organize subordinate parameters, and are not indicative of a nested structure.

For readability, parameters are grouped by category and sorted alphabetically.

Type notations are formatted like so:
- `String=""` means a String type with a default value of `""`.
- `String=["a"*, "b", "c", "d"]` means a String type that can be `a`, `b`, `c`, or `d`, with the `*` indicating that `a` is the default value.

##### Core

Parameter Name | Description
--- | ---
<a name="configUrl"></a>`configUrl` | `String`. URL to fetch external configuration document from.
<a name="dom_id"></a>`dom_id` |`String`, **REQUIRED** if `domNode` is not provided. The id of a dom element inside which SwaggerUi will put the user interface for swagger.
<a name="domNode"></a>`domNode` | `Element`, **REQUIRED** if `dom_id` is not provided. The HTML DOM element inside which SwaggerUi will put the user interface for swagger. Overrides `dom_id`.
<a name="spec"></a>`spec` | `Object={}`. A JS object describing the OpenAPI Specification. When used, the `url` parameter will not be parsed. This is useful for testing manually-generated specifications without hosting them.
<a name="url"></a>`url` | `String`. The url pointing to API definition (normally `swagger.json` or `swagger.yaml`). Will be ignored if `urls` or `spec` is used.
<a name="urls"></a>`urls` | `Array`. An array of API definition objects (`[{url: "<url1>", name: "<name1>"},{url: "<url2>", name: "<name2>"}]`) used by Topbar plugin. When used and Topbar plugin is enabled, the `url` parameter will not be parsed. Names and URLs must be unique among all items in this array, since they're used as identifiers.
<a name="urls.primaryName"></a>`urls.primaryName` | `String`. When using `urls`, you can use this subparameter. If the value matches the name of a spec provided in `urls`, that spec will be displayed when Swagger-UI loads, instead of defaulting to the first spec in `urls`.

##### Plugin system

Read more about the plugin system in the [Customization documentation](/docs/customization/overview.md).

Parameter Name | Description
--- | ---
<a name="layout"></a>`layout` | `String="BaseLayout"`. The name of a component available via the plugin system to use as the top-level layout for Swagger-UI.
<a name="plugins"></a>`plugins` | `Array=[]`. An array of plugin functions to use in Swagger-UI.
<a name="presets"></a>`presets` | `Array=[SwaggerUI.presets.ApisPreset]`. An array of presets to use in Swagger-UI. Usually, you'll want to include `ApisPreset` if you use this option.

##### Display

Parameter Name | Description
--- | ---
<a name="deepLinking"></a>`deepLinking` | `Boolean=false`. If set to `true`, enables deep linking for tags and operations. See the [Deep Linking documentation](/docs/usage/deep-linking.md) for more information.
<a name="displayOperationId"></a>`displayOperationId` | `Boolean=false`. Controls the display of operationId in operations list. The default is `false`.
<a name="defaultModelsExpandDepth"></a>`defaultModelsExpandDepth` | `Number=1`. The default expansion depth for models (set to -1 completely hide the models).
<a name="defaultModelExpandDepth"></a>`defaultModelExpandDepth` | `Number=1`. The default expansion depth for the model on the model-example section.
<a name="defaultModelRendering"></a>`defaultModelRendering` | `String=["example"*, "model"]`. Controls how the model is shown when the API is first rendered. (The user can always switch the rendering for a given model by clicking the 'Model' and 'Example Value' links.)
<a name="displayRequestDuration"></a>`displayRequestDuration` | `Boolean=false`. Controls the display of the request duration (in milliseconds) for Try-It-Out requests.
<a name="docExpansion"></a>`docExpansion` | `String=["list"*, "full", "none"]`. Controls the default expansion setting for the operations and tags. It can be 'list' (expands only the tags), 'full' (expands the tags and operations) or 'none' (expands nothing).
<a name="filter"></a>`filter` | `Boolean=false OR String`. If set, enables filtering. The top bar will show an edit box that you can use to filter the tagged operations that are shown. Can be Boolean to enable or disable, or a string, in which case filtering will be enabled using that string as the filter expression. Filtering is case sensitive matching the filter expression anywhere inside the tag.
<a name="maxDisplayedTags"></a>`maxDisplayedTags` | `Number`. If set, limits the number of tagged operations displayed to at most this many. The default is to show all operations.
<a name="operationsSorter"></a>`operationsSorter` | `Function=(a => a)`. Apply a sort to the operation list of each API. It can be 'alpha' (sort by paths alphanumerically), 'method' (sort by HTTP method) or a function (see Array.prototype.sort() to know how sort function works). Default is the order returned by the server unchanged.
<a name="showExtensions"></a>`showExtensions` | `Boolean=false`. Controls the display of vendor extension (`x-`) fields and values for Operations, Parameters, and Schema.
<a name="showCommonExtensions"></a>`showCommonExtensions` | `Boolean=false`. Controls the display of extensions (`pattern`, `maxLength`, `minLength`, `maximum`, `minimum`) fields and values for Parameters.
<a name="tagSorter"></a>`tagsSorter` | `Function=(a => a)`. Apply a sort to the tag list of each API. It can be 'alpha' (sort by paths alphanumerically) or a function (see [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) to learn how to write a sort function). Two tag name strings are passed to the sorter for each pass. Default is the order determined by Swagger-UI.
<a name="onComplete"></a>`onComplete` | `Function=NOOP`. Provides a mechanism to be notified when Swagger-UI has finished rendering a newly provided definition.

##### Network

Parameter Name | Description
--- | ---
<a name="oauth2RedirectUrl"></a>`oauth2RedirectUrl` | `String`. OAuth redirect URL.
<a name="requestInteceptor"></a>`requestInterceptor` | `Function=(a => a)`. MUST be a function.  Function to intercept remote definition, Try-It-Out, and OAuth2 requests.  Accepts one argument requestInterceptor(request) and must return the modified request, or a Promise that resolves to the modified request.
<a name="responseInterceptor"></a>`responseInterceptor` |`Function=(a => a)`. MUST be a function.  Function to intercept remote definition, Try-It-Out, and OAuth2 responses.  Accepts one argument responseInterceptor(response) and must return the modified response, or a Promise that resolves to the modified response.
<a name="showMutatedRequest"></a>`showMutatedRequest` | `Boolean=true`. If set to `true`, uses the mutated request returned from a requestInterceptor to produce the curl command in the UI, otherwise the request before the requestInterceptor was applied is used.
<a name="supportedSubmitMethods"></a>`supportedSubmitMethods` | `Array=["get", "put", "post", "delete", "options", "head", "patch", "trace"]`. List of HTTP methods that have the Try it out feature enabled. An empty array disables Try it out for all operations. This does not filter the operations from the display.
<a name="validatorUrl"></a>`validatorUrl` | `String="https://online.swagger.io/validator" OR null`. By default, Swagger-UI attempts to validate specs against swagger.io's online validator. You can use this parameter to set a different validator URL, for example for locally deployed validators ([Validator Badge](https://github.com/swagger-api/validator-badge)). Setting it to `null` will disable validation.

##### Macros

Parameter Name | Description
--- | ---
<a name="modelPropertyMacro"></a>`modelPropertyMacro` | `Function`. Function to set default values to each property in model. Accepts one argument modelPropertyMacro(property), property is immutable
<a name="parameterMacro"></a>`parameterMacro` | `Function`. Function to set default value to parameters. Accepts two arguments parameterMacro(operation, parameter). Operation and parameter are objects passed for context, both remain immutable

### Instance methods

Method Name | Description
--- | ---
<a name="initOAuth"></a>`initOAuth` | `(configObj) => void`. Provide Swagger-UI with information about your OAuth server - see the OAuth2 documentation for more information.
<a name="preauthorizeBasic"></a>`preauthorizeBasic` | `(authDefinitionKey, username, password) => action`. Programmatically set values for a Basic authorization scheme.
<a name="preauthorizeApiKey"></a>`preauthorizeApiKey` | `(authDefinitionKey, apiKeyValue) => action`. Programmatically set values for an API key authorization scheme.

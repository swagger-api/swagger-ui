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
`configUrl` | `String`. URL to fetch external configuration document from.
`dom_id` |`String`, **REQUIRED** if `domNode` is not provided. The id of a dom element inside which SwaggerUi will put the user interface for swagger.
`domNode` | `Element`, **REQUIRED** if `dom_id` is not provided. The HTML DOM element inside which SwaggerUi will put the user interface for swagger. Overrides `dom_id`.
`spec` | `Object={}`. A JS object describing the OpenAPI Specification. When used, the `url` parameter will not be parsed. This is useful for testing manually-generated specifications without hosting them.
`url` | `String`. The url pointing to API definition (normally `swagger.json` or `swagger.yaml`). Will be ignored if `urls` or `spec` is used.
`urls` | `String`. An array of API definition objects (`{url: "<url>", name: "<name>"}`) used by Topbar plugin. When used and Topbar plugin is enabled, the `url` parameter will not be parsed. Names and URLs must be unique among all items in this array, since they're used as identifiers.
`urls.primaryName` | `String`. When using `urls`, you can use this subparameter. If the value matches the name of a spec provided in `urls`, that spec will be displayed when Swagger-UI loads, instead of defaulting to the first spec in `urls`.

##### Plugin system

Read more about the plugin system in the [Customization documentation](/docs/customization/overview.md).

Parameter Name | Description
--- | ---
`layout` | `String="BaseLayout"`. The name of a component available via the plugin system to use as the top-level layout for Swagger-UI.
`plugins` | `Array=[]`. An array of plugin functions to use in Swagger-UI.
`presets` | `Array=[SwaggerUI.presets.ApisPreset]`. An array of presets to use in Swagger-UI. Usually, you'll want to include `ApisPreset` if you use this option.

##### Display

Parameter Name | Description
--- | ---
`deepLinking` | `Boolean=false`. If set to `true`, enables deep linking for tags and operations. See the [Deep Linking documentation](/docs/usage/deep-linking.md) for more information.
`displayOperationId` | `Boolean=false`. Controls the display of operationId in operations list. The default is `false`.
`defaultModelsExpandDepth` | `Number=1`. The default expansion depth for models (set to -1 completely hide the models).
`defaultModelExpandDepth` | `Number=1`. The default expansion depth for the model on the model-example section.
`defaultModelRendering` | `String=["example"*, "model"]`. Controls how the model is shown when the API is first rendered. (The user can always switch the rendering for a given model by clicking the 'Model' and 'Example Value' links.)
`displayRequestDuration` | `Boolean=false`. Controls the display of the request duration (in milliseconds) for Try-It-Out requests.
`docExpansion` | `String=["list"*, "full", "none"]`. Controls the default expansion setting for the operations and tags. It can be 'list' (expands only the tags), 'full' (expands the tags and operations) or 'none' (expands nothing).
`filter` | `Boolean=false OR String`. If set, enables filtering. The top bar will show an edit box that you can use to filter the tagged operations that are shown. Can be Boolean to enable or disable, or a string, in which case filtering will be enabled using that string as the filter expression. Filtering is case sensitive matching the filter expression anywhere inside the tag.
`maxDisplayedTags` | `Number`. If set, limits the number of tagged operations displayed to at most this many. The default is to show all operations.
`operationsSorter` | `Function=(a => a)`. Apply a sort to the operation list of each API. It can be 'alpha' (sort by paths alphanumerically), 'method' (sort by HTTP method) or a function (see Array.prototype.sort() to know how sort function works). Default is the order returned by the server unchanged.
`showExtensions` | `Boolean=false`. Controls the display of vendor extension (`x-`) fields and values for Operations, Parameters, and Schema.
`tagsSorter` | `Function=(a => a)`. Apply a sort to the tag list of each API. It can be 'alpha' (sort by paths alphanumerically) or a function (see [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) to learn how to write a sort function). Two tag name strings are passed to the sorter for each pass. Default is the order determined by Swagger-UI.
`onComplete` | `Function=NOOP`. Provides a mechanism to be notified when Swagger-UI has finished rendering a newly provided definition.

##### Network

Parameter Name | Description
--- | ---
`oauth2RedirectUrl` | `String`. OAuth redirect URL.
`requestInterceptor` | `Function=(a => a)`. MUST be a function.  Function to intercept remote definition, Try-It-Out, and OAuth2 requests.  Accepts one argument requestInterceptor(request) and must return the potentially modified request.
`responseInterceptor` |`Function=(a => a)`. MUST be a function.  Function to intercept remote definition, Try-It-Out, and OAuth2 responses.  Accepts one argument responseInterceptor(response) and must return the potentially modified response.
`showMutatedRequest` | `Boolean=true`. If set to `true`, uses the mutated request returned from a requestInterceptor to produce the curl command in the UI, otherwise the request before the requestInterceptor was applied is used.
`supportedSubmitMethods` | `Array=["get", "put", "post", "delete", "options", "head", "patch", "trace"]`. List of HTTP methods that have the Try it out feature enabled. An empty array disables Try it out for all operations. This does not filter the operations from the display.
`validatorUrl` | `String="https://online.swagger.io/validator" OR null`. By default, Swagger-UI attempts to validate specs against swagger.io's online validator. You can use this parameter to set a different validator URL, for example for locally deployed validators ([Validator Badge](https://github.com/swagger-api/validator-badge)). Setting it to `null` will disable validation.

##### Macros

Parameter Name | Description
--- | ---
`modelPropertyMacro` | `Function`. Function to set default values to each property in model. Accepts one argument modelPropertyMacro(property), property is immutable
`parameterMacro` | `Function`. Function to set default value to parameters. Accepts two arguments parameterMacro(operation, parameter). Operation and parameter are objects passed for context, both remain immutable

### Instance methods

Method Name | Description
--- | ---
`initOAuth` | `(configObj) => void`. Provide Swagger-UI with information about your OAuth server - see the OAuth2 documentation for more information.
`preauthorizeBasic` | `(authDefinitionKey, username, password) => action`. Programmatically set values for a Basic authorization scheme.
`preauthorizeApiKey` | `(authDefinitionKey, apiKeyValue) => action`. Programmatically set values for an API key authorization scheme.

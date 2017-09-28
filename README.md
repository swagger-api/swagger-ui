# Swagger UI

[![NPM version](https://badge.fury.io/js/swagger-ui.svg)](http://badge.fury.io/js/swagger-ui)

## New!

**This is the new version of swagger-ui, 3.x. Want to learn more? Check out our [FAQ](http://swagger.io/new-ui-faq/).**

**👉🏼 Want to score an easy open-source contribution?** Check out our [Good first contribution](https://github.com/swagger-api/swagger-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+contribution%22) label.

As a brand new version, written from the ground up, there are some known issues and unimplemented features. Check out the [Known Issues](#known-issues) section for more details.

This repository publishes to two different NPM modules:

* [swagger-ui](https://www.npmjs.com/package/swagger-ui) is a traditional npm module intended for use in JavaScript web application projects that are capable of resolving dependencies (via Webpack, Browserify, etc).
* [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist) is a dependency-free module that includes everything you need to serve Swagger-UI in a server-side project, or a web project that can't resolve npm module dependencies.

For the older version of swagger-ui, refer to the [*2.x branch*](https://github.com/swagger-api/swagger-ui/tree/2.x).

## Compatibility
The OpenAPI Specification has undergone 5 revisions since initial creation in 2010.  Compatibility between swagger-ui and the OpenAPI Specification is as follows:

Swagger UI Version | Release Date | OpenAPI Spec compatibility | Notes
------------------ | ------------ | -------------------------- | -----
3.2.2 | 2017-09-22 | 2.0, 3.0 | [tag v3.2.2](https://github.com/swagger-api/swagger-ui/tree/v3.2.2)
3.0.21 | 2017-07-26 | 2.0 | [tag v3.0.21](https://github.com/swagger-api/swagger-ui/tree/v3.0.21)
2.2.10 | 2017-01-04 | 1.1, 1.2, 2.0 | [tag v2.2.10](https://github.com/swagger-api/swagger-ui/tree/v2.2.10)
2.1.5 | 2016-07-20 | 1.1, 1.2, 2.0 | [tag v2.1.5](https://github.com/swagger-api/swagger-ui/tree/v2.1.5)
2.0.24 | 2014-09-12 | 1.1, 1.2 | [tag v2.0.24](https://github.com/swagger-api/swagger-ui/tree/v2.0.24)
1.0.13 | 2013-03-08 | 1.1, 1.2 | [tag v1.0.13](https://github.com/swagger-api/swagger-ui/tree/v1.0.13)
1.0.1 | 2011-10-11 | 1.0, 1.1 | [tag v1.0.1](https://github.com/swagger-api/swagger-ui/tree/v1.0.1)


### How to run

##### Easy start!  Docker
You can pull a pre-built docker image of the swagger-ui directly from Dockerhub:

```
docker pull swaggerapi/swagger-ui
docker run -p 80:8080 swaggerapi/swagger-ui
```

Will start nginx with swagger-ui on port 80.

Or you can provide your own swagger.json on your host

```
docker run -p 80:8080 -e SWAGGER_JSON=/foo/swagger.json -v /bar:/foo swaggerapi/swagger-ui
```

##### Prerequisites
- Node 6.x
- NPM 3.x

If you just want to see your specs, open `dist/index.html` in your browser directly from your filesystem.

If you'd like to make modifications to the codebase, run the dev server with: `npm run dev`. A development server will open on `3200`.

If you'd like to rebuild the `/dist` folder with your codebase changes, run `npm run build`.


##### Integration Tests

You will need JDK of version 7 or higher as instructed here
http://nightwatchjs.org/gettingstarted#selenium-server-setup

Integration tests can be run locally with `npm run e2e` - be sure you aren't running a dev server when testing!


##### Browser support
Swagger UI works in the latest versions of Chrome, Safari, Firefox, Edge and IE11.

### Known Issues

To help with the migration, here are the currently known issues with 3.X. This list will update regularly, and will not include features that were not implemented in previous versions.

- Only part of the [parameters](#parameters) previously supported are available.
- The JSON Form Editor is not implemented.
- Support for `collectionFormat` is partial.
- l10n (translations) is not implemented.
- Relative path support for external files is not implemented.

### Direct use of JS and CSS assets
To include the JS, CSS and image assets directly into a webpage, use the [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist) package.
The root directory of this package contains the contents of the _dist/_ directory of this repo.
As a node module, `swagger-ui-dist` also exports the `swagger-ui-bundle` and `swagger-ui-standalone-preset` objects.

### SwaggerUIBundle
To use swagger-ui's bundles, you should take a look at the [source of swagger-ui html page](https://github.com/swagger-api/swagger-ui/blob/master/dist/index.html) and customize it. This basically requires you to instantiate a SwaggerUi object as below:

```javascript
  const ui = SwaggerUIBundle({
      url: "http://petstore.swagger.io/v2/swagger.json",
      dom_id: '#swagger-ui',
      presets: [
        SwaggerUIBundle.presets.apis,
        SwaggerUIStandalonePreset
      ],
      plugins: [
        SwaggerUIBundle.plugins.DownloadUrl
      ],
      layout: "StandaloneLayout"
    })
```

#### OAuth2 configuration
You can configure OAuth2 authorization by calling `initOAuth` method with passed configs under the instance of `SwaggerUIBundle`
default `client_id` and `client_secret`, `realm`, an application name `appName`, `scopeSeparator`, `additionalQueryStringParams`,
`useBasicAuthenticationWithAccessCodeGrant`.

Config Name | Description
--- | ---
client_id | Default clientId. MUST be a string
client_secret | Default clientSecret. MUST be a string
realm | realm query parameter (for oauth1) added to `authorizationUrl` and `tokenUrl` . MUST be a string
appName | application name, displayed in authorization popup. MUST be a string
scopeSeparator | scope separator for passing scopes, encoded before calling, default value is a space (encoded value `%20`). MUST be a string
additionalQueryStringParams | Additional query parameters added to `authorizationUrl` and `tokenUrl`. MUST be an object
useBasicAuthenticationWithAccessCodeGrant | Only activated for the `accessCode` flow.  During the `authorization_code` request to the `tokenUrl`, pass the [Client Password](https://tools.ietf.org/html/rfc6749#section-2.3.1) using the HTTP Basic Authentication scheme (`Authorization` header with `Basic base64encoded[client_id:client_secret]`).  The default is `false`

```
const ui = SwaggerUIBundle({...})

// Method can be called in any place after calling constructor SwaggerUIBundle
ui.initOAuth({
    clientId: "your-client-id",
    clientSecret: "your-client-secret-if-required",
    realm: "your-realms",
    appName: "your-app-name",
    scopeSeparator: " ",
    additionalQueryStringParams: {test: "hello"}
  })
```

If you'd like to use the bundle files via npm, check out the [`swagger-ui-dist` package](https://www.npmjs.com/package/swagger-ui-dist).

#### Parameters

Parameters with dots in their names are single strings used to organize subordinate parameters, and are not indicative of a nested structure.

Parameter Name | Description
--- | ---
url | The url pointing to API definition (normally `swagger.json` or `swagger.yaml`). Will be ignored if `urls` or `spec` is used.
urls | An array of API definition objects (`{url: "<url>", name: "<name>"}`) used by Topbar plugin. When used and Topbar plugin is enabled, the `url` parameter will not be parsed. Names and URLs must be unique among all items in this array, since they're used as identifiers.
urls.primaryName | When using `urls`, you can use this subparameter. If the value matches the name of a spec provided in `urls`, that spec will be displayed when Swagger-UI loads, instead of defaulting to the first spec in `urls`.
spec | A JSON object describing the OpenAPI Specification. When used, the `url` parameter will not be parsed. This is useful for testing manually-generated specifications without hosting them.
validatorUrl | By default, Swagger-UI attempts to validate specs against swagger.io's online validator. You can use this parameter to set a different validator URL, for example for locally deployed validators ([Validator Badge](https://github.com/swagger-api/validator-badge)). Setting it to `null` will disable validation.
dom_id | The id of a dom element inside which SwaggerUi will put the user interface for swagger.
domNode | The HTML DOM element inside which SwaggerUi will put the user interface for swagger. Overrides `dom_id`.
oauth2RedirectUrl | OAuth redirect URL
tagsSorter | Apply a sort to the tag list of each API. It can be 'alpha' (sort by paths alphanumerically) or a function (see [Array.prototype.sort()](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort) to learn how to write a sort function). Two tag name strings are passed to the sorter for each pass. Default is the order determined by Swagger-UI.
operationsSorter | Apply a sort to the operation list of each API. It can be 'alpha' (sort by paths alphanumerically), 'method' (sort by HTTP method) or a function (see Array.prototype.sort() to know how sort function works). Default is the order returned by the server unchanged.
configUrl | Configs URL
parameterMacro | MUST be a function. Function to set default value to parameters. Accepts two arguments parameterMacro(operation, parameter). Operation and parameter are objects passed for context, both remain immutable
modelPropertyMacro | MUST be a function. Function to set default values to each property in model. Accepts one argument modelPropertyMacro(property), property is immutable
docExpansion | Controls the default expansion setting for the operations and tags. It can be 'list' (expands only the tags), 'full' (expands the tags and operations) or 'none' (expands nothing). The default is 'list'.
displayOperationId | Controls the display of operationId in operations list. The default is `false`.
displayRequestDuration | Controls the display of the request duration (in milliseconds) for `Try it out` requests. The default is `false`.
maxDisplayedTags | If set, limits the number of tagged operations displayed to at most this many. The default is to show all operations.
filter | If set, enables filtering. The top bar will show an edit box that you can use to filter the tagged operations that are shown. Can be true/false to enable or disable, or an explicit filter string in which case filtering will be enabled using that string as the filter expression. Filtering is case sensitive matching the filter expression anywhere inside the tag.
deepLinking | If set to `true`, enables dynamic deep linking for tags and operations. [Docs](https://github.com/swagger-api/swagger-ui/blob/master/docs/deep-linking.md)
requestInterceptor | MUST be a function.  Function to intercept try-it-out requests.  Accepts one argument requestInterceptor(request) and must return the potentially modified request.
responseInterceptor | MUST be a function.  Function to intercept try-it-out responses.  Accepts one argument responseInterceptor(response) and must return the potentially modified response.
showMutatedRequest | If set to `true` (the default), uses the mutated request returned from a rquestInterceptor to produce the curl command in the UI, otherwise the request before the requestInterceptor was applied is used.

### Plugins

#### Topbar plugin
Topbar plugin enables top bar with input for spec path and explore button or a dropdown if `urls` is used. By default the plugin is enabled, and to disable it you need to remove Topbar plugin from presets in `src/standalone/index.js`:

```
let preset = [
  // TopbarPlugin,
  ConfigsPlugin,
  () => {
    return {
      components: { StandaloneLayout }
    }
  }
]
```

#### Configs plugin
Configs plugin allows to fetch external configs instead of passing them to `SwaggerUIBundle`. Fetched configs support two formats: JSON or yaml. The plugin is enabled by default.
There are three options of passing config:
- add a query parameter `config` with URL to a server where the configs are hosted. For ex. http://petstore.swagger.io/?config=http://localhost:3001/config.yaml
- add a config `configUrl` with URL to SwaggerUIBundle
- change default configs in `swagger-config.yaml` *Note: after changing, the project must be re-built*

These options can be used altogether, the order of inheritance is following (from the lowest priority to the highest):
`swagger-config.yaml` -> config passed to `SwaggerUIBundle` -> config fetched from `configUrl` passed to `SwaggerUIBundle` -> config fetched from URL passed as a query parameter `config`

## CORS Support

CORS is a technique to prevent websites from doing bad things with your personal data.  Most browsers + JavaScript toolkits not only support CORS but enforce it, which has implications for your API server which supports Swagger.

You can read about CORS here: http://www.w3.org/TR/cors.

There are two cases where no action is needed for CORS support:

1. swagger-ui is hosted on the same server as the application itself (same host *and* port).
2. The application is located behind a proxy that enables the required CORS headers. This may already be covered within your organization.

Otherwise, CORS support needs to be enabled for:

1. Your Swagger docs. For Swagger 2.0 it's the `swagger.json`/`swagger.yaml` and any externally `$ref`ed docs.
2. For the `Try it now` button to work, CORS needs to be enabled on your API endpoints as well.

### Testing CORS Support

You can verify CORS support with one of three techniques:

- Curl your API and inspect the headers.  For instance:

```bash
$ curl -I "http://petstore.swagger.io/v2/swagger.json"
HTTP/1.1 200 OK
Date: Sat, 31 Jan 2015 23:05:44 GMT
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, DELETE, PUT, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, api_key, Authorization
Content-Type: application/json
Content-Length: 0
```

This tells us that the petstore resource listing supports OPTIONS, and the following headers:  `Content-Type`, `api_key`, `Authorization`.

- Try swagger-ui from your file system and look at the debug console.  If CORS is not enabled, you'll see something like this:

```
XMLHttpRequest cannot load http://sad.server.com/v2/api-docs. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

Swagger-UI cannot easily show this error state.

- Using the http://www.test-cors.org website. Keep in mind this will show a successful result even if `Access-Control-Allow-Headers` is not available, which is still required for Swagger-UI to function properly.

### Enabling CORS

The method of enabling CORS depends on the server and/or framework you use to host your application. http://enable-cors.org provides information on how to enable CORS in some common web servers.

Other servers/frameworks may provide you information on how to enable it specifically in their use case.

### CORS and Header Parameters

Swagger lets you easily send headers as parameters to requests.  The name of these headers *MUST* be supported in your CORS configuration as well.  From our example above:

```
Access-Control-Allow-Headers: Content-Type, api_key, Authorization
```

Only headers with these names will be allowed to be sent by Swagger-UI.

## Security contact

Please disclose any security-related issues or vulnerabilities by emailing [security@swagger.io](mailto:security@swagger.io), instead of using the public issue tracker.

## License

Copyright 2017 SmartBear Software

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

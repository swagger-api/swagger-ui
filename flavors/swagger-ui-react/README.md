# `swagger-ui-react`

[![NPM version](https://badge.fury.io/js/swagger-ui-react.svg)](http://badge.fury.io/js/swagger-ui-react)

`swagger-ui-react` is a flavor of Swagger UI suitable for use in React applications.

It has a few differences from the main version of Swagger UI:
* Declares `react` and `react-dom` as peerDependencies instead of production dependencies
* Exports a component instead of a constructor function

Versions of this module mirror the version of Swagger UI included in the distribution.

## Anonymized analytics

`swagger-ui-react` uses [Scarf](https://scarf.sh/) to collect [anonymized installation analytics](https://github.com/scarf-sh/scarf-js?tab=readme-ov-file#as-a-user-of-a-package-using-scarf-js-what-information-does-scarf-js-send-about-me). These analytics help support the maintainers of this library and ONLY run during installation. To [opt out](https://github.com/scarf-sh/scarf-js?tab=readme-ov-file#as-a-user-of-a-package-using-scarf-js-how-can-i-opt-out-of-analytics), you can set the `scarfSettings.enabled` field to `false` in your project's `package.json`:

```
// package.json
{
  // ...
  "scarfSettings": {
    "enabled": false
  }
  // ...
}
```

Alternatively, you can set the environment variable `SCARF_ANALYTICS` to `false` as part of the environment that installs your npm packages, e.g., `SCARF_ANALYTICS=false npm install`.


## Quick start

Install `swagger-ui-react`:

```
$ npm i --save swagger-ui-react
```

Use it in your React application:

```js
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default App = () => <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
```

## Props

These props map to [Swagger UI configuration options](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md) of the same name.

#### `spec`: PropTypes.object

An OpenAPI document represented as a JavaScript object, JSON string, or YAML string for Swagger UI to display.

⚠️ Don't use this in conjunction with `url` - unpredictable behavior may occur.

#### `url`: PropTypes.string

Remote URL to an OpenAPI document that Swagger UI will fetch, parse, and display.

⚠️ Don't use this in conjunction with `spec` - unpredictable behavior may occur.

#### `layout`: PropTypes.string

The name of a component available via the plugin system to use as the top-level layout for Swagger UI. The default value is `BaseLayout`.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `onComplete`: PropTypes.func

> `(system) => void`

A callback function that is triggered when Swagger-UI finishes rendering an OpenAPI document.

Swagger UI's `system` object is passed as an argument.

#### `requestInterceptor`: PropTypes.func

> `req => req` or `req => Promise<req>`.

A function that accepts a request object, and returns either a request object
or a Promise that resolves to a request object.

#### `responseInterceptor`: PropTypes.func

> `res => res` or `res => Promise<res>`.

A function that accepts a response object, and returns either a response object
or a Promise that resolves to a response object.

#### `docExpansion`: PropTypes.oneOf(['list', 'full', 'none'])

Controls the default expansion setting for the operations and tags. It can be 'list' (expands only the tags), 'full' (expands the tags and operations) or 'none' (expands nothing). The default value is 'list'.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `defaultModelExpandDepth`: PropTypes.number

The default expansion depth for models (set to -1 completely hide the models).

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `defaultModelRendering`: PropTypes.oneOf(["example", "model"])

Controls how the model is shown when the API is first rendered. (The user can always switch the rendering for a given model by clicking the 'Model' and 'Example Value' links.) The default value is 'example'.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.


#### `displayOperationId`: PropTypes.bool

Controls the display of operationId in operations list. The default is false.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `plugins`: PropTypes.arrayOf(PropTypes.object),

An array of objects that augment and modify Swagger UI's functionality. See Swagger UI's [Plugin API](https://github.com/swagger-api/swagger-ui/blob/master/docs/customization/plugin-api.md) for more details.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `supportedSubmitMethods`: PropTypes.arrayOf(PropTypes.oneOf(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']))

HTTP methods that have the Try it out feature enabled. An empty array disables Try it out for all operations. This does not filter the operations from the display.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `showExtensions`: PropTypes.bool

Controls the display of vendor extension (`x-`) fields and values for Operations, Parameters, Responses, and Schema.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `showCommonExtensions`: PropTypes.bool

Controls the display of extensions (pattern, maxLength, minLength, maximum, minimum) fields and values for Parameters.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `showMutatedRequest`: PropTypes.bool

If set to `true`, uses the mutated request returned from a requestInterceptor to produce the curl command in the UI, otherwise the request before the requestInterceptor was applied is used.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `presets`: PropTypes.arrayOf(PropTypes.func),

An array of functions that augment and modify Swagger UI's functionality. See Swagger UI's [Plugin API](https://github.com/swagger-api/swagger-ui/blob/master/docs/customization/plugin-api.md) for more details.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `tryItOutEnabled`: PropTypes.bool

Controls whether the "Try it out" section should start enabled. The default is false.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `displayRequestDuration`: PropTypes.bool

Controls the display of the request duration (in milliseconds) for "Try it out" requests. The default is false.

#### `filter`: PropTypes.oneOfType([PropTypes.string, PropTypes.bool])

If set, enables filtering. The top bar will show an edit box that you can use to filter the tagged operations that are shown. Can be Boolean to enable or disable, or a string, in which case filtering will be enabled using that string as the filter expression. Filtering is case sensitive matching the filter expression anywhere inside the tag. See Swagger UI's [Plug Points](https://github.com/swagger-api/swagger-ui/blob/master/docs/customization/plug-points.md#fnopsfilter) to customize the filtering behavior.

#### `requestSnippetsEnabled`: PropTypes.bool,

Enables the request snippet section. When disabled, the legacy curl snippet will be used. The default is false.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `requestSnippets`: PropTypes.object,

Configures the request snippet core plugin. See Swagger UI's [Display Configuration](https://github.com/swagger-api/swagger-ui/blob/master/docs/usage/configuration.md#display) for more details.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `persistAuthorization`: PropTypes.bool

If set, it persists authorization data and it would not be lost on browser close/refresh. The default is false.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `withCredentials`: PropTypes.bool

If set to `true`, enables passing credentials, [as defined in the Fetch standard](https://fetch.spec.whatwg.org/#credentials), in CORS requests that are sent by the browser. Note that Swagger UI cannot currently set cookies cross-domain (see [swagger-js#1163](https://github.com/swagger-api/swagger-js/issues/1163)) - as a result, you will have to rely on browser-supplied cookies (which this setting enables sending) that Swagger UI cannot control.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `oauth2RedirectUrl`: PropTypes.string

Redirect url given as parameter to the oauth2 provider. Default the url refers to oauth2-redirect.html at the same path as the Swagger UI is available.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.


## Limitations

* Not all configuration bindings are available.
* Some props are only applied on mount, and cannot be updated reliably.
* OAuth redirection handling is not supported.
* Topbar/Standalone mode is not supported.

We intend to address these limitations based on user demand, so please open an issue or pull request if you have a specific request.

## Notes

* The `package.json` in the same folder as this README is _not_ the manifest that should be used for releases - another manifest is generated at build-time and can be found in `./dist/`.

---

For anything else, check the [Swagger-UI](https://github.com/swagger-api/swagger-ui) repository.

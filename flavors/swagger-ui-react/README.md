# `swagger-ui-react`

[![NPM version](https://badge.fury.io/js/swagger-ui-react.svg)](http://badge.fury.io/js/swagger-ui-react)

`swagger-ui-react` is a flavor of Swagger UI suitable for use in React applications.

It has a few differences from the main version of Swagger UI:
* Declares `react` and `react-dom` as peerDependencies instead of production dependencies
* Exports a component instead of a constructor function

Versions of this module mirror the version of Swagger UI included in the distribution.

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

An OpenAPI document respresented as a JavaScript object, JSON string, or YAML string for Swagger UI to display.

⚠️ Don't use this in conjunction with `url` - unpredictable behavior may occur.

#### `url`: PropTypes.string

Remote URL to an OpenAPI document that Swagger UI will fetch, parse, and display.

⚠️ Don't use this in conjunction with `spec` - unpredictable behavior may occur.

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

#### `displayOperationId`: PropTypes.bool

Controls the display of operationId in operations list. The default is false.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `plugins`: PropTypes.arrayOf(PropTypes.object),

An array of objects that augment and modify Swagger UI's functionality. See Swagger UI's [Plugin API](https://github.com/swagger-api/swagger-ui/blob/master/docs/customization/plugin-api.md) for more details.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `supportedSubmitMethods`: PropTypes.arrayOf(PropTypes.oneOf(['get', 'put', 'post', 'delete', 'options', 'head', 'patch', 'trace']))

HTTP methods that have the Try it out feature enabled. An empty array disables Try it out for all operations. This does not filter the operations from the display.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `showMutatedRequest`: PropTypes.bool

If set to `true`, uses the mutated request returned from a requestInterceptor to produce the curl command in the UI, otherwise the request before the requestInterceptor was applied is used.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

#### `presets`: PropTypes.arrayOf(PropTypes.func),

An array of functions that augment and modify Swagger UI's functionality. See Swagger UI's [Plugin API](https://github.com/swagger-api/swagger-ui/blob/master/docs/customization/plugin-api.md) for more details.

⚠️ This prop is currently only applied once, on mount. Changes to this prop's value will not be propagated to the underlying Swagger UI instance. A future version of this module will remove this limitation, and the change will not be considered a breaking change.

## Limitations

* Not all configuration bindings are available.
* Some props are only applied on mount, and cannot be updated reliably.
* OAuth redirection handling is not supported.
* Topbar/Standalone mode is not supported.
* Custom plugins are not supported.

We intend to address these limitations based on user demand, so please open an issue or pull request if you have a specific request.

## Notes

* The `package.json` in the same folder as this README is _not_ the manifest that should be used for releases - another manifest is generated at build-time and can be found in `./dist/`.

---

For anything else, check the [Swagger-UI](https://github.com/swagger-api/swagger-ui) repository.

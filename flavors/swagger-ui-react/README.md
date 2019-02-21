# `swagger-ui-react`

[![NPM version](https://badge.fury.io/js/swagger-ui-react.svg)](http://badge.fury.io/js/swagger-ui-react)

`swagger-ui-react` is a flavor of Swagger UI suitable for use in React applications.

It has a few distinctions from the mainstream version of Swagger UI:
* Exports a component instead of a constructor function
* Declares `react` and `react-dom` as peerDependencies

Versions of this module mirror the version of Swagger UI included in the distribution.

### Quick start

Install `swagger-ui-react`:

```
$ npm i --save swagger-ui-react
```

Use it in your React application:

```js
import SwaggerUI from "swagger-ui-react"
import "swagger-ui-react/swagger-ui.css"

export default AppComponent = () => <SwaggerUI url="https://petstore.swagger.io/v2/swagger.json" />
```

### Configuration

TODO

### Limitations

* Not all configuration bindings are available.
* Custom plugins are not officially supported.
* OAuth redirection handling is not supported.
* Topbar/Standalone mode is not supported.

---

For anything else, check the [Swagger-UI](https://github.com/swagger-api/swagger-ui) repository.

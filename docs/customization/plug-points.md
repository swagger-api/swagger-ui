# Plug points

Swagger UI exposes most of its internal logic through the plugin system.

Often, it is beneficial to override the core internals to achieve custom behavior.

### Note: Semantic Versioning

Swagger UI's internal APIs are _not_ part of our public contract, which means that they can change without the major version change.

If your custom plugins wrap, extend, override, or consume any internal core APIs, we recommend specifying a specific minor version of Swagger UI to use in your application, because they will _not_ change between patch versions.

If you're installing Swagger UI via NPM, for example, you can do this by using a tilde:

```js
{
  "dependencies": {
    "swagger-ui": "~3.11.0"
  }
}
```

### `fn.opsFilter`

When using the `filter` option, tag names will be filtered by the user-provided value. If you'd like to customize this behavior, you can override the default `opsFilter` function.

For example, you can implement a multiple-phrase filter:

```js
const MultiplePhraseFilterPlugin = function() {
  return {
    fn: {
      opsFilter: (taggedOps, phrase) => {
        const phrases = phrase.split(", ")

        return taggedOps.filter((val, key) => {
          return phrases.some(item => key.indexOf(item) > -1)
        })
      }
    }
  }
}
```
### Logo component
While using the Standalone Preset the SwaggerUI logo is rendered in the Top Bar.
The logo can be exchanged by replacing the `Logo` component via the plugin api:

```jsx
import React from "react";
const MyLogoPlugin = {
  components: {
    Logo: () => (
      <img alt="My Logo" height="40" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTM3IiBoZWlnaHQ9IjEzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHRleHQgdHJhbnNmb3JtPSJtYXRyaXgoMy40Nzc2OSAwIDAgMy4yNjA2NyAtNjczLjEyOCAtNjkxLjk5MykiIHN0cm9rZT0iIzAwMCIgZm9udC1zdHlsZT0ibm9ybWFsIiBmb250LXdlaWdodD0ibm9ybWFsIiB4bWw6c3BhY2U9InByZXNlcnZlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIGZvbnQtZmFtaWx5PSInT3BlbiBTYW5zIEV4dHJhQm9sZCciIGZvbnQtc2l6ZT0iMjQiIGlkPSJzdmdfMSIgeT0iMjQxLjIyMTkyIiB4PSIxOTYuOTY5MjEiIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0iIzYyYTAzZiI+TXkgTG9nbzwvdGV4dD4KICA8cGF0aCBpZD0ic3ZnXzIiIGQ9Im0zOTUuNjAyNSw1MS4xODM1OWw1My44Nzc3MSwwbDE2LjY0ODYzLC01MS4xODM1OGwxNi42NDg2NCw1MS4xODM1OGw1My44Nzc3LDBsLTQzLjU4NzksMzEuNjMyODNsMTYuNjQ5NDksNTEuMTgzNThsLTQzLjU4NzkyLC0zMS42MzM2OWwtNDMuNTg3OTEsMzEuNjMzNjlsMTYuNjQ5NDksLTUxLjE4MzU4bC00My41ODc5MiwtMzEuNjMyODN6IiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzYyYTAzZiIvPgogPC9nPgo8L3N2Zz4="/>
    )
  }
}
```


### JSON Schema components
In swagger there are so called JSON Schema components. These are used to render inputs for parameters and components of request bodies with `application/x-www-form-urlencoded` or `multipart/*` media-type.

Internally swagger uses following mapping to find the JSON Schema component from OpenAPI Specification schema information:

For each schema’s type(eg. `string`, `array`, …) and if defined schema’s format (eg. ‘date’, ‘uuid’, …) there is a corresponding component mapping:

**If format defined:**
```js
`JsonSchema_${type}_${format}`
```

**Fallback if `JsonSchema_${type}_${format}` component does not exist or format not defined:**
```js
`JsonSchema_${type}`
```

**Default:**
```js
`JsonSchema_string`
```

With this, one can define custom input components or override existing.

#### Example Date-Picker plugin

If one would like to input date values you could provide a custom plugin to integrate [react-datepicker](https://www.npmjs.com/package/react-datepicker) into swagger-ui.
All you need to do is to create a component to wrap [react-datepicker](https://www.npmjs.com/package/react-datepicker) accordingly to the format.

**There are two cases:**
- ```yaml
  type: string
  format: date
  ```
  The resulting name for mapping to succeed: `JsonSchema_string_date`
- ```yaml
  type: string
  format: date-time
  ```
  The resulting name for mapping to succeed: `JsonSchema_string_date-time`

This creates the need for two components and simple logic to strip any time input in case the format is date:
```js
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const JsonSchema_string_date = (props) => {
  const dateNumber = Date.parse(props.value);
  const date = dateNumber
    ? new Date(dateNumber)
    : new Date();

  return (
    <DatePicker
      selected={date}
      onChange={d => props.onChange(d.toISOString().substring(0, 10))}
    />
  );
}

const JsonSchema_string_date_time = (props) => {
  const dateNumber = Date.parse(props.value);
  const date = dateNumber
    ? new Date(dateNumber)
    : new Date();

  return (
    <DatePicker
      selected={date}
      onChange={d => props.onChange(d.toISOString())}
      showTimeSelect
      timeFormat="p"
      dateFormat="Pp"
    />
  );
}


export const DateTimeSwaggerPlugin = {
  components: {
    JsonSchema_string_date: JsonSchema_string_date,
    "JsonSchema_string_date-time": JsonSchema_string_date_time
  }
};
```

### Request Snippets

SwaggerUI can be configured with the `requestSnippetsEnabled: true` option to activate Request Snippets.  
Instead of the generic curl that is generated upon doing a request. It gives you more granular options:
- curl for bash
- curl for cmd
- curl for powershell

There might be the case where you want to provide your own snipped generator. This can be done by using the plugin api.  
A Request Snipped generator consists of the configuration and a `fn`,   
which takes the internal request object and transforms it to the desired snippet.

```js
// Add config to Request Snippets Configuration with an unique key like "node_native" 
const snippetConfig = {
  requestSnippetsEnabled: true,
  requestSnippets: {
    generators: {
      "node_native": {
        title: "NodeJs Native",
        syntax: "javascript"
      }
    }
  }
}

const SnippedGeneratorNodeJsPlugin = {
  fn: {
    // use `requestSnippetGenerator_` + key from config (node_native) for generator fn
    requestSnippetGenerator_node_native: (request) => {
      const url = new Url(request.get("url"))
      let isMultipartFormDataRequest = false
      const headers = request.get("headers")
      if(headers && headers.size) {
        request.get("headers").map((val, key) => {
          isMultipartFormDataRequest = isMultipartFormDataRequest || /^content-type$/i.test(key) && /^multipart\/form-data$/i.test(val)
        })
      }
      const packageStr = url.protocol === "https:" ? "https" : "http"
      let reqBody = request.get("body")
      if (request.get("body")) {
        if (isMultipartFormDataRequest && ["POST", "PUT", "PATCH"].includes(request.get("method"))) {
          return "throw new Error(\"Currently unsupported content-type: /^multipart\\/form-data$/i\");"
        } else {
          if (!Map.isMap(reqBody)) {
            if (typeof reqBody !== "string") {
              reqBody = JSON.stringify(reqBody)
            }
          } else {
            reqBody = getStringBodyOfMap(request)
          }
        }
      } else if (!request.get("body") && request.get("method") === "POST") {
        reqBody = ""
      }

      const stringBody = "`" + (reqBody || "")
          .replace(/\\n/g, "\n")
          .replace(/`/g, "\\`")
        + "`"

      return `const http = require("${packageStr}");
const options = {
  "method": "${request.get("method")}",
  "hostname": "${url.host}",
  "port": ${url.port || "null"},
  "path": "${url.pathname}"${headers && headers.size ? `,
  "headers": {
    ${request.get("headers").map((val, key) => `"${key}": "${val}"`).valueSeq().join(",\n    ")}
  }` : ""}
};
const req = http.request(options, function (res) {
  const chunks = [];
  res.on("data", function (chunk) {
    chunks.push(chunk);
  });
  res.on("end", function () {
    const body = Buffer.concat(chunks);
    console.log(body.toString());
  });
});
${reqBody ? `\nreq.write(${stringBody});` : ""}
req.end();`
    }
  }
}

const ui = SwaggerUIBundle({
  "dom_id": "#swagger-ui",
  deepLinking: true,
  presets: [
    SwaggerUIBundle.presets.apis,
    SwaggerUIStandalonePreset
  ],
  plugins: [
    SwaggerUIBundle.plugins.DownloadUrl,
    SnippedGeneratorNodeJsPlugin
  ],
  layout: "StandaloneLayout",
  validatorUrl: "https://validator.swagger.io/validator",
  url: "https://petstore.swagger.io/v2/swagger.json",
  ...snippetConfig,
})
```

### Error handling

SwaggerUI comes with a `safe-render` plugin that handles error handling allows plugging into error handling system and modify it.

The plugin accepts a list of component names that should be protected by error boundaries.  

Its public API looks like this:

```js
{
  fn: {
    componentDidCatch,
    withErrorBoundary: withErrorBoundary(getSystem),
  },
  components: {
    ErrorBoundary,
    Fallback,
  },
}
```

safe-render plugin is automatically utilized by [base](https://github.com/swagger-api/swagger-ui/blob/78f62c300a6d137e65fd027d850981b010009970/src/core/presets/base.js) and [standalone](https://github.com/swagger-api/swagger-ui/tree/78f62c300a6d137e65fd027d850981b010009970/src/standalone) SwaggerUI presets and
should always be used as the last plugin, after all the components are already known to the SwaggerUI.
The plugin defines a default list of components that should be protected by error boundaries:

```js
[
  "App",
  "BaseLayout",
  "VersionPragmaFilter",
  "InfoContainer",
  "ServersContainer",
  "SchemesContainer",
  "AuthorizeBtnContainer",
  "FilterContainer",
  "Operations",
  "OperationContainer",
  "parameters",
  "responses",
  "OperationServers",
  "Models",
  "ModelWrapper",
  "Topbar",
  "StandaloneLayout",
  "onlineValidatorBadge"
]
```

As demonstrated below, additional components can be protected by utilizing the safe-render plugin 
with configuration options. This gets really handy if you are a SwaggerUI integrator and you maintain a number of
plugins with additional custom components.

```js
const swaggerUI = SwaggerUI({
  url: "https://petstore.swagger.io/v2/swagger.json",
  dom_id: '#swagger-ui',
  plugins: [
    () => ({
      components: {
        MyCustomComponent1: () => 'my custom component',
      },
    }),
    SwaggerUI.plugins.SafeRender({
      fullOverride: true, // only the component list defined here will apply (not the default list)
      componentList: [
        "MyCustomComponent1",
      ],
    }),
  ],
});
```

##### componentDidCatch

This static function is invoked after a component has thrown an error.  
It receives two parameters:

1. `error` - The error that was thrown.
2. `info` - An object with a componentStack key containing [information about which component threw the error](https://reactjs.org/docs/error-boundaries.html#component-stack-traces).

It has precisely the same signature as error boundaries [componentDidCatch lifecycle method](https://reactjs.org/docs/react-component.html#componentdidcatch),
except it's a static function and not a class method.

Default implement of componentDidCatch uses `console.error` to display the received error:

```js
export const componentDidCatch = console.error;
```

To utilize your own error handling logic (e.g. [bugsnag](https://www.bugsnag.com/)), create new SwaggerUI plugin that overrides componentDidCatch:

{% highlight js linenos %}
const BugsnagErrorHandlerPlugin = () => {
  // init bugsnag

  return {
    fn: {
      componentDidCatch = (error, info) => {
        Bugsnag.notify(error);
        Bugsnag.notify(info);
      },
    },
  };
};
{% endhighlight %}

##### withErrorBoundary

This function is HOC (Higher Order Component). It wraps a particular component into the `ErrorBoundary` component.
It can be overridden via a plugin system to control how components are wrapped by the ErrorBoundary component.
In 99.9% of situations, you won't need to override this function, but if you do, please read the source code of this function first.

##### Fallback

The component is displayed when the error boundary catches an error. It can be overridden via a plugin system.
Its default implementation is trivial:

```js
import React from "react"
import PropTypes from "prop-types"

const Fallback = ({ name }) => (
  <div className="fallback">
    😱 <i>Could not render { name === "t" ? "this component" : name }, see the console.</i>
  </div>
)
Fallback.propTypes = {
  name: PropTypes.string.isRequired,
}
export default Fallback
```

Feel free to override it to match your look & feel:

```js
const CustomFallbackPlugin = () => ({
  components: {
    Fallback: ({ name } ) => `This is my custom fallback. ${name} failed to render`,
  },
});

const swaggerUI = SwaggerUI({
  url: "https://petstore.swagger.io/v2/swagger.json",
  dom_id: '#swagger-ui',
  plugins: [
    CustomFallbackPlugin,
  ]  
});
```

##### ErrorBoundary

This is the component that implements React error boundaries. Uses `componentDidCatch` and `Fallback`
under the hood. In 99.9% of situations, you won't need to override this component, but if you do, 
please read the source code of this component first.


##### Change in behavior

In prior releases of SwaggerUI (before v4.3.0), almost all components have been protected, and when thrown error,
`Fallback` component was displayed. This changes with SwaggerUI v4.3.0. Only components defined
by the `safe-render` plugin are now protected and display fallback. If a small component somewhere within
SwaggerUI React component tree fails to render and throws an error. The error bubbles up to the closest
error boundary, and that error boundary displays the `Fallback` component and invokes `componentDidCatch`.

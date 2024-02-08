# Installation

## Distribution channels

### NPM Registry

We publish three modules to npm: **`swagger-ui`**, **`swagger-ui-dist`** and **`swagger-ui-react`**.

**`swagger-ui`** is meant for consumption by JavaScript web projects that include module bundlers,
such as Webpack, Browserify, and Rollup. Its main file exports Swagger UI's main function,
and the module also includes a namespaced stylesheet at `swagger-ui/dist/swagger-ui.css`. Here's an example:

```javascript
import SwaggerUI from 'swagger-ui'
// or use require if you prefer
const SwaggerUI = require('swagger-ui')

SwaggerUI({
  dom_id: '#myDomId'
})
```

See the [Webpack Getting Started](../samples/webpack-getting-started) sample for details.

In contrast, **`swagger-ui-dist`** is meant for server-side projects that need assets to serve to clients. The module, when imported, includes an `absolutePath` helper function that returns the absolute filesystem path to where the `swagger-ui-dist` module is installed.

_Note: we suggest using `swagger-ui` when your tooling makes it possible, as `swagger-ui-dist`
will result in more code going across the wire._

The module's contents mirror the `dist` folder you see in the Git repository. The most useful file is `swagger-ui-bundle.js`, which is a build of Swagger UI that includes all the code it needs to run in one file. The folder also has an `index.html` asset, to make it easy to serve Swagger UI like so:

```javascript
const express = require('express')
const pathToSwaggerUi = require('swagger-ui-dist').absolutePath()

const app = express()

app.use(express.static(pathToSwaggerUi))

app.listen(3000)
```

The module also exports `SwaggerUIBundle` and `SwaggerUIStandalonePreset`, so
if you're in a JavaScript project that can't handle a traditional npm module,
you could do something like this:

```js
var SwaggerUIBundle = require('swagger-ui-dist').SwaggerUIBundle

const ui = SwaggerUIBundle({
    url: "https://petstore.swagger.io/v2/swagger.json",
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIBundle.SwaggerUIStandalonePreset
    ],
    layout: "StandaloneLayout"
  })
```

`SwaggerUIBundle` is equivalent to `SwaggerUI`.

### Docker

You can pull a pre-built docker image of the swagger-ui directly from Docker Hub:

```sh
docker pull swaggerapi/swagger-ui
docker run -p 80:8080 swaggerapi/swagger-ui
```

Will start nginx with Swagger UI on port 80.

Or you can provide your own swagger.json on your host

```sh
docker run -p 80:8080 -e SWAGGER_JSON=/foo/swagger.json -v /bar:/foo swaggerapi/swagger-ui
```

You can also provide a URL to a swagger.json on an external host:

```sh
docker run -p 80:8080 -e SWAGGER_JSON_URL=https://petstore3.swagger.io/api/v3/openapi.json swaggerapi/swagger-ui
```

The base URL of the web application can be changed by specifying the `BASE_URL` environment variable:

```sh
docker run -p 80:8080 -e BASE_URL=/swagger -e SWAGGER_JSON=/foo/swagger.json -v /bar:/foo swaggerapi/swagger-ui
```

This will serve Swagger UI at `/swagger` instead of `/`.

You can specify a different port via `PORT` variable for accessing the application, default is `8080`.

```sh
docker run -p 80:80 -e PORT=80 swaggerapi/swagger-ui
```

You can specify an IPv6 port via `PORT_IPV6` variable. By default, IPv6 port is not set.

```sh
docker run -p 80:80 -e PORT_IPV6=8080 swaggerapi/swagger-ui
```

You can allow/disallow [embedding](https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/X-Frame-Options) via `EMBEDDING` variable. By default, embedding is disabled.

```sh
docker run -p 80:80 -e EMBEDDING=true swaggerapi/swagger-ui
```

For more information on controlling Swagger UI through the Docker image, see the Docker section of the [Configuration documentation](configuration.md#docker).

### unpkg

You can embed Swagger UI's code directly in your HTML by using [unpkg's](https://unpkg.com/) interface:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <meta name="description" content="SwaggerUI" />
  <title>SwaggerUI</title>
  <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
</head>
<body>
<div id="swagger-ui"></div>
<script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
<script>
  window.onload = () => {
    window.ui = SwaggerUIBundle({
      url: 'https://petstore3.swagger.io/api/v3/openapi.json',
      dom_id: '#swagger-ui',
    });
  };
</script>
</body>
</html>
```

Using `StandalonePreset` will render `TopBar` and `ValidatorBadge` as well.

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="description" content="SwaggerUI" />
    <title>SwaggerUI</title>
    <link rel="stylesheet" href="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui.css" />
  </head>
  <body>
  <div id="swagger-ui"></div>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-bundle.js" crossorigin></script>
  <script src="https://unpkg.com/swagger-ui-dist@5.11.0/swagger-ui-standalone-preset.js" crossorigin></script>
  <script>
    window.onload = () => {
      window.ui = SwaggerUIBundle({
        url: 'https://petstore3.swagger.io/api/v3/openapi.json',
        dom_id: '#swagger-ui',
        presets: [
          SwaggerUIBundle.presets.apis,
          SwaggerUIStandalonePreset
        ],
        layout: "StandaloneLayout",
      });
    };
  </script>
  </body>
</html>
```

See [unpkg's main page](https://unpkg.com/) for more information on how to use unpkg.

### Static files without HTTP or HTML

Once swagger-ui has successfully generated the `/dist` directory, you can copy this to your own file system and host from there.

## Plain old HTML/CSS/JS (Standalone)

The folder `/dist` includes all the HTML, CSS and JS files needed to run SwaggerUI on a static website or CMS, without requiring NPM.

1. Download the [latest release](https://github.com/swagger-api/swagger-ui/releases/latest).
1. Copy the contents of the `/dist` folder to your server.
1. Open `swagger-initializer.js` in your text editor and replace "https://petstore.swagger.io/v2/swagger.json" with the URL for your OpenAPI 3.0 spec.



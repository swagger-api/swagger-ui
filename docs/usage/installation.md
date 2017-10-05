# Installation

Swagger-UI is available

## Distribution channels

### NPM Registry

We publish two modules to npm: **`swagger-ui`** and **`swagger-ui-dist`**.

**`swagger-ui`** is meant for consumption by JavaScript web projects that include module bundlers, such as Webpack, Browserify, and Rollup. Its main file exports Swagger-UI's main function, and the module also includes a namespaced stylesheet at `swagger-ui/dist/swagger-ui.css`. Here's an example:

```javascript
import SwaggerUI from 'swagger-ui'
// or use require, if you prefer
const SwaggerUI = require('swagger-ui')

SwaggerUI({
  dom_id: '#myDomId'
})
```

In contrast, **`swagger-ui-dist`** is meant for server-side projects that need assets to serve to clients. The module, when imported, includes an `absolutePath` helper function that returns the absolute filesystem path to where the `swagger-ui-dist` module is installed.

The module's contents mirrors the `dist` folder you see in the Git repository. The most useful file is `swagger-ui-bundle.js`, which is a build of Swagger-UI that includes all the code it needs to run in one file. The folder also has an `index.html` asset, to make it easy to serve Swagger-UI like so:

```javascript
const express = require('express')
const pathToSwaggerUi = require('swagger-ui').absolutePath()

const app = express()

app.use(express.static(pathToSwaggerUi))

app.listen(3000)
```



### Docker Hub

### Packagist

### unpkg

# Integration

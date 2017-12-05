# Swagger UI

[![NPM version](https://badge.fury.io/js/swagger-ui.svg)](http://badge.fury.io/js/swagger-ui)

## New!

**This is the new version of swagger-ui, 3.x. Want to learn more? Check out our [FAQ](http://swagger.io/new-ui-faq/).**

**👉🏼 Want to score an easy open-source contribution?** Check out our [Good first issue](https://github.com/swagger-api/swagger-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+issue%22) label.

As a brand new version, written from the ground up, there are some known issues and unimplemented features. Check out the [Known Issues](#known-issues) section for more details.

This repository publishes to two different NPM modules:

* [swagger-ui](https://www.npmjs.com/package/swagger-ui) is a traditional npm module intended for use in JavaScript web application projects that are capable of resolving dependencies (via Webpack, Browserify, etc).
* [swagger-ui-dist](https://www.npmjs.com/package/swagger-ui-dist) is a dependency-free module that includes everything you need to serve Swagger-UI in a server-side project, or a web project that can't resolve npm module dependencies.

For the older version of swagger-ui, refer to the [*2.x branch*](https://github.com/swagger-api/swagger-ui/tree/2.x).

## Compatibility
The OpenAPI Specification has undergone 5 revisions since initial creation in 2010.  Compatibility between swagger-ui and the OpenAPI Specification is as follows:

Swagger UI Version | Release Date | OpenAPI Spec compatibility | Notes
------------------ | ------------ | -------------------------- | -----
3.6.0 | 2017-12-01 | 2.0, 3.0 | [tag v3.5=6.0](https://github.com/swagger-api/swagger-ui/tree/v3.6.0)
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

The base URL of the web application can be changed by specifying the `BASE_URL` environment variable:

```
docker run -p 80:8080 -e BASE_URL=/swagger -e SWAGGER_JSON=/foo/swagger.json -v /bar:/foo swaggerapi/swagger-ui
```

This will serve Swagger UI at `/swagger` instead of `/`.

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

If you'd like to use the bundle files via npm, check out the [`swagger-ui-dist` package](https://www.npmjs.com/package/swagger-ui-dist).

### Plugins

#### Topbar plugin
Topbar plugin enables top bar with input for spec path and explore button or a dropdown if `urls` is used. By default the plugin is enabled, and to disable it you need to remove Topbar plugin from presets in `src/standalone/index.js`:

```javascript
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

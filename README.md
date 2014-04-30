# Swagger UI


Swagger UI is part of Swagger project.  The Swagger project allows you to produce, visualize and consume your OWN RESTful services.  No proxy or 3rd party services required.  Do it your own way.

Swagger UI is a dependency-free collection of HTML, Javascript, and CSS assets that dynamically
generate beautiful documentation and sandbox from a Swagger-compliant API. Because Swagger UI has no dependencies, you can host it in any server environment, or on your local machine.

## What's Swagger?

The goal of Swagger™ is to define a standard, language-agnostic interface to REST APIs which allows both humans and computers to discover and understand the capabilities of the service without access to source code, documentation, or through network traffic inspection. When properly defined via Swagger, a consumer can understand and interact with the remote service with a minimal amount of implementation logic. Similar to what interfaces have done for lower-level programming, Swager removes the guesswork in calling the service.


Check out [Swagger-Spec](https://github.com/wordnik/swagger-spec) for additional information about the Swagger project, including additional libraries with support for other languages and more. 


## How to Use It

### Download
You can use the swagger-ui code AS-IS!  No need to build or recompile--just clone this repo and use the pre-built files in the `dist` folder.  If you like swagger-ui as-is, stop here.

### Build
You can rebuild swagger-ui on your own to tweak it or just so you can say you did.  To do so, follow these steps:

1. install [handlebars](http://handlebarsjs.com/)
2. install java
3. npm install
4. npm run-script build
5. You should see the distribution under the dist folder. Open ./dist/index.html to launch Swagger UI in a browser

### Use
Once you open the Swagger UI, it will load the [Swagger Petstore](http://petstore.swagger.wordnik.com/api/api-docs) service and show its APIs.  You can enter your own server url and click explore to view the API.

### Customize
You may choose to customize Swagger UI for your organization. Here is an overview of whats in its various directories:

-    dist: Contains a distribution which you can deploy on a server or load from your local machine.
-    bin: Contains files used by swagger-ui for its build/test. These are not required by the distribution.
-    lib: Contains javascript dependencies which swagger-ui depends on
-    node_modules: Contains node modules which swagger-ui uses for its development.
-    src
    -    src/main/coffeescript: main code in CoffeeScript
    -    src/main/templates: [handlebars](http://handlebarsjs.com/) templates used to render swagger-ui
    -    src/main/html: the html files, some images and css
    -    src/main/javascript: some legacy javascript referenced by CoffeeScript code

### SwaggerUi
To use swagger-ui you should take a look at the [source of swagger-ui html page](https://github.com/wordnik/swagger-ui/tree/master/src/main/html) and customize it. This basically requires you to instantiate a SwaggerUi object and call load() on it as below:

```javascript
    window.swaggerUi = new SwaggerUi({
        url:"http://petstore.swagger.wordnik.com/api/api-docs",
        dom_id:"swagger-ui-container"
    });

    window.swaggerUi.load();
```
* *url* parameter should point to a resource listing url as per [Swagger Spec](https://github.com/wordnik/swagger-core/wiki)
* *dom_id parameter* is the the id of a dom element inside which SwaggerUi will put the user interface for swagger
* *booleanValues* SwaggerUI renders boolean data types as a dropdown. By default it provides a 'true' and 'false' string as the possible choices. You can use this parameter to change the values in dropdown to be something else, for example 0 and 1 by setting booleanValues to new Array(0, 1)
* *docExpansion* controls how the API listing is displayed. It can be set to 'none' (default), 'list' (shows operations for each resource), or 'full' (fully expanded: shows operations and their details)
* *onComplete* is a callback function parameter which can be passed to be notified of when SwaggerUI has completed rendering successfully.
* *onFailure* is a callback function parameter which can be passed to be notified of when SwaggerUI encountered a failure was unable to render.
* All other parameters are explained in greater detail below


### HTTP Methods and API Invocation
swagger-ui supports invocation of all HTTP methods APIs including GET, PUT, POST, DELETE, PATCH, OPTIONS.  These are handled in the [swagger-js](https://github.com/wordnik/swagger-js) project, please see there for specifics on their usage.


### Header Parameters
Header params are supported through a pluggable mechanism in [swagger-js](https://github.com/wordnik/swagger-js).  You can see the [index.html](https://github.com/wordnik/swagger-ui/blob/master/dist/index.html) for a sample of how to dynamically set headers:

```js
// add a new ApiKeyAuthorization when the api-key changes in the ui.
$('#input_apiKey').change(function() {
  var key = $('#input_apiKey')[0].value;
  if(key && key.trim() != "") {
    window.authorizations.add("key", new ApiKeyAuthorization("api_key", key, "header"));
  }
})
```

This will add header `api_key` with value `key` on every call to the server.  You can substitute `query` to send the values as a query param.

### Custom Header Parameters - (For Basic auth etc)
If you have some header parameters which you need to send with every request, use the headers as below:

```js
window.authorizations.add("key", new ApiKeyAuthorization("Authorization", "XXXX", "header"));
```

Note!  You can pass multiple header params on a single request, just use unique names for them (`key` is used in the above example).

## How to Improve It

Create your own fork of [wordnik/swagger-ui](https://github.com/wordnik/swagger-ui)

To share your changes, [submit a pull request](https://github.com/wordnik/swagger-ui/pull/new/master).

Since the javascript files are compiled from coffeescript, please submit changes in the *.coffee files!  We have to reject changes only in the .js files as they will be lost on each build of the ui.

## License

Copyright 2011-2013 Wordnik, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

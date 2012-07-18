Swagger UI
==========

Swagger UI is part of [Swagger](http://swagger.wordnik.com/) project.

Swagger UI is a dependency-free collection of HTML, Javascript, and CSS assets that dynamically 
generate beautiful documentation and sandbox from a [Swagger-compliant](https://github.com/wordnik/swagger-core/wiki) API. Because Swagger UI has no
dependencies, you can host it in any server environment, or on your local machine.

How to Use It
-------------

### Build
1. Install [CoffeeScript](http://coffeescript.org/#installation) which will give you [cake](http://coffeescript.org/#cake)
2. Run cake dist
3. You should see the distribution under the dist folder. Open ./dist/index.html to launch Swagger UI in a browser

### Use
Once you open the Swagger UI, it will load the [Swagger Petstore](http://petstore.swagger.wordnik.com/api/resources.json) service and show its APIs.
You can enter your own server url and click explore to view the API.

### Customize
You may choose to customize Swagger UI for your organization. Here is an overview of what the various directories contain

-    dist: Contains a distribution which you can deploy on a server or load from your local machine.
-    bin: Contains files used by swagger-ui for its build/test. These are not required by the distribution.
-    lib: Contains javascript dependencies which swagger-ui depends on
-    node_modules: Contains node modules which swagger-ui uses for its development.
-    src
    -    src/main/coffeescript: main code in CoffeeScript
    -    src/main/templates: [handlebars](http://handlebarsjs.com/) templates used to render swagger-ui
    -    src/main/html: the html files, some images and css
    -    src/main/javascript: some legacy javascript referenced by CofffeeScript code

### HTTP Methods and API Invocation
swagger-ui supports invocation of all HTTP methods APIs but only GET methods APIs are enabled by default. You can choose to enable other HTTP methods like POST, PUT and DELETE. This can be enabled by [setting the supportedSubmitMethods parameter when creating SwaggerUI instance](https://github.com/wordnik/swagger-ui/blob/f2e63c65a759421aad590b7275371cd0c06c74ea/src/main/html/index.html#L49). 

For example if you wanted to enable GET, POST and PUT but not for DELETE, you'd set this as: 

    supportedSubmitMethods: ['get', 'post', 'put']

_Note that for POST/PUT body, you'd need to paste in the request data in an appropriate format which your service can unmarshall_

### Header Parameters
header parameters aere supported. However because of [Cross-Origin Resource Sharing](http://www.w3.org/TR/cors/) restrictions, swagger-ui, by default, does not send header parameters. This can be enabled by [setting the supportHeaderParams to false when creating SwaggerUI instance](https://github.com/wordnik/swagger-ui/blob/f2e63c65a759421aad590b7275371cd0c06c74ea/src/main/html/index.html#L48).

### Api Key Parameter
If you enter an api key in swagger-ui, it sends a parameter named 'api\_key' as a query (or as a header param if you've enabled it as described above). You may not want to use the name 'api\_key' as the name of this parameter. You can change its name by setting the _apiKeyName_ parameter when you instantiate a SwaggerUI instance. For example to call it 'sessionId'

    apiKeyName: "sessionId"

How to Improve It
-----------------

Create your own fork of [wordnik/swagger-ui](https://github.com/wordnik/swagger-ui)

To share your changes, [submit a pull request](https://github.com/wordnik/swagger-ui/pull/new/master).

License
-------

Copyright 2011-2012 Wordnik, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

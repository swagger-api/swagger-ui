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

### Header Parameters
Because of [Cross-Origin Resource Sharing](http://www.w3.org/TR/cors/) restrictions, swagger-ui, by default, does not send header parameters. This can be enabled by [setting the supportHeaderParams to false when creating SwaggerUI instance](https://github.com/wordnik/swagger-ui/blob/overhaul/src/main/html/index.html#L45).



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

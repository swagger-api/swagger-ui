Swagger UI
==========

Swagger UI is a dependency-free collection of HTML, Javascript, and CSS assets that dynamically 
generate beautiful documentation from a Swagger-compliant API. Because Swagger UI has no 
dependencies, you can host it in any server environment, or on your local machine.

How to Use It
-------------

```bash
wget https://github.com/downloads/wordnik/swagger-ui/swagger-ui-1.0.zip
unzip swagger-ui-1.0.zip
open swagger-ui-1.0/index.html
```

How to Improve It
-----------------

First, create your own fork of [wordnik/swagger-ui](https://github.com/wordnik/swagger-ui)

To hack on swagger-ui, you'll need ruby. Then..

```bash
# Install the middleman gem:
gem install middleman

# Start up a development server on http://localhost:4567
middleman

# Edit the files in `/source`
# Then when you're ready to build, run:
middleman build
```

To share your changes, [submit a pull request](https://github.com/wordnik/swagger-ui/pull/new/master).

License
-------

Copyright 2011 Wordnik, Inc.

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at [apache.org/licenses/LICENSE-2.0](http://www.apache.org/licenses/LICENSE-2.0)

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.

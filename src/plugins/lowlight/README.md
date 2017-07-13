# Syntax Highlight with lowlight #

## Design ##

The lowlight plugin is designed as a preset.

## Usage ##

In the final html file, add the following:

1. css

Add `swagger-ui-lowlight.css` under `swagger-ui.css` , like this: 

```
<link rel="stylesheet" type="text/css" href="./swagger-ui.css" >
<link rel="stylesheet" type="text/css" href="./swagger-ui-lowlight.css" >
```

The stylesheet `swagger-ui-lowlight.css` is actually minimized version of [this style from highlight.js](https://github.com/isagalaev/highlight.js/blob/master/src/styles/atom-one-dark.css), and you can also use other stylesheet provided with [highlight.js](https://github.com/isagalaev/highlight.js/tree/master/src/styles) .

2. SwaggerUI initialization

Add `SwaggerUIBundle.presets.lowlight` to `presets` section, like this:

```
<script src="./swagger-ui-bundle.js"> </script>
<script src="./swagger-ui-standalone-preset.js"> </script>
<script>
window.onload = function() {
  // Build a system
  const ui = SwaggerUIBundle({
    url: "http://petstore.swagger.io/v2/swagger.json",
    dom_id: '#swagger-ui',
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset,
	  SwaggerUIBundle.presets.lowlight
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    layout: "StandaloneLayout"
  })

  window.ui = ui
}
</script>
```

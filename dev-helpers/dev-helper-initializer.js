/* eslint-disable no-undef */
window.onload = function() {
  window["SwaggerUIBundle"] = window["swagger-ui-bundle"]
  window["SwaggerUIStandalonePreset"] = window["swagger-ui-standalone-preset"]
  // Build a system
  const ui = SwaggerUIBundle({
    url: "https://localhost:7003/swagger/v1/swagger.json",
    dom_id: "#swagger-ui",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    // requestSnippetsEnabled: true,
    layout: "StandaloneLayout",
    docExpansion: "full"
  })

  const ui2 = SwaggerUIBundle({
    url: "https://localhost:7002/swagger/v1/swagger.json",
    dom_id: "#swagger-ui2",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    // requestSnippetsEnabled: true,
    layout: "StandaloneLayout",
    docExpansion: "full"
  })

  const ui3 = SwaggerUIBundle({
    url: "https://localhost:7001/swagger/v1/swagger.json",
    dom_id: "#swagger-ui3",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    // requestSnippetsEnabled: true,
    layout: "StandaloneLayout",
    docExpansion: "full"
  })

  window.ui = ui;
  window.ui2 = ui2;
  window.ui3 = ui3;

  // ui.initOAuth({
  //   clientId: "your-client-id",
  //   clientSecret: "your-client-secret-if-required",
  //   realm: "your-realms",
  //   appName: "your-app-name",
  //   scopeSeparator: " ",
  //   scopes: "openid profile email phone address",
  //   additionalQueryStringParams: {},
  //   useBasicAuthenticationWithAccessCodeGrant: false,
  //   usePkceWithAuthorizationCodeGrant: false
  // })
}
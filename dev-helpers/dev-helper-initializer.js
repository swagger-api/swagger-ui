/* eslint-disable no-undef */
window.onload = function() {
  window["SwaggerUIBundle"] = window["swagger-ui-bundle"]
  window["SwaggerUIStandalonePreset"] = window["swagger-ui-standalone-preset"]
  // Build a system
  const ui = SwaggerUIBundle({
    spec: {
      swagger: '2.0',
      info: {
        title: "test",
        version: '1.0.0'
      },
      paths: {
        '/foo': {
          get: {
            responses: {
              '200': {
                description: 'OK'
              }
            }
          }
        }
      },
      "securityDefinitions": {
        "test_auth_implicit": {
            "type": "oauth2",
            "authorizationUrl": "https://oauth2provider.com/oauth/authorize",
            "flow": "implicit"
        },
        "test_auth_password": {
            "type": "oauth2",
            "authorizationUrl": "https://oauth2provider.com/oauth/authorize",
            "flow": "password"
        }
    }
    },
    dom_id: "#swagger-ui",
    presets: [
      SwaggerUIBundle.presets.apis,
      SwaggerUIStandalonePreset
    ],
    plugins: [
      SwaggerUIBundle.plugins.DownloadUrl
    ],
    // requestSnippetsEnabled: true,
    layout: "StandaloneLayout"
  })

  window.ui = ui

  ui.initOAuth({
    clientId: "your-client-id",
    clientSecret: "your-client-secret-if-required",
    realm: "your-realms",
    appName: "your-app-name",
    scopeSeparator: " ",
    scopes: "openid profile email phone address",
    additionalQueryStringParams: {},
    useBasicAuthenticationWithAccessCodeGrant: false,
    usePkceWithAuthorizationCodeGrant: false,
    oauth2FlowOverwrites: [
      ["implicit", {
        clientId: "client_id_123",
        clientSecret: "secret123"
      }],
      ["password", {
        clientId: "client_id_456",
        clientSecret: "secret456"
      }]

    ],
  })
}

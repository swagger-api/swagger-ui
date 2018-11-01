# OAuth2 configuration
You can configure OAuth2 authorization by calling the `initOAuth` method.

Property name | Docker variable |  Description
--- | --- | ------
clientId | `OAUTH_CLIENT_ID` | Default clientId. MUST be a string
clientSecret | `OAUTH_CLIENT_SECRET` | **🚨 Never use this parameter in your production environemnt. It exposes cruicial security information. This feature is intended for dev/test environments only. 🚨** <br>Default clientSecret. MUST be a string
realm | `OAUTH_REALM` |realm query parameter (for oauth1) added to `authorizationUrl` and `tokenUrl`. MUST be a string
appName | `OAUTH_APP_NAME` |application name, displayed in authorization popup. MUST be a string
scopeSeparator | `OAUTH_SCOPE_SEPARATOR` |scope separator for passing scopes, encoded before calling, default value is a space (encoded value `%20`). MUST be a string
additionalQueryStringParams | `OAUTH_ADDITIONAL_PARAMS` |Additional query parameters added to `authorizationUrl` and `tokenUrl`. MUST be an object
useBasicAuthenticationWithAccessCodeGrant | _Unavailable_ |Only activated for the `accessCode` flow.  During the `authorization_code` request to the `tokenUrl`, pass the [Client Password](https://tools.ietf.org/html/rfc6749#section-2.3.1) using the HTTP Basic Authentication scheme (`Authorization` header with `Basic base64encode(client_id + client_secret)`).  The default is `false`

```javascript
const ui = SwaggerUI({...})

// Method can be called in any place after calling constructor SwaggerUIBundle
ui.initOAuth({
    clientId: "your-client-id",
    clientSecret: "your-client-secret-if-required",
    realm: "your-realms",
    appName: "your-app-name",
    scopeSeparator: " ",
    additionalQueryStringParams: {test: "hello"}
  })
```

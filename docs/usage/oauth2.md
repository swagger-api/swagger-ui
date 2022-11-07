# OAuth 2.0 configuration
You can configure OAuth 2.0 authorization by calling the `initOAuth` method.

Property name | Docker variable |  Description
--- | --- | ------
clientId | `OAUTH_CLIENT_ID` | Default clientId. MUST be a string
clientSecret | `OAUTH_CLIENT_SECRET` | **🚨 Never use this parameter in your production environment. It exposes crucial security information. This feature is intended for dev/test environments only. 🚨** <br>Default clientSecret. MUST be a string
realm | `OAUTH_REALM` |realm query parameter (for oauth1) added to `authorizationUrl` and `tokenUrl`. MUST be a string
appName | `OAUTH_APP_NAME` |application name, displayed in authorization popup. MUST be a string
scopeSeparator | `OAUTH_SCOPE_SEPARATOR` |scope separator for passing scopes, encoded before calling, default value is a space (encoded value `%20`). MUST be a string
scopes | `OAUTH_SCOPES` |string array or scope separator (i.e. space) separated string of initially selected oauth scopes, default is empty array
additionalQueryStringParams | `OAUTH_ADDITIONAL_PARAMS` |Additional query parameters added to `authorizationUrl` and `tokenUrl`. MUST be an object
useBasicAuthenticationWithAccessCodeGrant | `OAUTH_USE_BASIC_AUTH` |Only activated for the `accessCode` flow.  During the `authorization_code` request to the `tokenUrl`, pass the [Client Password](https://tools.ietf.org/html/rfc6749#section-2.3.1) using the HTTP Basic Authentication scheme (`Authorization` header with `Basic base64encode(client_id + client_secret)`).  The default is `false`
usePkceWithAuthorizationCodeGrant | `OAUTH_USE_PKCE` | Only applies to `Authorization Code` flows. [Proof Key for Code Exchange](https://tools.ietf.org/html/rfc7636) brings enhanced security for OAuth public clients. The default is `false` <br/><br/>_Note:_ This option does not hide the client secret input because [neither PKCE nor client secrets are replacements for each other](https://oauth.net/2/pkce/).

```javascript
const ui = SwaggerUI({...})

// Method can be called in any place after calling constructor SwaggerUIBundle
ui.initOAuth({
    clientId: "your-client-id",
    clientSecret: "your-client-secret-if-required",
    realm: "your-realms",
    appName: "your-app-name",
    scopeSeparator: " ",
    scopes: "openid profile",
    additionalQueryStringParams: {test: "hello"},
    useBasicAuthenticationWithAccessCodeGrant: true,
    usePkceWithAuthorizationCodeGrant: true
  })
```

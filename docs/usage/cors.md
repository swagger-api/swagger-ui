# CORS

CORS is a technique to prevent websites from doing bad things with your personal data.  Most browsers + JavaScript toolkits not only support CORS but enforce it, which has implications for your API server which supports Swagger.

You can read about CORS here: http://www.w3.org/TR/cors.

There are two cases where no action is needed for CORS support:

1. swagger-ui is hosted on the same server as the application itself (same host *and* port).
2. The application is located behind a proxy that enables the required CORS headers. This may already be covered within your organization.

Otherwise, CORS support needs to be enabled for:

1. Your Swagger docs. For Swagger 2.0 it's the `swagger.json`/`swagger.yaml` and any externally `$ref`ed docs.
2. For the `Try it now` button to work, CORS needs to be enabled on your API endpoints as well.

### Testing CORS Support

You can verify CORS support with one of three techniques:

- Curl your API and inspect the headers.  For instance:

```bash
$ curl -I "https://petstore.swagger.io/v2/swagger.json"
HTTP/1.1 200 OK
Date: Sat, 31 Jan 2015 23:05:44 GMT
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET, POST, DELETE, PUT, PATCH, OPTIONS
Access-Control-Allow-Headers: Content-Type, api_key, Authorization
Content-Type: application/json
Content-Length: 0
```

This tells us that the petstore resource listing supports OPTIONS, and the following headers:  `Content-Type`, `api_key`, `Authorization`.

- Try swagger-ui from your file system and look at the debug console.  If CORS is not enabled, you'll see something like this:

```
XMLHttpRequest cannot load http://sad.server.com/v2/api-docs. No 'Access-Control-Allow-Origin' header is present on the requested resource. Origin 'null' is therefore not allowed access.
```

Swagger-UI cannot easily show this error state.

- Using the http://www.test-cors.org website. Keep in mind this will show a successful result even if `Access-Control-Allow-Headers` is not available, which is still required for Swagger-UI to function properly.

### Enabling CORS

The method of enabling CORS depends on the server and/or framework you use to host your application. http://enable-cors.org provides information on how to enable CORS in some common web servers.

Other servers/frameworks may provide you information on how to enable it specifically in their use case.

### CORS and Header Parameters

Swagger lets you easily send headers as parameters to requests.  The name of these headers *MUST* be supported in your CORS configuration as well.  From our example above:

```
Access-Control-Allow-Headers: Content-Type, api_key, Authorization
```

Only headers with these names will be allowed to be sent by Swagger-UI.

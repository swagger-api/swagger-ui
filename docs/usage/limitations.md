# Limitations

### Forbidden header names

Some header names cannot be controlled by web applications, due to security
features built into web browsers.

Forbidden headers include:

> - Accept-Charset
> - Accept-Encoding
> - Access-Control-Request-Headers
> - Access-Control-Request-Method
> - Connection
> - Content-Length
> - Cookie
> - Cookie2
> - Date
> - DNT
> - Expect
> - Host
> - Keep-Alive
> - Origin
> - Proxy-*
> - Sec-*
> - Referer
> - TE
> - Trailer
> - Transfer-Encoding
> - Upgrade
> - Via
>
> _[Forbidden header names (developer.mozilla.org)](https://developer.mozilla.org/en-US/docs/Glossary/Forbidden_header_name)_

The biggest impact of this is that OpenAPI 3.0 Cookie parameters cannot be
controlled when running Swagger UI in a browser.

For more context, see [#3956](https://github.com/swagger-api/swagger-ui/issues/3956).

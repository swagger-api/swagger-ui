# Deep linking

Swagger-UI allows you to deeply link into tags and operations within a spec. When Swagger-UI is provided a URL fragment at runtime, it will automatically expand and scroll to a specified tag or operation.

## Usage

👉🏼 Add `deepLinking: true` to your Swagger-UI configuration to enable this functionality.

When you expand a tag or operation, Swagger-UI will automatically update its URL fragment with a deep link to the item.
Conversely, when you collapse a tag or operation, Swagger-UI will clear the URL fragment.

You can also right-click a tag name or operation path in order to copy a link to that tag or operation.

#### Fragment format

The fragment is formatted in one of two ways:

- `#/{tagName}`, to trigger the focus of a specific tag
- `#/{tagName}/{operationId}`, to trigger the focus of a specific operation within a tag

`operationId` is the explicit operationId provided in the spec, if one exists.
Otherwise, Swagger-UI generates an implicit operationId by combining the operation's path and method, and escaping non-alphanumeric characters.

## FAQ

> I'm using Swagger-UI in an application that needs control of the URL fragment. How do I disable deep-linking?

This functionality is disabled by default, but you can pass `deepLinking: false` into Swagger-UI as a configuration item to be sure.

> Can I link to multiple tags or operations?

No, this is not supported.

> Can I collapse everything except the operation or tag I'm linking to?

Sure - use `docExpansion: none` to collapse all tags and operations. Your deep link will take precedence over the setting, so only the tag or operation you've specified will be expanded.

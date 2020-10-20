# Plug points

Swagger UI exposes most of its internal logic through the plugin system.

Often, it is beneficial to override the core internals to achieve custom behavior.

### Note: Semantic Versioning

Swagger UI's internal APIs are _not_ part of our public contract, which means that they can change without the major version change.

If your custom plugins wrap, extend, override, or consume any internal core APIs, we recommend specifying a specific minor version of Swagger UI to use in your application, because they will _not_ change between patch versions.

If you're installing Swagger UI via NPM, for example, you can do this by using a tilde:

```js
{
  "dependencies": {
    "swagger-ui": "~3.11.0"
  }
}
```

### `fn.opsFilter`

When using the `filter` option, tag names will be filtered by the user-provided value. If you'd like to customize this behavior, you can override the default `opsFilter` function.

For example, you can implement a multiple-phrase filter:

```js
const MultiplePhraseFilterPlugin = function() {
  return {
    fn: {
      opsFilter: (taggedOps, phrase) => {
        const phrases = phrase.split(", ")

        return taggedOps.filter((val, key) => {
          return phrases.some(item => key.indexOf(item) > -1)
        })
      }
    }
  }
}
```

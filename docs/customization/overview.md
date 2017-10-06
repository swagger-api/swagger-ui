# Plugin system overview

### Prior art

Swagger-UI leans heavily on concepts and patterns found in React and Redux.

If you aren't already familiar, here's some suggested reading:

- [React: Quick Start](https://reactjs.org/docs/hello-world.html)
- [Redux README](http://redux.js.org/)

In the following documentation, we won't take the time to define the fundamentals covered in the resources above.

### The System

The _system_ is the heart of the Swagger-UI application. At runtime, it's a JavaScript object that holds many things:

- React components
- Bound Redux actions and reducers
- Bound Reselect state selectors
- System-wide collection of available components
- Built-in helpers like `getComponent`, `makeMappedContainer`, and `getStore`
- User-defined helper functions

The system is built up when Swagger-UI is called by iterating through ("compiling") each plugin that Swagger-UI has been given, through the `presets` and `plugins` configuration options.

### Presets

Presets are arrays of plugins, which are provided to Swagger-UI through the `presets` configuration option. All plugins within presets are compiled before any plugins provided via the `plugins` configuration option. Consider the following example:

```javascript
SwaggerUI({
  presets: [
    [FirstPlugin, SecondPlugin],
    [ThirdPlugin, FourthPlugin]
  ],
  plugins: [
    FifthPlugin,
    SixthPlugin
  ]
})
```

By default, Swagger-UI includes the internal `ApisPreset`, which contains a set of plugins that provide baseline functionality for Swagger-UI. If you specify your own `presets` option, you need to add the ApisPreset manually, like so:

```javascript
SwaggerUI({
  presets: [
    SwaggerUI.presets.apis,
    MyAmazingCustomPreset
  ]
})
```

# Plugin API

A plugin is an object that contains functions and components capable of modifying and augmenting Swagger-UI's functionality.

### Format

A plugin may contain any or all of these keys:

```javascript
const MyPlugin = {
  statePlugins: {
    anyStateKey: {
      actions,
      reducers,
      selectors,
      wrapActions,
      wrapSelectors
    }
  },
  components: {

  },
  wrapComponents: {
    
  }
}
```

### Interfaces

##### Actions

##### Reducers

##### Selectors

##### Components

##### Wrap-Actions

##### Wrap-Selectors

##### Wrap-Components

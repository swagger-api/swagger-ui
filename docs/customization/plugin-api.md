# Plugins

A plugin is a function that returns an object - more specifically, the object may contain functions and components that augment and modify Swagger-UI's functionality.

### Format

A plugin return value may contain any of these keys, where `myStateKey` is a name for a piece of state:

```javascript
{
  statePlugins: {
    myStateKey: {
      actions,
      reducers,
      selectors,
      wrapActions,
      wrapSelectors
    }
  },
  components: {},
  wrapComponents: {},
  fn: {}
}
```

### Inputs

Let's assume we have a plugin, `NormalPlugin`, that exposes a `doStuff` action under the `normal` state namespace.

```javascript
const ExtendingPlugin = function(system) {
  return {
    statePlugins: {
      extending: {
        actions: {
          doExtendedThings: function(...args) {
            // you can do other things in here if you want
            return system.normalActions.doStuff(...args)
          }
        }
      }
    }
  }
}
```

As you can see, each plugin is passed a reference to the `system` being built up. As long as `NormalPlugin` is compiled before `ExtendingPlugin`, this will work without any issues.

There is no dependency management built into the plugin system, so if you create a plugin that relies on another, it is your responsibility to make sure that the dependent plugin is loaded _after_ the plugin being depended on.

### Interfaces

##### Actions

```javascript
const MyActionPlugin = () => {
  return {
    statePlugins: {
      example: {
        actions: {
          updateFavoriteColor: (str) => {
            return {
              type: "EXAMPLE_SET_FAV_COLOR",
              payload: str
            }
          }
        }
      }
    }
  }
}
```

The Action interface enables the creation of new Redux action creators within a piece of state in the Swagger-UI system.

This action creator function will be bound to the `example` reducer dispatcher and exposed to container components as `exampleActions.updateFavoriteColor`.

For more information about the concept of actions in Redux, see the [Redux Actions documentation](http://redux.js.org/docs/basics/Actions.html).

##### Reducers

##### Selectors

##### Components

##### Wrap-Actions

##### Wrap-Selectors

##### Wrap-Components

##### fn

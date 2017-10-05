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
          updateFavoriteColor: (obj) => {
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

```js
// elsewhere
exampleActions.updateFavoriteColor({
  name: "blue",
  hex: "#0000ff"
})
```

The Action interface enables the creation of new Redux action creators within a piece of state in the Swagger-UI system.

This action creator function will be bound to the `example` reducer dispatcher and exposed to container components as `exampleActions.updateFavoriteColor`.

For more information about the concept of actions in Redux, see the [Redux Actions documentation](http://redux.js.org/docs/basics/Actions.html).

##### Reducers

Reducers take a state (which is an Immutable map) and an action, and return a new state.

Reducers must be provided to the system under the name of the action type that they handle, in this case, `MYPLUGIN_UPDATE_SOMETHING`.

```js
const MyReducerPlugin = function(system) {
  return {
    statePlugins: {
      example: {
        reducers: {
          "EXAMPLE_SET_FAV_COLOR": (state, action) => {
            //
            return state.set("favColor", fromJS(action.payload))
            // we're updating the Immutable state object...
            // we need to convert vanilla objects into an immutable type (fromJS)
            // See immutable docs about how to modify the state
            // PS: you're only working with the state under the namespace, in this case "example".
            // So you can do what you want, without worrying about /other/ namespaces
          }
        }
      }
    }
  }
}
```

##### Selectors

Selectors take any number of functions as arguments, and passes all results to the last function.

They're an easy way to keep logic for getting data out of state in one place, and is preferred over passing state data directly into components.

See [Reselect: `createSelector`](https://github.com/reactjs/reselect#createselectorinputselectors--inputselectors-resultfunc) for more information.
```js
const MySelectorPlugin = function(system) {
  return {
    statePlugins: {
      myPlugin: {
        selectors: {
          something: createSelector(
            state => state.get("something") // return the whatever "something" points to
          )
        }
      }
    }
  }
}
```

##### Components

You can provide a map of components to be integrated into the system.

Be mindful of the key names for the components you provide, as you'll need to use those names to refer to the components elsewhere.

```js
const MyComponentPlugin = function(system) {
  return {
    components: {
      // components can just be functions
      HelloWorld: () => <h1>Hello World!</h1>
    }
  }
}
```

```js
// elsewhere
const HelloWorld = getComponent("HelloWorld")
```

##### Wrap-Actions

Wrap Actions allow you to override the behavior of an action in the system.

This interface is very useful for building custom behavior on top of builtin actions.

A Wrap Action's first argument is `oriAction`, which is the action being wrapped. It is your responsibility to call the `oriAction` - if you don't, the original action will not fire!

```js
const MySpecPlugin = function(system) {
  return {
    statePlugins: {
      spec: {
        actions: {
          updateSpec: (str) => {
            return {
              type: "SPEC_UPDATE_SPEC",
              payload: str
            }
          }
        }
      }
    }
  }
}

// this plugin allows you to watch changes to the spec that is in memory
const MyWrapActionPlugin = function(system) {
  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec: function(oriAction, str) {
            doSomethingWithSpecValue(str)
            return oriAction(str) // don't forget!
          }
        }
      }
    }
  }
}
```

##### Wrap-Selectors

Wrap Selectors allow you to override the behavior of a selector in the system.

They are function factories with the signature `(oriSelector, system) => (...args) => result`.

This interface is useful for controlling what data flows into components. We use this in the core code to disable selectors based on the API definition's version.

```js
import { createSelector } from 'reselect'

const MySpecPlugin = function(system) {
  return {
    statePlugins: {
      spec: {
        selectors: {
          someData: createSelector(
            state => state.get("something")
          )
        }
      }
    }
  }
}

const MyWrapSelectorsPlugin = function(system) {
  return {
    statePlugins: {
      spec: {
        wrapSelectors: {
          someData: (oriSelector, system) => (...args) => {
            // you can do other things here...
            // but let's just enable the default behavior
            return oriSelector(...args)
          }
        }
      }
    }
  }
}
```

##### Wrap-Components

Wrap Components allow you to override a component registered within the system.

Wrap Components are function factories with the signature `(OriginalComponent, system) => props => ReactElement`.

```js
const MyNumberDisplayPlugin = function(system) {
  return {
    components: {
      NumberDisplay: ({ number }) => <span>{number}</span>
    }
  }
}

const MyWrapComponentPlugin = function(system) {
  return {
    wrapComponents: {
      NumberDisplay: (Original, system) => (props) => {
        if(props.number > 10) {
          return <div>
            <h3>Warning! Big number ahead.</h3>
          </div>
        } else {
          return <Original {...props} />
        }
      }
    }
  }
}
```

##### fn

The fn interface allows you to add helper functions to the system for use elsewhere.

```js
import leftPad from "left-pad"

const MyFnPlugin = function(system) {
  return {
    fn: {
      leftPad: leftPad
    }
  }
}
```

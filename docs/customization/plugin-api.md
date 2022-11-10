# Plugins

A plugin is a function that returns an object - more specifically, the object may contain functions and components that augment and modify Swagger UI's functionality.

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

### Format

A plugin return value may contain any of these keys, where `stateKey` is a name for a piece of state:

```javascript
{
  statePlugins: {
    [stateKey]: {
      actions,
      reducers,
      selectors,
      wrapActions,
      wrapSelectors
    }
  },
  components: {},
  wrapComponents: {},
  rootInjects: {},
  afterLoad: (system) => {},
  fn: {},
}
```

### System is provided to plugins

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

#### Actions

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

Once an action has been defined, you can use it anywhere that you can get a system reference:

```javascript
// elsewhere
system.exampleActions.updateFavoriteColor("blue")
```

The Action interface enables the creation of new Redux action creators within a piece of state in the Swagger UI system.

This action creator function will be exposed to container components as `exampleActions.updateFavoriteColor`. When this action creator is called, the return value (which should be a [Flux Standard Action](https://github.com/acdlite/flux-standard-action)) will be passed to the `example` reducer, which we'll define in the next section.

For more information about the concept of actions in Redux, see the [Redux Actions documentation](https://redux.js.org/tutorials/fundamentals/part-2-concepts-data-flow#actions).

#### Reducers

Reducers take a state (which is an [Immutable.js map](https://facebook.github.io/immutable-js/docs/#/Map)) and an action, then returns a new state.

Reducers must be provided to the system under the name of the action type that they handle, in this case, `EXAMPLE_SET_FAV_COLOR`.

```javascript
const MyReducerPlugin = function(system) {
  return {
    statePlugins: {
      example: {
        reducers: {
          "EXAMPLE_SET_FAV_COLOR": (state, action) => {
            // you're only working with the state under the namespace, in this case "example".
            // So you can do what you want, without worrying about /other/ namespaces
            return state.set("favColor", action.payload)
          }
        }
      }
    }
  }
}
```

#### Selectors

Selectors reach into their namespace's state to retrieve or derive data from the state.

They're an easy way to keep logic in one place, and are preferred over passing state data directly into components.


```javascript
const MySelectorPlugin = function(system) {
  return {
    statePlugins: {
      example: {
        selectors: {
          myFavoriteColor: (state) => state.get("favColor")
        }
      }
    }
  }
}
```

You can also use the Reselect library to memoize your selectors, which is recommended for any selectors that will see heavy use, since Reselect automatically memoizes selector calls for you:

```javascript
import { createSelector } from "reselect"

const MySelectorPlugin = function(system) {
  return {
    statePlugins: {
      example: {
        selectors: {
          // this selector will be memoized after it is run once for a
          // value of `state`
          myFavoriteColor: createSelector((state) => state.get("favColor"))
        }
      }
    }
  }
}
```

Once a selector has been defined, you can use it anywhere that you can get a system reference:
```javascript
system.exampleSelectors.myFavoriteColor() // gets `favColor` in state for you
```

#### Components

You can provide a map of components to be integrated into the system.

Be mindful of the key names for the components you provide, as you'll need to use those names to refer to the components elsewhere.

```javascript
class HelloWorldClass extends React.Component {
  render() {
    return <h1>Hello World!</h1>
  }
}

const MyComponentPlugin = function(system) {
  return {
    components: {
      HelloWorldClass: HelloWorldClass
      // components can just be functions, these are called "stateless components"
      HelloWorldStateless: () => <h1>Hello World!</h1>,
    }
  }
}
```

```javascript
// elsewhere
const HelloWorldStateless = system.getComponent("HelloWorldStateless")
const HelloWorldClass = system.getComponent("HelloWorldClass")
```

You can also "cancel out" any components that you don't want by creating a stateless component that always returns `null`:

```javascript
const NeverShowInfoPlugin = function(system) {
  return {
    components: {
      info: () => null
    }
  }
}
```

You can use `config.failSilently` if you don't want a warning when a component doesn't exist in the system.

Be mindful of `getComponent` arguments order. In the example below, the boolean `false` refers to presence of a container, and the 3rd argument is the config object used to suppress the missing component warning.
```javascript
const thisVariableWillBeNull = getComponent("not_real", false, { failSilently: true })
```

#### Wrap-Actions

Wrap Actions allow you to override the behavior of an action in the system.

They are function factories with the signature `(oriAction, system) => (...args) => result`.

A Wrap Action's first argument is `oriAction`, which is the action being wrapped. It is your responsibility to call the `oriAction` - if you don't, the original action will not fire!

This mechanism is useful for conditionally overriding built-in behaviors, or listening to actions.

```javascript
// FYI: in an actual Swagger UI, `updateSpec` is already defined in the core code
// it's just here for clarity on what's behind the scenes
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
          updateSpec: (oriAction, system) => (str) => {
            // here, you can hand the value to some function that exists outside of Swagger UI
            console.log("Here is my API definition", str)
            return oriAction(str) // don't forget! otherwise, Swagger UI won't update
          }
        }
      }
    }
  }
}
```

#### Wrap-Selectors

Wrap Selectors allow you to override the behavior of a selector in the system.

They are function factories with the signature `(oriSelector, system) => (state, ...args) => result`.

This interface is useful for controlling what data flows into components. We use this in the core code to disable selectors based on the API definition's version.

```javascript
import { createSelector } from 'reselect'

// FYI: in an actual Swagger UI, the `url` spec selector is already defined
// it's just here for clarity on what's behind the scenes
const MySpecPlugin = function(system) {
  return {
    statePlugins: {
      spec: {
        selectors: {
          url: createSelector(
            state => state.get("url")
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
          url: (oriSelector, system) => (state, ...args) => {
            console.log('someone asked for the spec url!!! it is', state.get('url'))
            // you can return other values here...
            // but let's just enable the default behavior
            return oriSelector(state, ...args)
          }
        }
      }
    }
  }
}
```

#### Wrap-Components

Wrap Components allow you to override a component registered within the system.

Wrap Components are function factories with the signature `(OriginalComponent, system) => props => ReactElement`. If you'd prefer to provide a React component class, `(OriginalComponent, system) => ReactClass` works as well.

```javascript
const MyWrapBuiltinComponentPlugin = function(system) {
  return {
    wrapComponents: {
      info: (Original, system) => (props) => {
        return <div>
          <h3>Hello world! I am above the Info component.</h3>
          <Original {...props} />
        </div>
      }
    }
  }
}
```

Here's another example that includes a code sample of a component that will be wrapped:

```javascript
/////  Overriding a component from a plugin

// Here's our normal, unmodified component.
const MyNumberDisplayPlugin = function(system) {
  return {
    components: {
      NumberDisplay: ({ number }) => <span>{number}</span>
    }
  }
}

// Here's a component wrapper defined as a function.
const MyWrapComponentPlugin = function(system) {
  return {
    wrapComponents: {
      NumberDisplay: (Original, system) => (props) => {
        if(props.number > 10) {
          return <div>
            <h3>Warning! Big number ahead.</h3>
            <Original {...props} />
          </div>
        } else {
          return <Original {...props} />
        }
      }
    }
  }
}

// Alternatively, here's the same component wrapper defined as a class.
const MyWrapComponentPlugin = function(system) {
  return {
    wrapComponents: {
      NumberDisplay: (Original, system) => class WrappedNumberDisplay extends React.component {
        render() {
          if(props.number > 10) {
            return <div>
              <h3>Warning! Big number ahead.</h3>
              <Original {...props} />
            </div>
          } else {
            return <Original {...props} />
          }
        }
      }
    }
  }
}
```

**Note:**

If you have multiple plugins wrapping the same component, you may want to change the [`pluginsOptions.pluginLoadType`](/docs/usage/configuration.md#Plugins-options) parameter to `chain`.

#### `rootInjects`

The `rootInjects` interface allows you to inject values at the top level of the system.

This interface takes an object, which will be merged in with the top-level system object at runtime.

```js
const MyRootInjectsPlugin = function(system) {
  return {
    rootInjects: {
      myConstant: 123,
      myMethod: (...params) => console.log(...params)
    }
  }
}
```

#### `afterLoad`

The `afterLoad` plugin method allows you to get a reference to the system after your plugin has been registered.

This interface is used in the core code to attach methods that are driven by bound selectors or actions. You can also use it to execute logic that requires your plugin to already be ready, for example fetching initial data from a remote endpoint and passing it to an action your plugin creates.

The plugin context, which is bound to `this`, is undocumented, but below is an example of how to attach a bound action as a top-level method:

```javascript
const MyMethodProvidingPlugin = function() {
  return {
    afterLoad(system) {
      // at this point in time, your actions have been bound into the system
      // so you can do things with them
      this.rootInjects = this.rootInjects || {}
      this.rootInjects.myMethod = system.exampleActions.updateFavoriteColor
    },
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

#### fn

The fn interface allows you to add helper functions to the system for use elsewhere.

```javascript
import leftPad from "left-pad"

const MyFnPlugin = function(system) {
  return {
    fn: {
      leftPad: leftPad
    }
  }
}
```

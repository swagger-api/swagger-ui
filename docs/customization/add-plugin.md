# Add a plugin

### Swagger-UI relies on plugins for all the good stuff.

Plugins allow you to add
- `statePlugins`
  - `selectors` - query the state
  - `reducers` - modify the state
  - `actions` - fire and forget, that will eventually be handled by a reducer. You *can* rely on the result of async actions. But in general it's not recommended
  - `wrapActions` - replace an action with a wrapped action (useful for hooking into existing `actions`)
- `components` - React components
- `fn` - commons functions

To add a plugin we include it in the configs...

```js
SwaggerUI({
  url: 'some url',
  plugins: [ ... ]
})
```

Or if you're updating the core plugins.. you'll add it to the base preset: [src/core/presets/base/index.js](https://github.com/swagger-api/swagger-ui/blob/master/src/core/presets/base/index.js)

Each Plugin is a function that returns an object. That object will get merged with the `system` and later bound to the state.
Here is an example of each `type`

```js
// A contrived, but quite full example....

export function SomePlugin(toolbox) {

  const UPDATE_SOMETHING = "some_namespace_update_something" // strings just need to be uniuqe... see below

  // Tools
  const fromJS = toolbox.Im.fromJS // needed below
  const createSelector = toolbox.createSelector // same, needed below

  return {
    statePlugins: {

      someNamespace: {
        actions: {
          actionName: (args)=> ({type: UPDATE_SOMETHING, payload: args}), // Synchronous action must return an object for the reducer to handle
          anotherAction: (a,b,c) => (system) => system.someNamespaceActions.actionName(a || b) // Asynchronous actions must return a function. The function gets the whole system, and can call other actions (based on state if needed)
        },
        wrapActions: {
          anotherAction: (oriAction, system) => (...args) => {
            oriAction(...args) // Usually we at least call the original action
            system.someNamespace.actionName(...args) // why not call this?
            console.log("args", args) // Log the args
            // anotherAction in the someNamespace has now been replaced with the this function
          }
        },
        reducers: {
          [UPDATE_SOMETHING]: (state, action) => { // Take a state (which is immutable) and an action (see synchronous actions) and return a new state
            return state.set("something", fromJS(action.payload)) // we're updating the Immutable state object... we need to convert vanilla objects into an immutable type (fromJS)
            // See immutable about how to modify the state
            // PS: you're only working with the state under the namespace, in this case "someNamespace". So you can do what you want, without worrying about /other/ namespaces
          }
        },
        selectors: {
          // creatSelector takes a list of fn's and passes all the results to the last fn.
          // eg: createSelector(a => a, a => a+1, (a,a2) => a + a2)(1) // = 3
          something: createSelector( // see [reselect#createSelector](https://github.com/reactjs/reselect#createselectorinputselectors--inputselectors-resultfunc)
            getState => getState(), // This is a requirement... because we `bind` selectors, we don't want to bind to any particular state (which is an immutable value) so we bind to a function, which returns the current state
            state => state.get("something") // return the whatever "something" points to
          ),
          foo: getState => "bar" // In the end selectors are just functions that we pass getState to
        }
      }

      ... // you can include as many namespaces as you want. They just get merged into the 'system'

    },

    components: {
      foo: ()=> <h1> Hello </h1> // just a map of names to react components, naturally you'd want to import a fuller react component
    },

    fn: {
      addOne: (a) => a + 1 // just any extra functions you want to include
    }
  }
}
```

>The plugin factory gets one argument, which I like to call `toolbox`.
This argument is the entire plugin system (at the point the plugin factory is called). It also includes a reference to the `Immutable` lib, so that plugin authors don't need to include it.


### The Plugin system

Each plugin you include will end up getting merged into the `system`, which is just an object.

Then we bind the `system` to our state. And flatten it, so that we don't need to reach into deep objects

> ie: spec.actions becomes specActions, spec.selectors becomes specSelectors

You can reach this bound system by calling `getSystem` on the store.

`getSystem` is the heart of this whole project. Each container component will receive a spread of props from `getSystem`

here is an example....
```js
class Bobby extends React.Component {

  handleClick(e) {
    this.props.someNamespaceActions.actionName() // fires an action... which the reducer will *eventually* see
  }

  render() {

    let { someNamespaceSelectors, someNamespaceActions } = this.props // this.props has the whole state spread
    let something = someNamespaceSelectors.something() // calls our selector, which returns some state (either an immutable object or value)

    return (
      <h1 onClick={this.handleClick.bind(this)}> Hello {something} </h1> // render the contents
    )

  }

}
```

TODO: a lot more elaboration
`

import React from "react"
import { createStore, applyMiddleware, bindActionCreators, compose } from "redux"
import Im, { fromJS, Map } from "immutable"
import deepExtend from "deep-extend"
import { combineReducers } from "redux-immutable"
import { serializeError } from "serialize-error"
import assignDeep from "@kyleshockey/object-assign-deep"
import { NEW_THROWN_ERR } from "corePlugins/err/actions"
import win from "core/window"

import { systemThunkMiddleware, isFn, objMap, objReduce, isObject, isArray, isFunc } from "core/utils"

const idFn = a => a

// Apply middleware that gets sandwitched between `dispatch` and the reducer function(s)
function createStoreWithMiddleware(rootReducer, initialState, getSystem) {

  let middlwares = [
    // createLogger( {
    //   stateTransformer: state => state && state.toJS()
    // } ),
    systemThunkMiddleware( getSystem )
  ]

  const composeEnhancers = win.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose

  return createStore(rootReducer, initialState, composeEnhancers(
    applyMiddleware( ...middlwares )
  ))
}

export default class Store {

  constructor(opts={}) {
    deepExtend(this, {
      state: {},
      plugins: [],
      pluginsOptions: {},
      system: {
        configs: {},
        fn: {},
        components: {},
        rootInjects: {},
        statePlugins: {}
      },
      boundSystem: {},
      toolbox: {}
    }, opts)

    this.getSystem = this._getSystem.bind(this)

    // Bare system (nothing in it, besides the state)
    this.store = configureStore(idFn, fromJS(this.state), this.getSystem )

    // will be the system + Im, we can add more tools when we need to
    this.buildSystem(false)

    // Bootstrap plugins
    this.register(this.plugins)
  }

  getStore() {
    return this.store
  }

  register(plugins, rebuild=true) {
    var pluginSystem = combinePlugins(plugins, this.getSystem(), this.pluginsOptions)
    systemExtend(this.system, pluginSystem)
    if(rebuild) {
      this.buildSystem()
    }

    const needAnotherRebuild = callAfterLoad.call(this.system, plugins, this.getSystem())

    if(needAnotherRebuild) {
      this.buildSystem()
    }
  }

  buildSystem(buildReducer=true) {
    let dispatch = this.getStore().dispatch
    let getState = this.getStore().getState

    this.boundSystem = Object.assign({},
        this.getRootInjects(),
        this.getWrappedAndBoundActions(dispatch),
        this.getWrappedAndBoundSelectors(getState, this.getSystem),
        this.getStateThunks(getState),
        this.getFn(),
        this.getConfigs()
     )

    if(buildReducer)
      this.rebuildReducer()
  }

  _getSystem() {
    return this.boundSystem
  }

  getRootInjects() {
    return Object.assign({
      getSystem: this.getSystem,
      getStore: this.getStore.bind(this),
      getComponents: this.getComponents.bind(this),
      getState: this.getStore().getState,
      getConfigs: this._getConfigs.bind(this),
      Im,
      React
    }, this.system.rootInjects || {})
  }

  _getConfigs(){
    return this.system.configs
  }

  getConfigs() {
    return {
      configs: this.system.configs
    }
  }

  setConfigs(configs) {
    this.system.configs = configs
  }

  rebuildReducer() {
    this.store.replaceReducer(buildReducer(this.system.statePlugins))
  }

  /**
   * Generic getter from system.statePlugins
   *
   */
  getType(name) {
    let upName = name[0].toUpperCase() + name.slice(1)
    return objReduce(this.system.statePlugins, (val, namespace) => {
        let thing = val[name]
        if(thing)
        return {[namespace+upName]:  thing}
      })
  }

  getSelectors() {
    return this.getType("selectors")
  }

  getActions() {
    let actionHolders = this.getType("actions")

    return objMap(actionHolders, (actions) => {
      return objReduce(actions, (action, actionName) => {
        if(isFn(action))
          return {[actionName]: action}
      })
    })
  }

  getWrappedAndBoundActions(dispatch) {
    let actionGroups = this.getBoundActions(dispatch)
      return objMap(actionGroups, (actions, actionGroupName) => {
        let wrappers = this.system.statePlugins[actionGroupName.slice(0,-7)].wrapActions
          if(wrappers) {
            return objMap(actions, (action, actionName) => {
              let wrap = wrappers[actionName]
              if(!wrap) {
                return action
              }

              if(!Array.isArray(wrap)) {
                wrap = [wrap]
              }
              return wrap.reduce((acc, fn) => {
                let newAction = (...args) => {
                  return fn(acc, this.getSystem())(...args)
                }
                if(!isFn(newAction)) {
                  throw new TypeError("wrapActions needs to return a function that returns a new function (ie the wrapped action)")
                }
                return wrapWithTryCatch(newAction)
              }, action || Function.prototype)
            })
          }
        return actions
      })
  }

  getWrappedAndBoundSelectors(getState, getSystem) {
    let selectorGroups = this.getBoundSelectors(getState, getSystem)
      return objMap(selectorGroups, (selectors, selectorGroupName) => {
        let stateName = [selectorGroupName.slice(0, -9)] // selectors = 9 chars
        let wrappers = this.system.statePlugins[stateName].wrapSelectors
          if(wrappers) {
            return objMap(selectors, (selector, selectorName) => {
              let wrap = wrappers[selectorName]
              if(!wrap) {
                return selector
              }

              if(!Array.isArray(wrap)) {
                wrap = [wrap]
              }
              return wrap.reduce((acc, fn) => {
                let wrappedSelector = (...args) => {
                  return fn(acc, this.getSystem())(getState().getIn(stateName), ...args)
                }
                if(!isFn(wrappedSelector)) {
                  throw new TypeError("wrapSelector needs to return a function that returns a new function (ie the wrapped action)")
                }
                return wrappedSelector
              }, selector || Function.prototype)
            })
          }
        return selectors
      })
  }

  getStates(state) {
    return Object.keys(this.system.statePlugins).reduce((obj, key) => {
      obj[key] = state.get(key)
      return obj
    }, {})
  }

  getStateThunks(getState) {
    return Object.keys(this.system.statePlugins).reduce((obj, key) => {
        obj[key] = ()=> getState().get(key)
    return obj
  }, {})
  }

  getFn() {
    return {
      fn: this.system.fn
    }
  }

  getComponents(component) {
    const res = this.system.components[component]

    if(Array.isArray(res)) {
      return res.reduce((ori, wrapper) => {
        return wrapper(ori, this.getSystem())
      })
    }
    if(typeof component !== "undefined") {
      return this.system.components[component]
    }

    return this.system.components
  }

  getBoundSelectors(getState, getSystem) {
    return objMap(this.getSelectors(), (obj, key) => {
      let stateName = [key.slice(0, -9)] // selectors = 9 chars
      const getNestedState = ()=> getState().getIn(stateName)

      return objMap(obj, (fn) => {
        return (...args) => {
          let res = wrapWithTryCatch(fn).apply(null, [getNestedState(), ...args])

          //  If a selector returns a function, give it the system - for advanced usage
          if(typeof(res) === "function")
            res = wrapWithTryCatch(res)(getSystem())

          return res
        }
      })
    })
  }

  getBoundActions(dispatch) {

    dispatch = dispatch || this.getStore().dispatch

    const actions = this.getActions()

    const process = creator =>{
      if( typeof( creator ) !== "function" ) {
        return objMap(creator, prop => process(prop))
      }

      return ( ...args )=>{
        var action = null
        try{
          action = creator( ...args )
        }
        catch( e ){
          action = {type: NEW_THROWN_ERR, error: true, payload: serializeError(e) }
        }
        finally{
          return action // eslint-disable-line no-unsafe-finally
        }
      }

    }
    return objMap(actions, actionCreator => bindActionCreators( process( actionCreator ), dispatch ) )
  }

  getMapStateToProps() {
    return () => {
      return Object.assign({}, this.getSystem())
    }
  }

  getMapDispatchToProps(extras) {
    return (dispatch) => {
      return deepExtend({}, this.getWrappedAndBoundActions(dispatch), this.getFn(), extras)
    }
  }

}

function combinePlugins(plugins, toolbox, pluginOptions) {
  if(isObject(plugins) && !isArray(plugins)) {
    return assignDeep({}, plugins)
  }

  if(isFunc(plugins)) {
    return combinePlugins(plugins(toolbox), toolbox, pluginOptions)
  }

  if(isArray(plugins)) {
    const dest = pluginOptions.pluginLoadType === "chain" ? toolbox.getComponents() : {}

    return plugins
    .map(plugin => combinePlugins(plugin, toolbox, pluginOptions))
    .reduce(systemExtend, dest)
  }

  return {}
}

function callAfterLoad(plugins, system, { hasLoaded } = {}) {
  let calledSomething = hasLoaded
  if(isObject(plugins) && !isArray(plugins)) {
    if(typeof plugins.afterLoad === "function") {
      calledSomething = true
      wrapWithTryCatch(plugins.afterLoad).call(this, system)
    }
  }

  if(isFunc(plugins))
    return callAfterLoad.call(this, plugins(system), system, { hasLoaded: calledSomething })

  if(isArray(plugins)) {
    return plugins.map(plugin => callAfterLoad.call(this, plugin, system, { hasLoaded: calledSomething }))
  }

  return calledSomething
}

// Wraps deepExtend, to account for certain fields, being wrappers.
// Ie: we need to convert some fields into arrays, and append to them.
// Rather than overwrite
function systemExtend(dest={}, src={}) {

  if(!isObject(dest)) {
    return {}
  }
  if(!isObject(src)) {
    return dest
  }

  // Wrap components
  // Parses existing components in the system, and prepares them for wrapping via getComponents
  if(src.wrapComponents) {
    objMap(src.wrapComponents, (wrapperFn, key) => {
      const ori = dest.components && dest.components[key]
      if(ori && Array.isArray(ori)) {
        dest.components[key] = ori.concat([wrapperFn])
        delete src.wrapComponents[key]
      } else if(ori) {
        dest.components[key] = [ori, wrapperFn]
        delete src.wrapComponents[key]
      }
    })

    if(!Object.keys(src.wrapComponents).length) {
      // only delete wrapComponents if we've matched all of our wrappers to components
      // this handles cases where the component to wrap may be out of our scope,
      // but a higher recursive `combinePlugins` call will be able to handle it.
      delete src.wrapComponents
    }
  }


  // Account for wrapActions, make it an array and append to it
  // Modifies `src`
  // 80% of this code is just safe traversal. We need to address that ( ie: use a lib )
  const { statePlugins } = dest
  if(isObject(statePlugins)) {
    for(let namespace in statePlugins) {
      const namespaceObj = statePlugins[namespace]
      if(!isObject(namespaceObj)) {
        continue
      }

      const { wrapActions, wrapSelectors } = namespaceObj

      // process action wrapping
      if (isObject(wrapActions)) {
        for(let actionName in wrapActions) {
          let action = wrapActions[actionName]

          // This should only happen if dest is the first plugin, since invocations after that will ensure its an array
          if(!Array.isArray(action)) {
            action = [action]
            wrapActions[actionName] = action // Put the value inside an array
          }

          if(src && src.statePlugins && src.statePlugins[namespace] && src.statePlugins[namespace].wrapActions && src.statePlugins[namespace].wrapActions[actionName]) {
            src.statePlugins[namespace].wrapActions[actionName] = wrapActions[actionName].concat(src.statePlugins[namespace].wrapActions[actionName])
          }

        }
      }

      // process selector wrapping
      if (isObject(wrapSelectors)) {
        for(let selectorName in wrapSelectors) {
          let selector = wrapSelectors[selectorName]

          // This should only happen if dest is the first plugin, since invocations after that will ensure its an array
          if(!Array.isArray(selector)) {
            selector = [selector]
            wrapSelectors[selectorName] = selector // Put the value inside an array
          }

          if(src && src.statePlugins && src.statePlugins[namespace] && src.statePlugins[namespace].wrapSelectors && src.statePlugins[namespace].wrapSelectors[selectorName]) {
            src.statePlugins[namespace].wrapSelectors[selectorName] = wrapSelectors[selectorName].concat(src.statePlugins[namespace].wrapSelectors[selectorName])
          }

        }
      }
    }
  }

  return deepExtend(dest, src)
}

function buildReducer(states) {
  let reducerObj = objMap(states, (val) => {
    return val.reducers
  })
  return allReducers(reducerObj)
}

function allReducers(reducerSystem) {
  let reducers = Object.keys(reducerSystem).reduce((obj, key) => {
    obj[key] = makeReducer(reducerSystem[key])
    return obj
  },{})

  if(!Object.keys(reducers).length) {
    return idFn
  }

  return combineReducers(reducers)
}

function makeReducer(reducerObj) {
  return (state = new Map(), action) => {
    if(!reducerObj)
      return state

    let redFn = (reducerObj[action.type])
    if(redFn) {
      const res = wrapWithTryCatch(redFn)(state, action)
      // If the try/catch wrapper kicks in, we'll get null back...
      // in that case, we want to avoid making any changes to state
      return res === null ? state : res
    }
    return state
  }
}

function wrapWithTryCatch(fn, {
  logErrors = true
} = {}) {
  if(typeof fn !== "function") {
    return fn
  }

  return function(...args) {
    try {
      return fn.call(this, ...args)
    } catch(e) {
      if(logErrors) {
        console.error(e)
      }
      return null
    }
  }
}

function configureStore(rootReducer, initialState, getSystem) {
  const store = createStoreWithMiddleware(rootReducer, initialState, getSystem)

  // if (module.hot) {
  //   // Enable Webpack hot module replacement for reducers
  //   module.hot.accept("reducers/index", () => {
  //     const nextRootReducer = require("reducers/index")
  //     store.replaceReducer(nextRootReducer)
  //   })
  // }

  return store
}

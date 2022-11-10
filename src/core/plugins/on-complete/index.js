let engaged = false

export default function() {

  return {
    statePlugins: {
      spec: {
        wrapActions: {
          updateSpec: (ori) => (...args) => {
            engaged = true
            return ori(...args)
          },
          updateJsonSpec: (ori, system) => (...args) => {
            const cb = system.getConfigs().onComplete
            if(engaged && typeof cb === "function") {
              // call `onComplete` on next tick, which allows React to
              // reconcile the DOM before we notify the user
              setTimeout(cb, 0)
              engaged = false
            }

            return ori(...args)
          }
        }
      }
    }
  }
}

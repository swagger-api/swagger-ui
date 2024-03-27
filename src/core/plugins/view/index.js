import { memoize } from "core/utils"

import memoizeN from "core/utils/memoizeN"
import { getComponent, render, withMappedContainer } from "./root-injects"
import { getDisplayName } from "./fn"

const memoizeForGetComponent = (fn) => {
  const resolver = (...args) => JSON.stringify(args)
  return memoize(fn, resolver)
}

const memoizeForWithMappedContainer = (fn) => {
  const resolver = (...args) => args
  return memoizeN(fn, resolver)
}

const viewPlugin = ({getComponents, getStore, getSystem}) => {
  // getComponent should be passed into makeMappedContainer, _already_ memoized... otherwise we have a big performance hit ( think, really big )
  const memGetComponent = memoizeForGetComponent(getComponent(getSystem, getStore, getComponents))
  const memMakeMappedContainer = memoizeForWithMappedContainer(withMappedContainer(getSystem, getStore, memGetComponent))

  return {
    rootInjects: {
      getComponent: memGetComponent,
      makeMappedContainer: memMakeMappedContainer,
      render: render(getSystem, getStore, getComponent, getComponents),
    },
    fn: {
      getDisplayName,
    },
  }
}

export default viewPlugin

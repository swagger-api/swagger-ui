import { memoize } from "core/utils"

import { getComponent, render, withMappedContainer } from "./root-injects"
import { getDisplayName } from "./fn"

const viewPlugin = ({getComponents, getStore, getSystem}) => {
  // getComponent should be passed into makeMappedContainer, _already_ memoized... otherwise we have a big performance hit ( think, really big )
  const memGetComponent = memoize(getComponent(getSystem, getStore, getComponents))
  const memMakeMappedContainer = memoize(withMappedContainer(getSystem, getStore, memGetComponent))

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

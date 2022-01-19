import { memoize } from "core/utils"

import { getDisplayName, componentDidCatch } from "./fn"
import { getComponent, render, makeMappedContainer, withErrorBoundary } from "./root-injects"
import ErrorBoundary from "./components/error-boundary"
import Fallback from "./components/fallback"

const viewPlugin = ({getComponents, getStore, getSystem}) => {
  // getComponent should be passed into makeMappedContainer, _already_ memoized... otherwise we have a big performance hit ( think, really big )
  const memGetComponent = memoize(getComponent.bind(null, getSystem, getStore, getComponents))
  const memMakeMappedContainer = memoize(makeMappedContainer.bind(null, getSystem, getStore, memGetComponent, getComponents))

  return {
    rootInjects: {
      getComponent: memGetComponent,
      makeMappedContainer: memMakeMappedContainer,
      render: render.bind(null, getSystem, getStore, getComponent, getComponents),
    },
    fn: {
      getDisplayName,
      componentDidCatch,
      withErrorBoundary: withErrorBoundary(getSystem),
    },
    components: {
      ErrorBoundary,
      Fallback,
    },
  }
}

export default viewPlugin

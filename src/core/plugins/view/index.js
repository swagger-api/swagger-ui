import * as rootInjects from "./root-injects"
import { memoize } from "core/utils"

import ErrorBoundary from "./error-boundary"
import Fallback from "./fallback"

export default function({getComponents, getStore, getSystem}) {

  let { getComponent, render, makeMappedContainer } = rootInjects

  // getComponent should be passed into makeMappedContainer, _already_ memoized... otherwise we have a big performance hit ( think, really big )
  const memGetComponent = memoize(getComponent.bind(null, getSystem, getStore, getComponents))
  const memMakeMappedContainer = memoize(makeMappedContainer.bind(null, getSystem, getStore, memGetComponent, getComponents))

  return {
    rootInjects: {
      getComponent: memGetComponent,
      makeMappedContainer: memMakeMappedContainer,
      render: render.bind(null, getSystem, getStore, getComponent, getComponents),
    },
    components: {
      ErrorBoundary,
      Fallback,
    },
  }
}

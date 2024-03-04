/**
 * @prettier
 */
import { getComponent } from "core/plugins/view/root-injects"
import { render } from "./root-injects"

const ViewLegacyPlugin = ({ React, getSystem, getStore, getComponents }) => {
  const rootInjects = {}
  const reactMajorVersion = parseInt(React?.version, 10)

  if (reactMajorVersion >= 16 && reactMajorVersion < 18) {
    rootInjects.render = render(
      getSystem,
      getStore,
      getComponent,
      getComponents
    )
  }

  return {
    rootInjects,
  }
}

export default ViewLegacyPlugin

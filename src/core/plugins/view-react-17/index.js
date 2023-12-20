/**
 * @prettier
 */
import { getComponent } from "core/plugins/view/root-injects"
import { render } from "./root-injects"

const ViewReact17Plugin = ({ React, getSystem, getStore, getComponents }) => {
  const rootInjects = {}

  if (/^1[67]\./.test(React?.version)) {
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

export default ViewReact17Plugin

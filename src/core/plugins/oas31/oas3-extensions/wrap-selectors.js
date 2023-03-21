/**
 * @prettier
 */
import { createOnlyOAS31SelectorWrapper } from "../fn"

export const hasUserEditedBody = createOnlyOAS31SelectorWrapper(
  (state, path, method) => (system) => {
    const webhooks = system.specSelectors.webhooks()

    if (webhooks.hasIn([path, method])) {
      // try it out functionality is disabled for webhooks
      return false
    }
  }
)

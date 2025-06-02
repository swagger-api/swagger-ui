/**
 * @prettier
 */
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"

export const selectLicenseUrl = createSelector(
  [
    (state, system) => system.specSelectors.url(),
    (state, system) => system.oas3Selectors.selectedServer(),
    (state, system) => system.specSelectors.selectLicenseUrlField(),
    (state, system) => system.specSelectors.selectLicenseIdentifierField(),
  ],
  (specUrl, selectedServer, url, identifier) => {
    if (url) {
      return safeBuildUrl(url, specUrl, { selectedServer })
    }

    if (identifier) {
      return `https://spdx.org/licenses/${identifier}.html`
    }

    return undefined
  }
)

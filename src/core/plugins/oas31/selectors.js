/**
 * @prettier
 */
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"
import { onlyOAS31 } from "./helpers"

export const makeSelectLicenseUrl = (system) =>
  onlyOAS31(
    createSelector(
      () => system.specSelectors.url(),
      () => system.oas3Selectors.selectedServer(),
      () => system.specSelectors.selectLicenseUrlField(),
      () => system.specSelectors.selectLicenseIdentifierField(),
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
  )

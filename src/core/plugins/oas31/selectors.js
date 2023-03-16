/**
 * @prettier
 */
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"

export const selectLicenseNameField = () => (system) => {
  return system.specSelectors.license().get("name", "License")
}

export const selectLicenseUrlField = () => (system) => {
  return system.specSelectors.license().get("url")
}

export const selectLicenseIdentifierField = () => (system) => {
  return system.specSelectors.license().get("identifier")
}

export const makeSelectLicenseUrl = (system) =>
  createSelector(
    () => system.specSelectors.url(),
    () => system.oas3Selectors.selectedServer(),
    () => system.oas31Selectors.selectLicenseUrlField(),
    () => system.oas31Selectors.selectLicenseIdentifierField(),
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

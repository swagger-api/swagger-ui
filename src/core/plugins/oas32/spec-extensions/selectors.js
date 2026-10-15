/**
 * @prettier
 */
import { List, Map } from "immutable"
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"
import { isOAS32 } from "../fn"

const map = Map()

/**
 * Detects if the current spec is OAS 3.2.x
 */
export const selectIsOAS32 = (state, system) => () => {
  const spec = system.specSelectors.specJson()
  return isOAS32(spec)
}

export const webhooks = () => (system) => {
  const webhooks = system.specSelectors.specJson().get("webhooks")
  return Map.isMap(webhooks) ? webhooks : map
}

/**
 * `specResolvedSubtree` selector is needed as input selector,
 * so that we regenerate the selected result whenever the lazy
 * resolution happens.
 */
export const selectWebhooksOperations = createSelector(
  [
    (state, system) => system.specSelectors.webhooks(),
    (state, system) => system.specSelectors.validOperationMethods(),
    (state, system) => system.specSelectors.specResolvedSubtree(["webhooks"]),
  ],
  (webhooks, validOperationMethods) =>
    webhooks
      .reduce((allOperations, pathItem, pathItemName) => {
        if (!Map.isMap(pathItem)) return allOperations

        const pathItemOperations = pathItem
          .entrySeq()
          .filter(([key]) => validOperationMethods.includes(key))
          .map(([method, operation]) => ({
            operation: Map({ operation }),
            method,
            path: pathItemName,
            specPath: ["webhooks", pathItemName, method],
          }))

        return allOperations.concat(pathItemOperations)
      }, List())
      .groupBy((operationDTO) => operationDTO.path)
      .map((operations) => operations.toArray())
      .toObject()
)

export const license = () => (system) => {
  const license = system.specSelectors.info().get("license")
  return Map.isMap(license) ? license : map
}

export const selectLicenseNameField = () => (system) => {
  return system.specSelectors.license().get("name", "License")
}

export const selectLicenseUrlField = () => (system) => {
  return system.specSelectors.license().get("url")
}

export const selectLicenseUrl = createSelector(
  [
    (state, system) => system.specSelectors.url(),
    (state, system) => system.oas3Selectors.selectedServer(),
    (state, system) => system.specSelectors.selectLicenseUrlField(),
  ],
  (specUrl, selectedServer, url) => {
    if (url) {
      return safeBuildUrl(url, specUrl, { selectedServer })
    }

    return undefined
  }
)

export const selectLicenseIdentifierField = () => (system) => {
  return system.specSelectors.license().get("identifier")
}

export const contact = () => (system) => {
  const contact = system.specSelectors.info().get("contact")
  return Map.isMap(contact) ? contact : map
}

export const selectContactNameField = () => (system) => {
  return system.specSelectors.contact().get("name", "the developer")
}

export const selectContactEmailField = () => (system) => {
  return system.specSelectors.contact().get("email")
}

export const selectContactUrlField = () => (system) => {
  return system.specSelectors.contact().get("url")
}

export const selectContactUrl = createSelector(
  [
    (state, system) => system.specSelectors.url(),
    (state, system) => system.oas3Selectors.selectedServer(),
    (state, system) => system.specSelectors.selectContactUrlField(),
  ],
  (specUrl, selectedServer, url) => {
    if (url) {
      return safeBuildUrl(url, specUrl, { selectedServer })
    }

    return undefined
  }
)

export const selectInfoSummaryField = () => (system) => {
  return system.specSelectors.info().get("summary")
}

/**
 * @prettier
 */
import { List, Map } from "immutable"
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"
import { isOAS31 as isOAS31Helper, onlyOAS31 } from "../helpers"

const map = Map()

export const makeIsOAS31 = (system) =>
  createSelector(() => system.specSelectors.specJson(), isOAS31Helper)

export const webhooks = onlyOAS31(() => (system) => {
  return system.specSelectors.specJson().get("webhooks", map)
})

/**
 * `specResolvedSubtree` selector is needed as input selector,
 * so that we regenerate the selected result whenever the lazy
 * resolution happens.
 */
export const makeSelectWebhooksOperations = (system) =>
  onlyOAS31(
    createSelector(
      () => system.specSelectors.webhooks(),
      () => system.specSelectors.validOperationMethods(),
      () => system.specSelectors.specResolvedSubtree(["webhooks"]),
      (webhooks, validOperationMethods) => {
        return webhooks
          .reduce((allOperations, pathItem, pathItemName) => {
            const pathItemOperations = pathItem
              .entrySeq()
              .filter(([key]) => validOperationMethods.includes(key))
              .map(([method, operation]) => ({
                operation: Map({ operation }),
                method,
                path: pathItemName,
                specPath: List(["webhooks", pathItemName, method]),
              }))

            return allOperations.concat(pathItemOperations)
          }, List())
          .groupBy((operation) => operation.path)
          .map((operations) => operations.toArray())
          .toObject()
      }
    )
  )

export const license = () => (system) => {
  return system.specSelectors.info().get("license", map)
}

export const selectLicenseNameField = () => (system) => {
  return system.specSelectors.license().get("name", "License")
}

export const selectLicenseUrlField = () => (system) => {
  return system.specSelectors.license().get("url")
}

export const makeSelectLicenseUrl = (system) =>
  createSelector(
    () => system.specSelectors.url(),
    () => system.oas3Selectors.selectedServer(),
    () => system.specSelectors.selectLicenseUrlField(),
    (specUrl, selectedServer, url) => {
      if (url) {
        return safeBuildUrl(url, specUrl, { selectedServer })
      }

      return undefined
    }
  )

export const selectLicenseIdentifierField = onlyOAS31(() => (system) => {
  return system.specSelectors.license().get("identifier")
})

export const contact = () => (system) => {
  return system.specSelectors.info().get("contact", map)
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

export const makeSelectContactUrl = (system) =>
  createSelector(
    () => system.specSelectors.url(),
    () => system.oas3Selectors.selectedServer(),
    () => system.specSelectors.selectContactUrlField(),
    (specUrl, selectedServer, url) => {
      if (url) {
        return safeBuildUrl(url, specUrl, { selectedServer })
      }

      return undefined
    }
  )

export const selectInfoTitleField = () => (system) => {
  return system.specSelectors.info().get("title")
}

export const selectInfoSummaryField = onlyOAS31(() => (system) => {
  return system.specSelectors.info().get("summary")
})

export const selectInfoDescriptionField = () => (system) => {
  return system.specSelectors.info().get("description")
}

export const selectInfoTermsOfServiceField = () => (system) => {
  return system.specSelectors.info().get("termsOfService")
}

export const makeSelectInfoTermsOfServiceUrl = (system) =>
  createSelector(
    () => system.specSelectors.url(),
    () => system.oas3Selectors.selectedServer(),
    () => system.specSelectors.selectInfoTermsOfServiceField(),
    (specUrl, selectedServer, termsOfService) => {
      if (termsOfService) {
        return safeBuildUrl(termsOfService, specUrl, { selectedServer })
      }

      return undefined
    }
  )

export const selectExternalDocsDescriptionField = () => (system) => {
  return system.specSelectors.externalDocs().get("description")
}

export const selectExternalDocsUrlField = () => (system) => {
  return system.specSelectors.externalDocs().get("url")
}

export const makeSelectExternalDocsUrl = (system) =>
  createSelector(
    () => system.specSelectors.url(),
    () => system.oas3Selectors.selectedServer(),
    () => system.specSelectors.selectExternalDocsUrlField(),
    (specUrl, selectedServer, url) => {
      if (url) {
        return safeBuildUrl(url, specUrl, { selectedServer })
      }

      return undefined
    }
  )

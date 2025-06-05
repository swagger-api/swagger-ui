/**
 * @prettier
 */
import { List, Map, Set, OrderedMap } from "immutable"
import { createSelector } from "reselect"

import { safeBuildUrl } from "core/utils/url"
import { isOAS31 as isOAS31Fn } from "../fn"
import { sorters } from "core/utils"

const map = Map()
const DEFAULT_TAG = "default"

export const isOAS31 = createSelector(
  (state, system) => system.specSelectors.specJson(),
  isOAS31Fn
)

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

/**
 * Selectors for grouping webhooks by tags
 */
export const webhooksWithTags = createSelector(
  [
    (state, system) => system.specSelectors.webhooks(),
    (state, system) => system.specSelectors.validOperationMethods(),
    (state, system) => system.specSelectors.specResolvedSubtree(["webhooks"]),
    (state, system) => system.specSelectors.tags(),
  ],
  (webhooks, validOperationMethods, resolvedWebhooks, tags) => {
    return webhooks
      .reduce((taggedMap, pathItem, pathItemName) => {
        if (!Map.isMap(pathItem)) return taggedMap

        const pathItemOperations = pathItem
          .entrySeq()
          .filter(([key]) => validOperationMethods.includes(key))
          .map(([method, operation]) => {
            return Map({
              operation,
              method,
              path: pathItemName,
              specPath: ["webhooks", pathItemName, method],
              operationTags: Set(operation.get("tags", List()))
            })
          })

        return pathItemOperations.reduce((acc, operation) => {
          const operationTags = operation.get("operationTags")

          if (operationTags.count() < 1) {
            return acc.update(DEFAULT_TAG, List(), ar => ar.push(operation))
          }

          return operationTags.reduce(
            (res, tag) => res.update(tag, List(), ar => ar.push(operation)),
            acc
          )
        }, taggedMap)
      }, tags.reduce((taggedMap, tag) => {
        return taggedMap.set(tag.get("name"), List())
      }, OrderedMap()))
  }
)

export const taggedWebhooks = createSelector(
  [
    (state, system) => system.specSelectors.webhooksWithTags(state),
    (state, system) => system.specSelectors.tags(),
    (state, system) => system.specSelectors.tagDetails,
  ],
  (webhooksWithTags, tags, tagDetailsSelector) => ({ getConfigs }) => {
    let { tagsSorter, operationsSorter } = getConfigs()
    return webhooksWithTags
      .sortBy(
        (val, key) => key, // get the name of the tag to be passed to the sorter
        (tagA, tagB) => {
          let sortFn = (typeof tagsSorter === "function" ? tagsSorter : sorters.tagsSorter[tagsSorter])
          return (!sortFn ? null : sortFn(tagA, tagB))
        }
      )
      .map((ops, tag) => {
        let sortFn = (typeof operationsSorter === "function" ? operationsSorter : sorters.operationsSorter[operationsSorter])
        let operations = (!sortFn ? ops : ops.sort(sortFn))
        
        // Find the tag details in the tags array
        const tagDetail = tags.find(t => t.get("name") === tag)
        
        return Map({ 
          tagDetails: tagDetail || null, 
          operations: operations 
        })
      })
  }
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

export const selectInfoTitleField = () => (system) => {
  return system.specSelectors.info().get("title")
}

export const selectInfoSummaryField = () => (system) => {
  return system.specSelectors.info().get("summary")
}

export const selectInfoDescriptionField = () => (system) => {
  return system.specSelectors.info().get("description")
}

export const selectInfoTermsOfServiceField = () => (system) => {
  return system.specSelectors.info().get("termsOfService")
}

export const selectInfoTermsOfServiceUrl = createSelector(
  [
    (state, system) => system.specSelectors.url(),
    (state, system) => system.oas3Selectors.selectedServer(),
    (state, system) => system.specSelectors.selectInfoTermsOfServiceField(),
  ],
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

export const selectExternalDocsUrl = createSelector(
  [
    (state, system) => system.specSelectors.url(),
    (state, system) => system.oas3Selectors.selectedServer(),
    (state, system) => system.specSelectors.selectExternalDocsUrlField(),
  ],
  (specUrl, selectedServer, url) => {
    if (url) {
      return safeBuildUrl(url, specUrl, { selectedServer })
    }

    return undefined
  }
)

export const selectJsonSchemaDialectField = () => (system) => {
  return system.specSelectors.specJson().get("jsonSchemaDialect")
}

export const selectJsonSchemaDialectDefault = () =>
  "https://spec.openapis.org/oas/3.1/dialect/base"

export const selectSchemas = createSelector(
  (state, system) => system.specSelectors.definitions(),
  (state, system) =>
    system.specSelectors.specResolvedSubtree(["components", "schemas"]),

  (rawSchemas, resolvedSchemas) => {
    if (!Map.isMap(rawSchemas)) return {}
    if (!Map.isMap(resolvedSchemas)) return rawSchemas.toJS()

    return Object.entries(rawSchemas.toJS()).reduce(
      (acc, [schemaName, rawSchema]) => {
        const resolvedSchema = resolvedSchemas.get(schemaName)
        acc[schemaName] = resolvedSchema?.toJS() || rawSchema
        return acc
      },
      {}
    )
  }
)

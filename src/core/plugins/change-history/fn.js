const HTTP_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
]

const INFO_FIELDS = ["title", "version", "description"]

const OPERATION_FIELDS = ["summary", "description", "operationId", "deprecated"]

const PARAMETER_FIELDS = ["required", "description", "schema", "type"]

export function stableStringify(value) {
  if (value === null || value === undefined) {
    return "null"
  }

  if (typeof value !== "object") {
    return JSON.stringify(value)
  }

  if (Array.isArray(value)) {
    return `[${value.map(stableStringify).join(",")}]`
  }

  const keys = Object.keys(value).sort()
  return `{${keys
    .map((key) => `${JSON.stringify(key)}:${stableStringify(value[key])}`)
    .join(",")}}`
}

export function hashSpec(spec) {
  return simpleHash(stableStringify(spec))
}

function simpleHash(str) {
  let hash = 0

  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i)
    hash |= 0
  }

  return hash.toString(36)
}

export function getStorageKey(url, spec) {
  if (url) {
    return url
  }

  const title = spec?.info?.title
  if (title) {
    return `inline:${title}`
  }

  return "inline"
}

function getByPointer(root, ref) {
  const path = ref
    .slice(2)
    .split("/")
    .map((segment) => segment.replace(/~1/g, "/").replace(/~0/g, "~"))

  let current = root

  for (const segment of path) {
    if (current == null || typeof current !== "object") {
      return undefined
    }
    current = current[segment]
  }

  return current
}

/**
 * Dereferences internal ($ref: "#/...") pointers so that structural changes to
 * a referenced schema surface on every operation that uses it. Circular
 * references are left intact via a per-branch resolution stack.
 */
export function resolveRefs(spec) {
  if (!spec || typeof spec !== "object") {
    return spec
  }

  const resolve = (node, stack) => {
    if (Array.isArray(node)) {
      return node.map((item) => resolve(item, stack))
    }

    if (node && typeof node === "object") {
      const ref = node.$ref

      if (typeof ref === "string" && ref.startsWith("#/")) {
        if (stack.includes(ref)) {
          return { $ref: ref }
        }

        const target = getByPointer(spec, ref)

        if (target === undefined) {
          return node
        }

        return resolve(target, [...stack, ref])
      }

      const out = {}
      for (const key of Object.keys(node)) {
        out[key] = resolve(node[key], stack)
      }
      return out
    }

    return node
  }

  return resolve(spec, [])
}

function getOperationMap(spec) {
  const map = new Map()
  const paths = spec?.paths || {}

  Object.keys(paths).forEach((path) => {
    const pathItem = paths[path]

    HTTP_METHODS.forEach((method) => {
      if (pathItem?.[method]) {
        map.set(`${method.toUpperCase()} ${path}`, {
          path,
          method: method.toUpperCase(),
          operation: pathItem[method],
        })
      }
    })
  })

  return map
}

function getSchemas(spec) {
  if (spec?.components?.schemas) {
    return spec.components.schemas
  }

  if (spec?.definitions) {
    return spec.definitions
  }

  return {}
}

function paramKey(param) {
  return `${param.in}:${param.name}`
}

function compareInfo(oldSpec, newSpec, changes) {
  const oldInfo = oldSpec?.info || {}
  const newInfo = newSpec?.info || {}

  INFO_FIELDS.forEach((field) => {
    if (oldInfo[field] !== newInfo[field]) {
      changes.push({
        type: "info-changed",
        field,
        oldValue: oldInfo[field],
        newValue: newInfo[field],
      })
    }
  })
}

function compareTags(oldSpec, newSpec, changes) {
  const oldTags = new Set((oldSpec?.tags || []).map((tag) => tag.name))
  const newTags = new Set((newSpec?.tags || []).map((tag) => tag.name))

  newTags.forEach((tag) => {
    if (!oldTags.has(tag)) {
      changes.push({ type: "tag-added", name: tag })
    }
  })

  oldTags.forEach((tag) => {
    if (!newTags.has(tag)) {
      changes.push({ type: "tag-removed", name: tag })
    }
  })
}

function compareSecurity(oldSpec, newSpec, changes) {
  if (
    stableStringify(oldSpec?.security) !== stableStringify(newSpec?.security)
  ) {
    changes.push({ type: "security-changed" })
  }
}

function compareParameters(oldParams, newParams, changes, context) {
  const oldMap = new Map(
    (oldParams || []).map((param) => [paramKey(param), param])
  )
  const newMap = new Map(
    (newParams || []).map((param) => [paramKey(param), param])
  )

  newMap.forEach((param, key) => {
    if (!oldMap.has(key)) {
      changes.push({
        type: "parameter-added",
        ...context,
        parameter: param.name,
        location: param.in,
      })
    }
  })

  oldMap.forEach((param, key) => {
    if (!newMap.has(key)) {
      changes.push({
        type: "parameter-removed",
        ...context,
        parameter: param.name,
        location: param.in,
      })
    }
  })

  oldMap.forEach((oldParam, key) => {
    if (!newMap.has(key)) {
      return
    }

    const newParam = newMap.get(key)
    const fields = PARAMETER_FIELDS.filter(
      (field) =>
        stableStringify(oldParam[field]) !== stableStringify(newParam[field])
    )

    if (fields.length) {
      changes.push({
        type: "parameter-modified",
        ...context,
        parameter: oldParam.name,
        location: oldParam.in,
        fields,
      })
    }
  })
}

function compareResponses(oldResponses, newResponses, changes, context) {
  const oldCodes = new Set(Object.keys(oldResponses || {}))
  const newCodes = new Set(Object.keys(newResponses || {}))

  newCodes.forEach((code) => {
    if (!oldCodes.has(code)) {
      changes.push({
        type: "response-added",
        ...context,
        statusCode: code,
      })
    }
  })

  oldCodes.forEach((code) => {
    if (!newCodes.has(code)) {
      changes.push({
        type: "response-removed",
        ...context,
        statusCode: code,
      })
    }
  })

  oldCodes.forEach((code) => {
    if (!newCodes.has(code)) {
      return
    }

    const oldResponse = oldResponses[code]
    const newResponse = newResponses[code]

    if (stableStringify(oldResponse) === stableStringify(newResponse)) {
      return
    }

    changes.push({
      type: "response-modified",
      ...context,
      statusCode: code,
    })

    const oldMediaTypes = new Set(Object.keys(oldResponse?.content || {}))
    const newMediaTypes = new Set(Object.keys(newResponse?.content || {}))

    newMediaTypes.forEach((mediaType) => {
      if (!oldMediaTypes.has(mediaType)) {
        changes.push({
          type: "response-content-added",
          ...context,
          statusCode: code,
          mediaType,
        })
      }
    })

    oldMediaTypes.forEach((mediaType) => {
      if (!newMediaTypes.has(mediaType)) {
        changes.push({
          type: "response-content-removed",
          ...context,
          statusCode: code,
          mediaType,
        })
      }
    })
  })
}

function compareOperation(oldOperation, newOperation, changes, context) {
  const fields = OPERATION_FIELDS.filter(
    (field) => oldOperation[field] !== newOperation[field]
  )

  if (fields.length) {
    changes.push({
      type: "endpoint-modified",
      ...context,
      fields,
    })
  }

  if (
    stableStringify(oldOperation.tags || []) !==
    stableStringify(newOperation.tags || [])
  ) {
    changes.push({
      type: "endpoint-tags-changed",
      ...context,
    })
  }

  if (
    stableStringify(oldOperation.security) !==
    stableStringify(newOperation.security)
  ) {
    changes.push({
      type: "endpoint-security-changed",
      ...context,
    })
  }

  compareParameters(
    oldOperation.parameters,
    newOperation.parameters,
    changes,
    context
  )

  if (
    stableStringify(oldOperation.requestBody) !==
    stableStringify(newOperation.requestBody)
  ) {
    changes.push({
      type: "request-body-modified",
      ...context,
    })
  }

  compareResponses(
    oldOperation.responses,
    newOperation.responses,
    changes,
    context
  )
}

function comparePaths(oldSpec, newSpec, changes) {
  const oldOps = getOperationMap(oldSpec)
  const newOps = getOperationMap(newSpec)

  newOps.forEach((entry, key) => {
    if (!oldOps.has(key)) {
      changes.push({
        type: "endpoint-added",
        path: entry.path,
        method: entry.method,
        summary: entry.operation.summary,
      })
    }
  })

  oldOps.forEach((entry, key) => {
    if (!newOps.has(key)) {
      changes.push({
        type: "endpoint-removed",
        path: entry.path,
        method: entry.method,
      })
    }
  })

  oldOps.forEach((oldEntry, key) => {
    if (!newOps.has(key)) {
      return
    }

    const newEntry = newOps.get(key)
    compareOperation(oldEntry.operation, newEntry.operation, changes, {
      path: oldEntry.path,
      method: oldEntry.method,
    })
  })
}

function compareSchemaObject(name, oldSchema, newSchema, changes) {
  const oldProps = oldSchema?.properties || {}
  const newProps = newSchema?.properties || {}
  const oldPropNames = new Set(Object.keys(oldProps))
  const newPropNames = new Set(Object.keys(newProps))

  newPropNames.forEach((property) => {
    if (!oldPropNames.has(property)) {
      changes.push({ type: "schema-property-added", name, property })
    }
  })

  oldPropNames.forEach((property) => {
    if (!newPropNames.has(property)) {
      changes.push({ type: "schema-property-removed", name, property })
    }
  })

  oldPropNames.forEach((property) => {
    if (!newPropNames.has(property)) {
      return
    }

    if (
      stableStringify(oldProps[property]) !==
      stableStringify(newProps[property])
    ) {
      changes.push({ type: "schema-property-modified", name, property })
    }
  })

  const oldRequired = new Set(oldSchema?.required || [])
  const newRequired = new Set(newSchema?.required || [])

  newRequired.forEach((property) => {
    if (!oldRequired.has(property)) {
      changes.push({ type: "schema-required-added", name, property })
    }
  })

  oldRequired.forEach((property) => {
    if (!newRequired.has(property)) {
      changes.push({ type: "schema-required-removed", name, property })
    }
  })

  if (oldSchema?.type !== newSchema?.type) {
    changes.push({
      type: "schema-type-changed",
      name,
      oldValue: oldSchema?.type,
      newValue: newSchema?.type,
    })
  }
}

function compareSchemas(oldSpec, newSpec, changes) {
  const oldSchemas = getSchemas(oldSpec)
  const newSchemas = getSchemas(newSpec)
  const oldNames = new Set(Object.keys(oldSchemas))
  const newNames = new Set(Object.keys(newSchemas))

  newNames.forEach((name) => {
    if (!oldNames.has(name)) {
      changes.push({ type: "schema-added", name })
    }
  })

  oldNames.forEach((name) => {
    if (!newNames.has(name)) {
      changes.push({ type: "schema-removed", name })
    }
  })

  oldNames.forEach((name) => {
    if (!newNames.has(name)) {
      return
    }

    const oldSchema = oldSchemas[name]
    const newSchema = newSchemas[name]

    if (stableStringify(oldSchema) === stableStringify(newSchema)) {
      return
    }

    const before = changes.length
    compareSchemaObject(name, oldSchema, newSchema, changes)

    if (changes.length === before) {
      changes.push({ type: "schema-modified", name })
    }
  })
}

export function compareSpecs(oldSpec, newSpec) {
  if (!oldSpec || !newSpec) {
    return []
  }

  const changes = []

  // Operation-level comparison runs against dereferenced specs so that a change
  // to a shared schema is attributed to every endpoint that references it.
  const resolvedOldSpec = resolveRefs(oldSpec)
  const resolvedNewSpec = resolveRefs(newSpec)

  compareInfo(oldSpec, newSpec, changes)
  compareTags(oldSpec, newSpec, changes)
  compareSecurity(oldSpec, newSpec, changes)
  comparePaths(resolvedOldSpec, resolvedNewSpec, changes)
  // Schema-level comparison runs against the raw (unresolved) schemas so that
  // property-level detail stays clean and is reported once per schema.
  compareSchemas(oldSpec, newSpec, changes)

  return changes
}

export function formatChangeSummary(change) {
  switch (change.type) {
    case "info-changed":
      return `Info ${change.field} changed`
    case "tag-added":
      return `Tag "${change.name}" added`
    case "tag-removed":
      return `Tag "${change.name}" removed`
    case "security-changed":
      return "Global security requirements changed"
    case "endpoint-added":
      return `${change.method} ${change.path} added`
    case "endpoint-removed":
      return `${change.method} ${change.path} removed`
    case "endpoint-modified":
      return `${change.method} ${change.path} modified (${change.fields.join(", ")})`
    case "endpoint-tags-changed":
      return `${change.method} ${change.path}: tags changed`
    case "endpoint-security-changed":
      return `${change.method} ${change.path}: security changed`
    case "parameter-added":
      return `${change.method} ${change.path}: parameter "${change.parameter}" added (${change.location})`
    case "parameter-removed":
      return `${change.method} ${change.path}: parameter "${change.parameter}" removed (${change.location})`
    case "parameter-modified":
      return `${change.method} ${change.path}: parameter "${change.parameter}" modified (${change.fields.join(", ")})`
    case "request-body-modified":
      return `${change.method} ${change.path}: request body modified`
    case "response-added":
      return `${change.method} ${change.path}: response ${change.statusCode} added`
    case "response-removed":
      return `${change.method} ${change.path}: response ${change.statusCode} removed`
    case "response-modified":
      return `${change.method} ${change.path}: response ${change.statusCode} modified`
    case "response-content-added":
      return `${change.method} ${change.path}: response ${change.statusCode} added media type "${change.mediaType}"`
    case "response-content-removed":
      return `${change.method} ${change.path}: response ${change.statusCode} removed media type "${change.mediaType}"`
    case "schema-added":
      return `Schema "${change.name}" added`
    case "schema-removed":
      return `Schema "${change.name}" removed`
    case "schema-modified":
      return `Schema "${change.name}" modified`
    case "schema-property-added":
      return `Schema "${change.name}": property "${change.property}" added`
    case "schema-property-removed":
      return `Schema "${change.name}": property "${change.property}" removed`
    case "schema-property-modified":
      return `Schema "${change.name}": property "${change.property}" modified`
    case "schema-required-added":
      return `Schema "${change.name}": "${change.property}" is now required`
    case "schema-required-removed":
      return `Schema "${change.name}": "${change.property}" is no longer required`
    case "schema-type-changed":
      return `Schema "${change.name}": type changed (${change.oldValue} → ${change.newValue})`
    default:
      return "Unknown change"
  }
}

export const STORAGE_PREFIX = "swagger-ui-change-history"
export const SNAPSHOT_PREFIX = "swagger-ui-change-snapshot"
export const VIEWED_PREFIX = "swagger-ui-change-history-viewed"

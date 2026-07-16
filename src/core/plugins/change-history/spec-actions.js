import {
  canPersistSnapshot,
  compareSpecs,
  DEFAULT_MAX_SNAPSHOT_BYTES,
  DEFAULT_TTL_MS,
  filterHistoryByTtl,
  getStorageKey,
  hashSpec,
  isOversizedSnapshotMarker,
  SNAPSHOT_PREFIX,
  STORAGE_PREFIX,
  unwrapSnapshot,
  VIEWED_PREFIX,
  wrapOversizedSnapshotMarker,
  wrapSnapshot,
} from "./fn"

function readJson(key, fallback) {
  try {
    const value = localStorage.getItem(key)
    return value ? JSON.parse(value) : fallback
  } catch {
    return fallback
  }
}

function writeJson(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value))
    return true
  } catch (err) {
    console.warn(
      "Swagger UI: unable to persist change history to localStorage",
      err
    )
    return false
  }
}

function removeKey(key) {
  try {
    localStorage.removeItem(key)
  } catch (err) {
    console.warn(
      "Swagger UI: unable to remove change history from localStorage",
      err
    )
  }
}

function getHistoryStorageKey(storageKey) {
  return `${STORAGE_PREFIX}:${storageKey}`
}

function getSnapshotStorageKey(storageKey) {
  return `${SNAPSHOT_PREFIX}:${storageKey}`
}

function getViewedStorageKey(storageKey) {
  return `${VIEWED_PREFIX}:${storageKey}`
}

function clearPersistedHistory(storageKey) {
  removeKey(getHistoryStorageKey(storageKey))
  removeKey(getSnapshotStorageKey(storageKey))
  removeKey(getViewedStorageKey(storageKey))
}

export const recordSpecLoad = () => (system) => {
  const {
    specSelectors,
    changeHistoryActions,
    changeHistorySelectors,
    getConfigs,
  } = system
  const configs = getConfigs()

  if (configs.changeHistory === false) {
    return
  }

  const spec = specSelectors.specJS()
  if (!spec || !Object.keys(spec).length) {
    return
  }

  const url = specSelectors.url()
  const storageKey = getStorageKey(url, spec)
  const specHash = hashSpec(spec)
  const maxEntries = configs.changeHistoryMaxEntries || 20
  const maxSnapshotBytes =
    configs.changeHistoryMaxSnapshotBytes ?? DEFAULT_MAX_SNAPSHOT_BYTES
  const ttlMs = configs.changeHistoryTtlMs ?? DEFAULT_TTL_MS
  const now = Date.now()

  changeHistoryActions.setStorageKey(storageKey)

  const historyKey = getHistoryStorageKey(storageKey)
  const snapshotKey = getSnapshotStorageKey(storageKey)
  const viewedKey = getViewedStorageKey(storageKey)

  const existingHistory = filterHistoryByTtl(
    readJson(historyKey, []),
    ttlMs,
    now
  )
  const rawSnapshot = readJson(snapshotKey, null)
  const previousSnapshotPayload = unwrapSnapshot(rawSnapshot, {
    ttlMs,
    now,
  })
  const previousSnapshot = previousSnapshotPayload
    ? previousSnapshotPayload.spec
    : null
  const lastViewedAt = readJson(viewedKey, 0)
  const oversizedMarker = isOversizedSnapshotMarker(rawSnapshot, {
    ttlMs,
    now,
  })

  // Drop expired / invalid snapshot payloads from disk
  if (rawSnapshot && !previousSnapshotPayload && !oversizedMarker) {
    removeKey(snapshotKey)
  }

  if (
    (previousSnapshot && hashSpec(previousSnapshot) === specHash) ||
    (oversizedMarker && rawSnapshot.specHash === specHash)
  ) {
    changeHistoryActions.setHistory(existingHistory)
    changeHistoryActions.setUnseenChanges(
      existingHistory.some((entry) => entry.timestamp > lastViewedAt)
    )
    // Keep history pruned on disk even when the snapshot is unchanged
    writeJson(historyKey, existingHistory)
    return
  }

  let changes = []

  if (previousSnapshot) {
    changes = compareSpecs(previousSnapshot, spec)
  }

  if (!previousSnapshot || changes.length) {
    const entry = {
      id: `${now}`,
      timestamp: now,
      version: spec?.info?.version || null,
      title: spec?.info?.title || null,
      specHash,
      changes,
      isBaseline: !previousSnapshot,
    }

    const nextHistory = [entry, ...existingHistory].slice(0, maxEntries)
    writeJson(historyKey, nextHistory)

    if (canPersistSnapshot(spec, maxSnapshotBytes, now)) {
      writeJson(snapshotKey, wrapSnapshot(spec, now))
    } else {
      console.warn(
        "Swagger UI: change-history snapshot exceeds size limit; skipping localStorage snapshot persistence"
      )
      // Keep a tiny marker so we do not re-baseline on every reload
      writeJson(snapshotKey, wrapOversizedSnapshotMarker(specHash, now))
    }

    changeHistoryActions.setHistory(nextHistory)

    if (changes.length) {
      const isPanelOpen = changeHistorySelectors.isPanelOpen()
      changeHistoryActions.setUnseenChanges(!isPanelOpen)
    }
  } else {
    changeHistoryActions.setHistory(existingHistory)
    writeJson(historyKey, existingHistory)
  }
}

export const restoreHistory = () => (system) => {
  const { changeHistoryActions, changeHistorySelectors, getConfigs } = system
  const configs = getConfigs()

  if (configs.changeHistory === false) {
    return
  }

  const storageKey = changeHistorySelectors.storageKey()
  if (!storageKey) {
    return
  }

  const ttlMs = configs.changeHistoryTtlMs ?? DEFAULT_TTL_MS
  const now = Date.now()
  const historyKey = getHistoryStorageKey(storageKey)
  const snapshotKey = getSnapshotStorageKey(storageKey)
  const viewedKey = getViewedStorageKey(storageKey)
  const existingHistory = filterHistoryByTtl(
    readJson(historyKey, []),
    ttlMs,
    now
  )
  const lastViewedAt = readJson(viewedKey, 0)
  const rawSnapshot = readJson(snapshotKey, null)

  if (
    rawSnapshot &&
    !unwrapSnapshot(rawSnapshot, { ttlMs, now }) &&
    !isOversizedSnapshotMarker(rawSnapshot, { ttlMs, now })
  ) {
    removeKey(snapshotKey)
  }

  // Persist pruned history so expired entries don't linger
  writeJson(historyKey, existingHistory)

  changeHistoryActions.setHistory(existingHistory)
  changeHistoryActions.setUnseenChanges(
    existingHistory.some((entry) => entry.timestamp > lastViewedAt)
  )
}

export const togglePanel = () => (system) => {
  const { changeHistoryActions, changeHistorySelectors } = system
  const isOpen = changeHistorySelectors.isPanelOpen()

  if (isOpen) {
    changeHistoryActions.setPanelOpen(false)
    return
  }

  changeHistoryActions.setPanelOpen(true)
  changeHistoryActions.markAsViewed()
}

export const markAsViewed = () => (system) => {
  const { changeHistoryActions, changeHistorySelectors } = system
  const storageKey = changeHistorySelectors.storageKey()

  if (!storageKey) {
    return
  }

  const viewedKey = getViewedStorageKey(storageKey)
  writeJson(viewedKey, Date.now())
  changeHistoryActions.setUnseenChanges(false)
}

export const clearHistory = () => (system) => {
  const { changeHistoryActions, changeHistorySelectors } = system
  const storageKey = changeHistorySelectors.storageKey()

  if (!storageKey) {
    return
  }

  clearPersistedHistory(storageKey)

  changeHistoryActions.setHistory([])
  changeHistoryActions.setUnseenChanges(false)
}

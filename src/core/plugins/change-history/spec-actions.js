import {
  compareSpecs,
  getStorageKey,
  hashSpec,
  SNAPSHOT_PREFIX,
  STORAGE_PREFIX,
  VIEWED_PREFIX,
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
  localStorage.setItem(key, JSON.stringify(value))
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

  changeHistoryActions.setStorageKey(storageKey)

  const historyKey = getHistoryStorageKey(storageKey)
  const snapshotKey = getSnapshotStorageKey(storageKey)
  const viewedKey = getViewedStorageKey(storageKey)

  const existingHistory = readJson(historyKey, [])
  const previousSnapshot = readJson(snapshotKey, null)
  const lastViewedAt = readJson(viewedKey, 0)

  if (previousSnapshot && hashSpec(previousSnapshot) === specHash) {
    changeHistoryActions.setHistory(existingHistory)
    changeHistoryActions.setUnseenChanges(
      existingHistory.some((entry) => entry.timestamp > lastViewedAt)
    )
    return
  }

  let changes = []

  if (previousSnapshot) {
    changes = compareSpecs(previousSnapshot, spec)
  }

  if (!previousSnapshot || changes.length) {
    const entry = {
      id: `${Date.now()}`,
      timestamp: Date.now(),
      version: spec?.info?.version || null,
      title: spec?.info?.title || null,
      specHash,
      changes,
      isBaseline: !previousSnapshot,
    }

    const nextHistory = [entry, ...existingHistory].slice(0, maxEntries)
    writeJson(historyKey, nextHistory)
    writeJson(snapshotKey, spec)

    changeHistoryActions.setHistory(nextHistory)

    if (changes.length) {
      const isPanelOpen = changeHistorySelectors.isPanelOpen()
      changeHistoryActions.setUnseenChanges(!isPanelOpen)
    }
  } else {
    changeHistoryActions.setHistory(existingHistory)
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

  const historyKey = getHistoryStorageKey(storageKey)
  const viewedKey = getViewedStorageKey(storageKey)
  const existingHistory = readJson(historyKey, [])
  const lastViewedAt = readJson(viewedKey, 0)

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

  localStorage.removeItem(getHistoryStorageKey(storageKey))
  localStorage.removeItem(getSnapshotStorageKey(storageKey))
  localStorage.removeItem(getViewedStorageKey(storageKey))

  changeHistoryActions.setHistory([])
  changeHistoryActions.setUnseenChanges(false)
}

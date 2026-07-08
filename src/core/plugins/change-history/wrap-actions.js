export const updateJsonSpec =
  (ori, system) =>
  (...args) => {
    const result = ori(...args)

    setTimeout(() => {
      system.changeHistoryActions.recordSpecLoad()
    }, 0)

    return result
  }

export const loaded =
  (ori, system) =>
  (...args) => {
    const result = ori(...args)

    setTimeout(() => {
      system.changeHistoryActions.restoreHistory()
    }, 0)

    return result
  }

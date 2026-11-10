/**
 * @prettier
 */
import { Map } from "immutable"

interface Action {
  type: string
  [key: string]: unknown
}

type ImmutableReducer = (
  state: Map<string, unknown> | undefined,
  action: Action
) => Map<string, unknown>

/**
 * Combines multiple reducers that operate on Immutable.js Map state.
 * This is a replacement for the deprecated `redux-immutable` package.
 */
export function combineReducers(
  reducers: Record<string, ImmutableReducer>
): ImmutableReducer {
  return (
    state: Map<string, unknown> = Map(),
    action: Action
  ): Map<string, unknown> => {
    return Object.keys(reducers).reduce((nextState, key) => {
      const reducer = reducers[key]
      const previousStateForKey = nextState.get(key) as
        | Map<string, unknown>
        | undefined
      const nextStateForKey = reducer(previousStateForKey, action)
      return nextState.set(key, nextStateForKey)
    }, state)
  }
}

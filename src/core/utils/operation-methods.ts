/**
 * Fixed Path Item operation fields (OAS 3.2 adds `query`).
 */
export const OPERATION_METHODS = [
  "get",
  "put",
  "post",
  "delete",
  "options",
  "head",
  "patch",
  "trace",
  "query",
] as const

export type OperationMethod = (typeof OPERATION_METHODS)[number]

const fixedMethods: readonly string[] = OPERATION_METHODS

/**
 * Exact match: is this Path Item key a fixed operation field?
 * Path Item keys are lowercase field names, so `additionalOperations`,
 * `summary`, `parameters`, etc. are rejected.
 */
export const isOperationMethodField = (key: unknown): key is OperationMethod =>
  typeof key === "string" && fixedMethods.includes(key)

/**
 * Case-insensitive: does an `additionalOperations` key duplicate a fixed field?
 * Such entries (e.g. `POST`, `Head`) are invalid per OAS 3.2 and must be ignored.
 */
export const isFixedOperationMethod = (method: unknown): boolean =>
  fixedMethods.includes(String(method).toLowerCase())
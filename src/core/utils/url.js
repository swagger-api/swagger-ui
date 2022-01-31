export function isAbsoluteUrl(url) {
  return url.match(/^(?:[a-z]+:)?\/\//i) // Matches http://, HTTP://, https://, ftp://, //example.com,
}

export function addProtocol(url) {
  if (!url.match(/^\/\//i)) return url // Checks if protocol is missing e.g. //example.com

  return `${window.location.protocol}${url}`
}

export function buildBaseUrl(selectedServer, specUrl) {
  if (!selectedServer) return specUrl
  if (isAbsoluteUrl(selectedServer)) return addProtocol(selectedServer)

  return new URL(selectedServer, specUrl).href
}

export function buildUrl(url, specUrl, { selectedServer="" } = {}) {
  if (!url) return undefined
  if (isAbsoluteUrl(url)) return url

  const baseUrl = buildBaseUrl(selectedServer, specUrl)
  if (!isAbsoluteUrl(baseUrl)) {
    return new URL(url, window.location.href).href
  }
  return new URL(url, baseUrl).href
}

/**
 * Safe version of buildUrl function. `selectedServer` can contain server variables
 * which can fail the URL resolution.
 */
export function safeBuildUrl(url, specUrl, { selectedServer="" } = {}) {
  try {
    return buildUrl(url, specUrl, { selectedServer })
  } catch {
    return undefined
  }
}

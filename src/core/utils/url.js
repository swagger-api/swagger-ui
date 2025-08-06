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

export function sanitizeUrl(url) {
  if (typeof url !== "string" || url.trim() === "") {
    return ""
  }

  const urlTrimmed = url.trim()
  const blankURL = "about:blank"

  try {
    const base = `https://base${String(Math.random()).slice(2)}`
    const urlObject = new URL(urlTrimmed, base)
    const scheme = urlObject.protocol.slice(0, -1)

    // check for invalid schemes
    if (["javascript", "data", "vbscript"].includes(scheme.toLowerCase())) {
      return blankURL
    }

    // return sanitized URI reference
    if (urlObject.origin === base) {
      if (urlTrimmed.startsWith("/")) {
        return `${urlObject.pathname}${urlObject.search}${urlObject.hash}`
      }
    
      if (urlTrimmed.startsWith("./")) {
        return `.${urlObject.pathname}${urlObject.search}${urlObject.hash}`
      }
    
      if (urlTrimmed.startsWith("../")) {
        return `..${urlObject.pathname}${urlObject.search}${urlObject.hash}`
      }
    
      return `${urlObject.pathname.substring(1)}${urlObject.search}${urlObject.hash}`
    }

    return String(urlObject)
  } catch {
    return blankURL
  }
}


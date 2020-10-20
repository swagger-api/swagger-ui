export function isAbsoluteUrl(url) {
  return url.match(/^(?:[a-z]+:)?\/\//i) // Matches http://, HTTP://, https://, ftp://, //example.com,
}

export function addProtocol(url) {
  if(!url.match(/^\/\//i)) return url // Checks if protocol is missing e.g. //example.com
  return `${window.location.protocol}${url}`
}

export function buildBaseUrl(selectedServer, specUrl) {
  if(!selectedServer) return specUrl
  if(isAbsoluteUrl(selectedServer)) return addProtocol(selectedServer)
  
  return new URL(selectedServer, specUrl).href    
}

export function buildUrl(url, specUrl, { selectedServer="" } = {}) {  
  if(!url) return
  if(isAbsoluteUrl(url)) return url

  const baseUrl = buildBaseUrl(selectedServer, specUrl)
  return new URL(url, baseUrl).href
}

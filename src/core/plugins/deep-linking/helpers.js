export const setHash = (value) => {
  if(value) {
    return history.pushState(null, null, `#${value}`)
  } else {
    return window.location.hash = ""
  }
}



const makeDeeplinks = (rootNode) => {
  /**
    Converts an element's qualified descendants into deep links. A qualified
    descendant is an anchor element whose href attribute is assigned the hash of an
    operation or tag, and whose name attribute is assigned `deeplink`. A qualified
    descendant becomes a deep link when it can dispatch a deeplinkClick event whenever
    the descendant is clicked.

    Arguments:
      a) rootNode: element object

**/
  const callback = function() {
    const deeplinks = rootNode.querySelectorAll("[name=deeplink]")
    if (deeplinks.length === 0) return
    deeplinks.forEach((link) => {
        link.addEventListener("click", function(event) {
            event.preventDefault()
            window.location.hash = event.target.getAttribute("href")
            const deeplinkClickEvent = new Event("deeplinkClick", {bubbles: true})
            link.dispatchEvent(deeplinkClickEvent)
        })
    })
  }
  //Wait for the tree to be full created before making deeplinks
  setTimeout(callback, 2000)
}


export { setHash, makeDeeplinks }

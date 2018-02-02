const setHash = (value) => {
  if(value) {
    return history.pushState(null, null, `#${value}`)
  } else {
    return window.location.hash = ""
  }
}

const makeDeeplinks = (rootNode) => {
  /**
      Given an element instance, some of its descendant anchor elements
      are converted into deeplinks. Atleast in the context of implemenation,
      a deeplink is any anchor element that dispatches a deeplink click event
      when it is clicked.
  **/
  const callback = function() {
    const deeplinks = rootNode.querySelectorAll("[name=deeplink]")
    if (deeplinks.length === 0) return
    deeplinks.forEach((link) => {
        link.addEventListener("click", function() {
            const deeplinkClickEvent = new Event("deeplinkClick", {bubbles: true})
            link.dispatchEvent(deeplinkClickEvent)
        })
    })
  }
  //Wait for the tree to be full created before making deeplinks
  setTimeout(callback, 2000)
}


export { setHash, makeDeeplinks }

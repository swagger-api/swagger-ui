const setHash = (value) => {
  if(value) {
    return history.pushState(null, null, `#${value}`)
  } else {
    return window.location.hash = ""
  }
}

const makeDeeplinkClickEvent = () => {
  const createEvent = function() {
    var deeplinks = document.querySelectorAll("[name=deeplink]")
    if (deeplinks.length === 0) return
    deeplinks.forEach((link) => {
        link.addEventListener("click", function() {
            const deeplinkClickEvent = new Event("deeplinkClick", {bubbles: true})
            link.dispatchEvent(deeplinkClickEvent)
        })
    })
  }
  setTimeout(createEvent, 2000)
}



export {setHash, makeDeeplinkClickEvent}

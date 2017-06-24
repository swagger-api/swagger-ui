function makeWindow() {
  var win = {
    location: {},
    history: {},
    open: () => {},
    close: () => {},
    File: function() {}
  }

  if(typeof window === "undefined") {
    return win
  }

  try {
    win = window
    var props = ["File", "Blob", "FormData"]
    for (var prop of props) {
      if (prop in window) {
        win[prop] = window[prop]
      }
    }
  } catch( e ) {
    console.error(e)
  }

  return win
}

module.exports = makeWindow()

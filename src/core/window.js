function makeWindow() {
  var win = {
    location: {
      href: "https://example.com/apis/swagger-api/petstore/1.0.0#/pet/addPet"
    },
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
    var props = ["File", "Blob", "FormData", "location"]
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

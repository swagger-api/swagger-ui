var win = {
  location: {},
  history: {},
  open: () => {},
  close: () => {}
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

export default win

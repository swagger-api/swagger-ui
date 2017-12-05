// Promise global, Used ( at least ) by 'whatwg-fetch'. And required by IE 11

if(!window.Promise) {
  require("core-js/fn/promise")
}

// Required by IE 11
if(!String.prototype.startsWith) {
  require("core-js/es6/string")
}

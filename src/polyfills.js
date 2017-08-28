// Promise global, Used ( at least ) by 'whatwg-fetch'. And required by IE 11

if(!window.Promise) {
  require("core-js/fn/promise")
}

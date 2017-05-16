import get from "lodash/get"

export function transformPathToArray(property, jsSpec) {
  if(property.slice(0,9) === "instance.") {
    var str = property.slice(9)
  } else { // eslint-disable-next-line no-redeclare
    var str = property
  }

  var pathArr = []

  str
    .split(".")
    .map(item => {
      // "key[0]" becomes ["key", "0"]
      if(item.includes("[")) {
        let index = parseInt(item.match(/\[(.*)\]/)[1])
        let keyName = item.slice(0, item.indexOf("["))
        return [keyName, index.toString()]
      } else {
        return item
      }
    })
    .reduce(function(a, b) {
      // flatten!
      return a.concat(b)
    }, [])
    .concat([""]) // add an empty item into the array, so we don't get stuck with something in our buffer below
    .reduce((buffer, curr) => {
      let obj = pathArr.length ? get(jsSpec, pathArr) : jsSpec

      if(get(obj, makeAccessArray(buffer, curr))) {
        if(buffer.length) {
          pathArr.push(buffer)
        }
        if(curr.length) {
          pathArr.push(curr)
        }
        return ""
      } else {
        // attach key to buffer
        return `${buffer}${buffer.length ? "." : ""}${curr}`
      }
    }, "")

  if(typeof get(jsSpec, pathArr) !== "undefined") {
    return pathArr
  } else {
    // if our path is not correct (there is no value at the path),
    // return null
    return null
  }
}

function makeAccessArray(buffer, curr) {
  let arr = []

  if(buffer.length) {
    arr.push(buffer)
  }

  if(curr.length) {
    arr.push(curr)
  }

  return arr
}

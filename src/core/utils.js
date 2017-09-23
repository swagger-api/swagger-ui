import Im from "immutable"

import camelCase from "lodash/camelCase"
import upperFirst from "lodash/upperFirst"
import _memoize from "lodash/memoize"
import find from "lodash/find"
import some from "lodash/some"
import eq from "lodash/eq"
import { memoizedSampleFromSchema, memoizedCreateXMLExample } from "core/plugins/samples/fn"
import win from "./window"
import cssEscape from "css.escape"

const DEFAULT_REPONSE_KEY = "default"

export const isImmutable = (maybe) => Im.Iterable.isIterable(maybe)

export function isJSONObject (str) {
  try {
    var o = JSON.parse(str)

    // Handle non-exception-throwing cases:
    // Neither JSON.parse(false) or JSON.parse(1234) throw errors, hence the type-checking,
    // but... JSON.parse(null) returns null, and typeof null === "object",
    // so we must check for that, too. Thankfully, null is falsey, so this suffices:
    if (o && typeof o === "object") {
      return o
    }
  }
  catch (e) {
    // do nothing
  }

  return false
}

export function objectify (thing) {
  if(!isObject(thing))
    return {}
  if(isImmutable(thing))
    return thing.toObject()
  return thing
}

export function arrayify (thing) {
  if(!thing)
    return []

  if(thing.toArray)
    return thing.toArray()

  return normalizeArray(thing)
}

export function fromJSOrdered (js) {
  if(isImmutable(js))
    return js // Can't do much here

  if (js instanceof win.File)
    return js

  return !isObject(js) ? js :
    Array.isArray(js) ?
      Im.Seq(js).map(fromJSOrdered).toList() :
      Im.OrderedMap(js).map(fromJSOrdered)
}

export function bindToState(obj, state) {
	var newObj = {}
	Object.keys(obj)
  .filter(key => typeof obj[key] === "function")
  .forEach(key => newObj[key] = obj[key].bind(null, state))
	return newObj
}

export function normalizeArray(arr) {
  if(Array.isArray(arr))
    return arr
  return [arr]
}

export function isFn(fn) {
  return typeof fn === "function"
}

export function isObject(obj) {
  return !!obj && typeof obj === "object"
}

export function isFunc(thing) {
  return typeof(thing) === "function"
}

export function isArray(thing) {
  return Array.isArray(thing)
}

// I've changed memoize libs more than once, so I'm using this a way to make that simpler
export const memoize = _memoize

export function objMap(obj, fn) {
  return Object.keys(obj).reduce((newObj, key) => {
    newObj[key] = fn(obj[key], key)
    return newObj
  }, {})
}

export function objReduce(obj, fn) {
  return Object.keys(obj).reduce((newObj, key) => {
    let res = fn(obj[key], key)
    if(res && typeof res === "object")
      Object.assign(newObj, res)
    return newObj
  }, {})
}

// Redux middleware that exposes the system to async actions (like redux-thunk, but with out system instead of (dispatch, getState)
export function systemThunkMiddleware(getSystem) {
  return ({ dispatch, getState }) => { // eslint-disable-line no-unused-vars
    return next => action => {
      if (typeof action === "function") {
        return action(getSystem())
      }

      return next(action)
    }
  }
}

export const errorLog = getSystem => () => next => action => {
  try{
    next( action )
  }
  catch( e ) {
    getSystem().errActions.newThrownErr( e, action )
  }
}

export function defaultStatusCode ( responses ) {
  let codes = responses.keySeq()
  return codes.contains(DEFAULT_REPONSE_KEY) ? DEFAULT_REPONSE_KEY : codes.filter( key => (key+"")[0] === "2").sort().first()
}


/**
 * Returns an Immutable List, safely
 * @param {Immutable.Iterable} iterable the iterable to get the key from
 * @param {String|[String]} key either an array of keys, or a single key
 * @returns {Immutable.List} either iterable.get(keys) or an empty Immutable.List
 */
export function getList(iterable, keys) {
  if(!Im.Iterable.isIterable(iterable)) {
    return Im.List()
  }
  let val = iterable.getIn(Array.isArray(keys) ? keys : [keys])
  return Im.List.isList(val) ? val : Im.List()
}

// Adapted from http://stackoverflow.com/a/2893259/454004
// Note: directly ported from CoffeeScript
export function formatXml (xml) {
  var contexp, fn, formatted, indent, l, lastType, len, lines, ln, reg, transitions, wsexp
  reg = /(>)(<)(\/*)/g
  wsexp = /[ ]*(.*)[ ]+\n/g
  contexp = /(<.+>)(.+\n)/g
  xml = xml.replace(/\r\n/g, "\n").replace(reg, "$1\n$2$3").replace(wsexp, "$1\n").replace(contexp, "$1\n$2")
  formatted = ""
  lines = xml.split("\n")
  indent = 0
  lastType = "other"
  transitions = {
    "single->single": 0,
    "single->closing": -1,
    "single->opening": 0,
    "single->other": 0,
    "closing->single": 0,
    "closing->closing": -1,
    "closing->opening": 0,
    "closing->other": 0,
    "opening->single": 1,
    "opening->closing": 0,
    "opening->opening": 1,
    "opening->other": 1,
    "other->single": 0,
    "other->closing": -1,
    "other->opening": 0,
    "other->other": 0
  }
  fn = function(ln) {
    var fromTo, key, padding, type, types, value
    types = {
      single: Boolean(ln.match(/<.+\/>/)),
      closing: Boolean(ln.match(/<\/.+>/)),
      opening: Boolean(ln.match(/<[^!?].*>/))
    }
    type = ((function() {
      var results
      results = []
      for (key in types) {
        value = types[key]
        if (value) {
          results.push(key)
        }
      }
      return results
    })())[0]
    type = type === void 0 ? "other" : type
    fromTo = lastType + "->" + type
    lastType = type
    padding = ""
    indent += transitions[fromTo]
    padding = ((function() {
      /* eslint-disable no-unused-vars */
      var m, ref1, results, j
      results = []
      for (j = m = 0, ref1 = indent; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
        results.push("  ")
      }
      /* eslint-enable no-unused-vars */
      return results
    })()).join("")
    if (fromTo === "opening->closing") {
      formatted = formatted.substr(0, formatted.length - 1) + ln + "\n"
    } else {
      formatted += padding + ln + "\n"
    }
  }
  for (l = 0, len = lines.length; l < len; l++) {
    ln = lines[l]
    fn(ln)
  }
  return formatted
}


/**
 * Adapted from http://github.com/asvd/microlight
 * @copyright 2016 asvd <heliosframework@gmail.com>
 */
export function highlight (el) {
  const MAX_LENGTH = 5000
  var
    _document = document,
    appendChild = "appendChild",
    test = "test"

  if (!el) return ""
  if (el.textContent.length > MAX_LENGTH) { return el.textContent }

  var reset = function(el) {
    var text = el.textContent,
      pos = 0, // current position
      next1 = text[0], // next character
      chr = 1, // current character
      prev1, // previous character
      prev2, // the one before the previous
      token = // current token content
        el.innerHTML = "", // (and cleaning the node)

    // current token type:
    //  0: anything else (whitespaces / newlines)
    //  1: operator or brace
    //  2: closing braces (after which '/' is division not regex)
    //  3: (key)word
    //  4: regex
    //  5: string starting with "
    //  6: string starting with '
    //  7: xml comment  <!-- -->
    //  8: multiline comment /* */
    //  9: single-line comment starting with two slashes //
    // 10: single-line comment starting with hash #
      tokenType = 0,

    // kept to determine between regex and division
      lastTokenType,
    // flag determining if token is multi-character
      multichar,
      node

    // running through characters and highlighting
    while (prev2 = prev1,
      // escaping if needed (with except for comments)
      // pervious character will not be therefore
      // recognized as a token finalize condition
      prev1 = tokenType < 7 && prev1 == "\\" ? 1 : chr
      ) {
      chr = next1
      next1=text[++pos]
      multichar = token.length > 1

      // checking if current token should be finalized
      if (!chr || // end of content
          // types 9-10 (single-line comments) end with a
          // newline
        (tokenType > 8 && chr == "\n") ||
        [ // finalize conditions for other token types
          // 0: whitespaces
          /\S/[test](chr), // merged together
          // 1: operators
          1, // consist of a single character
          // 2: braces
          1, // consist of a single character
          // 3: (key)word
          !/[$\w]/[test](chr),
          // 4: regex
          (prev1 == "/" || prev1 == "\n") && multichar,
          // 5: string with "
          prev1 == "\"" && multichar,
          // 6: string with '
          prev1 == "'" && multichar,
          // 7: xml comment
          text[pos-4]+prev2+prev1 == "-->",
          // 8: multiline comment
          prev2+prev1 == "*/"
        ][tokenType]
      ) {
        // appending the token to the result
        if (token) {
          // remapping token type into style
          // (some types are highlighted similarly)
          el[appendChild](
            node = _document.createElement("span")
          ).setAttribute("style", [
            // 0: not formatted
            "color: #555; font-weight: bold;",
            // 1: keywords
            "",
            // 2: punctuation
            "",
            // 3: strings and regexps
            "color: #555;",
            // 4: comments
            ""
          ][
            // not formatted
            !tokenType ? 0 :
              // punctuation
              tokenType < 3 ? 2 :
                // comments
                tokenType > 6 ? 4 :
                  // regex and strings
                  tokenType > 3 ? 3 :
                    // otherwise tokenType == 3, (key)word
                    // (1 if regexp matches, 0 otherwise)
                    + /^(a(bstract|lias|nd|rguments|rray|s(m|sert)?|uto)|b(ase|egin|ool(ean)?|reak|yte)|c(ase|atch|har|hecked|lass|lone|ompl|onst|ontinue)|de(bugger|cimal|clare|f(ault|er)?|init|l(egate|ete)?)|do|double|e(cho|ls?if|lse(if)?|nd|nsure|num|vent|x(cept|ec|p(licit|ort)|te(nds|nsion|rn)))|f(allthrough|alse|inal(ly)?|ixed|loat|or(each)?|riend|rom|unc(tion)?)|global|goto|guard|i(f|mp(lements|licit|ort)|n(it|clude(_once)?|line|out|stanceof|t(erface|ernal)?)?|s)|l(ambda|et|ock|ong)|m(icrolight|odule|utable)|NaN|n(amespace|ative|ext|ew|il|ot|ull)|o(bject|perator|r|ut|verride)|p(ackage|arams|rivate|rotected|rotocol|ublic)|r(aise|e(adonly|do|f|gister|peat|quire(_once)?|scue|strict|try|turn))|s(byte|ealed|elf|hort|igned|izeof|tatic|tring|truct|ubscript|uper|ynchronized|witch)|t(emplate|hen|his|hrows?|ransient|rue|ry|ype(alias|def|id|name|of))|u(n(checked|def(ined)?|ion|less|signed|til)|se|sing)|v(ar|irtual|oid|olatile)|w(char_t|hen|here|hile|ith)|xor|yield)$/[test](token)
            ])

          node[appendChild](_document.createTextNode(token))
        }

        // saving the previous token type
        // (skipping whitespaces and comments)
        lastTokenType =
          (tokenType && tokenType < 7) ?
            tokenType : lastTokenType

        // initializing a new token
        token = ""

        // determining the new token type (going up the
        // list until matching a token type start
        // condition)
        tokenType = 11
        while (![
          1, //  0: whitespace
                               //  1: operator or braces
          /[\/{}[(\-+*=<>:;|\\.,?!&@~]/[test](chr), // eslint-disable-line no-useless-escape
          /[\])]/[test](chr), //  2: closing brace
          /[$\w]/[test](chr), //  3: (key)word
          chr == "/" && //  4: regex
            // previous token was an
            // opening brace or an
            // operator (otherwise
            // division, not a regex)
          (lastTokenType < 2) &&
            // workaround for xml
            // closing tags
          prev1 != "<",
          chr == "\"", //  5: string with "
          chr == "'", //  6: string with '
                               //  7: xml comment
          chr+next1+text[pos+1]+text[pos+2] == "<!--",
          chr+next1 == "/*", //  8: multiline comment
          chr+next1 == "//", //  9: single-line comment
          chr == "#" // 10: hash-style comment
        ][--tokenType]);
      }

      token += chr
    }
  }

  return reset(el)
}

/**
 * Take an immutable map, and convert to a list.
 * Where the keys are merged with the value objects
 * @param {Immutable.Map} map, the map to convert
 * @param {String} key the key to use, when merging the `key`
 * @returns {Immutable.List}
 */
export function mapToList(map, keyNames="key", collectedKeys=Im.Map()) {
  if(!Im.Map.isMap(map) || !map.size) {
    return Im.List()
  }

  if(!Array.isArray(keyNames)) {
    keyNames = [ keyNames ]
  }

  if(keyNames.length < 1) {
    return map.merge(collectedKeys)
  }

  // I need to avoid `flatMap` from merging in the Maps, as well as the lists
  let list = Im.List()
  let keyName = keyNames[0]
  for(let entry of map.entries()) {
    let [key, val] = entry
    let nextList = mapToList(val, keyNames.slice(1), collectedKeys.set(keyName, key))
    if(Im.List.isList(nextList)) {
      list = list.concat(nextList)
    } else {
      list = list.push(nextList)
    }
  }

  return list
}

// PascalCase, aka UpperCamelCase
export function pascalCase(str) {
  return upperFirst(camelCase(str))
}

// Remove the ext of a filename, and pascalCase it
export function pascalCaseFilename(filename) {
  return pascalCase(filename.replace(/\.[^./]*$/, ""))
}

// Check if ...
// - new props
// - If immutable, use .is()
// - if in explicit objectList, then compare using _.eq
// - else use ===
export const propChecker = (props, nextProps, objectList=[], ignoreList=[]) => {

  if(Object.keys(props).length !== Object.keys(nextProps).length) {
    return true
  }

  return (
    some(props, (a, name) => {
      if(ignoreList.includes(name)) {
        return false
      }
      let b = nextProps[name]

      if(Im.Iterable.isIterable(a)) {
        return !Im.is(a,b)
      }

      // Not going to compare objects
      if(typeof a === "object" && typeof b === "object") {
        return false
      }

      return a !== b
    })
    || objectList.some( objectPropName => !eq(props[objectPropName], nextProps[objectPropName])))
}

export const validateNumber = ( val ) => {
  if (!/^-?\d+(\.?\d+)?$/.test(val)) {
    return "Value must be a number"
  }
}

export const validateInteger = ( val ) => {
  if (!/^-?\d+$/.test(val)) {
    return "Value must be an integer"
  }
}

export const validateFile = ( val ) => {
  if ( val && !(val instanceof win.File) ) {
    return "Value must be a file"
  }
}

export const validateBoolean = ( val ) => {
  if ( !(val === "true" || val === "false" || val === true || val === false) ) {
    return "Value must be a boolean"
  }
}

export const validateString = ( val ) => {
  if ( val && typeof val !== "string" ) {
    return "Value must be a string"
  }
}

export const validateDateTime = (val) => {
    if (isNaN(Date.parse(val))) {
        return "Value must be a DateTime"
    }
}

export const validateGuid = (val) => {
    if (!/^[{(]?[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}[)}]?$/.test(val)) {
        return "Value must be a Guid"
    }
}

// validation of parameters before execute
export const validateParam = (param, isXml) => {
  let errors = []
  let value = isXml && param.get("in") === "body" ? param.get("value_xml") : param.get("value")
  let required = param.get("required")
  let type = param.get("type")
  let format = param.get("format")

  /*
    If the parameter is required OR the parameter has a value (meaning optional, but filled in)
    then we should do our validation routine.
    Only bother validating the parameter if the type was specified.
  */
  if ( type && (required || value) ) {
    // These checks should evaluate to true if the parameter's value is valid
    let stringCheck = type === "string" && value && !validateString(value)
    let arrayCheck = type === "array" && Array.isArray(value) && value.length
    let listCheck = type === "array" && Im.List.isList(value) && value.count()
    let fileCheck = type === "file" && value instanceof win.File
    let booleanCheck = type === "boolean" && !validateBoolean(value)
    let numberCheck = type === "number" && !validateNumber(value) // validateNumber returns undefined if the value is a number
    let integerCheck = type === "integer" && !validateInteger(value) // validateInteger returns undefined if the value is an integer

    if ( required && !(stringCheck || arrayCheck || listCheck || fileCheck || booleanCheck || numberCheck || integerCheck) ) {
      errors.push("Required field is not provided")
      return errors
    }

    if ( type === "string" ) {
      let err
      if (format === "date-time") {
          err = validateDateTime(value)
      } else if (format === "uuid") {
          err = validateGuid(value)
      } else {
          err = validateString(value)
      }
      if (!err) return errors
      errors.push(err)
    } else if ( type === "boolean" ) {
      let err = validateBoolean(value)
      if (!err) return errors
      errors.push(err)
    } else if ( type === "number" ) {
      let err = validateNumber(value)
      if (!err) return errors
      errors.push(err)
    } else if ( type === "integer" ) {
      let err = validateInteger(value)
      if (!err) return errors
      errors.push(err)
    } else if ( type === "array" ) {
      let itemType

      if ( !value.count() ) { return errors }

      itemType = param.getIn(["items", "type"])

      value.forEach((item, index) => {
        let err

        if (itemType === "number") {
          err = validateNumber(item)
        } else if (itemType === "integer") {
          err = validateInteger(item)
        } else if (itemType === "string") {
          err = validateString(item)
        }

        if ( err ) {
          errors.push({ index: index, error: err})
        }
      })
    } else if ( type === "file" ) {
      let err = validateFile(value)
      if (!err) return errors
      errors.push(err)
    }
  }

  return errors
}

export const getSampleSchema = (schema, contentType="", config={}) => {
  if (/xml/.test(contentType)) {
    if (!schema.xml || !schema.xml.name) {
      schema.xml = schema.xml || {}

      if (schema.$$ref) {
        let match = schema.$$ref.match(/\S*\/(\S+)$/)
        schema.xml.name = match[1]
      } else if (schema.type || schema.items || schema.properties || schema.additionalProperties) {
        return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>\n<!-- XML example cannot be generated -->"
      } else {
        return null
      }
    }
    return memoizedCreateXMLExample(schema, config)
  }

  return JSON.stringify(memoizedSampleFromSchema(schema, config), null, 2)
}

export const parseSearch = () => {
  let map = {}
  let search = window.location.search

  if ( search != "" ) {
    let params = search.substr(1).split("&")

    for (let i in params) {
      i = params[i].split("=")
      map[decodeURIComponent(i[0])] = decodeURIComponent(i[1])
    }
  }

  return map
}

export const btoa = (str) => {
  let buffer

  if (str instanceof Buffer) {
    buffer = str
  } else {
    buffer = new Buffer(str.toString(), "utf-8")
  }

  return buffer.toString("base64")
}

export const sorters = {
  operationsSorter: {
    alpha: (a, b) => a.get("path").localeCompare(b.get("path")),
    method: (a, b) => a.get("method").localeCompare(b.get("method"))
  },
  tagsSorter: {
    alpha: (a, b) => a.localeCompare(b)
  }
}

export const buildFormData = (data) => {
  let formArr = []

  for (let name in data) {
    let val = data[name]
    if (val !== undefined && val !== "") {
      formArr.push([name, "=", encodeURIComponent(val).replace(/%20/g,"+")].join(""))
    }
  }
  return formArr.join("&")
}

// Is this really required as a helper? Perhaps. TODO: expose the system of presets.apis in docs, so we know what is supported
export const shallowEqualKeys = (a,b, keys) => {
  return !!find(keys, (key) => {
    return eq(a[key], b[key])
  })
}

export function getAcceptControllingResponse(responses) {
  if(!Im.OrderedMap.isOrderedMap(responses)) {
    // wrong type!
    return null
  }

  if(!responses.size) {
    // responses is empty
    return null
  }

  const suitable2xxResponse = responses.find((res, k) => {
    return k.startsWith("2") && Object.keys(res.get("content") || {}).length > 0
  })

  // try to find a suitable `default` responses
  const defaultResponse = responses.get("default") || Im.OrderedMap()
  const defaultResponseMediaTypes = (defaultResponse.get("content") || Im.OrderedMap()).keySeq().toJS()
  const suitableDefaultResponse = defaultResponseMediaTypes.length ? defaultResponse : null

  return suitable2xxResponse || suitableDefaultResponse
}

export const createDeepLinkPath = (str) => typeof str == "string" || str instanceof String ? str.trim().replace(/\s/g, "_") : ""
export const escapeDeepLinkPath = (str) => cssEscape( createDeepLinkPath(str) )

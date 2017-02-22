/*! JSON Editor v0.7.28 - JSON Schema -> HTML Editor
 * By Jeremy Dorn - https://github.com/jdorn/json-editor/
 * Released under the MIT license
 *
 * Date: 2016-08-07
 */
/**
 * See README.md for requirements and usage info
 */
!function(){/*jshint loopfunc: true */
/* Simple JavaScript Inheritance
 * By John Resig http://ejohn.org/
 * MIT Licensed.
 */
// Inspired by base2 and Prototype
var a;!function(){var b=!1,c=/xyz/.test(function(){window.postMessage("xyz")})?/\b_super\b/:/.*/;
// The base Class implementation (does nothing)
// Create a new Class that inherits from this class
return a=function(){},a.extend=function d(a){
// The dummy class constructor
function e(){
// All construction is actually done in the init method
!b&&this.init&&this.init.apply(this,arguments)}var f=this.prototype;
// Instantiate a base class (but only create the instance,
// don't run the init constructor)
b=!0;var g=new this;b=!1;
// Copy the properties over onto the new prototype
for(var h in a)
// Check if we're overwriting an existing function
g[h]="function"==typeof a[h]&&"function"==typeof f[h]&&c.test(a[h])?function(a,b){return function(){var c=this._super;
// Add a new ._super() method that is the same method
// but on the super-class
this._super=f[a];
// The method only need to be bound temporarily, so we
// remove it when we're done executing
var d=b.apply(this,arguments);return this._super=c,d}}(h,a[h]):a[h];
// Populate our constructed prototype object
// Enforce the constructor to be what we expect
// And make this class extendable
return e.prototype=g,e.prototype.constructor=e,e.extend=d,e},a}(),
// CustomEvent constructor polyfill
// From MDN
function(){function a(a,b){b=b||{bubbles:!1,cancelable:!1,detail:void 0};var c=document.createEvent("CustomEvent");return c.initCustomEvent(a,b.bubbles,b.cancelable,b.detail),c}a.prototype=window.Event.prototype,window.CustomEvent=a}(),
// requestAnimationFrame polyfill by Erik Möller. fixes from Paul Irish and Tino Zijdel
// MIT license
function(){for(var a=0,b=["ms","moz","webkit","o"],c=0;c<b.length&&!window.requestAnimationFrame;++c)window.requestAnimationFrame=window[b[c]+"RequestAnimationFrame"],window.cancelAnimationFrame=window[b[c]+"CancelAnimationFrame"]||window[b[c]+"CancelRequestAnimationFrame"];window.requestAnimationFrame||(window.requestAnimationFrame=function(b,c){var d=(new Date).getTime(),e=Math.max(0,16-(d-a)),f=window.setTimeout(function(){b(d+e)},e);return a=d+e,f}),window.cancelAnimationFrame||(window.cancelAnimationFrame=function(a){clearTimeout(a)})}(),
// Array.isArray polyfill
// From MDN
function(){Array.isArray||(Array.isArray=function(a){return"[object Array]"===Object.prototype.toString.call(a)})}();/**
 * Taken from jQuery 2.1.3
 *
 * @param obj
 * @returns {boolean}
 */
var b=function(a){
// Not plain objects:
// - Any object or value whose internal [[Class]] property is not "[object Object]"
// - DOM nodes
// - window
// Not plain objects:
// - Any object or value whose internal [[Class]] property is not "[object Object]"
// - DOM nodes
// - window
return!("object"!=typeof a||a.nodeType||null!==a&&a===a.window)&&!(a.constructor&&!Object.prototype.hasOwnProperty.call(a.constructor.prototype,"isPrototypeOf"))},c=function(a){var d,e,f;for(e=1;e<arguments.length;e++){d=arguments[e];for(f in d)d.hasOwnProperty(f)&&(d[f]&&b(d[f])?(a.hasOwnProperty(f)||(a[f]={}),c(a[f],d[f])):a[f]=d[f])}return a},d=function(a,b){if(a&&"object"==typeof a){var c;if(Array.isArray(a)||"number"==typeof a.length&&a.length>0&&a.length-1 in a){for(c=0;c<a.length;c++)if(b(c,a[c])===!1)return}else if(Object.keys){var d=Object.keys(a);for(c=0;c<d.length;c++)if(b(d[c],a[d[c]])===!1)return}else for(c in a)if(a.hasOwnProperty(c)&&b(c,a[c])===!1)return}},e=function(a,b){var c=document.createEvent("HTMLEvents");c.initEvent(b,!0,!0),a.dispatchEvent(c)},f=function(a,b){if(!(a instanceof Element))throw new Error("element should be an instance of Element");b=c({},f.defaults.options,b||{}),this.element=a,this.options=b,this.init()};f.prototype={
// necessary since we remove the ctor property by doing a literal assignment. Without this
// the $isplainobject function will think that this is a plain object.
constructor:f,init:function(){var a=this;this.ready=!1;var b=f.defaults.themes[this.options.theme||f.defaults.theme];if(!b)throw"Unknown theme "+(this.options.theme||f.defaults.theme);this.schema=this.options.schema,this.theme=new b,this.template=this.options.template,this.refs=this.options.refs||{},this.uuid=0,this.__data={};var c=f.defaults.iconlibs[this.options.iconlib||f.defaults.iconlib];c&&(this.iconlib=new c),this.root_container=this.theme.getContainer(),this.element.appendChild(this.root_container),this.translate=this.options.translate||f.defaults.translate,
// Fetch all external refs via ajax
this._loadExternalRefs(this.schema,function(){a._getDefinitions(a.schema);
// Validator options
var b={};a.options.custom_validators&&(b.custom_validators=a.options.custom_validators),a.validator=new f.Validator(a,null,b);
// Create the root editor
var c=a.getEditorClass(a.schema);a.root=a.createEditor(c,{jsoneditor:a,schema:a.schema,required:!0,container:a.root_container}),a.root.preBuild(),a.root.build(),a.root.postBuild(),
// Starting data
a.options.startval&&a.root.setValue(a.options.startval),a.validation_results=a.validator.validate(a.root.getValue()),a.root.showValidationErrors(a.validation_results),a.ready=!0,
// Fire ready event asynchronously
window.requestAnimationFrame(function(){a.ready&&(a.validation_results=a.validator.validate(a.root.getValue()),a.root.showValidationErrors(a.validation_results),a.trigger("ready"),a.trigger("change"))})})},getValue:function(){if(!this.ready)throw"JSON Editor not ready yet.  Listen for 'ready' event before getting the value";return this.root.getValue()},setValue:function(a){if(!this.ready)throw"JSON Editor not ready yet.  Listen for 'ready' event before setting the value";return this.root.setValue(a),this},validate:function(a){if(!this.ready)throw"JSON Editor not ready yet.  Listen for 'ready' event before validating";
// Custom value
// Custom value
return 1===arguments.length?this.validator.validate(a):this.validation_results},destroy:function(){this.destroyed||this.ready&&(this.schema=null,this.options=null,this.root.destroy(),this.root=null,this.root_container=null,this.validator=null,this.validation_results=null,this.theme=null,this.iconlib=null,this.template=null,this.__data=null,this.ready=!1,this.element.innerHTML="",this.destroyed=!0)},on:function(a,b){return this.callbacks=this.callbacks||{},this.callbacks[a]=this.callbacks[a]||[],this.callbacks[a].push(b),this},off:function(a,b){
// Specific callback
if(a&&b){this.callbacks=this.callbacks||{},this.callbacks[a]=this.callbacks[a]||[];for(var c=[],d=0;d<this.callbacks[a].length;d++)this.callbacks[a][d]!==b&&c.push(this.callbacks[a][d]);this.callbacks[a]=c}else a?(this.callbacks=this.callbacks||{},this.callbacks[a]=[]):this.callbacks={};return this},trigger:function(a){if(this.callbacks&&this.callbacks[a]&&this.callbacks[a].length)for(var b=0;b<this.callbacks[a].length;b++)this.callbacks[a][b]();return this},setOption:function(a,b){if("show_errors"!==a)throw"Option "+a+" must be set during instantiation and cannot be changed later";return this.options.show_errors=b,this.onChange(),this},getEditorClass:function(a){var b;if(a=this.expandSchema(a),d(f.defaults.resolvers,function(c,d){var e=d(a);if(e&&f.defaults.editors[e])return b=e,!1}),!b)throw"Unknown editor for schema "+JSON.stringify(a);if(!f.defaults.editors[b])throw"Unknown editor "+b;return f.defaults.editors[b]},createEditor:function(a,b){return b=c({},a.options||{},b),new a(b)},onChange:function(){if(this.ready&&!this.firing_change){this.firing_change=!0;var a=this;return window.requestAnimationFrame(function(){a.firing_change=!1,a.ready&&(
// Validate and cache results
a.validation_results=a.validator.validate(a.root.getValue()),"never"!==a.options.show_errors?a.root.showValidationErrors(a.validation_results):a.root.showValidationErrors([]),
// Fire change event
a.trigger("change"))}),this}},compileTemplate:function(a,b){b=b||f.defaults.template;var c;
// Specifying a preset engine
if("string"==typeof b){if(!f.defaults.templates[b])throw"Unknown template engine "+b;if(c=f.defaults.templates[b](),!c)throw"Template engine "+b+" missing required library."}else c=b;if(!c)throw"No template engine set";if(!c.compile)throw"Invalid template engine set";return c.compile(a)},_data:function(a,b,c){
// Setting data
if(3!==arguments.length)
// No data stored
// No data stored
return a.hasAttribute("data-jsoneditor-"+b)?this.__data[a.getAttribute("data-jsoneditor-"+b)]:null;var d;a.hasAttribute("data-jsoneditor-"+b)?d=a.getAttribute("data-jsoneditor-"+b):(d=this.uuid++,a.setAttribute("data-jsoneditor-"+b,d)),this.__data[d]=c},registerEditor:function(a){return this.editors=this.editors||{},this.editors[a.path]=a,this},unregisterEditor:function(a){return this.editors=this.editors||{},this.editors[a.path]=null,this},getEditor:function(a){if(this.editors)return this.editors[a]},watch:function(a,b){return this.watchlist=this.watchlist||{},this.watchlist[a]=this.watchlist[a]||[],this.watchlist[a].push(b),this},unwatch:function(a,b){if(!this.watchlist||!this.watchlist[a])return this;
// If removing all callbacks for a path
if(!b)return this.watchlist[a]=null,this;for(var c=[],d=0;d<this.watchlist[a].length;d++)this.watchlist[a][d]!==b&&c.push(this.watchlist[a][d]);return this.watchlist[a]=c.length?c:null,this},notifyWatchers:function(a){if(!this.watchlist||!this.watchlist[a])return this;for(var b=0;b<this.watchlist[a].length;b++)this.watchlist[a][b]()},isEnabled:function(){return!this.root||this.root.isEnabled()},enable:function(){this.root.enable()},disable:function(){this.root.disable()},_getDefinitions:function(a,b){if(b=b||"#/definitions/",a.definitions)for(var c in a.definitions)a.definitions.hasOwnProperty(c)&&(this.refs[b+c]=a.definitions[c],a.definitions[c].definitions&&this._getDefinitions(a.definitions[c],b+c+"/definitions/"))},_getExternalRefs:function(a){var b={},c=function(a){for(var c in a)a.hasOwnProperty(c)&&(b[c]=!0)};a.$ref&&"object"!=typeof a.$ref&&"#"!==a.$ref.substr(0,1)&&!this.refs[a.$ref]&&(b[a.$ref]=!0);for(var d in a)if(a.hasOwnProperty(d))if(a[d]&&"object"==typeof a[d]&&Array.isArray(a[d]))for(var e=0;e<a[d].length;e++)"object"==typeof a[d][e]&&c(this._getExternalRefs(a[d][e]));else a[d]&&"object"==typeof a[d]&&c(this._getExternalRefs(a[d]));return b},_loadExternalRefs:function(a,b){var c=this,e=this._getExternalRefs(a),f=0,g=0,h=!1;d(e,function(a){if(!c.refs[a]){if(!c.options.ajax)throw"Must set ajax option to true to load external ref "+a;c.refs[a]="loading",g++;var d=new XMLHttpRequest;d.open("GET",a,!0),d.onreadystatechange=function(){if(4==d.readyState){
// Request succeeded
if(200!==d.status)throw window.console.log(d),"Failed to fetch ref via ajax- "+a;var e;try{e=JSON.parse(d.responseText)}catch(i){throw window.console.log(i),"Failed to parse external ref "+a}if(!e||"object"!=typeof e)throw"External ref does not contain a valid schema - "+a;c.refs[a]=e,c._loadExternalRefs(e,function(){f++,f>=g&&!h&&(h=!0,b())})}},d.send()}}),g||b()},expandRefs:function(a){for(a=c({},a);a.$ref;){var b=a.$ref;delete a.$ref,this.refs[b]||(b=decodeURIComponent(b)),a=this.extendSchemas(a,this.refs[b])}return a},expandSchema:function(a){var b,e=this,f=c({},a);
// allOf schemas should be merged into the parent
if(
// Version 3 `type`
"object"==typeof a.type&&(
// Array of types
Array.isArray(a.type)?d(a.type,function(b,c){
// Schema
"object"==typeof c&&(a.type[b]=e.expandSchema(c))}):a.type=e.expandSchema(a.type)),
// Version 3 `disallow`
"object"==typeof a.disallow&&(
// Array of types
Array.isArray(a.disallow)?d(a.disallow,function(b,c){
// Schema
"object"==typeof c&&(a.disallow[b]=e.expandSchema(c))}):a.disallow=e.expandSchema(a.disallow)),
// Version 4 `anyOf`
a.anyOf&&d(a.anyOf,function(b,c){a.anyOf[b]=e.expandSchema(c)}),
// Version 4 `dependencies` (schema dependencies)
a.dependencies&&d(a.dependencies,function(b,c){"object"!=typeof c||Array.isArray(c)||(a.dependencies[b]=e.expandSchema(c))}),
// Version 4 `not`
a.not&&(a.not=this.expandSchema(a.not)),a.allOf){for(b=0;b<a.allOf.length;b++)f=this.extendSchemas(f,this.expandSchema(a.allOf[b]));delete f.allOf}
// extends schemas should be merged into parent
if(a["extends"]){
// If extends is a schema
if(Array.isArray(a["extends"]))for(b=0;b<a["extends"].length;b++)f=this.extendSchemas(f,this.expandSchema(a["extends"][b]));else f=this.extendSchemas(f,this.expandSchema(a["extends"]));delete f["extends"]}
// parent should be merged into oneOf schemas
if(a.oneOf){var g=c({},f);for(delete g.oneOf,b=0;b<a.oneOf.length;b++)f.oneOf[b]=this.extendSchemas(this.expandSchema(a.oneOf[b]),g)}return this.expandRefs(f)},extendSchemas:function(a,b){a=c({},a),b=c({},b);var e=this,f={};
// Properties in obj2 that aren't in obj1
return d(a,function(a,c){
// If this key is also defined in obj2, merge them
"undefined"!=typeof b[a]?
// Required and defaultProperties arrays should be unioned together
"required"!==a&&"defaultProperties"!==a||"object"!=typeof c||!Array.isArray(c)?"type"!==a||"string"!=typeof c&&!Array.isArray(c)?"object"==typeof c&&Array.isArray(c)?f[a]=c.filter(function(c){return b[a].indexOf(c)!==-1}):"object"==typeof c&&null!==c?f[a]=e.extendSchemas(c,b[a]):f[a]=c:(
// Make sure we're dealing with arrays
"string"==typeof c&&(c=[c]),"string"==typeof b.type&&(b.type=[b.type]),
// If type is only defined in the first schema, keep it
b.type&&b.type.length?f.type=c.filter(function(a){return b.type.indexOf(a)!==-1}):f.type=c,
// If there's only 1 type and it's a primitive, use a string instead of array
1===f.type.length&&"string"==typeof f.type[0]?f.type=f.type[0]:0===f.type.length&&delete f.type):
// Union arrays and unique
f[a]=c.concat(b[a]).reduce(function(a,b){return a.indexOf(b)<0&&a.push(b),a},[]):f[a]=c}),d(b,function(b,c){"undefined"==typeof a[b]&&(f[b]=c)}),f}},f.defaults={themes:{},templates:{},iconlibs:{},editors:{},languages:{},resolvers:[],custom_validators:[]},f.Validator=a.extend({init:function(a,b,c){this.jsoneditor=a,this.schema=b||this.jsoneditor.schema,this.options=c||{},this.translate=this.jsoneditor.translate||f.defaults.translate},validate:function(a){return this._validateSchema(this.schema,a)},_validateSchema:function(a,b,e){var g,h,i,j=this,k=[],l=JSON.stringify(b);/*
     * Type Agnostic Validation
     */
// Version 3 `required`
if(e=e||"root",
// Work on a copy of the schema
a=c({},this.jsoneditor.expandRefs(a)),a.required&&a.required===!0){if("undefined"==typeof b)
// Can't do any more validation at this point
return k.push({path:e,property:"required",message:this.translate("error_notset")}),k}else if("undefined"==typeof b){
// If required_by_default is set, all fields are required
if(!this.jsoneditor.options.required_by_default)return k;k.push({path:e,property:"required",message:this.translate("error_notset")})}
// `enum`
if(a["enum"]){for(g=!1,h=0;h<a["enum"].length;h++)l===JSON.stringify(a["enum"][h])&&(g=!0);g||k.push({path:e,property:"enum",message:this.translate("error_enum")})}
// `extends` (version 3)
if(a["extends"])for(h=0;h<a["extends"].length;h++)k=k.concat(this._validateSchema(a["extends"][h],b,e));
// `allOf`
if(a.allOf)for(h=0;h<a.allOf.length;h++)k=k.concat(this._validateSchema(a.allOf[h],b,e));
// `anyOf`
if(a.anyOf){for(g=!1,h=0;h<a.anyOf.length;h++)if(!this._validateSchema(a.anyOf[h],b,e).length){g=!0;break}g||k.push({path:e,property:"anyOf",message:this.translate("error_anyOf")})}
// `oneOf`
if(a.oneOf){g=0;var m=[];for(h=0;h<a.oneOf.length;h++){
// Set the error paths to be path.oneOf[i].rest.of.path
var n=this._validateSchema(a.oneOf[h],b,e);for(n.length||g++,i=0;i<n.length;i++)n[i].path=e+".oneOf["+h+"]"+n[i].path.substr(e.length);m=m.concat(n)}1!==g&&(k.push({path:e,property:"oneOf",message:this.translate("error_oneOf",[g])}),k=k.concat(m))}
// `type` (both Version 3 and Version 4 support)
if(
// `not`
a.not&&(this._validateSchema(a.not,b,e).length||k.push({path:e,property:"not",message:this.translate("error_not")})),a.type)
// Union type
if(Array.isArray(a.type)){for(g=!1,h=0;h<a.type.length;h++)if(this._checkType(a.type[h],b)){g=!0;break}g||k.push({path:e,property:"type",message:this.translate("error_type_union")})}else this._checkType(a.type,b)||k.push({path:e,property:"type",message:this.translate("error_type",[a.type])});
// `disallow` (version 3)
if(a.disallow)
// Union type
if(Array.isArray(a.disallow)){for(g=!0,h=0;h<a.disallow.length;h++)if(this._checkType(a.disallow[h],b)){g=!1;break}g||k.push({path:e,property:"disallow",message:this.translate("error_disallow_union")})}else this._checkType(a.disallow,b)&&k.push({path:e,property:"disallow",message:this.translate("error_disallow",[a.disallow])});/*
     * Type Specific Validation
     */
// Number Specific Validation
if("number"==typeof b){
// `multipleOf` and `divisibleBy`
if(a.multipleOf||a.divisibleBy){var o=a.multipleOf||a.divisibleBy;
// Vanilla JS, prone to floating point rounding errors (e.g. 1.14 / .01 == 113.99999)
g=b/o===Math.floor(b/o),
// Use math.js is available
window.math?g=window.math.mod(window.math.bignumber(b),window.math.bignumber(o)).equals(0):window.Decimal&&(g=new window.Decimal(b).mod(new window.Decimal(o)).equals(0)),g||k.push({path:e,property:a.multipleOf?"multipleOf":"divisibleBy",message:this.translate("error_multipleOf",[o])})}
// `maximum`
a.hasOwnProperty("maximum")&&(
// Vanilla JS, prone to floating point rounding errors (e.g. .999999999999999 == 1)
g=a.exclusiveMaximum?b<a.maximum:b<=a.maximum,
// Use math.js is available
window.math?g=window.math[a.exclusiveMaximum?"smaller":"smallerEq"](window.math.bignumber(b),window.math.bignumber(a.maximum)):window.Decimal&&(g=new window.Decimal(b)[a.exclusiveMaximum?"lt":"lte"](new window.Decimal(a.maximum))),g||k.push({path:e,property:"maximum",message:this.translate(a.exclusiveMaximum?"error_maximum_excl":"error_maximum_incl",[a.maximum])})),
// `minimum`
a.hasOwnProperty("minimum")&&(
// Vanilla JS, prone to floating point rounding errors (e.g. .999999999999999 == 1)
g=a.exclusiveMinimum?b>a.minimum:b>=a.minimum,
// Use math.js is available
window.math?g=window.math[a.exclusiveMinimum?"larger":"largerEq"](window.math.bignumber(b),window.math.bignumber(a.minimum)):window.Decimal&&(g=new window.Decimal(b)[a.exclusiveMinimum?"gt":"gte"](new window.Decimal(a.minimum))),g||k.push({path:e,property:"minimum",message:this.translate(a.exclusiveMinimum?"error_minimum_excl":"error_minimum_incl",[a.minimum])}))}else if("string"==typeof b)
// `maxLength`
a.maxLength&&(b+"").length>a.maxLength&&k.push({path:e,property:"maxLength",message:this.translate("error_maxLength",[a.maxLength])}),
// `minLength`
a.minLength&&(b+"").length<a.minLength&&k.push({path:e,property:"minLength",message:this.translate(1===a.minLength?"error_notempty":"error_minLength",[a.minLength])}),
// `pattern`
a.pattern&&(new RegExp(a.pattern).test(b)||k.push({path:e,property:"pattern",message:this.translate("error_pattern",[a.pattern])}));else if("object"==typeof b&&null!==b&&Array.isArray(b)){
// `items` and `additionalItems`
if(a.items)
// `items` is an array
if(Array.isArray(a.items))for(h=0;h<b.length;h++)
// If this item has a specific schema tied to it
// Validate against it
if(a.items[h])k=k.concat(this._validateSchema(a.items[h],b[h],e+"."+h));else{if(a.additionalItems===!0)break;if(!a.additionalItems){if(a.additionalItems===!1){k.push({path:e,property:"additionalItems",message:this.translate("error_additionalItems")});break}break}k=k.concat(this._validateSchema(a.additionalItems,b[h],e+"."+h))}else
// Each item in the array must validate against the schema
for(h=0;h<b.length;h++)k=k.concat(this._validateSchema(a.items,b[h],e+"."+h));
// `uniqueItems`
if(
// `maxItems`
a.maxItems&&b.length>a.maxItems&&k.push({path:e,property:"maxItems",message:this.translate("error_maxItems",[a.maxItems])}),
// `minItems`
a.minItems&&b.length<a.minItems&&k.push({path:e,property:"minItems",message:this.translate("error_minItems",[a.minItems])}),a.uniqueItems){var p={};for(h=0;h<b.length;h++){if(g=JSON.stringify(b[h]),p[g]){k.push({path:e,property:"uniqueItems",message:this.translate("error_uniqueItems")});break}p[g]=!0}}}else if("object"==typeof b&&null!==b){
// `maxProperties`
if(a.maxProperties){g=0;for(h in b)b.hasOwnProperty(h)&&g++;g>a.maxProperties&&k.push({path:e,property:"maxProperties",message:this.translate("error_maxProperties",[a.maxProperties])})}
// `minProperties`
if(a.minProperties){g=0;for(h in b)b.hasOwnProperty(h)&&g++;g<a.minProperties&&k.push({path:e,property:"minProperties",message:this.translate("error_minProperties",[a.minProperties])})}
// Version 4 `required`
if(a.required&&Array.isArray(a.required))for(h=0;h<a.required.length;h++)"undefined"==typeof b[a.required[h]]&&k.push({path:e,property:"required",message:this.translate("error_required",[a.required[h]])});
// `properties`
var q={};if(a.properties)for(h in a.properties)a.properties.hasOwnProperty(h)&&(q[h]=!0,k=k.concat(this._validateSchema(a.properties[h],b[h],e+"."+h)));
// `patternProperties`
if(a.patternProperties)for(h in a.patternProperties)if(a.patternProperties.hasOwnProperty(h)){var r=new RegExp(h);
// Check which properties match
for(i in b)b.hasOwnProperty(i)&&r.test(i)&&(q[i]=!0,k=k.concat(this._validateSchema(a.patternProperties[h],b[i],e+"."+i)))}
// `additionalProperties`
if(
// The no_additional_properties option currently doesn't work with extended schemas that use oneOf or anyOf
"undefined"!=typeof a.additionalProperties||!this.jsoneditor.options.no_additional_properties||a.oneOf||a.anyOf||(a.additionalProperties=!1),"undefined"!=typeof a.additionalProperties)for(h in b)if(b.hasOwnProperty(h)&&!q[h]){
// No extra properties allowed
if(!a.additionalProperties){k.push({path:e,property:"additionalProperties",message:this.translate("error_additional_properties",[h])});break}if(a.additionalProperties===!0)break;k=k.concat(this._validateSchema(a.additionalProperties,b[h],e+"."+h))}
// `dependencies`
if(a.dependencies)for(h in a.dependencies)if(a.dependencies.hasOwnProperty(h)&&"undefined"!=typeof b[h])
// Property dependency
if(Array.isArray(a.dependencies[h]))for(i=0;i<a.dependencies[h].length;i++)"undefined"==typeof b[a.dependencies[h][i]]&&k.push({path:e,property:"dependencies",message:this.translate("error_dependency",[a.dependencies[h][i]])});else k=k.concat(this._validateSchema(a.dependencies[h],b,e))}
// Custom type validation (global)
// Custom type validation (instance specific)
return d(f.defaults.custom_validators,function(c,d){k=k.concat(d.call(j,a,b,e))}),this.options.custom_validators&&d(this.options.custom_validators,function(c,d){k=k.concat(d.call(j,a,b,e))}),k},_checkType:function(a,b){
// Simple types
// Simple types
return"string"==typeof a?"string"===a?"string"==typeof b:"number"===a?"number"==typeof b:"integer"===a?"number"==typeof b&&b===Math.floor(b):"boolean"===a?"boolean"==typeof b:"array"===a?Array.isArray(b):"object"===a?null!==b&&!Array.isArray(b)&&"object"==typeof b:"null"!==a||null===b:!this._validateSchema(a,b).length}}),/**
 * All editors should extend from this class
 */
f.AbstractEditor=a.extend({onChildEditorChange:function(a){this.onChange(!0)},notify:function(){this.jsoneditor.notifyWatchers(this.path)},change:function(){this.parent?this.parent.onChildEditorChange(this):this.jsoneditor.onChange()},onChange:function(a){this.notify(),this.watch_listener&&this.watch_listener(),a&&this.change()},register:function(){this.jsoneditor.registerEditor(this),this.onChange()},unregister:function(){this.jsoneditor&&this.jsoneditor.unregisterEditor(this)},getNumColumns:function(){return 12},init:function(a){this.jsoneditor=a.jsoneditor,this.theme=this.jsoneditor.theme,this.template_engine=this.jsoneditor.template,this.iconlib=this.jsoneditor.iconlib,this.translate=this.jsoneditor.translate||f.defaults.translate,this.original_schema=a.schema,this.schema=this.jsoneditor.expandSchema(this.original_schema),this.options=c({},this.options||{},a.schema.options||{},a),a.path||this.schema.id||(this.schema.id="root"),this.path=a.path||"root",this.formname=a.formname||this.path.replace(/\.([^.]+)/g,"[$1]"),this.jsoneditor.options.form_name_root&&(this.formname=this.formname.replace(/^root\[/,this.jsoneditor.options.form_name_root+"[")),this.key=this.path.split(".").pop(),this.parent=a.parent,this.link_watchers=[],a.container&&this.setContainer(a.container)},setContainer:function(a){this.container=a,this.schema.id&&this.container.setAttribute("data-schemaid",this.schema.id),this.schema.type&&"string"==typeof this.schema.type&&this.container.setAttribute("data-schematype",this.schema.type),this.container.setAttribute("data-schemapath",this.path)},preBuild:function(){},build:function(){},postBuild:function(){this.setupWatchListeners(),this.addLinks(),this.setValue(this.getDefault(),!0),this.updateHeaderText(),this.register(),this.onWatchedFieldChange()},setupWatchListeners:function(){var a=this;if(
// Watched fields
this.watched={},this.schema.vars&&(this.schema.watch=this.schema.vars),this.watched_values={},this.watch_listener=function(){a.refreshWatchedFieldValues()&&a.onWatchedFieldChange()},this.register(),this.schema.hasOwnProperty("watch")){var b,c,d,e,f;for(var g in this.schema.watch)if(this.schema.watch.hasOwnProperty(g)){if(b=this.schema.watch[g],Array.isArray(b)){if(b.length<2)continue;c=[b[0]].concat(b[1].split("."))}else c=b.split("."),a.theme.closest(a.container,'[data-schemaid="'+c[0]+'"]')||c.unshift("#");if(d=c.shift(),"#"===d&&(d=a.jsoneditor.schema.id||"root"),
// Find the root node for this template variable
e=a.theme.closest(a.container,'[data-schemaid="'+d+'"]'),!e)throw"Could not find ancestor node with id "+d;
// Keep track of the root node and path for use when rendering the template
f=e.getAttribute("data-schemapath")+"."+c.join("."),a.jsoneditor.watch(f,a.watch_listener),a.watched[g]=f}}
// Dynamic header
this.schema.headerTemplate&&(this.header_template=this.jsoneditor.compileTemplate(this.schema.headerTemplate,this.template_engine))},addLinks:function(){
// Add links
if(!this.no_link_holder&&(this.link_holder=this.theme.getLinksHolder(),this.container.appendChild(this.link_holder),this.schema.links))for(var a=0;a<this.schema.links.length;a++)this.addLink(this.getLink(this.schema.links[a]))},getButton:function(a,b,c){var d="json-editor-btn-"+b;b=this.iconlib?this.iconlib.getIcon(b):null,!b&&c&&(a=c,c=null);var e=this.theme.getButton(a,b,c);return e.className+=" "+d+" ",e},setButtonText:function(a,b,c,d){return c=this.iconlib?this.iconlib.getIcon(c):null,!c&&d&&(b=d,d=null),this.theme.setButtonText(a,b,c,d)},addLink:function(a){this.link_holder&&this.link_holder.appendChild(a)},getLink:function(a){var b,c,d=a.mediaType||"application/javascript",e=d.split("/")[0],f=this.jsoneditor.compileTemplate(a.href,this.template_engine),g=null;
// Image links
if(a.download&&(g=a.download),g&&g!==!0&&(g=this.jsoneditor.compileTemplate(g,this.template_engine)),"image"===e){b=this.theme.getBlockLinkHolder(),c=document.createElement("a"),c.setAttribute("target","_blank");var h=document.createElement("img");this.theme.createImageLink(b,c,h),
// When a watched field changes, update the url  
this.link_watchers.push(function(b){var d=f(b);c.setAttribute("href",d),c.setAttribute("title",a.rel||d),h.setAttribute("src",d)})}else if(["audio","video"].indexOf(e)>=0){b=this.theme.getBlockLinkHolder(),c=this.theme.getBlockLink(),c.setAttribute("target","_blank");var i=document.createElement(e);i.setAttribute("controls","controls"),this.theme.createMediaLink(b,c,i),
// When a watched field changes, update the url  
this.link_watchers.push(function(b){var d=f(b);c.setAttribute("href",d),c.textContent=a.rel||d,i.setAttribute("src",d)})}else c=b=this.theme.getBlockLink(),b.setAttribute("target","_blank"),b.textContent=a.rel,
// When a watched field changes, update the url
this.link_watchers.push(function(c){var d=f(c);b.setAttribute("href",d),b.textContent=a.rel||d});return g&&c&&(g===!0?c.setAttribute("download",""):this.link_watchers.push(function(a){c.setAttribute("download",g(a))})),a["class"]&&(c.className=c.className+" "+a["class"]),b},refreshWatchedFieldValues:function(){if(this.watched_values){var a={},b=!1,c=this;if(this.watched){var d,e;for(var f in this.watched)this.watched.hasOwnProperty(f)&&(e=c.jsoneditor.getEditor(this.watched[f]),d=e?e.getValue():null,c.watched_values[f]!==d&&(b=!0),a[f]=d)}return a.self=this.getValue(),this.watched_values.self!==a.self&&(b=!0),this.watched_values=a,b}},getWatchedFieldValues:function(){return this.watched_values},updateHeaderText:function(){if(this.header)
// If the header has children, only update the text node's value
if(this.header.children.length){for(var a=0;a<this.header.childNodes.length;a++)if(3===this.header.childNodes[a].nodeType){this.header.childNodes[a].nodeValue=this.getHeaderText();break}}else this.header.textContent=this.getHeaderText()},getHeaderText:function(a){return this.header_text?this.header_text:a?this.schema.title:this.getTitle()},onWatchedFieldChange:function(){var a;if(this.header_template){a=c(this.getWatchedFieldValues(),{key:this.key,i:this.key,i0:1*this.key,i1:1*this.key+1,title:this.getTitle()});var b=this.header_template(a);b!==this.header_text&&(this.header_text=b,this.updateHeaderText(),this.notify())}if(this.link_watchers.length){a=this.getWatchedFieldValues();for(var d=0;d<this.link_watchers.length;d++)this.link_watchers[d](a)}},setValue:function(a){this.value=a},getValue:function(){return this.value},refreshValue:function(){},getChildEditors:function(){return!1},destroy:function(){var a=this;this.unregister(this),d(this.watched,function(b,c){a.jsoneditor.unwatch(c,a.watch_listener)}),this.watched=null,this.watched_values=null,this.watch_listener=null,this.header_text=null,this.header_template=null,this.value=null,this.container&&this.container.parentNode&&this.container.parentNode.removeChild(this.container),this.container=null,this.jsoneditor=null,this.schema=null,this.path=null,this.key=null,this.parent=null},getDefault:function(){if(this.schema["default"])return this.schema["default"];if(this.schema["enum"])return this.schema["enum"][0];var a=this.schema.type||this.schema.oneOf;if(a&&Array.isArray(a)&&(a=a[0]),a&&"object"==typeof a&&(a=a.type),a&&Array.isArray(a)&&(a=a[0]),"string"==typeof a){if("number"===a)return 0;if("boolean"===a)return!1;if("integer"===a)return 0;if("string"===a)return"";if("object"===a)return{};if("array"===a)return[]}return null},getTitle:function(){return this.schema.title||this.key},enable:function(){this.disabled=!1},disable:function(){this.disabled=!0},isEnabled:function(){return!this.disabled},isRequired:function(){return"boolean"==typeof this.schema.required?this.schema.required:this.parent&&this.parent.schema&&Array.isArray(this.parent.schema.required)?this.parent.schema.required.indexOf(this.key)>-1:!!this.jsoneditor.options.required_by_default},getDisplayText:function(a){var b=[],c={};
// Determine how many times each attribute name is used.
// This helps us pick the most distinct display text for the schemas.
d(a,function(a,b){b.title&&(c[b.title]=c[b.title]||0,c[b.title]++),b.description&&(c[b.description]=c[b.description]||0,c[b.description]++),b.format&&(c[b.format]=c[b.format]||0,c[b.format]++),b.type&&(c[b.type]=c[b.type]||0,c[b.type]++)}),
// Determine display text for each element of the array
d(a,function(a,d){var e;
// If it's a simple string
e="string"==typeof d?d:d.title&&c[d.title]<=1?d.title:d.format&&c[d.format]<=1?d.format:d.type&&c[d.type]<=1?d.type:d.description&&c[d.description]<=1?d.descripton:d.title?d.title:d.format?d.format:d.type?d.type:d.description?d.description:JSON.stringify(d).length<50?JSON.stringify(d):"type",b.push(e)});
// Replace identical display text with "text 1", "text 2", etc.
var e={};return d(b,function(a,d){e[d]=e[d]||0,e[d]++,c[d]>1&&(b[a]=d+" "+e[d])}),b},getOption:function(a){try{throw"getOption is deprecated"}catch(b){window.console.error(b)}return this.options[a]},showValidationErrors:function(a){}}),f.defaults.editors["null"]=f.AbstractEditor.extend({getValue:function(){return null},setValue:function(){this.onChange()},getNumColumns:function(){return 2}}),f.defaults.editors.string=f.AbstractEditor.extend({register:function(){this._super(),this.input&&this.input.setAttribute("name",this.formname)},unregister:function(){this._super(),this.input&&this.input.removeAttribute("name")},setValue:function(a,b,c){if((!this.template||c)&&(null===a||"undefined"==typeof a?a="":"object"==typeof a?a=JSON.stringify(a):"string"!=typeof a&&(a=""+a),a!==this.serialized)){
// Sanitize value before setting it
var d=this.sanitize(a);if(this.input.value!==d){this.input.value=d,
// If using SCEditor, update the WYSIWYG
this.sceditor_instance?this.sceditor_instance.val(d):this.epiceditor?this.epiceditor.importFile(null,d):this.ace_editor&&this.ace_editor.setValue(d);var e=c||this.getValue()!==a;this.refreshValue(),b?this.is_dirty=!1:"change"===this.jsoneditor.options.show_errors&&(this.is_dirty=!0),this.adjust_height&&this.adjust_height(this.input),
// Bubble this setValue to parents if the value changed
this.onChange(e)}}},getNumColumns:function(){var a,b=Math.ceil(Math.max(this.getTitle().length,this.schema.maxLength||0,this.schema.minLength||0)/5);return a="textarea"===this.input_type?6:["text","email"].indexOf(this.input_type)>=0?4:2,Math.min(12,Math.max(b,a))},build:function(){var a=this;
// Specific format
if(this.options.compact||(this.header=this.label=this.theme.getFormInputLabel(this.getTitle())),this.schema.description&&(this.description=this.theme.getFormInputDescription(this.schema.description)),this.format=this.schema.format,!this.format&&this.schema.media&&this.schema.media.type&&(this.format=this.schema.media.type.replace(/(^(application|text)\/(x-)?(script\.)?)|(-source$)/g,"")),!this.format&&this.options.default_format&&(this.format=this.options.default_format),this.options.format&&(this.format=this.options.format),this.format)
// Text Area
if("textarea"===this.format)this.input_type="textarea",this.input=this.theme.getTextareaInput();else if("range"===this.format){this.input_type="range";var b=this.schema.minimum||0,c=this.schema.maximum||Math.max(100,b+1),d=1;this.schema.multipleOf&&(b%this.schema.multipleOf&&(b=Math.ceil(b/this.schema.multipleOf)*this.schema.multipleOf),c%this.schema.multipleOf&&(c=Math.floor(c/this.schema.multipleOf)*this.schema.multipleOf),d=this.schema.multipleOf),this.input=this.theme.getRangeInput(b,c,d)}else["actionscript","batchfile","bbcode","c","c++","cpp","coffee","csharp","css","dart","django","ejs","erlang","golang","groovy","handlebars","haskell","haxe","html","ini","jade","java","javascript","json","less","lisp","lua","makefile","markdown","matlab","mysql","objectivec","pascal","perl","pgsql","php","python","r","ruby","sass","scala","scss","smarty","sql","stylus","svg","twig","vbscript","xml","yaml"].indexOf(this.format)>=0?(this.input_type=this.format,this.source_code=!0,this.input=this.theme.getTextareaInput()):(this.input_type=this.format,this.input=this.theme.getFormInputField(this.input_type));else this.input_type="text",this.input=this.theme.getFormInputField(this.input_type);
// minLength, maxLength, and pattern
"undefined"!=typeof this.schema.maxLength&&this.input.setAttribute("maxlength",this.schema.maxLength),"undefined"!=typeof this.schema.pattern?this.input.setAttribute("pattern",this.schema.pattern):"undefined"!=typeof this.schema.minLength&&this.input.setAttribute("pattern",".{"+this.schema.minLength+",}"),this.options.compact?this.container.className+=" compact":this.options.input_width&&(this.input.style.width=this.options.input_width),(this.schema.readOnly||this.schema.readonly||this.schema.template)&&(this.always_disabled=!0,this.input.disabled=!0),this.input.addEventListener("change",function(b){
// Don't allow changing if this field is a template
if(b.preventDefault(),b.stopPropagation(),a.schema.template)return void(this.value=a.value);var c=this.value,d=a.sanitize(c);c!==d&&(this.value=d),a.is_dirty=!0,a.refreshValue(),a.onChange(!0)}),this.options.input_height&&(this.input.style.height=this.options.input_height),this.options.expand_height&&(this.adjust_height=function(a){if(a){var b,c=a.offsetHeight;
// Input too short
if(a.offsetHeight<a.scrollHeight)for(b=0;a.offsetHeight<a.scrollHeight+3&&!(b>100);)b++,c++,a.style.height=c+"px";else{for(b=0;a.offsetHeight>=a.scrollHeight+3&&!(b>100);)b++,c--,a.style.height=c+"px";a.style.height=c+1+"px"}}},this.input.addEventListener("keyup",function(b){a.adjust_height(this)}),this.input.addEventListener("change",function(b){a.adjust_height(this)}),this.adjust_height()),this.format&&this.input.setAttribute("data-schemaformat",this.format),this.control=this.theme.getFormControl(this.label,this.input,this.description),this.container.appendChild(this.control),
// Any special formatting that needs to happen after the input is added to the dom
window.requestAnimationFrame(function(){
// Skip in case the input is only a temporary editor,
// otherwise, in the case of an ace_editor creation,
// it will generate an error trying to append it to the missing parentNode
a.input.parentNode&&a.afterInputReady(),a.adjust_height&&a.adjust_height(a.input)}),
// Compile and store the template
this.schema.template?(this.template=this.jsoneditor.compileTemplate(this.schema.template,this.template_engine),this.refreshValue()):this.refreshValue()},enable:function(){this.always_disabled||(this.input.disabled=!1),this._super()},disable:function(){this.input.disabled=!0,
// TODO: WYSIWYG and Markdown editors
this._super()},afterInputReady:function(){var a,b=this;
// Code editor
if(this.source_code)
// WYSIWYG html and bbcode editor
if(this.options.wysiwyg&&["html","bbcode"].indexOf(this.input_type)>=0&&window.jQuery&&window.jQuery.fn&&window.jQuery.fn.sceditor)a=c({},{plugins:"html"===b.input_type?"xhtml":"bbcode",emoticonsEnabled:!1,width:"100%",height:300},f.plugins.sceditor,b.options.sceditor_options||{}),window.jQuery(b.input).sceditor(a),b.sceditor_instance=window.jQuery(b.input).sceditor("instance"),b.sceditor_instance.blur(function(){
// Get editor's value
var a=window.jQuery("<div>"+b.sceditor_instance.val()+"</div>");
// Remove sceditor spans/divs
window.jQuery("#sceditor-start-marker,#sceditor-end-marker,.sceditor-nlf",a).remove(),
// Set the value and update
b.input.value=a.html(),b.value=b.input.value,b.is_dirty=!0,b.onChange(!0)});else if("markdown"===this.input_type&&window.EpicEditor)this.epiceditor_container=document.createElement("div"),this.input.parentNode.insertBefore(this.epiceditor_container,this.input),this.input.style.display="none",a=c({},f.plugins.epiceditor,{container:this.epiceditor_container,clientSideStorage:!1}),this.epiceditor=new window.EpicEditor(a).load(),this.epiceditor.importFile(null,this.getValue()),this.epiceditor.on("update",function(){var a=b.epiceditor.exportFile();b.input.value=a,b.value=a,b.is_dirty=!0,b.onChange(!0)});else if(window.ace){var d=this.input_type;
// aliases for c/cpp
"cpp"!==d&&"c++"!==d&&"c"!==d||(d="c_cpp"),this.ace_container=document.createElement("div"),this.ace_container.style.width="100%",this.ace_container.style.position="relative",this.ace_container.style.height="400px",this.input.parentNode.insertBefore(this.ace_container,this.input),this.input.style.display="none",this.ace_editor=window.ace.edit(this.ace_container),this.ace_editor.setValue(this.getValue()),
// The theme
f.plugins.ace.theme&&this.ace_editor.setTheme("ace/theme/"+f.plugins.ace.theme),
// The mode
d=window.ace.require("ace/mode/"+d),d&&this.ace_editor.getSession().setMode(new d.Mode),
// Listen for changes
this.ace_editor.on("change",function(){var a=b.ace_editor.getValue();b.input.value=a,b.refreshValue(),b.is_dirty=!0,b.onChange(!0)})}b.theme.afterInputReady(b.input)},refreshValue:function(){this.value=this.input.value,"string"!=typeof this.value&&(this.value=""),this.serialized=this.value},destroy:function(){
// If using SCEditor, destroy the editor instance
this.sceditor_instance?this.sceditor_instance.destroy():this.epiceditor?this.epiceditor.unload():this.ace_editor&&this.ace_editor.destroy(),this.template=null,this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this.label&&this.label.parentNode&&this.label.parentNode.removeChild(this.label),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this._super()},/**
   * This is overridden in derivative editors
   */
sanitize:function(a){return a},/**
   * Re-calculates the value if needed
   */
onWatchedFieldChange:function(){var a;
// If this editor needs to be rendered by a macro template
this.template&&(a=this.getWatchedFieldValues(),this.setValue(this.template(a),!1,!0)),this._super()},showValidationErrors:function(a){var b=this;if("always"===this.jsoneditor.options.show_errors);else if(!this.is_dirty&&this.previous_error_setting===this.jsoneditor.options.show_errors)return;this.previous_error_setting=this.jsoneditor.options.show_errors;var c=[];d(a,function(a,d){d.path===b.path&&c.push(d.message)}),c.length?this.theme.addInputError(this.input,c.join(". ")+"."):this.theme.removeInputError(this.input)}}),f.defaults.editors.number=f.defaults.editors.string.extend({sanitize:function(a){return(a+"").replace(/[^0-9\.\-eE]/g,"")},getNumColumns:function(){return 2},getValue:function(){return 1*this.value}}),f.defaults.editors.integer=f.defaults.editors.number.extend({sanitize:function(a){return a+="",a.replace(/[^0-9\-]/g,"")},getNumColumns:function(){return 2}}),f.defaults.editors.object=f.AbstractEditor.extend({getDefault:function(){return c({},this.schema["default"]||{})},getChildEditors:function(){return this.editors},register:function(){if(this._super(),this.editors)for(var a in this.editors)this.editors.hasOwnProperty(a)&&this.editors[a].register()},unregister:function(){if(this._super(),this.editors)for(var a in this.editors)this.editors.hasOwnProperty(a)&&this.editors[a].unregister()},getNumColumns:function(){return Math.max(Math.min(12,this.maxwidth),3)},enable:function(){if(this.editjson_button&&(this.editjson_button.disabled=!1),this.addproperty_button&&(this.addproperty_button.disabled=!1),this._super(),this.editors)for(var a in this.editors)this.editors.hasOwnProperty(a)&&this.editors[a].enable()},disable:function(){if(this.editjson_button&&(this.editjson_button.disabled=!0),this.addproperty_button&&(this.addproperty_button.disabled=!0),this.hideEditJSON(),this._super(),this.editors)for(var a in this.editors)this.editors.hasOwnProperty(a)&&this.editors[a].disable()},layoutEditors:function(){var a,b,c=this;if(this.row_container){
// Sort editors by propertyOrder
this.property_order=Object.keys(this.editors),this.property_order=this.property_order.sort(function(a,b){var d=c.editors[a].schema.propertyOrder,e=c.editors[b].schema.propertyOrder;return"number"!=typeof d&&(d=1e3),"number"!=typeof e&&(e=1e3),d-e});var e;if("grid"===this.format){var f=[];
// Make almost full rows width 12
// Do this by increasing all editors' sizes proprotionately
// Any left over space goes to the biggest editor
// Don't touch rows with a width of 6 or less
for(d(this.property_order,function(a,b){var d=c.editors[b];if(!d.property_removed){
// See if the editor will fit in any of the existing rows first
for(var e=!1,g=d.options.hidden?0:d.options.grid_columns||d.getNumColumns(),h=d.options.hidden?0:d.container.offsetHeight,i=0;i<f.length;i++)
// If the editor will fit in the row horizontally
f[i].width+g<=12&&(!h||.5*f[i].minh<h&&2*f[i].maxh>h)&&(e=i);
// If there isn't a spot in any of the existing rows, start a new row
e===!1&&(f.push({width:0,minh:999999,maxh:0,editors:[]}),e=f.length-1),f[e].editors.push({key:b,
//editor: editor,
width:g,height:h}),f[e].width+=g,f[e].minh=Math.min(f[e].minh,h),f[e].maxh=Math.max(f[e].maxh,h)}}),a=0;a<f.length;a++)if(f[a].width<12){var g=!1,h=0;for(b=0;b<f[a].editors.length;b++)g===!1?g=b:f[a].editors[b].width>f[a].editors[g].width&&(g=b),f[a].editors[b].width*=12/f[a].width,f[a].editors[b].width=Math.floor(f[a].editors[b].width),h+=f[a].editors[b].width;h<12&&(f[a].editors[g].width+=12-h),f[a].width=12}
// layout hasn't changed
if(this.layout===JSON.stringify(f))return!1;for(this.layout=JSON.stringify(f),
// Layout the form
e=document.createElement("div"),a=0;a<f.length;a++){var i=this.theme.getGridRow();for(e.appendChild(i),b=0;b<f[a].editors.length;b++){var j=f[a].editors[b].key,k=this.editors[j];k.options.hidden?k.container.style.display="none":this.theme.setGridColumnSize(k.container,f[a].editors[b].width),i.appendChild(k.container)}}}else e=document.createElement("div"),d(this.property_order,function(a,b){var d=c.editors[b];if(!d.property_removed){var f=c.theme.getGridRow();e.appendChild(f),d.options.hidden?d.container.style.display="none":c.theme.setGridColumnSize(d.container,12),f.appendChild(d.container)}});this.row_container.innerHTML="",this.row_container.appendChild(e)}},getPropertySchema:function(a){
// Schema declared directly in properties
var b=this.schema.properties[a]||{};b=c({},b);var d=!!this.schema.properties[a];
// Any matching patternProperties should be merged in
if(this.schema.patternProperties)for(var e in this.schema.patternProperties)if(this.schema.patternProperties.hasOwnProperty(e)){var f=new RegExp(e);f.test(a)&&(b.allOf=b.allOf||[],b.allOf.push(this.schema.patternProperties[e]),d=!0)}
// Hasn't matched other rules, use additionalProperties schema
return!d&&this.schema.additionalProperties&&"object"==typeof this.schema.additionalProperties&&(b=c({},this.schema.additionalProperties)),b},preBuild:function(){this._super(),this.editors={},this.cached_editors={};var a=this;
// If the object should be rendered as a table row
if(this.format=this.options.layout||this.options.object_layout||this.schema.format||this.jsoneditor.options.object_layout||"normal",this.schema.properties=this.schema.properties||{},this.minwidth=0,this.maxwidth=0,this.options.table_row)d(this.schema.properties,function(b,c){var d=a.jsoneditor.getEditorClass(c);a.editors[b]=a.jsoneditor.createEditor(d,{jsoneditor:a.jsoneditor,schema:c,path:a.path+"."+b,parent:a,compact:!0,required:!0}),a.editors[b].preBuild();var e=a.editors[b].options.hidden?0:a.editors[b].options.grid_columns||a.editors[b].getNumColumns();a.minwidth+=e,a.maxwidth+=e}),this.no_link_holder=!0;else{if(this.options.table)
// TODO: table display format
throw"Not supported yet";this.schema.defaultProperties||(this.jsoneditor.options.display_required_only||this.options.display_required_only?(this.schema.defaultProperties=[],d(this.schema.properties,function(b,c){a.isRequired({key:b,schema:c})&&a.schema.defaultProperties.push(b)})):a.schema.defaultProperties=Object.keys(a.schema.properties)),
// Increase the grid width to account for padding
a.maxwidth+=1,d(this.schema.defaultProperties,function(b,c){a.addObjectProperty(c,!0),a.editors[c]&&(a.minwidth=Math.max(a.minwidth,a.editors[c].options.grid_columns||a.editors[c].getNumColumns()),a.maxwidth+=a.editors[c].options.grid_columns||a.editors[c].getNumColumns())})}
// Sort editors by propertyOrder
this.property_order=Object.keys(this.editors),this.property_order=this.property_order.sort(function(b,c){var d=a.editors[b].schema.propertyOrder,e=a.editors[c].schema.propertyOrder;return"number"!=typeof d&&(d=1e3),"number"!=typeof e&&(e=1e3),d-e})},build:function(){var a=this;
// If the object should be rendered as a table row
if(this.options.table_row)this.editor_holder=this.container,d(this.editors,function(b,c){var d=a.theme.getTableCell();a.editor_holder.appendChild(d),c.setContainer(d),c.build(),c.postBuild(),a.editors[b].options.hidden&&(d.style.display="none"),a.editors[b].options.input_width&&(d.style.width=a.editors[b].options.input_width)});else{if(this.options.table)
// TODO: table display format
throw"Not supported yet";this.header=document.createElement("span"),this.header.textContent=this.getTitle(),this.title=this.theme.getHeader(this.header),this.container.appendChild(this.title),this.container.style.position="relative",
// Edit JSON modal
this.editjson_holder=this.theme.getModal(),this.editjson_textarea=this.theme.getTextareaInput(),this.editjson_textarea.style.height="170px",this.editjson_textarea.style.width="300px",this.editjson_textarea.style.display="block",this.editjson_save=this.getButton("Save","save","Save"),this.editjson_save.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.saveJSON()}),this.editjson_cancel=this.getButton("Cancel","cancel","Cancel"),this.editjson_cancel.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.hideEditJSON()}),this.editjson_holder.appendChild(this.editjson_textarea),this.editjson_holder.appendChild(this.editjson_save),this.editjson_holder.appendChild(this.editjson_cancel),
// Manage Properties modal
this.addproperty_holder=this.theme.getModal(),this.addproperty_list=document.createElement("div"),this.addproperty_list.style.width="295px",this.addproperty_list.style.maxHeight="160px",this.addproperty_list.style.padding="5px 0",this.addproperty_list.style.overflowY="auto",this.addproperty_list.style.overflowX="hidden",this.addproperty_list.style.paddingLeft="5px",this.addproperty_list.setAttribute("class","property-selector"),this.addproperty_add=this.getButton("add","add","add"),this.addproperty_input=this.theme.getFormInputField("text"),this.addproperty_input.setAttribute("placeholder","Property name..."),this.addproperty_input.style.width="220px",this.addproperty_input.style.marginBottom="0",this.addproperty_input.style.display="inline-block",this.addproperty_add.addEventListener("click",function(b){if(b.preventDefault(),b.stopPropagation(),a.addproperty_input.value){if(a.editors[a.addproperty_input.value])return void window.alert("there is already a property with that name");a.addObjectProperty(a.addproperty_input.value),a.editors[a.addproperty_input.value]&&a.editors[a.addproperty_input.value].disable(),a.onChange(!0)}}),this.addproperty_holder.appendChild(this.addproperty_list),this.addproperty_holder.appendChild(this.addproperty_input),this.addproperty_holder.appendChild(this.addproperty_add);var b=document.createElement("div");b.style.clear="both",this.addproperty_holder.appendChild(b),
// Description
this.schema.description&&(this.description=this.theme.getDescription(this.schema.description),this.container.appendChild(this.description)),
// Validation error placeholder area
this.error_holder=document.createElement("div"),this.container.appendChild(this.error_holder),
// Container for child editor area
this.editor_holder=this.theme.getIndentedPanel(),this.container.appendChild(this.editor_holder),
// Container for rows of child editors
this.row_container=this.theme.getGridContainer(),this.editor_holder.appendChild(this.row_container),d(this.editors,function(b,c){var d=a.theme.getGridColumn();a.row_container.appendChild(d),c.setContainer(d),c.build(),c.postBuild()}),
// Control buttons
this.title_controls=this.theme.getHeaderButtonHolder(),this.editjson_controls=this.theme.getHeaderButtonHolder(),this.addproperty_controls=this.theme.getHeaderButtonHolder(),this.title.appendChild(this.title_controls),this.title.appendChild(this.editjson_controls),this.title.appendChild(this.addproperty_controls),
// Show/Hide button
this.collapsed=!1,this.toggle_button=this.getButton("","collapse",this.translate("button_collapse")),this.title_controls.appendChild(this.toggle_button),this.toggle_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.collapsed?(a.editor_holder.style.display="",a.collapsed=!1,a.setButtonText(a.toggle_button,"","collapse",a.translate("button_collapse"))):(a.editor_holder.style.display="none",a.collapsed=!0,a.setButtonText(a.toggle_button,"","expand",a.translate("button_expand")))}),
// If it should start collapsed
this.options.collapsed&&e(this.toggle_button,"click"),
// Collapse button disabled
this.schema.options&&"undefined"!=typeof this.schema.options.disable_collapse?this.schema.options.disable_collapse&&(this.toggle_button.style.display="none"):this.jsoneditor.options.disable_collapse&&(this.toggle_button.style.display="none"),
// Edit JSON Button
this.editjson_button=this.getButton("JSON","edit","Edit JSON"),this.editjson_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.toggleEditJSON()}),this.editjson_controls.appendChild(this.editjson_button),this.editjson_controls.appendChild(this.editjson_holder),
// Edit JSON Buttton disabled
this.schema.options&&"undefined"!=typeof this.schema.options.disable_edit_json?this.schema.options.disable_edit_json&&(this.editjson_button.style.display="none"):this.jsoneditor.options.disable_edit_json&&(this.editjson_button.style.display="none"),
// Object Properties Button
this.addproperty_button=this.getButton("Properties","edit","Object Properties"),this.addproperty_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.toggleAddProperty()}),this.addproperty_controls.appendChild(this.addproperty_button),this.addproperty_controls.appendChild(this.addproperty_holder),this.refreshAddProperties()}
// Fix table cell ordering
this.options.table_row?(this.editor_holder=this.container,d(this.property_order,function(b,c){a.editor_holder.appendChild(a.editors[c].container)})):(
// Initial layout
this.layoutEditors(),
// Do it again now that we know the approximate heights of elements
this.layoutEditors())},showEditJSON:function(){this.editjson_holder&&(this.hideAddProperty(),
// Position the form directly beneath the button
// TODO: edge detection
this.editjson_holder.style.left=this.editjson_button.offsetLeft+"px",this.editjson_holder.style.top=this.editjson_button.offsetTop+this.editjson_button.offsetHeight+"px",
// Start the textarea with the current value
this.editjson_textarea.value=JSON.stringify(this.getValue(),null,2),
// Disable the rest of the form while editing JSON
this.disable(),this.editjson_holder.style.display="",this.editjson_button.disabled=!1,this.editing_json=!0)},hideEditJSON:function(){this.editjson_holder&&this.editing_json&&(this.editjson_holder.style.display="none",this.enable(),this.editing_json=!1)},saveJSON:function(){if(this.editjson_holder)try{var a=JSON.parse(this.editjson_textarea.value);this.setValue(a),this.hideEditJSON()}catch(b){throw window.alert("invalid JSON"),b}},toggleEditJSON:function(){this.editing_json?this.hideEditJSON():this.showEditJSON()},insertPropertyControlUsingPropertyOrder:function(a,b,c){var d;this.schema.properties[a]&&(d=this.schema.properties[a].propertyOrder),"number"!=typeof d&&(d=1e3),b.propertyOrder=d;for(var e=0;e<c.childNodes.length;e++){var f=c.childNodes[e];if(b.propertyOrder<f.propertyOrder){this.addproperty_list.insertBefore(b,f),b=null;break}}b&&this.addproperty_list.appendChild(b)},addPropertyCheckbox:function(a){var b,c,d,e,f=this;
//control.style.overflowY = 'hidden';
return b=f.theme.getCheckbox(),b.style.width="auto",d=this.schema.properties[a]&&this.schema.properties[a].title?this.schema.properties[a].title:a,c=f.theme.getCheckboxLabel(d),e=f.theme.getFormControl(c,b),e.style.paddingBottom=e.style.marginBottom=e.style.paddingTop=e.style.marginTop=0,e.style.height="auto",this.insertPropertyControlUsingPropertyOrder(a,e,this.addproperty_list),b.checked=a in this.editors,b.addEventListener("change",function(){b.checked?f.addObjectProperty(a):f.removeObjectProperty(a),f.onChange(!0)}),f.addproperty_checkboxes[a]=b,b},showAddProperty:function(){this.addproperty_holder&&(this.hideEditJSON(),
// Position the form directly beneath the button
// TODO: edge detection
this.addproperty_holder.style.left=this.addproperty_button.offsetLeft+"px",this.addproperty_holder.style.top=this.addproperty_button.offsetTop+this.addproperty_button.offsetHeight+"px",
// Disable the rest of the form while editing JSON
this.disable(),this.adding_property=!0,this.addproperty_button.disabled=!1,this.addproperty_holder.style.display="",this.refreshAddProperties())},hideAddProperty:function(){this.addproperty_holder&&this.adding_property&&(this.addproperty_holder.style.display="none",this.enable(),this.adding_property=!1)},toggleAddProperty:function(){this.adding_property?this.hideAddProperty():this.showAddProperty()},removeObjectProperty:function(a){this.editors[a]&&(this.editors[a].unregister(),delete this.editors[a],this.refreshValue(),this.layoutEditors())},addObjectProperty:function(a,b){var c=this;
// Property is already added
if(!this.editors[a]){
// Property was added before and is cached
if(this.cached_editors[a]){if(this.editors[a]=this.cached_editors[a],b)return;this.editors[a].register()}else{if(!(this.canHaveAdditionalProperties()||this.schema.properties&&this.schema.properties[a]))return;var d=c.getPropertySchema(a),e=c.jsoneditor.getEditorClass(d);if(c.editors[a]=c.jsoneditor.createEditor(e,{jsoneditor:c.jsoneditor,schema:d,path:c.path+"."+a,parent:c}),c.editors[a].preBuild(),!b){var f=c.theme.getChildEditorHolder();c.editor_holder.appendChild(f),c.editors[a].setContainer(f),c.editors[a].build(),c.editors[a].postBuild()}c.cached_editors[a]=c.editors[a]}
// If we're only prebuilding the editors, don't refresh values
b||(c.refreshValue(),c.layoutEditors())}},onChildEditorChange:function(a){this.refreshValue(),this._super(a)},canHaveAdditionalProperties:function(){return"boolean"==typeof this.schema.additionalProperties?this.schema.additionalProperties:!this.jsoneditor.options.no_additional_properties},destroy:function(){d(this.cached_editors,function(a,b){b.destroy()}),this.editor_holder&&(this.editor_holder.innerHTML=""),this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.error_holder&&this.error_holder.parentNode&&this.error_holder.parentNode.removeChild(this.error_holder),this.editors=null,this.cached_editors=null,this.editor_holder&&this.editor_holder.parentNode&&this.editor_holder.parentNode.removeChild(this.editor_holder),this.editor_holder=null,this._super()},getValue:function(){var a=this._super();if(this.jsoneditor.options.remove_empty_properties||this.options.remove_empty_properties)for(var b in a)a.hasOwnProperty(b)&&(a[b]||delete a[b]);return a},refreshValue:function(){this.value={};for(var a in this.editors)this.editors.hasOwnProperty(a)&&(this.value[a]=this.editors[a].getValue());this.adding_property&&this.refreshAddProperties()},refreshAddProperties:function(){if(this.options.disable_properties||this.options.disable_properties!==!1&&this.jsoneditor.options.disable_properties)return void(this.addproperty_controls.style.display="none");var a,b=!1,c=!1,d=0,e=!1;
// Get number of editors
for(a in this.editors)this.editors.hasOwnProperty(a)&&d++;
// Determine if we can add back removed properties
b=this.canHaveAdditionalProperties()&&!("undefined"!=typeof this.schema.maxProperties&&d>=this.schema.maxProperties),this.addproperty_checkboxes&&(this.addproperty_list.innerHTML=""),this.addproperty_checkboxes={};
// Check for which editors can't be removed or added back
for(a in this.cached_editors)this.cached_editors.hasOwnProperty(a)&&(this.addPropertyCheckbox(a),this.isRequired(this.cached_editors[a])&&a in this.editors&&(this.addproperty_checkboxes[a].disabled=!0),"undefined"!=typeof this.schema.minProperties&&d<=this.schema.minProperties?(this.addproperty_checkboxes[a].disabled=this.addproperty_checkboxes[a].checked,this.addproperty_checkboxes[a].checked||(e=!0)):a in this.editors?(e=!0,c=!0):b||this.schema.properties.hasOwnProperty(a)?(this.addproperty_checkboxes[a].disabled=!1,e=!0):this.addproperty_checkboxes[a].disabled=!0);this.canHaveAdditionalProperties()&&(e=!0);
// Additional addproperty checkboxes not tied to a current editor
for(a in this.schema.properties)this.schema.properties.hasOwnProperty(a)&&(this.cached_editors[a]||(e=!0,this.addPropertyCheckbox(a)));
// If no editors can be added or removed, hide the modal button
e?this.canHaveAdditionalProperties()?b?this.addproperty_add.disabled=!1:this.addproperty_add.disabled=!0:(this.addproperty_add.style.display="none",this.addproperty_input.style.display="none"):(this.hideAddProperty(),this.addproperty_controls.style.display="none")},isRequired:function(a){return"boolean"==typeof a.schema.required?a.schema.required:Array.isArray(this.schema.required)?this.schema.required.indexOf(a.key)>-1:!!this.jsoneditor.options.required_by_default},setValue:function(a,b){var c=this;a=a||{},("object"!=typeof a||Array.isArray(a))&&(a={}),
// First, set the values for all of the defined properties
d(this.cached_editors,function(d,e){
// Value explicitly set
"undefined"!=typeof a[d]?(c.addObjectProperty(d),e.setValue(a[d],b)):b||c.isRequired(e)?e.setValue(e.getDefault(),b):c.removeObjectProperty(d)}),d(a,function(a,d){c.cached_editors[a]||(c.addObjectProperty(a),c.editors[a]&&c.editors[a].setValue(d,b))}),this.refreshValue(),this.layoutEditors(),this.onChange()},showValidationErrors:function(a){var b=this,c=[],e=[];
// Show errors for this editor
if(d(a,function(a,d){d.path===b.path?c.push(d):e.push(d)}),this.error_holder)if(c.length){this.error_holder.innerHTML="",this.error_holder.style.display="",d(c,function(a,c){b.error_holder.appendChild(b.theme.getErrorMessage(c.message))})}else this.error_holder.style.display="none";
// Show error for the table row if this is inside a table
this.options.table_row&&(c.length?this.theme.addTableRowError(this.container):this.theme.removeTableRowError(this.container)),
// Show errors for child editors
d(this.editors,function(a,b){b.showValidationErrors(e)})}}),f.defaults.editors.array=f.AbstractEditor.extend({getDefault:function(){return this.schema["default"]||[]},register:function(){if(this._super(),this.rows)for(var a=0;a<this.rows.length;a++)this.rows[a].register()},unregister:function(){if(this._super(),this.rows)for(var a=0;a<this.rows.length;a++)this.rows[a].unregister()},getNumColumns:function(){var a=this.getItemInfo(0);
// Tabs require extra horizontal space
// Tabs require extra horizontal space
return this.tabs_holder?Math.max(Math.min(12,a.width+2),4):a.width},enable:function(){if(this.add_row_button&&(this.add_row_button.disabled=!1),this.remove_all_rows_button&&(this.remove_all_rows_button.disabled=!1),this.delete_last_row_button&&(this.delete_last_row_button.disabled=!1),this.rows)for(var a=0;a<this.rows.length;a++)this.rows[a].enable(),this.rows[a].moveup_button&&(this.rows[a].moveup_button.disabled=!1),this.rows[a].movedown_button&&(this.rows[a].movedown_button.disabled=!1),this.rows[a].delete_button&&(this.rows[a].delete_button.disabled=!1);this._super()},disable:function(){if(this.add_row_button&&(this.add_row_button.disabled=!0),this.remove_all_rows_button&&(this.remove_all_rows_button.disabled=!0),this.delete_last_row_button&&(this.delete_last_row_button.disabled=!0),this.rows)for(var a=0;a<this.rows.length;a++)this.rows[a].disable(),this.rows[a].moveup_button&&(this.rows[a].moveup_button.disabled=!0),this.rows[a].movedown_button&&(this.rows[a].movedown_button.disabled=!0),this.rows[a].delete_button&&(this.rows[a].delete_button.disabled=!0);this._super()},preBuild:function(){this._super(),this.rows=[],this.row_cache=[],this.hide_delete_buttons=this.options.disable_array_delete||this.jsoneditor.options.disable_array_delete,this.hide_delete_all_rows_buttons=this.hide_delete_buttons||this.options.disable_array_delete_all_rows||this.jsoneditor.options.disable_array_delete_all_rows,this.hide_delete_last_row_buttons=this.hide_delete_buttons||this.options.disable_array_delete_last_row||this.jsoneditor.options.disable_array_delete_last_row,this.hide_move_buttons=this.options.disable_array_reorder||this.jsoneditor.options.disable_array_reorder,this.hide_add_button=this.options.disable_array_add||this.jsoneditor.options.disable_array_add},build:function(){this.options.compact?(this.panel=this.theme.getIndentedPanel(),this.container.appendChild(this.panel),this.controls=this.theme.getButtonHolder(),this.panel.appendChild(this.controls),this.row_holder=document.createElement("div"),this.panel.appendChild(this.row_holder)):(this.header=document.createElement("span"),this.header.textContent=this.getTitle(),this.title=this.theme.getHeader(this.header),this.container.appendChild(this.title),this.title_controls=this.theme.getHeaderButtonHolder(),this.title.appendChild(this.title_controls),this.schema.description&&(this.description=this.theme.getDescription(this.schema.description),this.container.appendChild(this.description)),this.error_holder=document.createElement("div"),this.container.appendChild(this.error_holder),"tabs"===this.schema.format?(this.controls=this.theme.getHeaderButtonHolder(),this.title.appendChild(this.controls),this.tabs_holder=this.theme.getTabHolder(),this.container.appendChild(this.tabs_holder),this.row_holder=this.theme.getTabContentHolder(this.tabs_holder),this.active_tab=null):(this.panel=this.theme.getIndentedPanel(),this.container.appendChild(this.panel),this.row_holder=document.createElement("div"),this.panel.appendChild(this.row_holder),this.controls=this.theme.getButtonHolder(),this.panel.appendChild(this.controls))),
// Add controls
this.addControls()},onChildEditorChange:function(a){this.refreshValue(),this.refreshTabs(!0),this._super(a)},getItemTitle:function(){if(!this.item_title)if(this.schema.items&&!Array.isArray(this.schema.items)){var a=this.jsoneditor.expandRefs(this.schema.items);this.item_title=a.title||"item"}else this.item_title="item";return this.item_title},getItemSchema:function(a){return Array.isArray(this.schema.items)?a>=this.schema.items.length?this.schema.additionalItems===!0?{}:this.schema.additionalItems?c({},this.schema.additionalItems):void 0:c({},this.schema.items[a]):this.schema.items?c({},this.schema.items):{}},getItemInfo:function(a){var b=this.getItemSchema(a);
// Check if it's cached
this.item_info=this.item_info||{};var c=JSON.stringify(b);
// Get the schema for this item
return"undefined"!=typeof this.item_info[c]?this.item_info[c]:(b=this.jsoneditor.expandRefs(b),this.item_info[c]={title:b.title||"item","default":b["default"],width:12,child_editors:b.properties||b.items},this.item_info[c])},getElementEditor:function(a){var b=this.getItemInfo(a),c=this.getItemSchema(a);c=this.jsoneditor.expandRefs(c),c.title=b.title+" "+(a+1);var d,e=this.jsoneditor.getEditorClass(c);d=this.tabs_holder?this.theme.getTabContent():b.child_editors?this.theme.getChildEditorHolder():this.theme.getIndentedPanel(),this.row_holder.appendChild(d);var f=this.jsoneditor.createEditor(e,{jsoneditor:this.jsoneditor,schema:c,container:d,path:this.path+"."+a,parent:this,required:!0});return f.preBuild(),f.build(),f.postBuild(),f.title_controls||(f.array_controls=this.theme.getButtonHolder(),d.appendChild(f.array_controls)),f},destroy:function(){this.empty(!0),this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this.row_holder&&this.row_holder.parentNode&&this.row_holder.parentNode.removeChild(this.row_holder),this.controls&&this.controls.parentNode&&this.controls.parentNode.removeChild(this.controls),this.panel&&this.panel.parentNode&&this.panel.parentNode.removeChild(this.panel),this.rows=this.row_cache=this.title=this.description=this.row_holder=this.panel=this.controls=null,this._super()},empty:function(a){if(this.rows){var b=this;d(this.rows,function(c,d){a&&(d.tab&&d.tab.parentNode&&d.tab.parentNode.removeChild(d.tab),b.destroyRow(d,!0),b.row_cache[c]=null),b.rows[c]=null}),b.rows=[],a&&(b.row_cache=[])}},destroyRow:function(a,b){var c=a.container;b?(a.destroy(),c.parentNode&&c.parentNode.removeChild(c),a.tab&&a.tab.parentNode&&a.tab.parentNode.removeChild(a.tab)):(a.tab&&(a.tab.style.display="none"),c.style.display="none",a.unregister())},getMax:function(){return Array.isArray(this.schema.items)&&this.schema.additionalItems===!1?Math.min(this.schema.items.length,this.schema.maxItems||1/0):this.schema.maxItems||1/0},refreshTabs:function(a){var b=this;d(this.rows,function(c,d){d.tab&&(a?d.tab_text.textContent=d.getHeaderText():d.tab===b.active_tab?(b.theme.markTabActive(d.tab),d.container.style.display=""):(b.theme.markTabInactive(d.tab),d.container.style.display="none"))})},setValue:function(a,b){
// Update the array's value, adding/removing rows when necessary
a=a||[],Array.isArray(a)||(a=[a]);var c=JSON.stringify(a);if(c!==this.serialized){
// Make sure value has between minItems and maxItems items in it
if(this.schema.minItems)for(;a.length<this.schema.minItems;)a.push(this.getItemInfo(a.length)["default"]);this.getMax()&&a.length>this.getMax()&&(a=a.slice(0,this.getMax()));var e=this;d(a,function(a,c){e.rows[a]?
// TODO: don't set the row's value if it hasn't changed
e.rows[a].setValue(c,b):e.row_cache[a]?(e.rows[a]=e.row_cache[a],e.rows[a].setValue(c,b),e.rows[a].container.style.display="",e.rows[a].tab&&(e.rows[a].tab.style.display=""),e.rows[a].register()):e.addRow(c,b)});for(var f=a.length;f<e.rows.length;f++)e.destroyRow(e.rows[f]),e.rows[f]=null;e.rows=e.rows.slice(0,a.length);
// Set the active tab
var g=null;d(e.rows,function(a,b){if(b.tab===e.active_tab)return g=b.tab,!1}),!g&&e.rows.length&&(g=e.rows[0].tab),e.active_tab=g,e.refreshValue(b),e.refreshTabs(!0),e.refreshTabs(),e.onChange()}},refreshValue:function(a){var b=this,c=this.value?this.value.length:0;if(this.value=[],d(this.rows,function(a,c){
// Get the value for this editor
b.value[a]=c.getValue()}),c!==this.value.length||a){
// If we currently have minItems items in the array
var e=this.schema.minItems&&this.schema.minItems>=this.rows.length;d(this.rows,function(a,c){
// Hide the move down button for the last row
c.movedown_button&&(a===b.rows.length-1?c.movedown_button.style.display="none":c.movedown_button.style.display=""),
// Hide the delete button if we have minItems items
c.delete_button&&(e?c.delete_button.style.display="none":c.delete_button.style.display=""),
// Get the value for this editor
b.value[a]=c.getValue()});var f=!1;this.value.length?1===this.value.length?(this.remove_all_rows_button.style.display="none",
// If there are minItems items in the array, or configured to hide the delete_last_row button, hide the delete button beneath the rows
e||this.hide_delete_last_row_buttons?this.delete_last_row_button.style.display="none":(this.delete_last_row_button.style.display="",f=!0)):(e||this.hide_delete_last_row_buttons?this.delete_last_row_button.style.display="none":(this.delete_last_row_button.style.display="",f=!0),e||this.hide_delete_all_rows_buttons?this.remove_all_rows_button.style.display="none":(this.remove_all_rows_button.style.display="",f=!0)):(this.delete_last_row_button.style.display="none",this.remove_all_rows_button.style.display="none"),
// If there are maxItems in the array, hide the add button beneath the rows
this.getMax()&&this.getMax()<=this.rows.length||this.hide_add_button?this.add_row_button.style.display="none":(this.add_row_button.style.display="",f=!0),!this.collapsed&&f?this.controls.style.display="inline-block":this.controls.style.display="none"}},addRow:function(a,b){var c=this,e=this.rows.length;c.rows[e]=this.getElementEditor(e),c.row_cache[e]=c.rows[e],c.tabs_holder&&(c.rows[e].tab_text=document.createElement("span"),c.rows[e].tab_text.textContent=c.rows[e].getHeaderText(),c.rows[e].tab=c.theme.getTab(c.rows[e].tab_text),c.rows[e].tab.addEventListener("click",function(a){c.active_tab=c.rows[e].tab,c.refreshTabs(),a.preventDefault(),a.stopPropagation()}),c.theme.addTab(c.tabs_holder,c.rows[e].tab));var f=c.rows[e].title_controls||c.rows[e].array_controls;
// Buttons to delete row, move row up, and move row down
c.hide_delete_buttons||(c.rows[e].delete_button=this.getButton(c.getItemTitle(),"delete",this.translate("button_delete_row_title",[c.getItemTitle()])),c.rows[e].delete_button.className+=" delete",c.rows[e].delete_button.setAttribute("data-i",e),c.rows[e].delete_button.addEventListener("click",function(a){a.preventDefault(),a.stopPropagation();var b=1*this.getAttribute("data-i"),e=c.getValue(),f=[],g=null;d(e,function(a,d){
// If the one we're deleting is the active tab
// Make the next tab active if there is one
// Note: the next tab is going to be the current tab after deletion
return a===b?void(c.rows[a].tab===c.active_tab&&(c.rows[a+1]?g=c.rows[a].tab:a&&(g=c.rows[a-1].tab))):void f.push(d)}),c.setValue(f),g&&(c.active_tab=g,c.refreshTabs()),c.onChange(!0)}),f&&f.appendChild(c.rows[e].delete_button)),e&&!c.hide_move_buttons&&(c.rows[e].moveup_button=this.getButton("","moveup",this.translate("button_move_up_title")),c.rows[e].moveup_button.className+=" moveup",c.rows[e].moveup_button.setAttribute("data-i",e),c.rows[e].moveup_button.addEventListener("click",function(a){a.preventDefault(),a.stopPropagation();var b=1*this.getAttribute("data-i");if(!(b<=0)){var d=c.getValue(),e=d[b-1];d[b-1]=d[b],d[b]=e,c.setValue(d),c.active_tab=c.rows[b-1].tab,c.refreshTabs(),c.onChange(!0)}}),f&&f.appendChild(c.rows[e].moveup_button)),c.hide_move_buttons||(c.rows[e].movedown_button=this.getButton("","movedown",this.translate("button_move_down_title")),c.rows[e].movedown_button.className+=" movedown",c.rows[e].movedown_button.setAttribute("data-i",e),c.rows[e].movedown_button.addEventListener("click",function(a){a.preventDefault(),a.stopPropagation();var b=1*this.getAttribute("data-i"),d=c.getValue();if(!(b>=d.length-1)){var e=d[b+1];d[b+1]=d[b],d[b]=e,c.setValue(d),c.active_tab=c.rows[b+1].tab,c.refreshTabs(),c.onChange(!0)}}),f&&f.appendChild(c.rows[e].movedown_button)),a&&c.rows[e].setValue(a,b),c.refreshTabs()},addControls:function(){var a=this;this.collapsed=!1,this.toggle_button=this.getButton("","collapse",this.translate("button_collapse")),this.title_controls.appendChild(this.toggle_button);var b=a.row_holder.style.display,c=a.controls.style.display;this.toggle_button.addEventListener("click",function(d){d.preventDefault(),d.stopPropagation(),a.collapsed?(a.collapsed=!1,a.panel&&(a.panel.style.display=""),a.row_holder.style.display=b,a.tabs_holder&&(a.tabs_holder.style.display=""),a.controls.style.display=c,a.setButtonText(this,"","collapse",a.translate("button_collapse"))):(a.collapsed=!0,a.row_holder.style.display="none",a.tabs_holder&&(a.tabs_holder.style.display="none"),a.controls.style.display="none",a.panel&&(a.panel.style.display="none"),a.setButtonText(this,"","expand",a.translate("button_expand")))}),
// If it should start collapsed
this.options.collapsed&&e(this.toggle_button,"click"),
// Collapse button disabled
this.schema.options&&"undefined"!=typeof this.schema.options.disable_collapse?this.schema.options.disable_collapse&&(this.toggle_button.style.display="none"):this.jsoneditor.options.disable_collapse&&(this.toggle_button.style.display="none"),
// Add "new row" and "delete last" buttons below editor
this.add_row_button=this.getButton(this.getItemTitle(),"add",this.translate("button_add_row_title",[this.getItemTitle()])),this.add_row_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation();var c=a.rows.length;a.row_cache[c]?(a.rows[c]=a.row_cache[c],a.rows[c].setValue(a.rows[c].getDefault(),!0),a.rows[c].container.style.display="",a.rows[c].tab&&(a.rows[c].tab.style.display=""),a.rows[c].register()):a.addRow(),a.active_tab=a.rows[c].tab,a.refreshTabs(),a.refreshValue(),a.onChange(!0)}),a.controls.appendChild(this.add_row_button),this.delete_last_row_button=this.getButton(this.translate("button_delete_last",[this.getItemTitle()]),"delete",this.translate("button_delete_last_title",[this.getItemTitle()])),this.delete_last_row_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation();var c=a.getValue(),d=null;a.rows.length>1&&a.rows[a.rows.length-1].tab===a.active_tab&&(d=a.rows[a.rows.length-2].tab),c.pop(),a.setValue(c),d&&(a.active_tab=d,a.refreshTabs()),a.onChange(!0)}),a.controls.appendChild(this.delete_last_row_button),this.remove_all_rows_button=this.getButton(this.translate("button_delete_all"),"delete",this.translate("button_delete_all_title")),this.remove_all_rows_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.setValue([]),a.onChange(!0)}),a.controls.appendChild(this.remove_all_rows_button),a.tabs&&(this.add_row_button.style.width="100%",this.add_row_button.style.textAlign="left",this.add_row_button.style.marginBottom="3px",this.delete_last_row_button.style.width="100%",this.delete_last_row_button.style.textAlign="left",this.delete_last_row_button.style.marginBottom="3px",this.remove_all_rows_button.style.width="100%",this.remove_all_rows_button.style.textAlign="left",this.remove_all_rows_button.style.marginBottom="3px")},showValidationErrors:function(a){var b=this,c=[],e=[];
// Show errors for this editor
if(d(a,function(a,d){d.path===b.path?c.push(d):e.push(d)}),this.error_holder)if(c.length){this.error_holder.innerHTML="",this.error_holder.style.display="",d(c,function(a,c){b.error_holder.appendChild(b.theme.getErrorMessage(c.message))})}else this.error_holder.style.display="none";
// Show errors for child editors
d(this.rows,function(a,b){b.showValidationErrors(e)})}}),f.defaults.editors.table=f.defaults.editors.array.extend({register:function(){if(this._super(),this.rows)for(var a=0;a<this.rows.length;a++)this.rows[a].register()},unregister:function(){if(this._super(),this.rows)for(var a=0;a<this.rows.length;a++)this.rows[a].unregister()},getNumColumns:function(){return Math.max(Math.min(12,this.width),3)},preBuild:function(){var a=this.jsoneditor.expandRefs(this.schema.items||{});this.item_title=a.title||"row",this.item_default=a["default"]||null,this.item_has_child_editors=a.properties||a.items,this.width=12,this._super()},build:function(){var a=this;this.table=this.theme.getTable(),this.container.appendChild(this.table),this.thead=this.theme.getTableHead(),this.table.appendChild(this.thead),this.header_row=this.theme.getTableRow(),this.thead.appendChild(this.header_row),this.row_holder=this.theme.getTableBody(),this.table.appendChild(this.row_holder);
// Determine the default value of array element
var b=this.getElementEditor(0,!0);if(this.item_default=b.getDefault(),this.width=b.getNumColumns()+2,this.options.compact?(this.panel=document.createElement("div"),this.container.appendChild(this.panel)):(this.title=this.theme.getHeader(this.getTitle()),this.container.appendChild(this.title),this.title_controls=this.theme.getHeaderButtonHolder(),this.title.appendChild(this.title_controls),this.schema.description&&(this.description=this.theme.getDescription(this.schema.description),this.container.appendChild(this.description)),this.panel=this.theme.getIndentedPanel(),this.container.appendChild(this.panel),this.error_holder=document.createElement("div"),this.panel.appendChild(this.error_holder)),this.panel.appendChild(this.table),this.controls=this.theme.getButtonHolder(),this.panel.appendChild(this.controls),this.item_has_child_editors)for(var c=b.getChildEditors(),d=b.property_order||Object.keys(c),e=0;e<d.length;e++){var f=a.theme.getTableHeaderCell(c[d[e]].getTitle());c[d[e]].options.hidden&&(f.style.display="none"),a.header_row.appendChild(f)}else a.header_row.appendChild(a.theme.getTableHeaderCell(this.item_title));b.destroy(),this.row_holder.innerHTML="",
// Row Controls column
this.controls_header_cell=a.theme.getTableHeaderCell(" "),a.header_row.appendChild(this.controls_header_cell),
// Add controls
this.addControls()},onChildEditorChange:function(a){this.refreshValue(),this._super()},getItemDefault:function(){return c({},{"default":this.item_default})["default"]},getItemTitle:function(){return this.item_title},getElementEditor:function(a,b){var d=c({},this.schema.items),e=this.jsoneditor.getEditorClass(d,this.jsoneditor),f=this.row_holder.appendChild(this.theme.getTableRow()),g=f;this.item_has_child_editors||(g=this.theme.getTableCell(),f.appendChild(g));var h=this.jsoneditor.createEditor(e,{jsoneditor:this.jsoneditor,schema:d,container:g,path:this.path+"."+a,parent:this,compact:!0,table_row:!0});return h.preBuild(),b||(h.build(),h.postBuild(),h.controls_cell=f.appendChild(this.theme.getTableCell()),h.row=f,h.table_controls=this.theme.getButtonHolder(),h.controls_cell.appendChild(h.table_controls),h.table_controls.style.margin=0,h.table_controls.style.padding=0),h},destroy:function(){this.innerHTML="",this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this.row_holder&&this.row_holder.parentNode&&this.row_holder.parentNode.removeChild(this.row_holder),this.table&&this.table.parentNode&&this.table.parentNode.removeChild(this.table),this.panel&&this.panel.parentNode&&this.panel.parentNode.removeChild(this.panel),this.rows=this.title=this.description=this.row_holder=this.table=this.panel=null,this._super()},setValue:function(a,b){
// Make sure value has between minItems and maxItems items in it
if(
// Update the array's value, adding/removing rows when necessary
a=a||[],this.schema.minItems)for(;a.length<this.schema.minItems;)a.push(this.getItemDefault());this.schema.maxItems&&a.length>this.schema.maxItems&&(a=a.slice(0,this.schema.maxItems));var c=JSON.stringify(a);if(c!==this.serialized){var e=!1,f=this;d(a,function(a,b){f.rows[a]?
// TODO: don't set the row's value if it hasn't changed
f.rows[a].setValue(b):(f.addRow(b),e=!0)});for(var g=a.length;g<f.rows.length;g++){var h=f.rows[g].container;f.item_has_child_editors||f.rows[g].row.parentNode.removeChild(f.rows[g].row),f.rows[g].destroy(),h.parentNode&&h.parentNode.removeChild(h),f.rows[g]=null,e=!0}f.rows=f.rows.slice(0,a.length),f.refreshValue(),(e||b)&&f.refreshRowButtons(),f.onChange()}},refreshRowButtons:function(){var a=this,b=this.schema.minItems&&this.schema.minItems>=this.rows.length,c=!1;d(this.rows,function(d,e){
// Hide the move down button for the last row
e.movedown_button&&(d===a.rows.length-1?e.movedown_button.style.display="none":(c=!0,e.movedown_button.style.display="")),
// Hide the delete button if we have minItems items
e.delete_button&&(b?e.delete_button.style.display="none":(c=!0,e.delete_button.style.display="")),e.moveup_button&&(c=!0)}),
// Show/hide controls column in table
d(this.rows,function(a,b){c?b.controls_cell.style.display="":b.controls_cell.style.display="none"}),c?this.controls_header_cell.style.display="":this.controls_header_cell.style.display="none";var e=!1;this.value.length?1===this.value.length?(this.table.style.display="",this.remove_all_rows_button.style.display="none",
// If there are minItems items in the array, or configured to hide the delete_last_row button, hide the delete button beneath the rows
b||this.hide_delete_last_row_buttons?this.delete_last_row_button.style.display="none":(this.delete_last_row_button.style.display="",e=!0)):(this.table.style.display="",b||this.hide_delete_last_row_buttons?this.delete_last_row_button.style.display="none":(this.delete_last_row_button.style.display="",e=!0),b||this.hide_delete_all_rows_buttons?this.remove_all_rows_button.style.display="none":(this.remove_all_rows_button.style.display="",e=!0)):(this.delete_last_row_button.style.display="none",this.remove_all_rows_button.style.display="none",this.table.style.display="none"),
// If there are maxItems in the array, hide the add button beneath the rows
this.schema.maxItems&&this.schema.maxItems<=this.rows.length||this.hide_add_button?this.add_row_button.style.display="none":(this.add_row_button.style.display="",e=!0),e?this.controls.style.display="":this.controls.style.display="none"},refreshValue:function(){var a=this;this.value=[],d(this.rows,function(b,c){
// Get the value for this editor
a.value[b]=c.getValue()}),this.serialized=JSON.stringify(this.value)},addRow:function(a){var b=this,c=this.rows.length;b.rows[c]=this.getElementEditor(c);var e=b.rows[c].table_controls;
// Buttons to delete row, move row up, and move row down
this.hide_delete_buttons||(b.rows[c].delete_button=this.getButton("","delete",this.translate("button_delete_row_title_short")),b.rows[c].delete_button.className+=" delete",b.rows[c].delete_button.setAttribute("data-i",c),b.rows[c].delete_button.addEventListener("click",function(a){a.preventDefault(),a.stopPropagation();var c=1*this.getAttribute("data-i"),e=b.getValue(),f=[];d(e,function(a,b){a!==c&&// If this is the one we're deleting
f.push(b)}),b.setValue(f),b.onChange(!0)}),e.appendChild(b.rows[c].delete_button)),c&&!this.hide_move_buttons&&(b.rows[c].moveup_button=this.getButton("","moveup",this.translate("button_move_up_title")),b.rows[c].moveup_button.className+=" moveup",b.rows[c].moveup_button.setAttribute("data-i",c),b.rows[c].moveup_button.addEventListener("click",function(a){a.preventDefault(),a.stopPropagation();var c=1*this.getAttribute("data-i");if(!(c<=0)){var d=b.getValue(),e=d[c-1];d[c-1]=d[c],d[c]=e,b.setValue(d),b.onChange(!0)}}),e.appendChild(b.rows[c].moveup_button)),this.hide_move_buttons||(b.rows[c].movedown_button=this.getButton("","movedown",this.translate("button_move_down_title")),b.rows[c].movedown_button.className+=" movedown",b.rows[c].movedown_button.setAttribute("data-i",c),b.rows[c].movedown_button.addEventListener("click",function(a){a.preventDefault(),a.stopPropagation();var c=1*this.getAttribute("data-i"),d=b.getValue();if(!(c>=d.length-1)){var e=d[c+1];d[c+1]=d[c],d[c]=e,b.setValue(d),b.onChange(!0)}}),e.appendChild(b.rows[c].movedown_button)),a&&b.rows[c].setValue(a)},addControls:function(){var a=this;this.collapsed=!1,this.toggle_button=this.getButton("","collapse",this.translate("button_collapse")),this.title_controls&&(this.title_controls.appendChild(this.toggle_button),this.toggle_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.collapsed?(a.collapsed=!1,a.panel.style.display="",a.setButtonText(this,"","collapse",a.translate("button_collapse"))):(a.collapsed=!0,a.panel.style.display="none",a.setButtonText(this,"","expand",a.translate("button_expand")))}),
// If it should start collapsed
this.options.collapsed&&e(this.toggle_button,"click"),
// Collapse button disabled
this.schema.options&&"undefined"!=typeof this.schema.options.disable_collapse?this.schema.options.disable_collapse&&(this.toggle_button.style.display="none"):this.jsoneditor.options.disable_collapse&&(this.toggle_button.style.display="none")),
// Add "new row" and "delete last" buttons below editor
this.add_row_button=this.getButton(this.getItemTitle(),"add",this.translate("button_add_row_title",[this.getItemTitle()])),this.add_row_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.addRow(),a.refreshValue(),a.refreshRowButtons(),a.onChange(!0)}),a.controls.appendChild(this.add_row_button),this.delete_last_row_button=this.getButton(this.translate("button_delete_last",[this.getItemTitle()]),"delete",this.translate("button_delete_last_title",[this.getItemTitle()])),this.delete_last_row_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation();var c=a.getValue();c.pop(),a.setValue(c),a.onChange(!0)}),a.controls.appendChild(this.delete_last_row_button),this.remove_all_rows_button=this.getButton(this.translate("button_delete_all"),"delete",this.translate("button_delete_all_title")),this.remove_all_rows_button.addEventListener("click",function(b){b.preventDefault(),b.stopPropagation(),a.setValue([]),a.onChange(!0)}),a.controls.appendChild(this.remove_all_rows_button)}}),
// Multiple Editor (for when `type` is an array)
f.defaults.editors.multiple=f.AbstractEditor.extend({register:function(){if(this.editors){for(var a=0;a<this.editors.length;a++)this.editors[a]&&this.editors[a].unregister();this.editors[this.type]&&this.editors[this.type].register()}this._super()},unregister:function(){if(this._super(),this.editors)for(var a=0;a<this.editors.length;a++)this.editors[a]&&this.editors[a].unregister()},getNumColumns:function(){return this.editors[this.type]?Math.max(this.editors[this.type].getNumColumns(),4):4},enable:function(){if(this.editors)for(var a=0;a<this.editors.length;a++)this.editors[a]&&this.editors[a].enable();this.switcher.disabled=!1,this._super()},disable:function(){if(this.editors)for(var a=0;a<this.editors.length;a++)this.editors[a]&&this.editors[a].disable();this.switcher.disabled=!0,this._super()},switchEditor:function(a){var b=this;this.editors[a]||this.buildChildEditor(a);var c=b.getValue();b.type=a,b.register(),d(b.editors,function(a,d){d&&(b.type===a?(b.keep_values&&d.setValue(c,!0),d.container.style.display=""):d.container.style.display="none")}),b.refreshValue(),b.refreshHeaderText()},buildChildEditor:function(a){var b=this,d=this.types[a],e=b.theme.getChildEditorHolder();b.editor_holder.appendChild(e);var f;"string"==typeof d?(f=c({},b.schema),f.type=d):(f=c({},b.schema,d),f=b.jsoneditor.expandRefs(f),
// If we need to merge `required` arrays
d.required&&Array.isArray(d.required)&&b.schema.required&&Array.isArray(b.schema.required)&&(f.required=b.schema.required.concat(d.required)));var g=b.jsoneditor.getEditorClass(f);b.editors[a]=b.jsoneditor.createEditor(g,{jsoneditor:b.jsoneditor,schema:f,container:e,path:b.path,parent:b,required:!0}),b.editors[a].preBuild(),b.editors[a].build(),b.editors[a].postBuild(),b.editors[a].header&&(b.editors[a].header.style.display="none"),b.editors[a].option=b.switcher_options[a],e.addEventListener("change_header_text",function(){b.refreshHeaderText()}),a!==b.type&&(e.style.display="none")},preBuild:function(){if(this.types=[],this.type=0,this.editors=[],this.validators=[],this.keep_values=!0,"undefined"!=typeof this.jsoneditor.options.keep_oneof_values&&(this.keep_values=this.jsoneditor.options.keep_oneof_values),"undefined"!=typeof this.options.keep_oneof_values&&(this.keep_values=this.options.keep_oneof_values),this.schema.oneOf)this.oneOf=!0,this.types=this.schema.oneOf,delete this.schema.oneOf;else if(this.schema.anyOf)this.anyOf=!0,this.types=this.schema.anyOf,delete this.schema.anyOf;else{if(this.schema.type&&"any"!==this.schema.type)Array.isArray(this.schema.type)?this.types=this.schema.type:this.types=[this.schema.type];else
// If any of these primitive types are disallowed
if(this.types=["string","number","integer","boolean","object","array","null"],this.schema.disallow){var a=this.schema.disallow;"object"==typeof a&&Array.isArray(a)||(a=[a]);var b=[];d(this.types,function(c,d){a.indexOf(d)===-1&&b.push(d)}),this.types=b}delete this.schema.type}this.display_text=this.getDisplayText(this.types)},build:function(){var a=this,b=this.container;this.header=this.label=this.theme.getFormInputLabel(this.getTitle()),this.container.appendChild(this.header),this.switcher=this.theme.getSwitcher(this.display_text),b.appendChild(this.switcher),this.switcher.addEventListener("change",function(b){b.preventDefault(),b.stopPropagation(),a.switchEditor(a.display_text.indexOf(this.value)),a.onChange(!0)}),this.editor_holder=document.createElement("div"),b.appendChild(this.editor_holder);var e={};a.jsoneditor.options.custom_validators&&(e.custom_validators=a.jsoneditor.options.custom_validators),this.switcher_options=this.theme.getSwitcherOptions(this.switcher),d(this.types,function(b,d){a.editors[b]=!1;var g;"string"==typeof d?(g=c({},a.schema),g.type=d):(g=c({},a.schema,d),
// If we need to merge `required` arrays
d.required&&Array.isArray(d.required)&&a.schema.required&&Array.isArray(a.schema.required)&&(g.required=a.schema.required.concat(d.required))),a.validators[b]=new f.Validator(a.jsoneditor,g,e)}),this.switchEditor(0)},onChildEditorChange:function(a){this.editors[this.type]&&(this.refreshValue(),this.refreshHeaderText()),this._super()},refreshHeaderText:function(){var a=this.getDisplayText(this.types);d(this.switcher_options,function(b,c){c.textContent=a[b]})},refreshValue:function(){this.value=this.editors[this.type].getValue()},setValue:function(a,b){
// Determine type by getting the first one that validates
var c=this;d(this.validators,function(b,d){if(!d.validate(a).length)return c.type=b,c.switcher.value=c.display_text[b],!1}),this.switchEditor(this.type),this.editors[this.type].setValue(a,b),this.refreshValue(),c.onChange()},destroy:function(){d(this.editors,function(a,b){b&&b.destroy()}),this.editor_holder&&this.editor_holder.parentNode&&this.editor_holder.parentNode.removeChild(this.editor_holder),this.switcher&&this.switcher.parentNode&&this.switcher.parentNode.removeChild(this.switcher),this._super()},showValidationErrors:function(a){var b=this;
// oneOf and anyOf error paths need to remove the oneOf[i] part before passing to child editors
if(this.oneOf||this.anyOf){var e=this.oneOf?"oneOf":"anyOf";d(this.editors,function(f,g){if(g){var h=b.path+"."+e+"["+f+"]",i=[];d(a,function(a,d){if(d.path.substr(0,h.length)===h){var e=c({},d);e.path=b.path+e.path.substr(h.length),i.push(e)}}),g.showValidationErrors(i)}})}else d(this.editors,function(b,c){c&&c.showValidationErrors(a)})}}),
// Enum Editor (used for objects and arrays with enumerated values)
f.defaults.editors["enum"]=f.AbstractEditor.extend({getNumColumns:function(){return 4},build:function(){this.container;this.title=this.header=this.label=this.theme.getFormInputLabel(this.getTitle()),this.container.appendChild(this.title),this.options.enum_titles=this.options.enum_titles||[],this["enum"]=this.schema["enum"],this.selected=0,this.select_options=[],this.html_values=[];for(var a=this,b=0;b<this["enum"].length;b++)this.select_options[b]=this.options.enum_titles[b]||"Value "+(b+1),this.html_values[b]=this.getHTML(this["enum"][b]);
// Switcher
this.switcher=this.theme.getSwitcher(this.select_options),this.container.appendChild(this.switcher),
// Display area
this.display_area=this.theme.getIndentedPanel(),this.container.appendChild(this.display_area),this.options.hide_display&&(this.display_area.style.display="none"),this.switcher.addEventListener("change",function(){a.selected=a.select_options.indexOf(this.value),a.value=a["enum"][a.selected],a.refreshValue(),a.onChange(!0)}),this.value=this["enum"][0],this.refreshValue(),1===this["enum"].length&&(this.switcher.style.display="none")},refreshValue:function(){var a=this;a.selected=-1;var b=JSON.stringify(this.value);return d(this["enum"],function(c,d){if(b===JSON.stringify(d))return a.selected=c,!1}),a.selected<0?void a.setValue(a["enum"][0]):(this.switcher.value=this.select_options[this.selected],void(this.display_area.innerHTML=this.html_values[this.selected]))},enable:function(){this.always_disabled||(this.switcher.disabled=!1),this._super()},disable:function(){this.switcher.disabled=!0,this._super()},getHTML:function(a){var b=this;if(null===a)return"<em>null</em>";if("object"==typeof a){
// TODO: use theme
var c="";return d(a,function(d,e){var f=b.getHTML(e);
// Add the keys to object children
Array.isArray(a)||(
// TODO: use theme
f="<div><em>"+d+"</em>: "+f+"</div>"),
// TODO: use theme
c+="<li>"+f+"</li>"}),c=Array.isArray(a)?"<ol>"+c+"</ol>":"<ul style='margin-top:0;margin-bottom:0;padding-top:0;padding-bottom:0;'>"+c+"</ul>"}return"boolean"==typeof a?a?"true":"false":"string"==typeof a?a.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"):a},setValue:function(a){this.value!==a&&(this.value=a,this.refreshValue(),this.onChange())},destroy:function(){this.display_area&&this.display_area.parentNode&&this.display_area.parentNode.removeChild(this.display_area),this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.switcher&&this.switcher.parentNode&&this.switcher.parentNode.removeChild(this.switcher),this._super()}}),f.defaults.editors.select=f.AbstractEditor.extend({setValue:function(a,b){a=this.typecast(a||"");
// Sanitize value before setting it
var c=a;this.enum_values.indexOf(c)<0&&(c=this.enum_values[0]),this.value!==c&&(this.input.value=this.enum_options[this.enum_values.indexOf(c)],this.select2&&this.select2.select2("val",this.input.value),this.value=c,this.onChange())},register:function(){this._super(),this.input&&this.input.setAttribute("name",this.formname)},unregister:function(){this._super(),this.input&&this.input.removeAttribute("name")},getNumColumns:function(){if(!this.enum_options)return 3;for(var a=this.getTitle().length,b=0;b<this.enum_options.length;b++)a=Math.max(a,this.enum_options[b].length+4);return Math.min(12,Math.max(a/7,2))},typecast:function(a){return"boolean"===this.schema.type?!!a:"number"===this.schema.type?1*a:"integer"===this.schema.type?Math.floor(1*a):""+a},getValue:function(){return this.value},preBuild:function(){var a=this;this.input_type="select",this.enum_options=[],this.enum_values=[],this.enum_display=[];var b;
// Enum options enumerated
if(this.schema["enum"]){var e=this.schema.options&&this.schema.options.enum_titles||[];d(this.schema["enum"],function(b,c){a.enum_options[b]=""+c,a.enum_display[b]=""+(e[b]||c),a.enum_values[b]=a.typecast(c)}),this.isRequired()||(a.enum_display.unshift(" "),a.enum_options.unshift("undefined"),a.enum_values.unshift(void 0))}else if("boolean"===this.schema.type)a.enum_display=this.schema.options&&this.schema.options.enum_titles||["true","false"],a.enum_options=["1",""],a.enum_values=[!0,!1],this.isRequired()||(a.enum_display.unshift(" "),a.enum_options.unshift("undefined"),a.enum_values.unshift(void 0));else{if(!this.schema.enumSource)throw"'select' editor requires the enum property to be set.";
// Shortcut declaration for using a single array
if(this.enumSource=[],this.enum_display=[],this.enum_options=[],this.enum_values=[],Array.isArray(this.schema.enumSource))for(b=0;b<this.schema.enumSource.length;b++)
// Shorthand for watched variable
"string"==typeof this.schema.enumSource[b]?this.enumSource[b]={source:this.schema.enumSource[b]}:Array.isArray(this.schema.enumSource[b])?this.enumSource[b]=this.schema.enumSource[b]:this.enumSource[b]=c({},this.schema.enumSource[b]);else this.schema.enumValue?this.enumSource=[{source:this.schema.enumSource,value:this.schema.enumValue}]:this.enumSource=[{source:this.schema.enumSource}];
// Now, enumSource is an array of sources
// Walk through this array and fix up the values
for(b=0;b<this.enumSource.length;b++)this.enumSource[b].value&&(this.enumSource[b].value=this.jsoneditor.compileTemplate(this.enumSource[b].value,this.template_engine)),this.enumSource[b].title&&(this.enumSource[b].title=this.jsoneditor.compileTemplate(this.enumSource[b].title,this.template_engine)),this.enumSource[b].filter&&(this.enumSource[b].filter=this.jsoneditor.compileTemplate(this.enumSource[b].filter,this.template_engine))}},build:function(){var a=this;this.options.compact||(this.header=this.label=this.theme.getFormInputLabel(this.getTitle())),this.schema.description&&(this.description=this.theme.getFormInputDescription(this.schema.description)),this.options.compact&&(this.container.className+=" compact"),this.input=this.theme.getSelectInput(this.enum_options),this.theme.setSelectOptions(this.input,this.enum_options,this.enum_display),(this.schema.readOnly||this.schema.readonly)&&(this.always_disabled=!0,this.input.disabled=!0),this.input.addEventListener("change",function(b){b.preventDefault(),b.stopPropagation(),a.onInputChange()}),this.control=this.theme.getFormControl(this.label,this.input,this.description),this.container.appendChild(this.control),this.value=this.enum_values[0]},onInputChange:function(){var a,b=this.input.value;
// Invalid option, use first option instead
a=this.enum_options.indexOf(b)===-1?this.enum_values[0]:this.enum_values[this.enum_options.indexOf(b)],
// If valid hasn't changed
a!==this.value&&(
// Store new value and propogate change event
this.value=a,this.onChange(!0))},setupSelect2:function(){
// If the Select2 library is loaded use it when we have lots of items
if(window.jQuery&&window.jQuery.fn&&window.jQuery.fn.select2&&(this.enum_options.length>2||this.enum_options.length&&this.enumSource)){var a=c({},f.plugins.select2);this.schema.options&&this.schema.options.select2_options&&(a=c(a,this.schema.options.select2_options)),this.select2=window.jQuery(this.input).select2(a);var b=this;this.select2.on("select2-blur",function(){b.input.value=b.select2.select2("val"),b.onInputChange()}),this.select2.on("change",function(){b.input.value=b.select2.select2("val"),b.onInputChange()})}else this.select2=null},postBuild:function(){this._super(),this.theme.afterInputReady(this.input),this.setupSelect2()},onWatchedFieldChange:function(){var a,b;
// If this editor uses a dynamic select box
if(this.enumSource){a=this.getWatchedFieldValues();for(var c=[],d=[],e=0;e<this.enumSource.length;e++)
// Constant values
if(Array.isArray(this.enumSource[e]))c=c.concat(this.enumSource[e]),d=d.concat(this.enumSource[e]);else{var f=[];if(
// Static list of items
f=Array.isArray(this.enumSource[e].source)?this.enumSource[e].source:a[this.enumSource[e].source]){
// Filter the items
if(
// Only use a predefined part of the array
this.enumSource[e].slice&&(f=Array.prototype.slice.apply(f,this.enumSource[e].slice)),this.enumSource[e].filter){var g=[];for(b=0;b<f.length;b++)this.enumSource[e].filter({i:b,item:f[b],watched:a})&&g.push(f[b]);f=g}var h=[],i=[];for(b=0;b<f.length;b++){var j=f[b];
// Rendered value
this.enumSource[e].value?i[b]=this.enumSource[e].value({i:b,item:j}):i[b]=f[b],
// Rendered title
this.enumSource[e].title?h[b]=this.enumSource[e].title({i:b,item:j}):h[b]=i[b]}
// TODO: sort
c=c.concat(i),d=d.concat(h)}}var k=this.value;this.theme.setSelectOptions(this.input,c,d),this.enum_options=c,this.enum_display=d,this.enum_values=c,this.select2&&this.select2.select2("destroy"),
// If the previous value is still in the new select options, stick with it
c.indexOf(k)!==-1?(this.input.value=k,this.value=k):(this.input.value=c[0],this.value=c[0]||"",this.parent?this.parent.onChildEditorChange(this):this.jsoneditor.onChange(),this.jsoneditor.notifyWatchers(this.path)),this.setupSelect2()}this._super()},enable:function(){this.always_disabled||(this.input.disabled=!1,this.select2&&this.select2.select2("enable",!0)),this._super()},disable:function(){this.input.disabled=!0,this.select2&&this.select2.select2("enable",!1),this._super()},destroy:function(){this.label&&this.label.parentNode&&this.label.parentNode.removeChild(this.label),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this.select2&&(this.select2.select2("destroy"),this.select2=null),this._super()}}),f.defaults.editors.selectize=f.AbstractEditor.extend({setValue:function(a,b){a=this.typecast(a||"");
// Sanitize value before setting it
var c=a;this.enum_values.indexOf(c)<0&&(c=this.enum_values[0]),this.value!==c&&(this.input.value=this.enum_options[this.enum_values.indexOf(c)],this.selectize&&this.selectize[0].selectize.addItem(c),this.value=c,this.onChange())},register:function(){this._super(),this.input&&this.input.setAttribute("name",this.formname)},unregister:function(){this._super(),this.input&&this.input.removeAttribute("name")},getNumColumns:function(){if(!this.enum_options)return 3;for(var a=this.getTitle().length,b=0;b<this.enum_options.length;b++)a=Math.max(a,this.enum_options[b].length+4);return Math.min(12,Math.max(a/7,2))},typecast:function(a){return"boolean"===this.schema.type?!!a:"number"===this.schema.type?1*a:"integer"===this.schema.type?Math.floor(1*a):""+a},getValue:function(){return this.value},preBuild:function(){var a=this;this.input_type="select",this.enum_options=[],this.enum_values=[],this.enum_display=[];var b;
// Enum options enumerated
if(this.schema["enum"]){var e=this.schema.options&&this.schema.options.enum_titles||[];d(this.schema["enum"],function(b,c){a.enum_options[b]=""+c,a.enum_display[b]=""+(e[b]||c),a.enum_values[b]=a.typecast(c)})}else if("boolean"===this.schema.type)a.enum_display=this.schema.options&&this.schema.options.enum_titles||["true","false"],a.enum_options=["1","0"],a.enum_values=[!0,!1];else{if(!this.schema.enumSource)throw"'select' editor requires the enum property to be set.";
// Shortcut declaration for using a single array
if(this.enumSource=[],this.enum_display=[],this.enum_options=[],this.enum_values=[],Array.isArray(this.schema.enumSource))for(b=0;b<this.schema.enumSource.length;b++)
// Shorthand for watched variable
"string"==typeof this.schema.enumSource[b]?this.enumSource[b]={source:this.schema.enumSource[b]}:Array.isArray(this.schema.enumSource[b])?this.enumSource[b]=this.schema.enumSource[b]:this.enumSource[b]=c({},this.schema.enumSource[b]);else this.schema.enumValue?this.enumSource=[{source:this.schema.enumSource,value:this.schema.enumValue}]:this.enumSource=[{source:this.schema.enumSource}];
// Now, enumSource is an array of sources
// Walk through this array and fix up the values
for(b=0;b<this.enumSource.length;b++)this.enumSource[b].value&&(this.enumSource[b].value=this.jsoneditor.compileTemplate(this.enumSource[b].value,this.template_engine)),this.enumSource[b].title&&(this.enumSource[b].title=this.jsoneditor.compileTemplate(this.enumSource[b].title,this.template_engine)),this.enumSource[b].filter&&(this.enumSource[b].filter=this.jsoneditor.compileTemplate(this.enumSource[b].filter,this.template_engine))}},build:function(){var a=this;this.options.compact||(this.header=this.label=this.theme.getFormInputLabel(this.getTitle())),this.schema.description&&(this.description=this.theme.getFormInputDescription(this.schema.description)),this.options.compact&&(this.container.className+=" compact"),this.input=this.theme.getSelectInput(this.enum_options),this.theme.setSelectOptions(this.input,this.enum_options,this.enum_display),(this.schema.readOnly||this.schema.readonly)&&(this.always_disabled=!0,this.input.disabled=!0),this.input.addEventListener("change",function(b){b.preventDefault(),b.stopPropagation(),a.onInputChange()}),this.control=this.theme.getFormControl(this.label,this.input,this.description),this.container.appendChild(this.control),this.value=this.enum_values[0]},onInputChange:function(){var a=this.input.value,b=a;this.enum_options.indexOf(a)===-1&&(b=this.enum_options[0]),this.value=this.enum_values[this.enum_options.indexOf(a)],this.onChange(!0)},setupSelectize:function(){
// If the Selectize library is loaded use it when we have lots of items
var a=this;if(window.jQuery&&window.jQuery.fn&&window.jQuery.fn.selectize&&(this.enum_options.length>=2||this.enum_options.length&&this.enumSource)){var b=c({},f.plugins.selectize);this.schema.options&&this.schema.options.selectize_options&&(b=c(b,this.schema.options.selectize_options)),this.selectize=window.jQuery(this.input).selectize(c(b,{create:!0,onChange:function(){a.onInputChange()}}))}else this.selectize=null},postBuild:function(){this._super(),this.theme.afterInputReady(this.input),this.setupSelectize()},onWatchedFieldChange:function(){var a,b;
// If this editor uses a dynamic select box
if(this.enumSource){a=this.getWatchedFieldValues();for(var c=[],d=[],e=0;e<this.enumSource.length;e++)
// Constant values
if(Array.isArray(this.enumSource[e]))c=c.concat(this.enumSource[e]),d=d.concat(this.enumSource[e]);else if(a[this.enumSource[e].source]){var f=a[this.enumSource[e].source];
// Filter the items
if(
// Only use a predefined part of the array
this.enumSource[e].slice&&(f=Array.prototype.slice.apply(f,this.enumSource[e].slice)),this.enumSource[e].filter){var g=[];for(b=0;b<f.length;b++)this.enumSource[e].filter({i:b,item:f[b]})&&g.push(f[b]);f=g}var h=[],i=[];for(b=0;b<f.length;b++){var j=f[b];
// Rendered value
this.enumSource[e].value?i[b]=this.enumSource[e].value({i:b,item:j}):i[b]=f[b],
// Rendered title
this.enumSource[e].title?h[b]=this.enumSource[e].title({i:b,item:j}):h[b]=i[b]}
// TODO: sort
c=c.concat(i),d=d.concat(h)}var k=this.value;this.theme.setSelectOptions(this.input,c,d),this.enum_options=c,this.enum_display=d,this.enum_values=c,
// If the previous value is still in the new select options, stick with it
c.indexOf(k)!==-1?(this.input.value=k,this.value=k):(this.input.value=c[0],this.value=c[0]||"",this.parent?this.parent.onChildEditorChange(this):this.jsoneditor.onChange(),this.jsoneditor.notifyWatchers(this.path)),this.selectize?
// Update the Selectize options
this.updateSelectizeOptions(c):this.setupSelectize(),this._super()}},updateSelectizeOptions:function(a){var b=this.selectize[0].selectize,c=this;b.off(),b.clearOptions();for(var d in a)b.addOption({value:a[d],text:a[d]});b.addItem(this.value),b.on("change",function(){c.onInputChange()})},enable:function(){this.always_disabled||(this.input.disabled=!1,this.selectize&&this.selectize[0].selectize.unlock()),this._super()},disable:function(){this.input.disabled=!0,this.selectize&&this.selectize[0].selectize.lock(),this._super()},destroy:function(){this.label&&this.label.parentNode&&this.label.parentNode.removeChild(this.label),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this.selectize&&(this.selectize[0].selectize.destroy(),this.selectize=null),this._super()}}),f.defaults.editors.multiselect=f.AbstractEditor.extend({preBuild:function(){this._super();var a;this.select_options={},this.select_values={};var b=this.jsoneditor.expandRefs(this.schema.items||{}),c=b["enum"]||[],d=b.options?b.options.enum_titles||[]:[];for(this.option_keys=[],this.option_titles=[],a=0;a<c.length;a++)
// If the sanitized value is different from the enum value, don't include it
this.sanitize(c[a])===c[a]&&(this.option_keys.push(c[a]+""),this.option_titles.push((d[a]||c[a])+""),this.select_values[c[a]+""]=c[a])},build:function(){var a,b=this;if(this.options.compact||(this.header=this.label=this.theme.getFormInputLabel(this.getTitle())),this.schema.description&&(this.description=this.theme.getFormInputDescription(this.schema.description)),!this.schema.format&&this.option_keys.length<8||"checkbox"===this.schema.format){for(this.input_type="checkboxes",this.inputs={},this.controls={},a=0;a<this.option_keys.length;a++){this.inputs[this.option_keys[a]]=this.theme.getCheckbox(),this.select_options[this.option_keys[a]]=this.inputs[this.option_keys[a]];var c=this.theme.getCheckboxLabel(this.option_titles[a]);this.controls[this.option_keys[a]]=this.theme.getFormControl(c,this.inputs[this.option_keys[a]])}this.control=this.theme.getMultiCheckboxHolder(this.controls,this.label,this.description)}else{for(this.input_type="select",this.input=this.theme.getSelectInput(this.option_keys),this.theme.setSelectOptions(this.input,this.option_keys,this.option_titles),this.input.multiple=!0,this.input.size=Math.min(10,this.option_keys.length),a=0;a<this.option_keys.length;a++)this.select_options[this.option_keys[a]]=this.input.children[a];(this.schema.readOnly||this.schema.readonly)&&(this.always_disabled=!0,this.input.disabled=!0),this.control=this.theme.getFormControl(this.label,this.input,this.description)}this.container.appendChild(this.control),this.control.addEventListener("change",function(c){c.preventDefault(),c.stopPropagation();var d=[];for(a=0;a<b.option_keys.length;a++)(b.select_options[b.option_keys[a]].selected||b.select_options[b.option_keys[a]].checked)&&d.push(b.select_values[b.option_keys[a]]);b.updateValue(d),b.onChange(!0)})},setValue:function(a,b){var c;
// Make sure we are dealing with an array of strings so we can check for strict equality
for(a=a||[],"object"!=typeof a?a=[a]:Array.isArray(a)||(a=[]),c=0;c<a.length;c++)"string"!=typeof a[c]&&(a[c]+="");
// Update selected status of options
for(c in this.select_options)this.select_options.hasOwnProperty(c)&&(this.select_options[c]["select"===this.input_type?"selected":"checked"]=a.indexOf(c)!==-1);this.updateValue(a),this.onChange()},setupSelect2:function(){if(window.jQuery&&window.jQuery.fn&&window.jQuery.fn.select2){var a=window.jQuery.extend({},f.plugins.select2);this.schema.options&&this.schema.options.select2_options&&(a=c(a,this.schema.options.select2_options)),this.select2=window.jQuery(this.input).select2(a);var b=this;this.select2.on("select2-blur",function(){var a=b.select2.select2("val");b.value=a,b.onChange(!0)})}else this.select2=null},onInputChange:function(){this.value=this.input.value,this.onChange(!0)},postBuild:function(){this._super(),this.setupSelect2()},register:function(){this._super(),this.input&&this.input.setAttribute("name",this.formname)},unregister:function(){this._super(),this.input&&this.input.removeAttribute("name")},getNumColumns:function(){var a=this.getTitle().length;for(var b in this.select_values)this.select_values.hasOwnProperty(b)&&(a=Math.max(a,(this.select_values[b]+"").length+4));return Math.min(12,Math.max(a/7,2))},updateValue:function(a){for(var b=!1,c=[],d=0;d<a.length;d++)if(this.select_options[a[d]+""]){var e=this.sanitize(this.select_values[a[d]]);c.push(e),e!==a[d]&&(b=!0)}else b=!0;return this.value=c,this.select2&&this.select2.select2("val",this.value),b},sanitize:function(a){return"number"===this.schema.items.type?1*a:"integer"===this.schema.items.type?Math.floor(1*a):""+a},enable:function(){if(!this.always_disabled){if(this.input)this.input.disabled=!1;else if(this.inputs)for(var a in this.inputs)this.inputs.hasOwnProperty(a)&&(this.inputs[a].disabled=!1);this.select2&&this.select2.select2("enable",!0)}this._super()},disable:function(){if(this.input)this.input.disabled=!0;else if(this.inputs)for(var a in this.inputs)this.inputs.hasOwnProperty(a)&&(this.inputs[a].disabled=!0);this.select2&&this.select2.select2("enable",!1),this._super()},destroy:function(){this.select2&&(this.select2.select2("destroy"),this.select2=null),this._super()}}),f.defaults.editors.base64=f.AbstractEditor.extend({getNumColumns:function(){return 4},build:function(){var a=this;
// Don't show uploader if this is readonly
if(this.title=this.header=this.label=this.theme.getFormInputLabel(this.getTitle()),
// Input that holds the base64 string
this.input=this.theme.getFormInputField("hidden"),this.container.appendChild(this.input),!this.schema.readOnly&&!this.schema.readonly){if(!window.FileReader)throw"FileReader required for base64 editor";
// File uploader
this.uploader=this.theme.getFormInputField("file"),this.uploader.addEventListener("change",function(b){if(b.preventDefault(),b.stopPropagation(),this.files&&this.files.length){var c=new FileReader;c.onload=function(b){a.value=b.target.result,a.refreshPreview(),a.onChange(!0),c=null},c.readAsDataURL(this.files[0])}})}this.preview=this.theme.getFormInputDescription(this.schema.description),this.container.appendChild(this.preview),this.control=this.theme.getFormControl(this.label,this.uploader||this.input,this.preview),this.container.appendChild(this.control)},refreshPreview:function(){if(this.last_preview!==this.value&&(this.last_preview=this.value,this.preview.innerHTML="",this.value)){var a=this.value.match(/^data:([^;,]+)[;,]/);if(a&&(a=a[1]),a){if(this.preview.innerHTML="<strong>Type:</strong> "+a+", <strong>Size:</strong> "+Math.floor((this.value.length-this.value.split(",")[0].length-1)/1.33333)+" bytes","image"===a.substr(0,5)){this.preview.innerHTML+="<br>";var b=document.createElement("img");b.style.maxWidth="100%",b.style.maxHeight="100px",b.src=this.value,this.preview.appendChild(b)}}else this.preview.innerHTML="<em>Invalid data URI</em>"}},enable:function(){this.uploader&&(this.uploader.disabled=!1),this._super()},disable:function(){this.uploader&&(this.uploader.disabled=!0),this._super()},setValue:function(a){this.value!==a&&(this.value=a,this.input.value=this.value,this.refreshPreview(),this.onChange())},destroy:function(){this.preview&&this.preview.parentNode&&this.preview.parentNode.removeChild(this.preview),this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this.uploader&&this.uploader.parentNode&&this.uploader.parentNode.removeChild(this.uploader),this._super()}}),f.defaults.editors.upload=f.AbstractEditor.extend({getNumColumns:function(){return 4},build:function(){var a=this;
// Don't show uploader if this is readonly
if(this.title=this.header=this.label=this.theme.getFormInputLabel(this.getTitle()),
// Input that holds the base64 string
this.input=this.theme.getFormInputField("hidden"),this.container.appendChild(this.input),!this.schema.readOnly&&!this.schema.readonly){if(!this.jsoneditor.options.upload)throw"Upload handler required for upload editor";
// File uploader
this.uploader=this.theme.getFormInputField("file"),this.uploader.addEventListener("change",function(b){if(b.preventDefault(),b.stopPropagation(),this.files&&this.files.length){var c=new FileReader;c.onload=function(b){a.preview_value=b.target.result,a.refreshPreview(),a.onChange(!0),c=null},c.readAsDataURL(this.files[0])}})}var b=this.schema.description;b||(b=""),this.preview=this.theme.getFormInputDescription(b),this.container.appendChild(this.preview),this.control=this.theme.getFormControl(this.label,this.uploader||this.input,this.preview),this.container.appendChild(this.control)},refreshPreview:function(){if(this.last_preview!==this.preview_value&&(this.last_preview=this.preview_value,this.preview.innerHTML="",this.preview_value)){var a=this,b=this.preview_value.match(/^data:([^;,]+)[;,]/);b&&(b=b[1]),b||(b="unknown");var c=this.uploader.files[0];if(this.preview.innerHTML="<strong>Type:</strong> "+b+", <strong>Size:</strong> "+c.size+" bytes","image"===b.substr(0,5)){this.preview.innerHTML+="<br>";var d=document.createElement("img");d.style.maxWidth="100%",d.style.maxHeight="100px",d.src=this.preview_value,this.preview.appendChild(d)}this.preview.innerHTML+="<br>";var e=this.getButton("Upload","upload","Upload");this.preview.appendChild(e),e.addEventListener("click",function(b){b.preventDefault(),e.setAttribute("disabled","disabled"),a.theme.removeInputError(a.uploader),a.theme.getProgressBar&&(a.progressBar=a.theme.getProgressBar(),a.preview.appendChild(a.progressBar)),a.jsoneditor.options.upload(a.path,c,{success:function(b){a.setValue(b),a.parent?a.parent.onChildEditorChange(a):a.jsoneditor.onChange(),a.progressBar&&a.preview.removeChild(a.progressBar),e.removeAttribute("disabled")},failure:function(b){a.theme.addInputError(a.uploader,b),a.progressBar&&a.preview.removeChild(a.progressBar),e.removeAttribute("disabled")},updateProgress:function(b){a.progressBar&&(b?a.theme.updateProgressBar(a.progressBar,b):a.theme.updateProgressBarUnknown(a.progressBar))}})})}},enable:function(){this.uploader&&(this.uploader.disabled=!1),this._super()},disable:function(){this.uploader&&(this.uploader.disabled=!0),this._super()},setValue:function(a){this.value!==a&&(this.value=a,this.input.value=this.value,this.onChange())},destroy:function(){this.preview&&this.preview.parentNode&&this.preview.parentNode.removeChild(this.preview),this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this.uploader&&this.uploader.parentNode&&this.uploader.parentNode.removeChild(this.uploader),this._super()}}),f.defaults.editors.checkbox=f.AbstractEditor.extend({setValue:function(a,b){this.value=!!a,this.input.checked=this.value,this.onChange()},register:function(){this._super(),this.input&&this.input.setAttribute("name",this.formname)},unregister:function(){this._super(),this.input&&this.input.removeAttribute("name")},getNumColumns:function(){return Math.min(12,Math.max(this.getTitle().length/7,2))},build:function(){var a=this;this.options.compact||(this.label=this.header=this.theme.getCheckboxLabel(this.getTitle())),this.schema.description&&(this.description=this.theme.getFormInputDescription(this.schema.description)),this.options.compact&&(this.container.className+=" compact"),this.input=this.theme.getCheckbox(),this.control=this.theme.getFormControl(this.label,this.input,this.description),(this.schema.readOnly||this.schema.readonly)&&(this.always_disabled=!0,this.input.disabled=!0),this.input.addEventListener("change",function(b){b.preventDefault(),b.stopPropagation(),a.value=this.checked,a.onChange(!0)}),this.container.appendChild(this.control)},enable:function(){this.always_disabled||(this.input.disabled=!1),this._super()},disable:function(){this.input.disabled=!0,this._super()},destroy:function(){this.label&&this.label.parentNode&&this.label.parentNode.removeChild(this.label),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this._super()}}),f.defaults.editors.arraySelectize=f.AbstractEditor.extend({build:function(){this.title=this.theme.getFormInputLabel(this.getTitle()),this.title_controls=this.theme.getHeaderButtonHolder(),this.title.appendChild(this.title_controls),this.error_holder=document.createElement("div"),this.schema.description&&(this.description=this.theme.getDescription(this.schema.description)),this.input=document.createElement("select"),this.input.setAttribute("multiple","multiple");var a=this.theme.getFormControl(this.title,this.input,this.description);this.container.appendChild(a),this.container.appendChild(this.error_holder),window.jQuery(this.input).selectize({delimiter:!1,createOnBlur:!0,create:!0})},postBuild:function(){var a=this;this.input.selectize.on("change",function(b){a.refreshValue(),a.onChange(!0)})},destroy:function(){this.empty(!0),this.title&&this.title.parentNode&&this.title.parentNode.removeChild(this.title),this.description&&this.description.parentNode&&this.description.parentNode.removeChild(this.description),this.input&&this.input.parentNode&&this.input.parentNode.removeChild(this.input),this._super()},empty:function(a){},setValue:function(a,b){var c=this;
// Update the array's value, adding/removing rows when necessary
a=a||[],Array.isArray(a)||(a=[a]),this.input.selectize.clearOptions(),this.input.selectize.clear(!0),a.forEach(function(a){c.input.selectize.addOption({text:a,value:a})}),this.input.selectize.setValue(a),this.refreshValue(b)},refreshValue:function(a){this.value=this.input.selectize.getValue()},showValidationErrors:function(a){var b=this,c=[],e=[];
// Show errors for this editor
if(d(a,function(a,d){d.path===b.path?c.push(d):e.push(d)}),this.error_holder)if(c.length){this.error_holder.innerHTML="",this.error_holder.style.display="",d(c,function(a,c){b.error_holder.appendChild(b.theme.getErrorMessage(c.message))})}else this.error_holder.style.display="none"}});var g=function(){var a=document.documentElement;return a.matches?"matches":a.webkitMatchesSelector?"webkitMatchesSelector":a.mozMatchesSelector?"mozMatchesSelector":a.msMatchesSelector?"msMatchesSelector":a.oMatchesSelector?"oMatchesSelector":void 0}();f.AbstractTheme=a.extend({getContainer:function(){return document.createElement("div")},getFloatRightLinkHolder:function(){var a=document.createElement("div");return a.style=a.style||{},a.style.cssFloat="right",a.style.marginLeft="10px",a},getModal:function(){var a=document.createElement("div");return a.style.backgroundColor="white",a.style.border="1px solid black",a.style.boxShadow="3px 3px black",a.style.position="absolute",a.style.zIndex="10",a.style.display="none",a},getGridContainer:function(){var a=document.createElement("div");return a},getGridRow:function(){var a=document.createElement("div");return a.className="row",a},getGridColumn:function(){var a=document.createElement("div");return a},setGridColumnSize:function(a,b){},getLink:function(a){var b=document.createElement("a");return b.setAttribute("href","#"),b.appendChild(document.createTextNode(a)),b},disableHeader:function(a){a.style.color="#ccc"},disableLabel:function(a){a.style.color="#ccc"},enableHeader:function(a){a.style.color=""},enableLabel:function(a){a.style.color=""},getFormInputLabel:function(a){var b=document.createElement("label");return b.appendChild(document.createTextNode(a)),b},getCheckboxLabel:function(a){var b=this.getFormInputLabel(a);return b.style.fontWeight="normal",b},getHeader:function(a){var b=document.createElement("h3");return"string"==typeof a?b.textContent=a:b.appendChild(a),b},getCheckbox:function(){var a=this.getFormInputField("checkbox");return a.style.display="inline-block",a.style.width="auto",a},getMultiCheckboxHolder:function(a,b,c){var d=document.createElement("div");b&&(b.style.display="block",d.appendChild(b));for(var e in a)a.hasOwnProperty(e)&&(a[e].style.display="inline-block",a[e].style.marginRight="20px",d.appendChild(a[e]));return c&&d.appendChild(c),d},getSelectInput:function(a){var b=document.createElement("select");return a&&this.setSelectOptions(b,a),b},getSwitcher:function(a){var b=this.getSelectInput(a);return b.style.backgroundColor="transparent",b.style.display="inline-block",b.style.fontStyle="italic",b.style.fontWeight="normal",b.style.height="auto",b.style.marginBottom=0,b.style.marginLeft="5px",b.style.padding="0 0 0 3px",b.style.width="auto",b},getSwitcherOptions:function(a){return a.getElementsByTagName("option")},setSwitcherOptions:function(a,b,c){this.setSelectOptions(a,b,c)},setSelectOptions:function(a,b,c){c=c||[],a.innerHTML="";for(var d=0;d<b.length;d++){var e=document.createElement("option");e.setAttribute("value",b[d]),e.textContent=c[d]||b[d],a.appendChild(e)}},getTextareaInput:function(){var a=document.createElement("textarea");return a.style=a.style||{},a.style.width="100%",a.style.height="300px",a.style.boxSizing="border-box",a},getRangeInput:function(a,b,c){var d=this.getFormInputField("range");return d.setAttribute("min",a),d.setAttribute("max",b),d.setAttribute("step",c),d},getFormInputField:function(a){var b=document.createElement("input");return b.setAttribute("type",a),b},afterInputReady:function(a){},getFormControl:function(a,b,c){var d=document.createElement("div");return d.className="form-control",a&&d.appendChild(a),"checkbox"===b.type?a.insertBefore(b,a.firstChild):d.appendChild(b),c&&d.appendChild(c),d},getIndentedPanel:function(){var a=document.createElement("div");return a.style=a.style||{},a.style.paddingLeft="10px",a.style.marginLeft="10px",a.style.borderLeft="1px solid #ccc",a},getChildEditorHolder:function(){return document.createElement("div")},getDescription:function(a){var b=document.createElement("p");return b.innerHTML=a,b},getCheckboxDescription:function(a){return this.getDescription(a)},getFormInputDescription:function(a){return this.getDescription(a)},getHeaderButtonHolder:function(){return this.getButtonHolder()},getButtonHolder:function(){return document.createElement("div")},getButton:function(a,b,c){var d=document.createElement("button");return d.type="button",this.setButtonText(d,a,b,c),d},setButtonText:function(a,b,c,d){a.innerHTML="",c&&(a.appendChild(c),a.innerHTML+=" "),a.appendChild(document.createTextNode(b)),d&&a.setAttribute("title",d)},getTable:function(){return document.createElement("table")},getTableRow:function(){return document.createElement("tr")},getTableHead:function(){return document.createElement("thead")},getTableBody:function(){return document.createElement("tbody")},getTableHeaderCell:function(a){var b=document.createElement("th");return b.textContent=a,b},getTableCell:function(){var a=document.createElement("td");return a},getErrorMessage:function(a){var b=document.createElement("p");return b.style=b.style||{},b.style.color="red",b.appendChild(document.createTextNode(a)),b},addInputError:function(a,b){},removeInputError:function(a){},addTableRowError:function(a){},removeTableRowError:function(a){},getTabHolder:function(){var a=document.createElement("div");return a.innerHTML="<div style='float: left; width: 130px;' class='tabs'></div><div class='content' style='margin-left: 130px;'></div><div style='clear:both;'></div>",a},applyStyles:function(a,b){a.style=a.style||{};for(var c in b)b.hasOwnProperty(c)&&(a.style[c]=b[c])},closest:function(a,b){for(;a&&a!==document;){if(!a[g])return!1;if(a[g](b))return a;a=a.parentNode}return!1},getTab:function(a){var b=document.createElement("div");return b.appendChild(a),b.style=b.style||{},this.applyStyles(b,{border:"1px solid #ccc",borderWidth:"1px 0 1px 1px",textAlign:"center",lineHeight:"30px",borderRadius:"5px",borderBottomRightRadius:0,borderTopRightRadius:0,fontWeight:"bold",cursor:"pointer"}),b},getTabContentHolder:function(a){return a.children[1]},getTabContent:function(){return this.getIndentedPanel()},markTabActive:function(a){this.applyStyles(a,{opacity:1,background:"white"})},markTabInactive:function(a){this.applyStyles(a,{opacity:.5,background:""})},addTab:function(a,b){a.children[0].appendChild(b)},getBlockLink:function(){var a=document.createElement("a");return a.style.display="block",a},getBlockLinkHolder:function(){var a=document.createElement("div");return a},getLinksHolder:function(){var a=document.createElement("div");return a},createMediaLink:function(a,b,c){a.appendChild(b),c.style.width="100%",a.appendChild(c)},createImageLink:function(a,b,c){a.appendChild(b),b.appendChild(c)}}),f.defaults.themes.bootstrap2=f.AbstractTheme.extend({getRangeInput:function(a,b,c){
// TODO: use bootstrap slider
return this._super(a,b,c)},getGridContainer:function(){var a=document.createElement("div");return a.className="container-fluid",a},getGridRow:function(){var a=document.createElement("div");return a.className="row-fluid",a},getFormInputLabel:function(a){var b=this._super(a);return b.style.display="inline-block",b.style.fontWeight="bold",b},setGridColumnSize:function(a,b){a.className="span"+b},getSelectInput:function(a){var b=this._super(a);return b.style.width="auto",b.style.maxWidth="98%",b},getFormInputField:function(a){var b=this._super(a);return b.style.width="98%",b},afterInputReady:function(a){a.controlgroup||(a.controlgroup=this.closest(a,".control-group"),a.controls=this.closest(a,".controls"),this.closest(a,".compact")&&(a.controlgroup.className=a.controlgroup.className.replace(/control-group/g,"").replace(/[ ]{2,}/g," "),a.controls.className=a.controlgroup.className.replace(/controls/g,"").replace(/[ ]{2,}/g," "),a.style.marginBottom=0))},getIndentedPanel:function(){var a=document.createElement("div");return a.className="well well-small",a.style.paddingBottom=0,a},getFormInputDescription:function(a){var b=document.createElement("p");return b.className="help-inline",b.textContent=a,b},getFormControl:function(a,b,c){var d=document.createElement("div");d.className="control-group";var e=document.createElement("div");return e.className="controls",a&&"checkbox"===b.getAttribute("type")?(d.appendChild(e),a.className+=" checkbox",a.appendChild(b),e.appendChild(a),e.style.height="30px"):(a&&(a.className+=" control-label",d.appendChild(a)),e.appendChild(b),d.appendChild(e)),c&&e.appendChild(c),d},getHeaderButtonHolder:function(){var a=this.getButtonHolder();return a.style.marginLeft="10px",a},getButtonHolder:function(){var a=document.createElement("div");return a.className="btn-group",a},getButton:function(a,b,c){var d=this._super(a,b,c);return d.className+=" btn btn-default",d},getTable:function(){var a=document.createElement("table");return a.className="table table-bordered",a.style.width="auto",a.style.maxWidth="none",a},addInputError:function(a,b){a.controlgroup&&a.controls&&(a.controlgroup.className+=" error",a.errmsg?a.errmsg.style.display="":(a.errmsg=document.createElement("p"),a.errmsg.className="help-block errormsg",a.controls.appendChild(a.errmsg)),a.errmsg.textContent=b)},removeInputError:function(a){a.errmsg&&(a.errmsg.style.display="none",a.controlgroup.className=a.controlgroup.className.replace(/\s?error/g,""))},getTabHolder:function(){var a=document.createElement("div");return a.className="tabbable tabs-left",a.innerHTML="<ul class='nav nav-tabs span2' style='margin-right: 0;'></ul><div class='tab-content span10' style='overflow:visible;'></div>",a},getTab:function(a){var b=document.createElement("li"),c=document.createElement("a");return c.setAttribute("href","#"),c.appendChild(a),b.appendChild(c),b},getTabContentHolder:function(a){return a.children[1]},getTabContent:function(){var a=document.createElement("div");return a.className="tab-pane active",a},markTabActive:function(a){a.className+=" active"},markTabInactive:function(a){a.className=a.className.replace(/\s?active/g,"")},addTab:function(a,b){a.children[0].appendChild(b)},getProgressBar:function(){var a=document.createElement("div");a.className="progress";var b=document.createElement("div");return b.className="bar",b.style.width="0%",a.appendChild(b),a},updateProgressBar:function(a,b){a&&(a.firstChild.style.width=b+"%")},updateProgressBarUnknown:function(a){a&&(a.className="progress progress-striped active",a.firstChild.style.width="100%")}}),f.defaults.themes.bootstrap3=f.AbstractTheme.extend({getSelectInput:function(a){var b=this._super(a);
//el.style.width = 'auto';
return b.className+="form-control",b},setGridColumnSize:function(a,b){a.className="col-md-"+b},afterInputReady:function(a){a.controlgroup||(a.controlgroup=this.closest(a,".form-group"),this.closest(a,".compact")&&(a.controlgroup.style.marginBottom=0))},getTextareaInput:function(){var a=document.createElement("textarea");return a.className="form-control",a},getRangeInput:function(a,b,c){
// TODO: use better slider
return this._super(a,b,c)},getFormInputField:function(a){var b=this._super(a);return"checkbox"!==a&&(b.className+="form-control"),b},getFormControl:function(a,b,c){var d=document.createElement("div");return a&&"checkbox"===b.type?(d.className+=" checkbox",a.appendChild(b),a.style.fontSize="14px",d.style.marginTop="0",d.appendChild(a),b.style.position="relative",b.style.cssFloat="left"):(d.className+=" form-group",a&&(a.className+=" control-label",d.appendChild(a)),d.appendChild(b)),c&&d.appendChild(c),d},getIndentedPanel:function(){var a=document.createElement("div");return a.className="well well-sm",a.style.paddingBottom=0,a},getFormInputDescription:function(a){var b=document.createElement("p");return b.className="help-block",b.innerHTML=a,b},getHeaderButtonHolder:function(){var a=this.getButtonHolder();return a.style.marginLeft="10px",a},getButtonHolder:function(){var a=document.createElement("div");return a.className="btn-group",a},getButton:function(a,b,c){var d=this._super(a,b,c);return d.className+="btn btn-default",d},getTable:function(){var a=document.createElement("table");return a.className="table table-bordered",a.style.width="auto",a.style.maxWidth="none",a},addInputError:function(a,b){a.controlgroup&&(a.controlgroup.className+=" has-error",a.errmsg?a.errmsg.style.display="":(a.errmsg=document.createElement("p"),a.errmsg.className="help-block errormsg",a.controlgroup.appendChild(a.errmsg)),a.errmsg.textContent=b)},removeInputError:function(a){a.errmsg&&(a.errmsg.style.display="none",a.controlgroup.className=a.controlgroup.className.replace(/\s?has-error/g,""))},getTabHolder:function(){var a=document.createElement("div");return a.innerHTML="<div class='tabs list-group col-md-2'></div><div class='col-md-10'></div>",a.className="rows",a},getTab:function(a){var b=document.createElement("a");return b.className="list-group-item",b.setAttribute("href","#"),b.appendChild(a),b},markTabActive:function(a){a.className+=" active"},markTabInactive:function(a){a.className=a.className.replace(/\s?active/g,"")},getProgressBar:function(){var a=0,b=100,c=0,d=document.createElement("div");d.className="progress";var e=document.createElement("div");return e.className="progress-bar",e.setAttribute("role","progressbar"),e.setAttribute("aria-valuenow",c),e.setAttribute("aria-valuemin",a),e.setAttribute("aria-valuenax",b),e.innerHTML=c+"%",d.appendChild(e),d},updateProgressBar:function(a,b){if(a){var c=a.firstChild,d=b+"%";c.setAttribute("aria-valuenow",b),c.style.width=d,c.innerHTML=d}},updateProgressBarUnknown:function(a){if(a){var b=a.firstChild;a.className="progress progress-striped active",b.removeAttribute("aria-valuenow"),b.style.width="100%",b.innerHTML=""}}}),
// Base Foundation theme
f.defaults.themes.foundation=f.AbstractTheme.extend({getChildEditorHolder:function(){var a=document.createElement("div");return a.style.marginBottom="15px",a},getSelectInput:function(a){var b=this._super(a);return b.style.minWidth="none",b.style.padding="5px",b.style.marginTop="3px",b},getSwitcher:function(a){var b=this._super(a);return b.style.paddingRight="8px",b},afterInputReady:function(a){this.closest(a,".compact")&&(a.style.marginBottom=0),a.group=this.closest(a,".form-control")},getFormInputLabel:function(a){var b=this._super(a);return b.style.display="inline-block",b},getFormInputField:function(a){var b=this._super(a);return b.style.width="100%",b.style.marginBottom="checkbox"===a?"0":"12px",b},getFormInputDescription:function(a){var b=document.createElement("p");return b.textContent=a,b.style.marginTop="-10px",b.style.fontStyle="italic",b},getIndentedPanel:function(){var a=document.createElement("div");return a.className="panel",a.style.paddingBottom=0,a},getHeaderButtonHolder:function(){var a=this.getButtonHolder();return a.style.display="inline-block",a.style.marginLeft="10px",a.style.verticalAlign="middle",a},getButtonHolder:function(){var a=document.createElement("div");return a.className="button-group",a},getButton:function(a,b,c){var d=this._super(a,b,c);return d.className+=" small button",d},addInputError:function(a,b){a.group&&(a.group.className+=" error",a.errmsg?a.errmsg.style.display="":(a.insertAdjacentHTML("afterend",'<small class="error"></small>'),a.errmsg=a.parentNode.getElementsByClassName("error")[0]),a.errmsg.textContent=b)},removeInputError:function(a){a.errmsg&&(a.group.className=a.group.className.replace(/ error/g,""),a.errmsg.style.display="none")},getProgressBar:function(){var a=document.createElement("div");a.className="progress";var b=document.createElement("span");return b.className="meter",b.style.width="0%",a.appendChild(b),a},updateProgressBar:function(a,b){a&&(a.firstChild.style.width=b+"%")},updateProgressBarUnknown:function(a){a&&(a.firstChild.style.width="100%")}}),
// Foundation 3 Specific Theme
f.defaults.themes.foundation3=f.defaults.themes.foundation.extend({getHeaderButtonHolder:function(){var a=this._super();return a.style.fontSize=".6em",a},getFormInputLabel:function(a){var b=this._super(a);return b.style.fontWeight="bold",b},getTabHolder:function(){var a=document.createElement("div");return a.className="row",a.innerHTML="<dl class='tabs vertical two columns'></dl><div class='tabs-content ten columns'></div>",a},setGridColumnSize:function(a,b){var c=["zero","one","two","three","four","five","six","seven","eight","nine","ten","eleven","twelve"];a.className="columns "+c[b]},getTab:function(a){var b=document.createElement("dd"),c=document.createElement("a");return c.setAttribute("href","#"),c.appendChild(a),b.appendChild(c),b},getTabContentHolder:function(a){return a.children[1]},getTabContent:function(){var a=document.createElement("div");return a.className="content active",a.style.paddingLeft="5px",a},markTabActive:function(a){a.className+=" active"},markTabInactive:function(a){a.className=a.className.replace(/\s*active/g,"")},addTab:function(a,b){a.children[0].appendChild(b)}}),
// Foundation 4 Specific Theme
f.defaults.themes.foundation4=f.defaults.themes.foundation.extend({getHeaderButtonHolder:function(){var a=this._super();return a.style.fontSize=".6em",a},setGridColumnSize:function(a,b){a.className="columns large-"+b},getFormInputDescription:function(a){var b=this._super(a);return b.style.fontSize=".8rem",b},getFormInputLabel:function(a){var b=this._super(a);return b.style.fontWeight="bold",b}}),
// Foundation 5 Specific Theme
f.defaults.themes.foundation5=f.defaults.themes.foundation.extend({getFormInputDescription:function(a){var b=this._super(a);return b.style.fontSize=".8rem",b},setGridColumnSize:function(a,b){a.className="columns medium-"+b},getButton:function(a,b,c){var d=this._super(a,b,c);return d.className=d.className.replace(/\s*small/g,"")+" tiny",d},getTabHolder:function(){var a=document.createElement("div");return a.innerHTML="<dl class='tabs vertical'></dl><div class='tabs-content vertical'></div>",a},getTab:function(a){var b=document.createElement("dd"),c=document.createElement("a");return c.setAttribute("href","#"),c.appendChild(a),b.appendChild(c),b},getTabContentHolder:function(a){return a.children[1]},getTabContent:function(){var a=document.createElement("div");return a.className="content active",a.style.paddingLeft="5px",a},markTabActive:function(a){a.className+=" active"},markTabInactive:function(a){a.className=a.className.replace(/\s*active/g,"")},addTab:function(a,b){a.children[0].appendChild(b)}}),f.defaults.themes.foundation6=f.defaults.themes.foundation5.extend({getIndentedPanel:function(){var a=document.createElement("div");return a.className="callout secondary",a},getButtonHolder:function(){var a=document.createElement("div");return a.className="button-group tiny",a.style.marginBottom=0,a},getFormInputLabel:function(a){var b=this._super(a);return b.style.display="block",b},getFormControl:function(a,b,c){var d=document.createElement("div");return d.className="form-control",a&&d.appendChild(a),"checkbox"===b.type?a.insertBefore(b,a.firstChild):a?a.appendChild(b):d.appendChild(b),c&&a.appendChild(c),d},addInputError:function(a,b){if(a.group){if(a.group.className+=" error",a.errmsg)a.errmsg.style.display="",a.className="";else{var c=document.createElement("span");c.className="form-error is-visible",a.group.getElementsByTagName("label")[0].appendChild(c),a.className=a.className+" is-invalid-input",a.errmsg=c}a.errmsg.textContent=b}},removeInputError:function(a){a.errmsg&&(a.className=a.className.replace(/ is-invalid-input/g,""),a.errmsg.parentNode&&a.errmsg.parentNode.removeChild(a.errmsg))}}),f.defaults.themes.html=f.AbstractTheme.extend({getFormInputLabel:function(a){var b=this._super(a);return b.style.display="block",b.style.marginBottom="3px",b.style.fontWeight="bold",b},getFormInputDescription:function(a){var b=this._super(a);return b.style.fontSize=".8em",b.style.margin=0,b.style.display="inline-block",b.style.fontStyle="italic",b},getIndentedPanel:function(){var a=this._super();return a.style.border="1px solid #ddd",a.style.padding="5px",a.style.margin="5px",a.style.borderRadius="3px",a},getChildEditorHolder:function(){var a=this._super();return a.style.marginBottom="8px",a},getHeaderButtonHolder:function(){var a=this.getButtonHolder();return a.style.display="inline-block",a.style.marginLeft="10px",a.style.fontSize=".8em",a.style.verticalAlign="middle",a},getTable:function(){var a=this._super();return a.style.borderBottom="1px solid #ccc",a.style.marginBottom="5px",a},addInputError:function(a,b){if(a.style.borderColor="red",a.errmsg)a.errmsg.style.display="block";else{var c=this.closest(a,".form-control");a.errmsg=document.createElement("div"),a.errmsg.setAttribute("class","errmsg"),a.errmsg.style=a.errmsg.style||{},a.errmsg.style.color="red",c.appendChild(a.errmsg)}a.errmsg.innerHTML="",a.errmsg.appendChild(document.createTextNode(b))},removeInputError:function(a){a.style.borderColor="",a.errmsg&&(a.errmsg.style.display="none")},getProgressBar:function(){var a=100,b=0,c=document.createElement("progress");return c.setAttribute("max",a),c.setAttribute("value",b),c},updateProgressBar:function(a,b){a&&a.setAttribute("value",b)},updateProgressBarUnknown:function(a){a&&a.removeAttribute("value")}}),f.defaults.themes.jqueryui=f.AbstractTheme.extend({getTable:function(){var a=this._super();return a.setAttribute("cellpadding",5),a.setAttribute("cellspacing",0),a},getTableHeaderCell:function(a){var b=this._super(a);return b.className="ui-state-active",b.style.fontWeight="bold",b},getTableCell:function(){var a=this._super();return a.className="ui-widget-content",a},getHeaderButtonHolder:function(){var a=this.getButtonHolder();return a.style.marginLeft="10px",a.style.fontSize=".6em",a.style.display="inline-block",a},getFormInputDescription:function(a){var b=this.getDescription(a);return b.style.marginLeft="10px",b.style.display="inline-block",b},getFormControl:function(a,b,c){var d=this._super(a,b,c);return"checkbox"===b.type?(d.style.lineHeight="25px",d.style.padding="3px 0"):d.style.padding="4px 0 8px 0",d},getDescription:function(a){var b=document.createElement("span");return b.style.fontSize=".8em",b.style.fontStyle="italic",b.textContent=a,b},getButtonHolder:function(){var a=document.createElement("div");return a.className="ui-buttonset",a.style.fontSize=".7em",a},getFormInputLabel:function(a){var b=document.createElement("label");return b.style.fontWeight="bold",b.style.display="block",b.textContent=a,b},getButton:function(a,b,c){var d=document.createElement("button");d.className="ui-button ui-widget ui-state-default ui-corner-all",
// Icon only
b&&!a?(d.className+=" ui-button-icon-only",b.className+=" ui-button-icon-primary ui-icon-primary",d.appendChild(b)):b?(d.className+=" ui-button-text-icon-primary",b.className+=" ui-button-icon-primary ui-icon-primary",d.appendChild(b)):d.className+=" ui-button-text-only";var e=document.createElement("span");return e.className="ui-button-text",e.textContent=a||c||".",d.appendChild(e),d.setAttribute("title",c),d},setButtonText:function(a,b,c,d){a.innerHTML="",a.className="ui-button ui-widget ui-state-default ui-corner-all",
// Icon only
c&&!b?(a.className+=" ui-button-icon-only",c.className+=" ui-button-icon-primary ui-icon-primary",a.appendChild(c)):c?(a.className+=" ui-button-text-icon-primary",c.className+=" ui-button-icon-primary ui-icon-primary",a.appendChild(c)):a.className+=" ui-button-text-only";var e=document.createElement("span");e.className="ui-button-text",e.textContent=b||d||".",a.appendChild(e),a.setAttribute("title",d)},getIndentedPanel:function(){var a=document.createElement("div");return a.className="ui-widget-content ui-corner-all",a.style.padding="1em 1.4em",a.style.marginBottom="20px",a},afterInputReady:function(a){a.controls||(a.controls=this.closest(a,".form-control"))},addInputError:function(a,b){a.controls&&(a.errmsg?a.errmsg.style.display="":(a.errmsg=document.createElement("div"),a.errmsg.className="ui-state-error",a.controls.appendChild(a.errmsg)),a.errmsg.textContent=b)},removeInputError:function(a){a.errmsg&&(a.errmsg.style.display="none")},markTabActive:function(a){a.className=a.className.replace(/\s*ui-widget-header/g,"")+" ui-state-active"},markTabInactive:function(a){a.className=a.className.replace(/\s*ui-state-active/g,"")+" ui-widget-header"}}),f.defaults.themes.barebones=f.AbstractTheme.extend({getFormInputLabel:function(a){var b=this._super(a);return b},getFormInputDescription:function(a){var b=this._super(a);return b},getIndentedPanel:function(){var a=this._super();return a},getChildEditorHolder:function(){var a=this._super();return a},getHeaderButtonHolder:function(){var a=this.getButtonHolder();return a},getTable:function(){var a=this._super();return a},addInputError:function(a,b){if(a.errmsg)a.errmsg.style.display="block";else{var c=this.closest(a,".form-control");a.errmsg=document.createElement("div"),a.errmsg.setAttribute("class","errmsg"),c.appendChild(a.errmsg)}a.errmsg.innerHTML="",a.errmsg.appendChild(document.createTextNode(b))},removeInputError:function(a){a.style.borderColor="",a.errmsg&&(a.errmsg.style.display="none")},getProgressBar:function(){var a=100,b=0,c=document.createElement("progress");return c.setAttribute("max",a),c.setAttribute("value",b),c},updateProgressBar:function(a,b){a&&a.setAttribute("value",b)},updateProgressBarUnknown:function(a){a&&a.removeAttribute("value")}}),f.AbstractIconLib=a.extend({mapping:{collapse:"",expand:"","delete":"",edit:"",add:"",cancel:"",save:"",moveup:"",movedown:""},icon_prefix:"",getIconClass:function(a){return this.mapping[a]?this.icon_prefix+this.mapping[a]:null},getIcon:function(a){var b=this.getIconClass(a);if(!b)return null;var c=document.createElement("i");return c.className=b,c}}),f.defaults.iconlibs.bootstrap2=f.AbstractIconLib.extend({mapping:{collapse:"chevron-down",expand:"chevron-up","delete":"trash",edit:"pencil",add:"plus",cancel:"ban-circle",save:"ok",moveup:"arrow-up",movedown:"arrow-down"},icon_prefix:"icon-"}),f.defaults.iconlibs.bootstrap3=f.AbstractIconLib.extend({mapping:{collapse:"chevron-down",expand:"chevron-right","delete":"remove",edit:"pencil",add:"plus",cancel:"floppy-remove",save:"floppy-saved",moveup:"arrow-up",movedown:"arrow-down"},icon_prefix:"glyphicon glyphicon-"}),f.defaults.iconlibs.fontawesome3=f.AbstractIconLib.extend({mapping:{collapse:"chevron-down",expand:"chevron-right","delete":"remove",edit:"pencil",add:"plus",cancel:"ban-circle",save:"save",moveup:"arrow-up",movedown:"arrow-down"},icon_prefix:"icon-"}),f.defaults.iconlibs.fontawesome4=f.AbstractIconLib.extend({mapping:{collapse:"caret-square-o-down",expand:"caret-square-o-right","delete":"times",edit:"pencil",add:"plus",cancel:"ban",save:"save",moveup:"arrow-up",movedown:"arrow-down"},icon_prefix:"fa fa-"}),f.defaults.iconlibs.foundation2=f.AbstractIconLib.extend({mapping:{collapse:"minus",expand:"plus","delete":"remove",edit:"edit",add:"add-doc",cancel:"error",save:"checkmark",moveup:"up-arrow",movedown:"down-arrow"},icon_prefix:"foundicon-"}),f.defaults.iconlibs.foundation3=f.AbstractIconLib.extend({mapping:{collapse:"minus",expand:"plus","delete":"x",edit:"pencil",add:"page-add",cancel:"x-circle",save:"save",moveup:"arrow-up",movedown:"arrow-down"},icon_prefix:"fi-"}),f.defaults.iconlibs.jqueryui=f.AbstractIconLib.extend({mapping:{collapse:"triangle-1-s",expand:"triangle-1-e","delete":"trash",edit:"pencil",add:"plusthick",cancel:"closethick",save:"disk",moveup:"arrowthick-1-n",movedown:"arrowthick-1-s"},icon_prefix:"ui-icon ui-icon-"}),f.defaults.templates["default"]=function(){return{compile:function(a){var b=a.match(/{{\s*([a-zA-Z0-9\-_ \.]+)\s*}}/g),c=b&&b.length;
// Shortcut if the template contains no variables
if(!c)return function(){return a};for(var d=[],e=function(a){var c,e=b[a].replace(/[{}]+/g,"").trim().split("."),f=e.length;if(f>1){var g;c=function(b){for(g=b,a=0;a<f&&(g=g[e[a]],g);a++);return g}}else e=e[0],c=function(a){return a[e]};d.push({s:b[a],r:c})},f=0;f<c;f++)e(f);
// The compiled function
return function(b){var e,g=a+"";for(f=0;f<c;f++)e=d[f],g=g.replace(e.s,e.r(b));return g}}}},f.defaults.templates.ejs=function(){return!!window.EJS&&{compile:function(a){var b=new window.EJS({text:a});return function(a){return b.render(a)}}}},f.defaults.templates.handlebars=function(){return window.Handlebars},f.defaults.templates.hogan=function(){return!!window.Hogan&&{compile:function(a){var b=window.Hogan.compile(a);return function(a){return b.render(a)}}}},f.defaults.templates.markup=function(){return!(!window.Mark||!window.Mark.up)&&{compile:function(a){return function(b){return window.Mark.up(a,b)}}}},f.defaults.templates.mustache=function(){return!!window.Mustache&&{compile:function(a){return function(b){return window.Mustache.render(a,b)}}}},f.defaults.templates.swig=function(){return window.swig},f.defaults.templates.underscore=function(){return!!window._&&{compile:function(a){return function(b){return window._.template(a,b)}}}},
// Set the default theme
f.defaults.theme="html",
// Set the default template engine
f.defaults.template="default",
// Default options when initializing JSON Editor
f.defaults.options={},
// String translate function
f.defaults.translate=function(a,b){var c=f.defaults.languages[f.defaults.language];if(!c)throw"Unknown language "+f.defaults.language;var d=c[a]||f.defaults.languages[f.defaults.default_language][a];if("undefined"==typeof d)throw"Unknown translate string "+a;if(b)for(var e=0;e<b.length;e++)d=d.replace(new RegExp("\\{\\{"+e+"}}","g"),b[e]);return d},
// Translation strings and default languages
f.defaults.default_language="en",f.defaults.language=f.defaults.default_language,f.defaults.languages.en={/**
   * When a property is not set
   */
error_notset:"Property must be set",/**
   * When a string must not be empty
   */
error_notempty:"Value required",/**
   * When a value is not one of the enumerated values
   */
error_enum:"Value must be one of the enumerated values",/**
   * When a value doesn't validate any schema of a 'anyOf' combination
   */
error_anyOf:"Value must validate against at least one of the provided schemas",/**
   * When a value doesn't validate
   * @variables This key takes one variable: The number of schemas the value does not validate
   */
error_oneOf:"Value must validate against exactly one of the provided schemas. It currently validates against {{0}} of the schemas.",/**
   * When a value does not validate a 'not' schema
   */
error_not:"Value must not validate against the provided schema",/**
   * When a value does not match any of the provided types
   */
error_type_union:"Value must be one of the provided types",/**
   * When a value does not match the given type
   * @variables This key takes one variable: The type the value should be of
   */
error_type:"Value must be of type {{0}}",/**
   *  When the value validates one of the disallowed types
   */
error_disallow_union:"Value must not be one of the provided disallowed types",/**
   *  When the value validates a disallowed type
   * @variables This key takes one variable: The type the value should not be of
   */
error_disallow:"Value must not be of type {{0}}",/**
   * When a value is not a multiple of or divisible by a given number
   * @variables This key takes one variable: The number mentioned above
   */
error_multipleOf:"Value must be a multiple of {{0}}",/**
   * When a value is greater than it's supposed to be (exclusive)
   * @variables This key takes one variable: The maximum
   */
error_maximum_excl:"Value must be less than {{0}}",/**
   * When a value is greater than it's supposed to be (inclusive
   * @variables This key takes one variable: The maximum
   */
error_maximum_incl:"Value must be at most {{0}}",/**
   * When a value is lesser than it's supposed to be (exclusive)
   * @variables This key takes one variable: The minimum
   */
error_minimum_excl:"Value must be greater than {{0}}",/**
   * When a value is lesser than it's supposed to be (inclusive)
   * @variables This key takes one variable: The minimum
   */
error_minimum_incl:"Value must be at least {{0}}",/**
   * When a value have too many characters
   * @variables This key takes one variable: The maximum character count
   */
error_maxLength:"Value must be at most {{0}} characters long",/**
   * When a value does not have enough characters
   * @variables This key takes one variable: The minimum character count
   */
error_minLength:"Value must be at least {{0}} characters long",/**
   * When a value does not match a given pattern
   */
error_pattern:"Value must match the pattern {{0}}",/**
   * When an array has additional items whereas it is not supposed to
   */
error_additionalItems:"No additional items allowed in this array",/**
   * When there are to many items in an array
   * @variables This key takes one variable: The maximum item count
   */
error_maxItems:"Value must have at most {{0}} items",/**
   * When there are not enough items in an array
   * @variables This key takes one variable: The minimum item count
   */
error_minItems:"Value must have at least {{0}} items",/**
   * When an array is supposed to have unique items but has duplicates
   */
error_uniqueItems:"Array must have unique items",/**
   * When there are too many properties in an object
   * @variables This key takes one variable: The maximum property count
   */
error_maxProperties:"Object must have at most {{0}} properties",/**
   * When there are not enough properties in an object
   * @variables This key takes one variable: The minimum property count
   */
error_minProperties:"Object must have at least {{0}} properties",/**
   * When a required property is not defined
   * @variables This key takes one variable: The name of the missing property
   */
error_required:"Object is missing the required property '{{0}}'",/**
   * When there is an additional property is set whereas there should be none
   * @variables This key takes one variable: The name of the additional property
   */
error_additional_properties:"No additional properties allowed, but property {{0}} is set",/**
   * When a dependency is not resolved
   * @variables This key takes one variable: The name of the missing property for the dependency
   */
error_dependency:"Must have property {{0}}",/**
   * Text on Delete All buttons
   */
button_delete_all:"All",/**
   * Title on Delete All buttons
   */
button_delete_all_title:"Delete All",/**
    * Text on Delete Last buttons
    * @variable This key takes one variable: The title of object to delete
    */
button_delete_last:"Last {{0}}",/**
    * Title on Delete Last buttons
    * @variable This key takes one variable: The title of object to delete
    */
button_delete_last_title:"Delete Last {{0}}",/**
    * Title on Add Row buttons
    * @variable This key takes one variable: The title of object to add
    */
button_add_row_title:"Add {{0}}",/**
    * Title on Move Down buttons
    */
button_move_down_title:"Move down",/**
    * Title on Move Up buttons
    */
button_move_up_title:"Move up",/**
    * Title on Delete Row buttons
    * @variable This key takes one variable: The title of object to delete
    */
button_delete_row_title:"Delete {{0}}",/**
    * Title on Delete Row buttons, short version (no parameter with the object title)
    */
button_delete_row_title_short:"Delete",/**
    * Title on Collapse buttons
    */
button_collapse:"Collapse",/**
    * Title on Expand buttons
    */
button_expand:"Expand"},
// Miscellaneous Plugin Settings
f.plugins={ace:{theme:""},epiceditor:{},sceditor:{},select2:{},selectize:{}},
// Default per-editor options
d(f.defaults.editors,function(a,b){f.defaults.editors[a].options=b.options||{}}),
// Set the default resolvers
// Use "multiple" as a fall back for everything
f.defaults.resolvers.unshift(function(a){if("string"!=typeof a.type)return"multiple"}),
// If the type is not set but properties are defined, we can infer the type is actually object
f.defaults.resolvers.unshift(function(a){
// If the schema is a simple type
if(!a.type&&a.properties)return"object"}),
// If the type is set and it's a basic type, use the primitive editor
f.defaults.resolvers.unshift(function(a){
// If the schema is a simple type
if("string"==typeof a.type)return a.type}),
// Boolean editors
f.defaults.resolvers.unshift(function(a){if("boolean"===a.type)
// If explicitly set to 'checkbox', use that
// If explicitly set to 'checkbox', use that
return"checkbox"===a.format||a.options&&a.options.checkbox?"checkbox":f.plugins.selectize.enable?"selectize":"select"}),
// Use the multiple editor for schemas where the `type` is set to "any"
f.defaults.resolvers.unshift(function(a){
// If the schema can be of any type
if("any"===a.type)return"multiple"}),
// Editor for base64 encoded files
f.defaults.resolvers.unshift(function(a){
// If the schema can be of any type
if("string"===a.type&&a.media&&"base64"===a.media.binaryEncoding)return"base64"}),
// Editor for uploading files
f.defaults.resolvers.unshift(function(a){if("string"===a.type&&"url"===a.format&&a.options&&a.options.upload===!0&&window.FileReader)return"upload"}),
// Use the table editor for arrays with the format set to `table`
f.defaults.resolvers.unshift(function(a){
// Type `array` with format set to `table`
if("array"==a.type&&"table"==a.format)return"table"}),
// Use the `select` editor for dynamic enumSource enums
f.defaults.resolvers.unshift(function(a){if(a.enumSource)return f.plugins.selectize.enable?"selectize":"select"}),
// Use the `enum` or `select` editors for schemas with enumerated properties
f.defaults.resolvers.unshift(function(a){if(a["enum"]){if("array"===a.type||"object"===a.type)return"enum";if("number"===a.type||"integer"===a.type||"string"===a.type)return f.plugins.selectize.enable?"selectize":"select"}}),
// Specialized editors for arrays of strings
f.defaults.resolvers.unshift(function(a){if("array"===a.type&&a.items&&!Array.isArray(a.items)&&a.uniqueItems&&["string","number","integer"].indexOf(a.items.type)>=0){
// For enumerated strings, number, or integers
if(a.items["enum"])return"multiselect";if(f.plugins.selectize.enable&&"string"===a.items.type)return"arraySelectize"}}),
// Use the multiple editor for schemas with `oneOf` set
f.defaults.resolvers.unshift(function(a){
// If this schema uses `oneOf` or `anyOf`
if(a.oneOf||a.anyOf)return"multiple"}),/**
 * This is a small wrapper for using JSON Editor like a typical jQuery plugin.
 */
function(){if(window.jQuery||window.Zepto){var a=window.jQuery||window.Zepto;a.jsoneditor=f.defaults,a.fn.jsoneditor=function(a){var b=this,c=this.data("jsoneditor");if("value"===a){if(!c)throw"Must initialize jsoneditor before getting/setting the value";
// Set value
if(!(arguments.length>1))return c.getValue();c.setValue(arguments[1])}else{if("validate"===a){if(!c)throw"Must initialize jsoneditor before validating";
// Validate a specific value
// Validate a specific value
return arguments.length>1?c.validate(arguments[1]):c.validate()}"destroy"===a?c&&(c.destroy(),this.data("jsoneditor",null)):(
// Destroy first
c&&c.destroy(),
// Create editor
c=new f(this.get(0),a),this.data("jsoneditor",c),
// Setup event listeners
c.on("change",function(){b.trigger("change")}),c.on("ready",function(){b.trigger("ready")}))}return this}}}(),window.JSONEditor=f}();
//# sourceMappingURL=jsoneditor.min.js.map
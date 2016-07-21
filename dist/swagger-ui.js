/**
 * swagger-ui - Swagger UI is a dependency-free collection of HTML, JavaScript, and CSS assets that dynamically generate beautiful documentation from a Swagger-compliant API
 * @version v2.1.4
 * @link http://swagger.io
 * @license Apache-2.0
 */
(function(){this["Handlebars"] = this["Handlebars"] || {};
this["Handlebars"]["templates"] = this["Handlebars"]["templates"] || {};
this["Handlebars"]["templates"]["apikey_auth"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                <span class=\"key_auth__value\">"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"3":function(depth0,helpers,partials,data) {
  return "                <input placeholder=\"api_key\" class=\"auth_input input_apiKey_entry\" name=\"apiKey\" type=\"text\"/>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class=\"key_input_container\">\n    <h3 class=\"auth__title\">Api key authorization</h3>\n    <div class=\"auth__description\">"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n    <div>\n        <div class=\"key_auth__field\">\n            <span class=\"key_auth__label\">name:</span>\n            <span class=\"key_auth__value\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</span>\n        </div>\n        <div class=\"key_auth__field\">\n            <span class=\"key_auth__label\">in:</span>\n            <span class=\"key_auth__value\">"
    + escapeExpression(((helper = (helper = helpers['in'] || (depth0 != null ? depth0['in'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"in","hash":{},"data":data}) : helper)))
    + "</span>\n        </div>\n        <div class=\"key_auth__field\">\n            <span class=\"key_auth__label\">value:</span>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isLogout : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </div>\n    </div>\n</div>\n";
},"useData":true});
this["Handlebars"]["templates"]["auth_button_operation"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "        authorize__btn_operation_login\n";
  },"3":function(depth0,helpers,partials,data) {
  return "        authorize__btn_operation_logout\n";
  },"5":function(depth0,helpers,partials,data) {
  var stack1, buffer = "        <ul class=\"authorize-scopes\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.scopes : depth0), {"name":"each","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "        </ul>\n";
},"6":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                <li class=\"authorize__scope\" title=\""
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.scope || (depth0 != null ? depth0.scope : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"scope","hash":{},"data":data}) : helper)))
    + "</li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"authorize__btn authorize__btn_operation\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isLogout : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.scopes : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"useData":true});
this["Handlebars"]["templates"]["auth_button"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  return "<a class='authorize__btn' href=\"#\">Authorize</a>\n";
  },"useData":true});
this["Handlebars"]["templates"]["auth_view"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "            <button type=\"button\" class=\"auth__button auth_submit__button\" data-sw-translate>Authorize</button>\n";
  },"3":function(depth0,helpers,partials,data) {
  return "            <button type=\"button\" class=\"auth__button auth_logout__button\" data-sw-translate>Logout</button>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, buffer = "<div class=\"auth_container\">\n\n    <div class=\"auth_inner\"></div>\n    <div class=\"auth_submit\">\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.isLogout : depth0), {"name":"unless","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isAuthorized : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </div>\n\n</div>\n";
},"useData":true});
this["Handlebars"]["templates"]["basic_auth"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return " - authorized";
  },"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                <span class=\"basic_auth__value\">"
    + escapeExpression(((helper = (helper = helpers.username || (depth0 != null ? depth0.username : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"username","hash":{},"data":data}) : helper)))
    + "</span>\n";
},"5":function(depth0,helpers,partials,data) {
  return "                <input required placeholder=\"username\" class=\"basic_auth__username auth_input\" name=\"username\" type=\"text\"/>\n";
  },"7":function(depth0,helpers,partials,data) {
  return "            <div class=\"auth_label\">\n                <span class=\"basic_auth__label\" data-sw-translate>password:</span>\n                <input required placeholder=\"password\" class=\"basic_auth__password auth_input\" name=\"password\" type=\"password\"/></label>\n            </div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='basic_auth_container'>\n    <h3 class=\"auth__title\">Basic authentication";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isLogout : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</h3>\n    <form class=\"basic_input_container\">\n        <div class=\"auth__description\">"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</div>\n        <div class=\"auth_label\">\n            <span class=\"basic_auth__label\" data-sw-translate>username:</span>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isLogout : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.program(5, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "        </div>\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.isLogout : depth0), {"name":"unless","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </form>\n</div>\n";
},"useData":true});
this["Handlebars"]["templates"]["content_type"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.produces : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "	<option value=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</option>\n";
},"4":function(depth0,helpers,partials,data) {
  return "  <option value=\"application/json\">application/json</option>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<label data-sw-translate for=\""
    + escapeExpression(((helper = (helper = helpers.contentTypeId || (depth0 != null ? depth0.contentTypeId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"contentTypeId","hash":{},"data":data}) : helper)))
    + "\">Response Content Type</label>\n<select name=\"contentType\" id=\""
    + escapeExpression(((helper = (helper = helpers.contentTypeId || (depth0 != null ? depth0.contentTypeId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"contentTypeId","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.produces : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</select>\n";
},"useData":true});
'use strict';


$(function() {

	// Helper function for vertically aligning DOM elements
	// http://www.seodenver.com/simple-vertical-align-plugin-for-jquery/
	$.fn.vAlign = function() {
		return this.each(function(){
			var ah = $(this).height();
			var ph = $(this).parent().height();
			var mh = (ph - ah) / 2;
			$(this).css('margin-top', mh);
		});
	};

	$.fn.stretchFormtasticInputWidthToParent = function() {
		return this.each(function(){
			var p_width = $(this).closest("form").innerWidth();
			var p_padding = parseInt($(this).closest("form").css('padding-left') ,10) + parseInt($(this).closest('form').css('padding-right'), 10);
			var this_padding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10);
			$(this).css('width', p_width - p_padding - this_padding);
		});
	};

	$('form.formtastic li.string input, form.formtastic textarea').stretchFormtasticInputWidthToParent();

	// Vertically center these paragraphs
	// Parent may need a min-height for this to work..
	$('ul.downplayed li div.content p').vAlign();

	// When a sandbox form is submitted..
	$("form.sandbox").submit(function(){

		var error_free = true;

		// Cycle through the forms required inputs
 		$(this).find("input.required").each(function() {

			// Remove any existing error styles from the input
			$(this).removeClass('error');

			// Tack the error style on if the input is empty..
			if ($(this).val() === '') {
				$(this).addClass('error');
				$(this).wiggle();
				error_free = false;
			}

		});

		return error_free;
	});

});

function clippyCopiedCallback() {
  $('#api_key_copied').fadeIn().delay(1000).fadeOut();

  // var b = $("#clippy_tooltip_" + a);
  // b.length != 0 && (b.attr("title", "copied!").trigger("tipsy.reload"), setTimeout(function() {
  //   b.attr("title", "copy to clipboard")
  // },
  // 500))
}

// Logging function that accounts for browsers that don't have window.console
function log(){
  log.history = log.history || [];
  log.history.push(arguments);
  if(this.console){
    console.log( Array.prototype.slice.call(arguments)[0] );
  }
}

// Handle browsers that do console incorrectly (IE9 and below, see http://stackoverflow.com/a/5539378/7913)
if (Function.prototype.bind && console && typeof console.log === "object") {
    [
      "log","info","warn","error","assert","dir","clear","profile","profileEnd"
    ].forEach(function (method) {
        console[method] = this.bind(console[method], console);
    }, Function.prototype.call);
}

window.Docs = {

	shebang: function() {

		// If shebang has an operation nickname in it..
		// e.g. /docs/#!/words/get_search
		var fragments = $.param.fragment().split('/');
		fragments.shift(); // get rid of the bang

		switch (fragments.length) {
			case 1:
        if (fragments[0].length > 0) { // prevent matching "#/"
          // Expand all operations for the resource and scroll to it
          var dom_id = 'resource_' + fragments[0];

          Docs.expandEndpointListForResource(fragments[0]);
          $("#"+dom_id).slideto({highlight: false});
        }
				break;
			case 2:
				// Refer to the endpoint DOM element, e.g. #words_get_search

        // Expand Resource
        Docs.expandEndpointListForResource(fragments[0]);
        $("#"+dom_id).slideto({highlight: false});

            // Expand operation
            var li_dom_id = fragments.join('_');
            var li_content_dom_id = li_dom_id + "_content";


            Docs.expandOperation($('#'+li_content_dom_id));
            $('#'+li_dom_id).slideto({highlight: false});
            break;
		}
	},

	toggleEndpointListForResource: function(resource) {
		var elem = $('li#resource_' + Docs.escapeResourceName(resource) + ' ul.endpoints');
		if (elem.is(':visible')) {
			$.bbq.pushState('#/', 2);
			Docs.collapseEndpointListForResource(resource);
		} else {
            $.bbq.pushState('#/' + resource, 2);
			Docs.expandEndpointListForResource(resource);
		}
	},

	// Expand resource
	expandEndpointListForResource: function(resource) {
		var resource = Docs.escapeResourceName(resource);
		if (resource == '') {
			$('.resource ul.endpoints').slideDown();
			return;
		}

		$('li#resource_' + resource).addClass('active');

		var elem = $('li#resource_' + resource + ' ul.endpoints');
		elem.slideDown();
	},

	// Collapse resource and mark as explicitly closed
	collapseEndpointListForResource: function(resource) {
		var resource = Docs.escapeResourceName(resource);
		if (resource == '') {
			$('.resource ul.endpoints').slideUp();
			return;
		}

		$('li#resource_' + resource).removeClass('active');

		var elem = $('li#resource_' + resource + ' ul.endpoints');
		elem.slideUp();
	},

	expandOperationsForResource: function(resource) {
		// Make sure the resource container is open..
		Docs.expandEndpointListForResource(resource);

		if (resource == '') {
			$('.resource ul.endpoints li.operation div.content').slideDown();
			return;
		}

		$('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function() {
			Docs.expandOperation($(this));
		});
	},

	collapseOperationsForResource: function(resource) {
		// Make sure the resource container is open..
		Docs.expandEndpointListForResource(resource);

		if (resource == '') {
			$('.resource ul.endpoints li.operation div.content').slideUp();
			return;
		}

		$('li#resource_' + Docs.escapeResourceName(resource) + ' li.operation div.content').each(function() {
			Docs.collapseOperation($(this));
		});
	},

	escapeResourceName: function(resource) {
		return resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&");
	},

	expandOperation: function(elem) {
		elem.slideDown();
	},

	collapseOperation: function(elem) {
		elem.slideUp();
	}
};

/*!
 * https://github.com/es-shims/es5-shim
 * @license es5-shim Copyright 2009-2015 by contributors, MIT License
 * see https://github.com/es-shims/es5-shim/blob/master/LICENSE
 */

// vim: ts=4 sts=4 sw=4 expandtab

// Add semicolon to prevent IIFE from being passed as argument to concatenated code.
;

// UMD (Universal Module Definition)
// see https://github.com/umdjs/umd/blob/master/templates/returnExports.js
(function (root, factory) {
    'use strict';

    /* global define, exports, module */
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(factory);
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like enviroments that support module.exports,
        // like Node.
        module.exports = factory();
    } else {
        // Browser globals (root is window)
        root.returnExports = factory();
    }
}(this, function () {
    /**
     * Brings an environment as close to ECMAScript 5 compliance
     * as is possible with the facilities of erstwhile engines.
     *
     * Annotated ES5: http://es5.github.com/ (specific links below)
     * ES5 Spec: http://www.ecma-international.org/publications/files/ECMA-ST/Ecma-262.pdf
     * Required reading: http://javascriptweblog.wordpress.com/2011/12/05/extending-javascript-natives/
     */

    // Shortcut to an often accessed properties, in order to avoid multiple
    // dereference that costs universally. This also holds a reference to known-good
    // functions.
    var $Array = Array;
    var ArrayPrototype = $Array.prototype;
    var $Object = Object;
    var ObjectPrototype = $Object.prototype;
    var $Function = Function;
    var FunctionPrototype = $Function.prototype;
    var $String = String;
    var StringPrototype = $String.prototype;
    var $Number = Number;
    var NumberPrototype = $Number.prototype;
    var array_slice = ArrayPrototype.slice;
    var array_splice = ArrayPrototype.splice;
    var array_push = ArrayPrototype.push;
    var array_unshift = ArrayPrototype.unshift;
    var array_concat = ArrayPrototype.concat;
    var array_join = ArrayPrototype.join;
    var call = FunctionPrototype.call;
    var apply = FunctionPrototype.apply;
    var max = Math.max;
    var min = Math.min;

    // Having a toString local variable name breaks in Opera so use to_string.
    var to_string = ObjectPrototype.toString;

    /* global Symbol */
    /* eslint-disable one-var-declaration-per-line, no-redeclare, max-statements-per-line */
    var hasToStringTag = typeof Symbol === 'function' && typeof Symbol.toStringTag === 'symbol';
    var isCallable; /* inlined from https://npmjs.com/is-callable */ var fnToStr = Function.prototype.toString, constructorRegex = /^\s*class /, isES6ClassFn = function isES6ClassFn(value) { try { var fnStr = fnToStr.call(value); var singleStripped = fnStr.replace(/\/\/.*\n/g, ''); var multiStripped = singleStripped.replace(/\/\*[.\s\S]*\*\//g, ''); var spaceStripped = multiStripped.replace(/\n/mg, ' ').replace(/ {2}/g, ' '); return constructorRegex.test(spaceStripped); } catch (e) { return false; /* not a function */ } }, tryFunctionObject = function tryFunctionObject(value) { try { if (isES6ClassFn(value)) { return false; } fnToStr.call(value); return true; } catch (e) { return false; } }, fnClass = '[object Function]', genClass = '[object GeneratorFunction]', isCallable = function isCallable(value) { if (!value) { return false; } if (typeof value !== 'function' && typeof value !== 'object') { return false; } if (hasToStringTag) { return tryFunctionObject(value); } if (isES6ClassFn(value)) { return false; } var strClass = to_string.call(value); return strClass === fnClass || strClass === genClass; };

    var isRegex; /* inlined from https://npmjs.com/is-regex */ var regexExec = RegExp.prototype.exec, tryRegexExec = function tryRegexExec(value) { try { regexExec.call(value); return true; } catch (e) { return false; } }, regexClass = '[object RegExp]'; isRegex = function isRegex(value) { if (typeof value !== 'object') { return false; } return hasToStringTag ? tryRegexExec(value) : to_string.call(value) === regexClass; };
    var isString; /* inlined from https://npmjs.com/is-string */ var strValue = String.prototype.valueOf, tryStringObject = function tryStringObject(value) { try { strValue.call(value); return true; } catch (e) { return false; } }, stringClass = '[object String]'; isString = function isString(value) { if (typeof value === 'string') { return true; } if (typeof value !== 'object') { return false; } return hasToStringTag ? tryStringObject(value) : to_string.call(value) === stringClass; };
    /* eslint-enable one-var-declaration-per-line, no-redeclare, max-statements-per-line */

    /* inlined from http://npmjs.com/define-properties */
    var supportsDescriptors = $Object.defineProperty && (function () {
        try {
            var obj = {};
            $Object.defineProperty(obj, 'x', { enumerable: false, value: obj });
            for (var _ in obj) { // jscs:ignore disallowUnusedVariables
                return false;
            }
            return obj.x === obj;
        } catch (e) { /* this is ES3 */
            return false;
        }
    }());
    var defineProperties = (function (has) {
        // Define configurable, writable, and non-enumerable props
        // if they don't exist.
        var defineProperty;
        if (supportsDescriptors) {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                $Object.defineProperty(object, name, {
                    configurable: true,
                    enumerable: false,
                    writable: true,
                    value: method
                });
            };
        } else {
            defineProperty = function (object, name, method, forceAssign) {
                if (!forceAssign && (name in object)) {
                    return;
                }
                object[name] = method;
            };
        }
        return function defineProperties(object, map, forceAssign) {
            for (var name in map) {
                if (has.call(map, name)) {
                    defineProperty(object, name, map[name], forceAssign);
                }
            }
        };
    }(ObjectPrototype.hasOwnProperty));

    //
    // Util
    // ======
    //

    /* replaceable with https://npmjs.com/package/es-abstract /helpers/isPrimitive */
    var isPrimitive = function isPrimitive(input) {
        var type = typeof input;
        return input === null || (type !== 'object' && type !== 'function');
    };

    var isActualNaN = $Number.isNaN || function isActualNaN(x) {
        return x !== x;
    };

    var ES = {
        // ES5 9.4
        // http://es5.github.com/#x9.4
        // http://jsperf.com/to-integer
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToInteger */
        ToInteger: function ToInteger(num) {
            var n = +num;
            if (isActualNaN(n)) {
                n = 0;
            } else if (n !== 0 && n !== (1 / 0) && n !== -(1 / 0)) {
                n = (n > 0 || -1) * Math.floor(Math.abs(n));
            }
            return n;
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToPrimitive */
        ToPrimitive: function ToPrimitive(input) {
            var val, valueOf, toStr;
            if (isPrimitive(input)) {
                return input;
            }
            valueOf = input.valueOf;
            if (isCallable(valueOf)) {
                val = valueOf.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            toStr = input.toString;
            if (isCallable(toStr)) {
                val = toStr.call(input);
                if (isPrimitive(val)) {
                    return val;
                }
            }
            throw new TypeError();
        },

        // ES5 9.9
        // http://es5.github.com/#x9.9
        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToObject */
        ToObject: function (o) {
            if (o == null) { // this matches both null and undefined
                throw new TypeError("can't convert " + o + ' to object');
            }
            return $Object(o);
        },

        /* replaceable with https://npmjs.com/package/es-abstract ES5.ToUint32 */
        ToUint32: function ToUint32(x) {
            return x >>> 0;
        }
    };

    //
    // Function
    // ========
    //

    // ES-5 15.3.4.5
    // http://es5.github.com/#x15.3.4.5

    var Empty = function Empty() {};

    defineProperties(FunctionPrototype, {
        bind: function bind(that) { // .length is 1
            // 1. Let Target be the this value.
            var target = this;
            // 2. If IsCallable(Target) is false, throw a TypeError exception.
            if (!isCallable(target)) {
                throw new TypeError('Function.prototype.bind called on incompatible ' + target);
            }
            // 3. Let A be a new (possibly empty) internal list of all of the
            //   argument values provided after thisArg (arg1, arg2 etc), in order.
            // XXX slicedArgs will stand in for "A" if used
            var args = array_slice.call(arguments, 1); // for normal call
            // 4. Let F be a new native ECMAScript object.
            // 11. Set the [[Prototype]] internal property of F to the standard
            //   built-in Function prototype object as specified in 15.3.3.1.
            // 12. Set the [[Call]] internal property of F as described in
            //   15.3.4.5.1.
            // 13. Set the [[Construct]] internal property of F as described in
            //   15.3.4.5.2.
            // 14. Set the [[HasInstance]] internal property of F as described in
            //   15.3.4.5.3.
            var bound;
            var binder = function () {

                if (this instanceof bound) {
                    // 15.3.4.5.2 [[Construct]]
                    // When the [[Construct]] internal method of a function object,
                    // F that was created using the bind function is called with a
                    // list of arguments ExtraArgs, the following steps are taken:
                    // 1. Let target be the value of F's [[TargetFunction]]
                    //   internal property.
                    // 2. If target has no [[Construct]] internal method, a
                    //   TypeError exception is thrown.
                    // 3. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Construct]] internal
                    //   method of target providing args as the arguments.

                    var result = apply.call(
                        target,
                        this,
                        array_concat.call(args, array_slice.call(arguments))
                    );
                    if ($Object(result) === result) {
                        return result;
                    }
                    return this;

                } else {
                    // 15.3.4.5.1 [[Call]]
                    // When the [[Call]] internal method of a function object, F,
                    // which was created using the bind function is called with a
                    // this value and a list of arguments ExtraArgs, the following
                    // steps are taken:
                    // 1. Let boundArgs be the value of F's [[BoundArgs]] internal
                    //   property.
                    // 2. Let boundThis be the value of F's [[BoundThis]] internal
                    //   property.
                    // 3. Let target be the value of F's [[TargetFunction]] internal
                    //   property.
                    // 4. Let args be a new list containing the same values as the
                    //   list boundArgs in the same order followed by the same
                    //   values as the list ExtraArgs in the same order.
                    // 5. Return the result of calling the [[Call]] internal method
                    //   of target providing boundThis as the this value and
                    //   providing args as the arguments.

                    // equiv: target.call(this, ...boundArgs, ...args)
                    return apply.call(
                        target,
                        that,
                        array_concat.call(args, array_slice.call(arguments))
                    );

                }

            };

            // 15. If the [[Class]] internal property of Target is "Function", then
            //     a. Let L be the length property of Target minus the length of A.
            //     b. Set the length own property of F to either 0 or L, whichever is
            //       larger.
            // 16. Else set the length own property of F to 0.

            var boundLength = max(0, target.length - args.length);

            // 17. Set the attributes of the length own property of F to the values
            //   specified in 15.3.5.1.
            var boundArgs = [];
            for (var i = 0; i < boundLength; i++) {
                array_push.call(boundArgs, '$' + i);
            }

            // XXX Build a dynamic function with desired amount of arguments is the only
            // way to set the length property of a function.
            // In environments where Content Security Policies enabled (Chrome extensions,
            // for ex.) all use of eval or Function costructor throws an exception.
            // However in all of these environments Function.prototype.bind exists
            // and so this code will never be executed.
            bound = $Function('binder', 'return function (' + array_join.call(boundArgs, ',') + '){ return binder.apply(this, arguments); }')(binder);

            if (target.prototype) {
                Empty.prototype = target.prototype;
                bound.prototype = new Empty();
                // Clean up dangling references.
                Empty.prototype = null;
            }

            // TODO
            // 18. Set the [[Extensible]] internal property of F to true.

            // TODO
            // 19. Let thrower be the [[ThrowTypeError]] function Object (13.2.3).
            // 20. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "caller", PropertyDescriptor {[[Get]]: thrower, [[Set]]:
            //   thrower, [[Enumerable]]: false, [[Configurable]]: false}, and
            //   false.
            // 21. Call the [[DefineOwnProperty]] internal method of F with
            //   arguments "arguments", PropertyDescriptor {[[Get]]: thrower,
            //   [[Set]]: thrower, [[Enumerable]]: false, [[Configurable]]: false},
            //   and false.

            // TODO
            // NOTE Function objects created using Function.prototype.bind do not
            // have a prototype property or the [[Code]], [[FormalParameters]], and
            // [[Scope]] internal properties.
            // XXX can't delete prototype in pure-js.

            // 22. Return F.
            return bound;
        }
    });

    // _Please note: Shortcuts are defined after `Function.prototype.bind` as we
    // use it in defining shortcuts.
    var owns = call.bind(ObjectPrototype.hasOwnProperty);
    var toStr = call.bind(ObjectPrototype.toString);
    var arraySlice = call.bind(array_slice);
    var arraySliceApply = apply.bind(array_slice);
    var strSlice = call.bind(StringPrototype.slice);
    var strSplit = call.bind(StringPrototype.split);
    var strIndexOf = call.bind(StringPrototype.indexOf);
    var pushCall = call.bind(array_push);
    var isEnum = call.bind(ObjectPrototype.propertyIsEnumerable);
    var arraySort = call.bind(ArrayPrototype.sort);

    //
    // Array
    // =====
    //

    var isArray = $Array.isArray || function isArray(obj) {
        return toStr(obj) === '[object Array]';
    };

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.13
    // Return len+argCount.
    // [bugfix, ielt8]
    // IE < 8 bug: [].unshift(0) === undefined but should be "1"
    var hasUnshiftReturnValueBug = [].unshift(0) !== 1;
    defineProperties(ArrayPrototype, {
        unshift: function () {
            array_unshift.apply(this, arguments);
            return this.length;
        }
    }, hasUnshiftReturnValueBug);

    // ES5 15.4.3.2
    // http://es5.github.com/#x15.4.3.2
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/isArray
    defineProperties($Array, { isArray: isArray });

    // The IsCallable() check in the Array functions
    // has been replaced with a strict check on the
    // internal class of the object to trap cases where
    // the provided function was actually a regular
    // expression literal, which in V8 and
    // JavaScriptCore is a typeof "function".  Only in
    // V8 are regular expression literals permitted as
    // reduce parameters, so it is desirable in the
    // general case for the shim to match the more
    // strict and common behavior of rejecting regular
    // expressions.

    // ES5 15.4.4.18
    // http://es5.github.com/#x15.4.4.18
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/array/forEach

    // Check failure of by-index access of string characters (IE < 9)
    // and failure of `0 in boxedString` (Rhino)
    var boxedString = $Object('a');
    var splitString = boxedString[0] !== 'a' || !(0 in boxedString);

    var properlyBoxesContext = function properlyBoxed(method) {
        // Check node 0.6.21 bug where third parameter is not boxed
        var properlyBoxesNonStrict = true;
        var properlyBoxesStrict = true;
        var threwException = false;
        if (method) {
            try {
                method.call('foo', function (_, __, context) {
                    if (typeof context !== 'object') {
                        properlyBoxesNonStrict = false;
                    }
                });

                method.call([1], function () {
                    'use strict';

                    properlyBoxesStrict = typeof this === 'string';
                }, 'x');
            } catch (e) {
                threwException = true;
            }
        }
        return !!method && !threwException && properlyBoxesNonStrict && properlyBoxesStrict;
    };

    defineProperties(ArrayPrototype, {
        forEach: function forEach(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var i = -1;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.forEach callback must be a function');
            }

            while (++i < length) {
                if (i in self) {
                    // Invoke the callback function with call, passing arguments:
                    // context, property value, property key, thisArg object
                    if (typeof T === 'undefined') {
                        callbackfn(self[i], i, object);
                    } else {
                        callbackfn.call(T, self[i], i, object);
                    }
                }
            }
        }
    }, !properlyBoxesContext(ArrayPrototype.forEach));

    // ES5 15.4.4.19
    // http://es5.github.com/#x15.4.4.19
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/map
    defineProperties(ArrayPrototype, {
        map: function map(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = $Array(length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.map callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    if (typeof T === 'undefined') {
                        result[i] = callbackfn(self[i], i, object);
                    } else {
                        result[i] = callbackfn.call(T, self[i], i, object);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.map));

    // ES5 15.4.4.20
    // http://es5.github.com/#x15.4.4.20
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/filter
    defineProperties(ArrayPrototype, {
        filter: function filter(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var result = [];
            var value;
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.filter callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self) {
                    value = self[i];
                    if (typeof T === 'undefined' ? callbackfn(value, i, object) : callbackfn.call(T, value, i, object)) {
                        pushCall(result, value);
                    }
                }
            }
            return result;
        }
    }, !properlyBoxesContext(ArrayPrototype.filter));

    // ES5 15.4.4.16
    // http://es5.github.com/#x15.4.4.16
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/every
    defineProperties(ArrayPrototype, {
        every: function every(callbackfn/*, thisArg*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.every callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && !(typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return false;
                }
            }
            return true;
        }
    }, !properlyBoxesContext(ArrayPrototype.every));

    // ES5 15.4.4.17
    // http://es5.github.com/#x15.4.4.17
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/some
    defineProperties(ArrayPrototype, {
        some: function some(callbackfn/*, thisArg */) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);
            var T;
            if (arguments.length > 1) {
                T = arguments[1];
            }

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.some callback must be a function');
            }

            for (var i = 0; i < length; i++) {
                if (i in self && (typeof T === 'undefined' ? callbackfn(self[i], i, object) : callbackfn.call(T, self[i], i, object))) {
                    return true;
                }
            }
            return false;
        }
    }, !properlyBoxesContext(ArrayPrototype.some));

    // ES5 15.4.4.21
    // http://es5.github.com/#x15.4.4.21
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduce
    var reduceCoercesToObject = false;
    if (ArrayPrototype.reduce) {
        reduceCoercesToObject = typeof ArrayPrototype.reduce.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduce: function reduce(callbackfn/*, initialValue*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduce callback must be a function');
            }

            // no value to return if no initial value and an empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduce of empty array with no initial value');
            }

            var i = 0;
            var result;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i++];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (++i >= length) {
                        throw new TypeError('reduce of empty array with no initial value');
                    }
                } while (true);
            }

            for (; i < length; i++) {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            }

            return result;
        }
    }, !reduceCoercesToObject);

    // ES5 15.4.4.22
    // http://es5.github.com/#x15.4.4.22
    // https://developer.mozilla.org/en/Core_JavaScript_1.5_Reference/Objects/Array/reduceRight
    var reduceRightCoercesToObject = false;
    if (ArrayPrototype.reduceRight) {
        reduceRightCoercesToObject = typeof ArrayPrototype.reduceRight.call('es5', function (_, __, ___, list) {
            return list;
        }) === 'object';
    }
    defineProperties(ArrayPrototype, {
        reduceRight: function reduceRight(callbackfn/*, initial*/) {
            var object = ES.ToObject(this);
            var self = splitString && isString(this) ? strSplit(this, '') : object;
            var length = ES.ToUint32(self.length);

            // If no callback function or if callback is not a callable function
            if (!isCallable(callbackfn)) {
                throw new TypeError('Array.prototype.reduceRight callback must be a function');
            }

            // no value to return if no initial value, empty array
            if (length === 0 && arguments.length === 1) {
                throw new TypeError('reduceRight of empty array with no initial value');
            }

            var result;
            var i = length - 1;
            if (arguments.length >= 2) {
                result = arguments[1];
            } else {
                do {
                    if (i in self) {
                        result = self[i--];
                        break;
                    }

                    // if array contains no values, no initial value to return
                    if (--i < 0) {
                        throw new TypeError('reduceRight of empty array with no initial value');
                    }
                } while (true);
            }

            if (i < 0) {
                return result;
            }

            do {
                if (i in self) {
                    result = callbackfn(result, self[i], i, object);
                }
            } while (i--);

            return result;
        }
    }, !reduceRightCoercesToObject);

    // ES5 15.4.4.14
    // http://es5.github.com/#x15.4.4.14
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/indexOf
    var hasFirefox2IndexOfBug = ArrayPrototype.indexOf && [0, 1].indexOf(1, 2) !== -1;
    defineProperties(ArrayPrototype, {
        indexOf: function indexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }

            var i = 0;
            if (arguments.length > 1) {
                i = ES.ToInteger(arguments[1]);
            }

            // handle negative indices
            i = i >= 0 ? i : max(0, length + i);
            for (; i < length; i++) {
                if (i in self && self[i] === searchElement) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2IndexOfBug);

    // ES5 15.4.4.15
    // http://es5.github.com/#x15.4.4.15
    // https://developer.mozilla.org/en/JavaScript/Reference/Global_Objects/Array/lastIndexOf
    var hasFirefox2LastIndexOfBug = ArrayPrototype.lastIndexOf && [0, 1].lastIndexOf(0, -3) !== -1;
    defineProperties(ArrayPrototype, {
        lastIndexOf: function lastIndexOf(searchElement/*, fromIndex */) {
            var self = splitString && isString(this) ? strSplit(this, '') : ES.ToObject(this);
            var length = ES.ToUint32(self.length);

            if (length === 0) {
                return -1;
            }
            var i = length - 1;
            if (arguments.length > 1) {
                i = min(i, ES.ToInteger(arguments[1]));
            }
            // handle negative indices
            i = i >= 0 ? i : length - Math.abs(i);
            for (; i >= 0; i--) {
                if (i in self && searchElement === self[i]) {
                    return i;
                }
            }
            return -1;
        }
    }, hasFirefox2LastIndexOfBug);

    // ES5 15.4.4.12
    // http://es5.github.com/#x15.4.4.12
    var spliceNoopReturnsEmptyArray = (function () {
        var a = [1, 2];
        var result = a.splice();
        return a.length === 2 && isArray(result) && result.length === 0;
    }());
    defineProperties(ArrayPrototype, {
        // Safari 5.0 bug where .splice() returns undefined
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            } else {
                return array_splice.apply(this, arguments);
            }
        }
    }, !spliceNoopReturnsEmptyArray);

    var spliceWorksWithEmptyObject = (function () {
        var obj = {};
        ArrayPrototype.splice.call(obj, 0, 0, 1);
        return obj.length === 1;
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            if (arguments.length === 0) {
                return [];
            }
            var args = arguments;
            this.length = max(ES.ToInteger(this.length), 0);
            if (arguments.length > 0 && typeof deleteCount !== 'number') {
                args = arraySlice(arguments);
                if (args.length < 2) {
                    pushCall(args, this.length - start);
                } else {
                    args[1] = ES.ToInteger(deleteCount);
                }
            }
            return array_splice.apply(this, args);
        }
    }, !spliceWorksWithEmptyObject);
    var spliceWorksWithLargeSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Safari 7/8 breaks with sparse arrays of size 1e5 or greater
        var arr = new $Array(1e5);
        // note: the index MUST be 8 or larger or the test will false pass
        arr[8] = 'x';
        arr.splice(1, 1);
        // note: this test must be defined *after* the indexOf shim
        // per https://github.com/es-shims/es5-shim/issues/313
        return arr.indexOf('x') === 7;
    }());
    var spliceWorksWithSmallSparseArrays = (function () {
        // Per https://github.com/es-shims/es5-shim/issues/295
        // Opera 12.15 breaks on this, no idea why.
        var n = 256;
        var arr = [];
        arr[n] = 'a';
        arr.splice(n + 1, 0, 'b');
        return arr[n] === 'a';
    }());
    defineProperties(ArrayPrototype, {
        splice: function splice(start, deleteCount) {
            var O = ES.ToObject(this);
            var A = [];
            var len = ES.ToUint32(O.length);
            var relativeStart = ES.ToInteger(start);
            var actualStart = relativeStart < 0 ? max((len + relativeStart), 0) : min(relativeStart, len);
            var actualDeleteCount = min(max(ES.ToInteger(deleteCount), 0), len - actualStart);

            var k = 0;
            var from;
            while (k < actualDeleteCount) {
                from = $String(actualStart + k);
                if (owns(O, from)) {
                    A[k] = O[from];
                }
                k += 1;
            }

            var items = arraySlice(arguments, 2);
            var itemCount = items.length;
            var to;
            if (itemCount < actualDeleteCount) {
                k = actualStart;
                var maxK = len - actualDeleteCount;
                while (k < maxK) {
                    from = $String(k + actualDeleteCount);
                    to = $String(k + itemCount);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k += 1;
                }
                k = len;
                var minK = len - actualDeleteCount + itemCount;
                while (k > minK) {
                    delete O[k - 1];
                    k -= 1;
                }
            } else if (itemCount > actualDeleteCount) {
                k = len - actualDeleteCount;
                while (k > actualStart) {
                    from = $String(k + actualDeleteCount - 1);
                    to = $String(k + itemCount - 1);
                    if (owns(O, from)) {
                        O[to] = O[from];
                    } else {
                        delete O[to];
                    }
                    k -= 1;
                }
            }
            k = actualStart;
            for (var i = 0; i < items.length; ++i) {
                O[k] = items[i];
                k += 1;
            }
            O.length = len - actualDeleteCount + itemCount;

            return A;
        }
    }, !spliceWorksWithLargeSparseArrays || !spliceWorksWithSmallSparseArrays);

    var originalJoin = ArrayPrototype.join;
    var hasStringJoinBug;
    try {
        hasStringJoinBug = Array.prototype.join.call('123', ',') !== '1,2,3';
    } catch (e) {
        hasStringJoinBug = true;
    }
    if (hasStringJoinBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(isString(this) ? strSplit(this, '') : this, sep);
            }
        }, hasStringJoinBug);
    }

    var hasJoinUndefinedBug = [1, 2].join(undefined) !== '1,2';
    if (hasJoinUndefinedBug) {
        defineProperties(ArrayPrototype, {
            join: function join(separator) {
                var sep = typeof separator === 'undefined' ? ',' : separator;
                return originalJoin.call(this, sep);
            }
        }, hasJoinUndefinedBug);
    }

    var pushShim = function push(item) {
        var O = ES.ToObject(this);
        var n = ES.ToUint32(O.length);
        var i = 0;
        while (i < arguments.length) {
            O[n + i] = arguments[i];
            i += 1;
        }
        O.length = n + i;
        return n + i;
    };

    var pushIsNotGeneric = (function () {
        var obj = {};
        var result = Array.prototype.push.call(obj, undefined);
        return result !== 1 || obj.length !== 1 || typeof obj[0] !== 'undefined' || !owns(obj, 0);
    }());
    defineProperties(ArrayPrototype, {
        push: function push(item) {
            if (isArray(this)) {
                return array_push.apply(this, arguments);
            }
            return pushShim.apply(this, arguments);
        }
    }, pushIsNotGeneric);

    // This fixes a very weird bug in Opera 10.6 when pushing `undefined
    var pushUndefinedIsWeird = (function () {
        var arr = [];
        var result = arr.push(undefined);
        return result !== 1 || arr.length !== 1 || typeof arr[0] !== 'undefined' || !owns(arr, 0);
    }());
    defineProperties(ArrayPrototype, { push: pushShim }, pushUndefinedIsWeird);

    // ES5 15.2.3.14
    // http://es5.github.io/#x15.4.4.10
    // Fix boxed string bug
    defineProperties(ArrayPrototype, {
        slice: function (start, end) {
            var arr = isString(this) ? strSplit(this, '') : this;
            return arraySliceApply(arr, arguments);
        }
    }, splitString);

    var sortIgnoresNonFunctions = (function () {
        try {
            [1, 2].sort(null);
            [1, 2].sort({});
            return true;
        } catch (e) {}
        return false;
    }());
    var sortThrowsOnRegex = (function () {
        // this is a problem in Firefox 4, in which `typeof /a/ === 'function'`
        try {
            [1, 2].sort(/a/);
            return false;
        } catch (e) {}
        return true;
    }());
    var sortIgnoresUndefined = (function () {
        // applies in IE 8, for one.
        try {
            [1, 2].sort(undefined);
            return true;
        } catch (e) {}
        return false;
    }());
    defineProperties(ArrayPrototype, {
        sort: function sort(compareFn) {
            if (typeof compareFn === 'undefined') {
                return arraySort(this);
            }
            if (!isCallable(compareFn)) {
                throw new TypeError('Array.prototype.sort callback must be a function');
            }
            return arraySort(this, compareFn);
        }
    }, sortIgnoresNonFunctions || !sortIgnoresUndefined || !sortThrowsOnRegex);

    //
    // Object
    // ======
    //

    // ES5 15.2.3.14
    // http://es5.github.com/#x15.2.3.14

    // http://whattheheadsaid.com/2010/10/a-safer-object-keys-compatibility-implementation
    var hasDontEnumBug = !isEnum({ 'toString': null }, 'toString');
    var hasProtoEnumBug = isEnum(function () {}, 'prototype');
    var hasStringEnumBug = !owns('x', '0');
    var equalsConstructorPrototype = function (o) {
        var ctor = o.constructor;
        return ctor && ctor.prototype === o;
    };
    var blacklistedKeys = {
        $window: true,
        $console: true,
        $parent: true,
        $self: true,
        $frame: true,
        $frames: true,
        $frameElement: true,
        $webkitIndexedDB: true,
        $webkitStorageInfo: true,
        $external: true
    };
    var hasAutomationEqualityBug = (function () {
        /* globals window */
        if (typeof window === 'undefined') {
            return false;
        }
        for (var k in window) {
            try {
                if (!blacklistedKeys['$' + k] && owns(window, k) && window[k] !== null && typeof window[k] === 'object') {
                    equalsConstructorPrototype(window[k]);
                }
            } catch (e) {
                return true;
            }
        }
        return false;
    }());
    var equalsConstructorPrototypeIfNotBuggy = function (object) {
        if (typeof window === 'undefined' || !hasAutomationEqualityBug) {
            return equalsConstructorPrototype(object);
        }
        try {
            return equalsConstructorPrototype(object);
        } catch (e) {
            return false;
        }
    };
    var dontEnums = [
        'toString',
        'toLocaleString',
        'valueOf',
        'hasOwnProperty',
        'isPrototypeOf',
        'propertyIsEnumerable',
        'constructor'
    ];
    var dontEnumsLength = dontEnums.length;

    // taken directly from https://github.com/ljharb/is-arguments/blob/master/index.js
    // can be replaced with require('is-arguments') if we ever use a build process instead
    var isStandardArguments = function isArguments(value) {
        return toStr(value) === '[object Arguments]';
    };
    var isLegacyArguments = function isArguments(value) {
        return value !== null &&
            typeof value === 'object' &&
            typeof value.length === 'number' &&
            value.length >= 0 &&
            !isArray(value) &&
            isCallable(value.callee);
    };
    var isArguments = isStandardArguments(arguments) ? isStandardArguments : isLegacyArguments;

    defineProperties($Object, {
        keys: function keys(object) {
            var isFn = isCallable(object);
            var isArgs = isArguments(object);
            var isObject = object !== null && typeof object === 'object';
            var isStr = isObject && isString(object);

            if (!isObject && !isFn && !isArgs) {
                throw new TypeError('Object.keys called on a non-object');
            }

            var theKeys = [];
            var skipProto = hasProtoEnumBug && isFn;
            if ((isStr && hasStringEnumBug) || isArgs) {
                for (var i = 0; i < object.length; ++i) {
                    pushCall(theKeys, $String(i));
                }
            }

            if (!isArgs) {
                for (var name in object) {
                    if (!(skipProto && name === 'prototype') && owns(object, name)) {
                        pushCall(theKeys, $String(name));
                    }
                }
            }

            if (hasDontEnumBug) {
                var skipConstructor = equalsConstructorPrototypeIfNotBuggy(object);
                for (var j = 0; j < dontEnumsLength; j++) {
                    var dontEnum = dontEnums[j];
                    if (!(skipConstructor && dontEnum === 'constructor') && owns(object, dontEnum)) {
                        pushCall(theKeys, dontEnum);
                    }
                }
            }
            return theKeys;
        }
    });

    var keysWorksWithArguments = $Object.keys && (function () {
        // Safari 5.0 bug
        return $Object.keys(arguments).length === 2;
    }(1, 2));
    var keysHasArgumentsLengthBug = $Object.keys && (function () {
        var argKeys = $Object.keys(arguments);
        return arguments.length !== 1 || argKeys.length !== 1 || argKeys[0] !== 1;
    }(1));
    var originalKeys = $Object.keys;
    defineProperties($Object, {
        keys: function keys(object) {
            if (isArguments(object)) {
                return originalKeys(arraySlice(object));
            } else {
                return originalKeys(object);
            }
        }
    }, !keysWorksWithArguments || keysHasArgumentsLengthBug);

    //
    // Date
    // ====
    //

    var hasNegativeMonthYearBug = new Date(-3509827329600292).getUTCMonth() !== 0;
    var aNegativeTestDate = new Date(-1509842289600292);
    var aPositiveTestDate = new Date(1449662400000);
    var hasToUTCStringFormatBug = aNegativeTestDate.toUTCString() !== 'Mon, 01 Jan -45875 11:59:59 GMT';
    var hasToDateStringFormatBug;
    var hasToStringFormatBug;
    var timeZoneOffset = aNegativeTestDate.getTimezoneOffset();
    if (timeZoneOffset < -720) {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Tue Jan 02 -45875';
        hasToStringFormatBug = !(/^Thu Dec 10 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/).test(aPositiveTestDate.toString());
    } else {
        hasToDateStringFormatBug = aNegativeTestDate.toDateString() !== 'Mon Jan 01 -45875';
        hasToStringFormatBug = !(/^Wed Dec 09 2015 \d\d:\d\d:\d\d GMT[-\+]\d\d\d\d(?: |$)/).test(aPositiveTestDate.toString());
    }

    var originalGetFullYear = call.bind(Date.prototype.getFullYear);
    var originalGetMonth = call.bind(Date.prototype.getMonth);
    var originalGetDate = call.bind(Date.prototype.getDate);
    var originalGetUTCFullYear = call.bind(Date.prototype.getUTCFullYear);
    var originalGetUTCMonth = call.bind(Date.prototype.getUTCMonth);
    var originalGetUTCDate = call.bind(Date.prototype.getUTCDate);
    var originalGetUTCDay = call.bind(Date.prototype.getUTCDay);
    var originalGetUTCHours = call.bind(Date.prototype.getUTCHours);
    var originalGetUTCMinutes = call.bind(Date.prototype.getUTCMinutes);
    var originalGetUTCSeconds = call.bind(Date.prototype.getUTCSeconds);
    var originalGetUTCMilliseconds = call.bind(Date.prototype.getUTCMilliseconds);
    var dayName = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    var monthName = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    var daysInMonth = function daysInMonth(month, year) {
        return originalGetDate(new Date(year, month, 0));
    };

    defineProperties(Date.prototype, {
        getFullYear: function getFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            if (year < 0 && originalGetMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getMonth: function getMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getDate: function getDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetFullYear(this);
            var month = originalGetMonth(this);
            var date = originalGetDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        },
        getUTCFullYear: function getUTCFullYear() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            if (year < 0 && originalGetUTCMonth(this) > 11) {
                return year + 1;
            }
            return year;
        },
        getUTCMonth: function getUTCMonth() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            if (year < 0 && month > 11) {
                return 0;
            }
            return month;
        },
        getUTCDate: function getUTCDate() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var year = originalGetUTCFullYear(this);
            var month = originalGetUTCMonth(this);
            var date = originalGetUTCDate(this);
            if (year < 0 && month > 11) {
                if (month === 12) {
                    return date;
                }
                var days = daysInMonth(0, year + 1);
                return (days - date) + 1;
            }
            return date;
        }
    }, hasNegativeMonthYearBug);

    defineProperties(Date.prototype, {
        toUTCString: function toUTCString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = originalGetUTCDay(this);
            var date = originalGetUTCDate(this);
            var month = originalGetUTCMonth(this);
            var year = originalGetUTCFullYear(this);
            var hour = originalGetUTCHours(this);
            var minute = originalGetUTCMinutes(this);
            var second = originalGetUTCSeconds(this);
            return dayName[day] + ', ' +
                (date < 10 ? '0' + date : date) + ' ' +
                monthName[month] + ' ' +
                year + ' ' +
                (hour < 10 ? '0' + hour : hour) + ':' +
                (minute < 10 ? '0' + minute : minute) + ':' +
                (second < 10 ? '0' + second : second) + ' GMT';
        }
    }, hasNegativeMonthYearBug || hasToUTCStringFormatBug);

    // Opera 12 has `,`
    defineProperties(Date.prototype, {
        toDateString: function toDateString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            return dayName[day] + ' ' +
                monthName[month] + ' ' +
                (date < 10 ? '0' + date : date) + ' ' +
                year;
        }
    }, hasNegativeMonthYearBug || hasToDateStringFormatBug);

    // can't use defineProperties here because of toString enumeration issue in IE <= 8
    if (hasNegativeMonthYearBug || hasToStringFormatBug) {
        Date.prototype.toString = function toString() {
            if (!this || !(this instanceof Date)) {
                throw new TypeError('this is not a Date object.');
            }
            var day = this.getDay();
            var date = this.getDate();
            var month = this.getMonth();
            var year = this.getFullYear();
            var hour = this.getHours();
            var minute = this.getMinutes();
            var second = this.getSeconds();
            var timezoneOffset = this.getTimezoneOffset();
            var hoursOffset = Math.floor(Math.abs(timezoneOffset) / 60);
            var minutesOffset = Math.floor(Math.abs(timezoneOffset) % 60);
            return dayName[day] + ' ' +
                monthName[month] + ' ' +
                (date < 10 ? '0' + date : date) + ' ' +
                year + ' ' +
                (hour < 10 ? '0' + hour : hour) + ':' +
                (minute < 10 ? '0' + minute : minute) + ':' +
                (second < 10 ? '0' + second : second) + ' GMT' +
                (timezoneOffset > 0 ? '-' : '+') +
                (hoursOffset < 10 ? '0' + hoursOffset : hoursOffset) +
                (minutesOffset < 10 ? '0' + minutesOffset : minutesOffset);
        };
        if (supportsDescriptors) {
            $Object.defineProperty(Date.prototype, 'toString', {
                configurable: true,
                enumerable: false,
                writable: true
            });
        }
    }

    // ES5 15.9.5.43
    // http://es5.github.com/#x15.9.5.43
    // This function returns a String value represent the instance in time
    // represented by this Date object. The format of the String is the Date Time
    // string format defined in 15.9.1.15. All fields are present in the String.
    // The time zone is always UTC, denoted by the suffix Z. If the time value of
    // this object is not a finite Number a RangeError exception is thrown.
    var negativeDate = -62198755200000;
    var negativeYearString = '-000001';
    var hasNegativeDateBug = Date.prototype.toISOString && new Date(negativeDate).toISOString().indexOf(negativeYearString) === -1;
    var hasSafari51DateBug = Date.prototype.toISOString && new Date(-1).toISOString() !== '1969-12-31T23:59:59.999Z';

    var getTime = call.bind(Date.prototype.getTime);

    defineProperties(Date.prototype, {
        toISOString: function toISOString() {
            if (!isFinite(this) || !isFinite(getTime(this))) {
                // Adope Photoshop requires the second check.
                throw new RangeError('Date.prototype.toISOString called on non-finite value.');
            }

            var year = originalGetUTCFullYear(this);

            var month = originalGetUTCMonth(this);
            // see https://github.com/es-shims/es5-shim/issues/111
            year += Math.floor(month / 12);
            month = (month % 12 + 12) % 12;

            // the date time string format is specified in 15.9.1.15.
            var result = [month + 1, originalGetUTCDate(this), originalGetUTCHours(this), originalGetUTCMinutes(this), originalGetUTCSeconds(this)];
            year = (
                (year < 0 ? '-' : (year > 9999 ? '+' : '')) +
                strSlice('00000' + Math.abs(year), (0 <= year && year <= 9999) ? -4 : -6)
            );

            for (var i = 0; i < result.length; ++i) {
                // pad months, days, hours, minutes, and seconds to have two digits.
                result[i] = strSlice('00' + result[i], -2);
            }
            // pad milliseconds to have three digits.
            return (
                year + '-' + arraySlice(result, 0, 2).join('-') +
                'T' + arraySlice(result, 2).join(':') + '.' +
                strSlice('000' + originalGetUTCMilliseconds(this), -3) + 'Z'
            );
        }
    }, hasNegativeDateBug || hasSafari51DateBug);

    // ES5 15.9.5.44
    // http://es5.github.com/#x15.9.5.44
    // This function provides a String representation of a Date object for use by
    // JSON.stringify (15.12.3).
    var dateToJSONIsSupported = (function () {
        try {
            return Date.prototype.toJSON &&
                new Date(NaN).toJSON() === null &&
                new Date(negativeDate).toJSON().indexOf(negativeYearString) !== -1 &&
                Date.prototype.toJSON.call({ // generic
                    toISOString: function () { return true; }
                });
        } catch (e) {
            return false;
        }
    }());
    if (!dateToJSONIsSupported) {
        Date.prototype.toJSON = function toJSON(key) {
            // When the toJSON method is called with argument key, the following
            // steps are taken:

            // 1.  Let O be the result of calling ToObject, giving it the this
            // value as its argument.
            // 2. Let tv be ES.ToPrimitive(O, hint Number).
            var O = $Object(this);
            var tv = ES.ToPrimitive(O);
            // 3. If tv is a Number and is not finite, return null.
            if (typeof tv === 'number' && !isFinite(tv)) {
                return null;
            }
            // 4. Let toISO be the result of calling the [[Get]] internal method of
            // O with argument "toISOString".
            var toISO = O.toISOString;
            // 5. If IsCallable(toISO) is false, throw a TypeError exception.
            if (!isCallable(toISO)) {
                throw new TypeError('toISOString property is not callable');
            }
            // 6. Return the result of calling the [[Call]] internal method of
            //  toISO with O as the this value and an empty argument list.
            return toISO.call(O);

            // NOTE 1 The argument is ignored.

            // NOTE 2 The toJSON function is intentionally generic; it does not
            // require that its this value be a Date object. Therefore, it can be
            // transferred to other kinds of objects for use as a method. However,
            // it does require that any such object have a toISOString method. An
            // object is free to use the argument key to filter its
            // stringification.
        };
    }

    // ES5 15.9.4.2
    // http://es5.github.com/#x15.9.4.2
    // based on work shared by Daniel Friesen (dantman)
    // http://gist.github.com/303249
    var supportsExtendedYears = Date.parse('+033658-09-27T01:46:40.000Z') === 1e15;
    var acceptsInvalidDates = !isNaN(Date.parse('2012-04-04T24:00:00.500Z')) || !isNaN(Date.parse('2012-11-31T23:59:59.000Z')) || !isNaN(Date.parse('2012-12-31T23:59:60.000Z'));
    var doesNotParseY2KNewYear = isNaN(Date.parse('2000-01-01T00:00:00.000Z'));
    if (doesNotParseY2KNewYear || acceptsInvalidDates || !supportsExtendedYears) {
        // XXX global assignment won't work in embeddings that use
        // an alternate object for the context.
        /* global Date: true */
        /* eslint-disable no-undef */
        var maxSafeUnsigned32Bit = Math.pow(2, 31) - 1;
        var hasSafariSignedIntBug = isActualNaN(new Date(1970, 0, 1, 0, 0, 0, maxSafeUnsigned32Bit + 1).getTime());
        /* eslint-disable no-implicit-globals */
        Date = (function (NativeDate) {
        /* eslint-enable no-implicit-globals */
        /* eslint-enable no-undef */
            // Date.length === 7
            var DateShim = function Date(Y, M, D, h, m, s, ms) {
                var length = arguments.length;
                var date;
                if (this instanceof NativeDate) {
                    var seconds = s;
                    var millis = ms;
                    if (hasSafariSignedIntBug && length >= 7 && ms > maxSafeUnsigned32Bit) {
                        // work around a Safari 8/9 bug where it treats the seconds as signed
                        var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                        var sToShift = Math.floor(msToShift / 1e3);
                        seconds += sToShift;
                        millis -= sToShift * 1e3;
                    }
                    date = length === 1 && $String(Y) === Y ? // isString(Y)
                        // We explicitly pass it through parse:
                        new NativeDate(DateShim.parse(Y)) :
                        // We have to manually make calls depending on argument
                        // length here
                        length >= 7 ? new NativeDate(Y, M, D, h, m, seconds, millis) :
                        length >= 6 ? new NativeDate(Y, M, D, h, m, seconds) :
                        length >= 5 ? new NativeDate(Y, M, D, h, m) :
                        length >= 4 ? new NativeDate(Y, M, D, h) :
                        length >= 3 ? new NativeDate(Y, M, D) :
                        length >= 2 ? new NativeDate(Y, M) :
                        length >= 1 ? new NativeDate(Y instanceof NativeDate ? +Y : Y) :
                                      new NativeDate();
                } else {
                    date = NativeDate.apply(this, arguments);
                }
                if (!isPrimitive(date)) {
                    // Prevent mixups with unfixed Date object
                    defineProperties(date, { constructor: DateShim }, true);
                }
                return date;
            };

            // 15.9.1.15 Date Time String Format.
            var isoDateExpression = new RegExp('^' +
                '(\\d{4}|[+-]\\d{6})' + // four-digit year capture or sign +
                                          // 6-digit extended year
                '(?:-(\\d{2})' + // optional month capture
                '(?:-(\\d{2})' + // optional day capture
                '(?:' + // capture hours:minutes:seconds.milliseconds
                    'T(\\d{2})' + // hours capture
                    ':(\\d{2})' + // minutes capture
                    '(?:' + // optional :seconds.milliseconds
                        ':(\\d{2})' + // seconds capture
                        '(?:(\\.\\d{1,}))?' + // milliseconds capture
                    ')?' +
                '(' + // capture UTC offset component
                    'Z|' + // UTC capture
                    '(?:' + // offset specifier +/-hours:minutes
                        '([-+])' + // sign capture
                        '(\\d{2})' + // hours offset capture
                        ':(\\d{2})' + // minutes offset capture
                    ')' +
                ')?)?)?)?' +
            '$');

            var months = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334, 365];

            var dayFromMonth = function dayFromMonth(year, month) {
                var t = month > 1 ? 1 : 0;
                return (
                    months[month] +
                    Math.floor((year - 1969 + t) / 4) -
                    Math.floor((year - 1901 + t) / 100) +
                    Math.floor((year - 1601 + t) / 400) +
                    365 * (year - 1970)
                );
            };

            var toUTC = function toUTC(t) {
                var s = 0;
                var ms = t;
                if (hasSafariSignedIntBug && ms > maxSafeUnsigned32Bit) {
                    // work around a Safari 8/9 bug where it treats the seconds as signed
                    var msToShift = Math.floor(ms / maxSafeUnsigned32Bit) * maxSafeUnsigned32Bit;
                    var sToShift = Math.floor(msToShift / 1e3);
                    s += sToShift;
                    ms -= sToShift * 1e3;
                }
                return $Number(new NativeDate(1970, 0, 1, 0, 0, s, ms));
            };

            // Copy any custom methods a 3rd party library may have added
            for (var key in NativeDate) {
                if (owns(NativeDate, key)) {
                    DateShim[key] = NativeDate[key];
                }
            }

            // Copy "native" methods explicitly; they may be non-enumerable
            defineProperties(DateShim, {
                now: NativeDate.now,
                UTC: NativeDate.UTC
            }, true);
            DateShim.prototype = NativeDate.prototype;
            defineProperties(DateShim.prototype, {
                constructor: DateShim
            }, true);

            // Upgrade Date.parse to handle simplified ISO 8601 strings
            var parseShim = function parse(string) {
                var match = isoDateExpression.exec(string);
                if (match) {
                    // parse months, days, hours, minutes, seconds, and milliseconds
                    // provide default values if necessary
                    // parse the UTC offset component
                    var year = $Number(match[1]),
                        month = $Number(match[2] || 1) - 1,
                        day = $Number(match[3] || 1) - 1,
                        hour = $Number(match[4] || 0),
                        minute = $Number(match[5] || 0),
                        second = $Number(match[6] || 0),
                        millisecond = Math.floor($Number(match[7] || 0) * 1000),
                        // When time zone is missed, local offset should be used
                        // (ES 5.1 bug)
                        // see https://bugs.ecmascript.org/show_bug.cgi?id=112
                        isLocalTime = Boolean(match[4] && !match[8]),
                        signOffset = match[9] === '-' ? 1 : -1,
                        hourOffset = $Number(match[10] || 0),
                        minuteOffset = $Number(match[11] || 0),
                        result;
                    var hasMinutesOrSecondsOrMilliseconds = minute > 0 || second > 0 || millisecond > 0;
                    if (
                        hour < (hasMinutesOrSecondsOrMilliseconds ? 24 : 25) &&
                        minute < 60 && second < 60 && millisecond < 1000 &&
                        month > -1 && month < 12 && hourOffset < 24 &&
                        minuteOffset < 60 && // detect invalid offsets
                        day > -1 &&
                        day < (dayFromMonth(year, month + 1) - dayFromMonth(year, month))
                    ) {
                        result = (
                            (dayFromMonth(year, month) + day) * 24 +
                            hour +
                            hourOffset * signOffset
                        ) * 60;
                        result = (
                            (result + minute + minuteOffset * signOffset) * 60 +
                            second
                        ) * 1000 + millisecond;
                        if (isLocalTime) {
                            result = toUTC(result);
                        }
                        if (-8.64e15 <= result && result <= 8.64e15) {
                            return result;
                        }
                    }
                    return NaN;
                }
                return NativeDate.parse.apply(this, arguments);
            };
            defineProperties(DateShim, { parse: parseShim });

            return DateShim;
        }(Date));
        /* global Date: false */
    }

    // ES5 15.9.4.4
    // http://es5.github.com/#x15.9.4.4
    if (!Date.now) {
        Date.now = function now() {
            return new Date().getTime();
        };
    }

    //
    // Number
    // ======
    //

    // ES5.1 15.7.4.5
    // http://es5.github.com/#x15.7.4.5
    var hasToFixedBugs = NumberPrototype.toFixed && (
      (0.00008).toFixed(3) !== '0.000' ||
      (0.9).toFixed(0) !== '1' ||
      (1.255).toFixed(2) !== '1.25' ||
      (1000000000000000128).toFixed(0) !== '1000000000000000128'
    );

    var toFixedHelpers = {
        base: 1e7,
        size: 6,
        data: [0, 0, 0, 0, 0, 0],
        multiply: function multiply(n, c) {
            var i = -1;
            var c2 = c;
            while (++i < toFixedHelpers.size) {
                c2 += n * toFixedHelpers.data[i];
                toFixedHelpers.data[i] = c2 % toFixedHelpers.base;
                c2 = Math.floor(c2 / toFixedHelpers.base);
            }
        },
        divide: function divide(n) {
            var i = toFixedHelpers.size;
            var c = 0;
            while (--i >= 0) {
                c += toFixedHelpers.data[i];
                toFixedHelpers.data[i] = Math.floor(c / n);
                c = (c % n) * toFixedHelpers.base;
            }
        },
        numToString: function numToString() {
            var i = toFixedHelpers.size;
            var s = '';
            while (--i >= 0) {
                if (s !== '' || i === 0 || toFixedHelpers.data[i] !== 0) {
                    var t = $String(toFixedHelpers.data[i]);
                    if (s === '') {
                        s = t;
                    } else {
                        s += strSlice('0000000', 0, 7 - t.length) + t;
                    }
                }
            }
            return s;
        },
        pow: function pow(x, n, acc) {
            return (n === 0 ? acc : (n % 2 === 1 ? pow(x, n - 1, acc * x) : pow(x * x, n / 2, acc)));
        },
        log: function log(x) {
            var n = 0;
            var x2 = x;
            while (x2 >= 4096) {
                n += 12;
                x2 /= 4096;
            }
            while (x2 >= 2) {
                n += 1;
                x2 /= 2;
            }
            return n;
        }
    };

    var toFixedShim = function toFixed(fractionDigits) {
        var f, x, s, m, e, z, j, k;

        // Test for NaN and round fractionDigits down
        f = $Number(fractionDigits);
        f = isActualNaN(f) ? 0 : Math.floor(f);

        if (f < 0 || f > 20) {
            throw new RangeError('Number.toFixed called with invalid number of decimals');
        }

        x = $Number(this);

        if (isActualNaN(x)) {
            return 'NaN';
        }

        // If it is too big or small, return the string value of the number
        if (x <= -1e21 || x >= 1e21) {
            return $String(x);
        }

        s = '';

        if (x < 0) {
            s = '-';
            x = -x;
        }

        m = '0';

        if (x > 1e-21) {
            // 1e-21 < x < 1e21
            // -70 < log2(x) < 70
            e = toFixedHelpers.log(x * toFixedHelpers.pow(2, 69, 1)) - 69;
            z = (e < 0 ? x * toFixedHelpers.pow(2, -e, 1) : x / toFixedHelpers.pow(2, e, 1));
            z *= 0x10000000000000; // Math.pow(2, 52);
            e = 52 - e;

            // -18 < e < 122
            // x = z / 2 ^ e
            if (e > 0) {
                toFixedHelpers.multiply(0, z);
                j = f;

                while (j >= 7) {
                    toFixedHelpers.multiply(1e7, 0);
                    j -= 7;
                }

                toFixedHelpers.multiply(toFixedHelpers.pow(10, j, 1), 0);
                j = e - 1;

                while (j >= 23) {
                    toFixedHelpers.divide(1 << 23);
                    j -= 23;
                }

                toFixedHelpers.divide(1 << j);
                toFixedHelpers.multiply(1, 1);
                toFixedHelpers.divide(2);
                m = toFixedHelpers.numToString();
            } else {
                toFixedHelpers.multiply(0, z);
                toFixedHelpers.multiply(1 << (-e), 0);
                m = toFixedHelpers.numToString() + strSlice('0.00000000000000000000', 2, 2 + f);
            }
        }

        if (f > 0) {
            k = m.length;

            if (k <= f) {
                m = s + strSlice('0.0000000000000000000', 0, f - k + 2) + m;
            } else {
                m = s + strSlice(m, 0, k - f) + '.' + strSlice(m, k - f);
            }
        } else {
            m = s + m;
        }

        return m;
    };
    defineProperties(NumberPrototype, { toFixed: toFixedShim }, hasToFixedBugs);

    var hasToPrecisionUndefinedBug = (function () {
        try {
            return 1.0.toPrecision(undefined) === '1';
        } catch (e) {
            return true;
        }
    }());
    var originalToPrecision = NumberPrototype.toPrecision;
    defineProperties(NumberPrototype, {
        toPrecision: function toPrecision(precision) {
            return typeof precision === 'undefined' ? originalToPrecision.call(this) : originalToPrecision.call(this, precision);
        }
    }, hasToPrecisionUndefinedBug);

    //
    // String
    // ======
    //

    // ES5 15.5.4.14
    // http://es5.github.com/#x15.5.4.14

    // [bugfix, IE lt 9, firefox 4, Konqueror, Opera, obscure browsers]
    // Many browsers do not split properly with regular expressions or they
    // do not perform the split correctly under obscure conditions.
    // See http://blog.stevenlevithan.com/archives/cross-browser-split
    // I've tested in many browsers and this seems to cover the deviant ones:
    //    'ab'.split(/(?:ab)*/) should be ["", ""], not [""]
    //    '.'.split(/(.?)(.?)/) should be ["", ".", "", ""], not ["", ""]
    //    'tesst'.split(/(s)*/) should be ["t", undefined, "e", "s", "t"], not
    //       [undefined, "t", undefined, "e", ...]
    //    ''.split(/.?/) should be [], not [""]
    //    '.'.split(/()()/) should be ["."], not ["", "", "."]

    if (
        'ab'.split(/(?:ab)*/).length !== 2 ||
        '.'.split(/(.?)(.?)/).length !== 4 ||
        'tesst'.split(/(s)*/)[1] === 't' ||
        'test'.split(/(?:)/, -1).length !== 4 ||
        ''.split(/.?/).length ||
        '.'.split(/()()/).length > 1
    ) {
        (function () {
            var compliantExecNpcg = typeof (/()??/).exec('')[1] === 'undefined'; // NPCG: nonparticipating capturing group
            var maxSafe32BitInt = Math.pow(2, 32) - 1;

            StringPrototype.split = function (separator, limit) {
                var string = String(this);
                if (typeof separator === 'undefined' && limit === 0) {
                    return [];
                }

                // If `separator` is not a regex, use native split
                if (!isRegex(separator)) {
                    return strSplit(this, separator, limit);
                }

                var output = [];
                var flags = (separator.ignoreCase ? 'i' : '') +
                            (separator.multiline ? 'm' : '') +
                            (separator.unicode ? 'u' : '') + // in ES6
                            (separator.sticky ? 'y' : ''), // Firefox 3+ and ES6
                    lastLastIndex = 0,
                    // Make `global` and avoid `lastIndex` issues by working with a copy
                    separator2, match, lastIndex, lastLength;
                var separatorCopy = new RegExp(separator.source, flags + 'g');
                if (!compliantExecNpcg) {
                    // Doesn't need flags gy, but they don't hurt
                    separator2 = new RegExp('^' + separatorCopy.source + '$(?!\\s)', flags);
                }
                /* Values for `limit`, per the spec:
                 * If undefined: 4294967295 // maxSafe32BitInt
                 * If 0, Infinity, or NaN: 0
                 * If positive number: limit = Math.floor(limit); if (limit > 4294967295) limit -= 4294967296;
                 * If negative number: 4294967296 - Math.floor(Math.abs(limit))
                 * If other: Type-convert, then use the above rules
                 */
                var splitLimit = typeof limit === 'undefined' ? maxSafe32BitInt : ES.ToUint32(limit);
                match = separatorCopy.exec(string);
                while (match) {
                    // `separatorCopy.lastIndex` is not reliable cross-browser
                    lastIndex = match.index + match[0].length;
                    if (lastIndex > lastLastIndex) {
                        pushCall(output, strSlice(string, lastLastIndex, match.index));
                        // Fix browsers whose `exec` methods don't consistently return `undefined` for
                        // nonparticipating capturing groups
                        if (!compliantExecNpcg && match.length > 1) {
                            /* eslint-disable no-loop-func */
                            match[0].replace(separator2, function () {
                                for (var i = 1; i < arguments.length - 2; i++) {
                                    if (typeof arguments[i] === 'undefined') {
                                        match[i] = void 0;
                                    }
                                }
                            });
                            /* eslint-enable no-loop-func */
                        }
                        if (match.length > 1 && match.index < string.length) {
                            array_push.apply(output, arraySlice(match, 1));
                        }
                        lastLength = match[0].length;
                        lastLastIndex = lastIndex;
                        if (output.length >= splitLimit) {
                            break;
                        }
                    }
                    if (separatorCopy.lastIndex === match.index) {
                        separatorCopy.lastIndex++; // Avoid an infinite loop
                    }
                    match = separatorCopy.exec(string);
                }
                if (lastLastIndex === string.length) {
                    if (lastLength || !separatorCopy.test('')) {
                        pushCall(output, '');
                    }
                } else {
                    pushCall(output, strSlice(string, lastLastIndex));
                }
                return output.length > splitLimit ? arraySlice(output, 0, splitLimit) : output;
            };
        }());

    // [bugfix, chrome]
    // If separator is undefined, then the result array contains just one String,
    // which is the this value (converted to a String). If limit is not undefined,
    // then the output array is truncated so that it contains no more than limit
    // elements.
    // "0".split(undefined, 0) -> []
    } else if ('0'.split(void 0, 0).length) {
        StringPrototype.split = function split(separator, limit) {
            if (typeof separator === 'undefined' && limit === 0) {
                return [];
            }
            return strSplit(this, separator, limit);
        };
    }

    var str_replace = StringPrototype.replace;
    var replaceReportsGroupsCorrectly = (function () {
        var groups = [];
        'x'.replace(/x(.)?/g, function (match, group) {
            pushCall(groups, group);
        });
        return groups.length === 1 && typeof groups[0] === 'undefined';
    }());

    if (!replaceReportsGroupsCorrectly) {
        StringPrototype.replace = function replace(searchValue, replaceValue) {
            var isFn = isCallable(replaceValue);
            var hasCapturingGroups = isRegex(searchValue) && (/\)[*?]/).test(searchValue.source);
            if (!isFn || !hasCapturingGroups) {
                return str_replace.call(this, searchValue, replaceValue);
            } else {
                var wrappedReplaceValue = function (match) {
                    var length = arguments.length;
                    var originalLastIndex = searchValue.lastIndex;
                    searchValue.lastIndex = 0;
                    var args = searchValue.exec(match) || [];
                    searchValue.lastIndex = originalLastIndex;
                    pushCall(args, arguments[length - 2], arguments[length - 1]);
                    return replaceValue.apply(this, args);
                };
                return str_replace.call(this, searchValue, wrappedReplaceValue);
            }
        };
    }

    // ECMA-262, 3rd B.2.3
    // Not an ECMAScript standard, although ECMAScript 3rd Edition has a
    // non-normative section suggesting uniform semantics and it should be
    // normalized across all browsers
    // [bugfix, IE lt 9] IE < 9 substr() with negative value not working in IE
    var string_substr = StringPrototype.substr;
    var hasNegativeSubstrBug = ''.substr && '0b'.substr(-1) !== 'b';
    defineProperties(StringPrototype, {
        substr: function substr(start, length) {
            var normalizedStart = start;
            if (start < 0) {
                normalizedStart = max(this.length + start, 0);
            }
            return string_substr.call(this, normalizedStart, length);
        }
    }, hasNegativeSubstrBug);

    // ES5 15.5.4.20
    // whitespace from: http://es5.github.io/#x15.5.4.20
    var ws = '\x09\x0A\x0B\x0C\x0D\x20\xA0\u1680\u180E\u2000\u2001\u2002\u2003' +
        '\u2004\u2005\u2006\u2007\u2008\u2009\u200A\u202F\u205F\u3000\u2028' +
        '\u2029\uFEFF';
    var zeroWidth = '\u200b';
    var wsRegexChars = '[' + ws + ']';
    var trimBeginRegexp = new RegExp('^' + wsRegexChars + wsRegexChars + '*');
    var trimEndRegexp = new RegExp(wsRegexChars + wsRegexChars + '*$');
    var hasTrimWhitespaceBug = StringPrototype.trim && (ws.trim() || !zeroWidth.trim());
    defineProperties(StringPrototype, {
        // http://blog.stevenlevithan.com/archives/faster-trim-javascript
        // http://perfectionkills.com/whitespace-deviations/
        trim: function trim() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            return $String(this).replace(trimBeginRegexp, '').replace(trimEndRegexp, '');
        }
    }, hasTrimWhitespaceBug);
    var trim = call.bind(String.prototype.trim);

    var hasLastIndexBug = StringPrototype.lastIndexOf && 'abcあい'.lastIndexOf('あい', 2) !== -1;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var S = $String(this);
            var searchStr = $String(searchString);
            var numPos = arguments.length > 1 ? $Number(arguments[1]) : NaN;
            var pos = isActualNaN(numPos) ? Infinity : ES.ToInteger(numPos);
            var start = min(max(pos, 0), S.length);
            var searchLen = searchStr.length;
            var k = start + searchLen;
            while (k > 0) {
                k = max(0, k - searchLen);
                var index = strIndexOf(strSlice(S, k, start + searchLen), searchStr);
                if (index !== -1) {
                    return k + index;
                }
            }
            return -1;
        }
    }, hasLastIndexBug);

    var originalLastIndexOf = StringPrototype.lastIndexOf;
    defineProperties(StringPrototype, {
        lastIndexOf: function lastIndexOf(searchString) {
            return originalLastIndexOf.apply(this, arguments);
        }
    }, StringPrototype.lastIndexOf.length !== 1);

    // ES-5 15.1.2.2
    /* eslint-disable radix */
    if (parseInt(ws + '08') !== 8 || parseInt(ws + '0x16') !== 22) {
    /* eslint-enable radix */
        /* global parseInt: true */
        parseInt = (function (origParseInt) {
            var hexRegex = /^[\-+]?0[xX]/;
            return function parseInt(str, radix) {
                var string = trim(String(str));
                var defaultedRadix = $Number(radix) || (hexRegex.test(string) ? 16 : 10);
                return origParseInt(string, defaultedRadix);
            };
        }(parseInt));
    }

    // https://es5.github.io/#x15.1.2.3
    if (1 / parseFloat('-0') !== -Infinity) {
        /* global parseFloat: true */
        parseFloat = (function (origParseFloat) {
            return function parseFloat(string) {
                var inputString = trim(String(string));
                var result = origParseFloat(inputString);
                return result === 0 && strSlice(inputString, 0, 1) === '-' ? -0 : result;
            };
        }(parseFloat));
    }

    if (String(new RangeError('test')) !== 'RangeError: test') {
        var errorToStringShim = function toString() {
            if (typeof this === 'undefined' || this === null) {
                throw new TypeError("can't convert " + this + ' to object');
            }
            var name = this.name;
            if (typeof name === 'undefined') {
                name = 'Error';
            } else if (typeof name !== 'string') {
                name = $String(name);
            }
            var msg = this.message;
            if (typeof msg === 'undefined') {
                msg = '';
            } else if (typeof msg !== 'string') {
                msg = $String(msg);
            }
            if (!name) {
                return msg;
            }
            if (!msg) {
                return name;
            }
            return name + ': ' + msg;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        Error.prototype.toString = errorToStringShim;
    }

    if (supportsDescriptors) {
        var ensureNonEnumerable = function (obj, prop) {
            if (isEnum(obj, prop)) {
                var desc = Object.getOwnPropertyDescriptor(obj, prop);
                if (desc.configurable) {
                    desc.enumerable = false;
                    Object.defineProperty(obj, prop, desc);
                }
            }
        };
        ensureNonEnumerable(Error.prototype, 'message');
        if (Error.prototype.message !== '') {
            Error.prototype.message = '';
        }
        ensureNonEnumerable(Error.prototype, 'name');
    }

    if (String(/a/mig) !== '/a/gim') {
        var regexToString = function toString() {
            var str = '/' + this.source + '/';
            if (this.global) {
                str += 'g';
            }
            if (this.ignoreCase) {
                str += 'i';
            }
            if (this.multiline) {
                str += 'm';
            }
            return str;
        };
        // can't use defineProperties here because of toString enumeration issue in IE <= 8
        RegExp.prototype.toString = regexToString;
    }
}));

'use strict';
/*jslint eqeq: true*/

Handlebars.registerHelper('sanitize', function(html) {
    // Strip the script tags from the html, and return it as a Handlebars.SafeString
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('renderTextParam', function(param) {
    var result, type = 'text', idAtt = '';
    var paramType = param.type || param.schema.type || '';
    var isArray = paramType.toLowerCase() === 'array' || param.allowMultiple;
    var defaultValue = isArray && Array.isArray(param.default) ? param.default.join('\n') : param.default;

    var dataVendorExtensions = Object.keys(param).filter(function(property) {
        // filter X-data- properties
        return property.match(/^X-data-/i) !== null;
    }).reduce(function(result, property) {
        // remove X- from property name, so it results in html attributes like data-foo='bar'
        return result += ' ' + property.substring(2, property.length) + '=\'' + param[property] + '\'';
    }, '');

    if (typeof defaultValue === 'undefined') {
        defaultValue = '';
    }

    if(param.format && param.format === 'password') {
        type = 'password';
    }

    if(param.valueId) {
        idAtt = ' id=\'' + param.valueId + '\'';
    }

    if (typeof defaultValue === 'string' || defaultValue instanceof String) {
        defaultValue = defaultValue.replace(/'/g,'&apos;');
    }

    if(isArray) {
        result = '<textarea class=\'body-textarea' + (param.required ? ' required' : '') + '\' name=\'' + param.name + '\'' + idAtt + dataVendorExtensions;
        result += ' placeholder=\'Provide multiple values in new lines' + (param.required ? ' (at least one required).' : '.') + '\'>';
        result += defaultValue + '</textarea>';
    } else {
        var parameterClass = 'parameter';
        if(param.required) {
          parameterClass += ' required';
        }
        result = '<input class=\'' + parameterClass + '\' minlength=\'' + (param.required ? 1 : 0) + '\'';
        result += ' name=\'' + param.name +'\' placeholder=\'' + (param.required ? '(required)' : '') + '\'' + idAtt + dataVendorExtensions;
        result += ' type=\'' + type + '\' value=\'' + defaultValue + '\'/>';
    }
    return new Handlebars.SafeString(result);
});

Handlebars.registerHelper('ifCond', function (v1, operator, v2, options) {

    switch (operator) {
        case '==':
            return (v1 == v2) ? options.fn(this) : options.inverse(this);
        case '===':
            return (v1 === v2) ? options.fn(this) : options.inverse(this);
        case '<':
            return (v1 < v2) ? options.fn(this) : options.inverse(this);
        case '<=':
            return (v1 <= v2) ? options.fn(this) : options.inverse(this);
        case '>':
            return (v1 > v2) ? options.fn(this) : options.inverse(this);
        case '>=':
            return (v1 >= v2) ? options.fn(this) : options.inverse(this);
        case '&&':
            return (v1 && v2) ? options.fn(this) : options.inverse(this);
        case '||':
            return (v1 || v2) ? options.fn(this) : options.inverse(this);
        default:
            return options.inverse(this);
    }
});
this["Handlebars"]["templates"]["main"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression, buffer = "  <div class=\"info_title\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.title : stack1), depth0))
    + "</div>\n  <div class=\"info_description markdown\">";
  stack1 = lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.description : stack1), depth0);
  if (stack1 != null) { buffer += stack1; }
  buffer += "</div>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.externalDocs : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.termsOfServiceUrl : stack1), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), {"name":"if","hash":{},"fn":this.program(6, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.url : stack1), {"name":"if","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, ((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), {"name":"if","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.license : stack1), {"name":"if","hash":{},"fn":this.program(12, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "  <p>"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.externalDocs : depth0)) != null ? stack1.description : stack1), depth0))
    + "</p>\n  <a href=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.externalDocs : depth0)) != null ? stack1.url : stack1), depth0))
    + "\" target=\"_blank\">"
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.externalDocs : depth0)) != null ? stack1.url : stack1), depth0))
    + "</a>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class=\"info_tos\"><a target=\"_blank\" href=\""
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.termsOfServiceUrl : stack1), depth0))
    + "\" data-sw-translate>Terms of service</a></div>";
},"6":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div><div class='info_name' style=\"display: inline\" data-sw-translate>Created by </div> "
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.name : stack1), depth0))
    + "</div>";
},"8":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class='info_url' data-sw-translate>See more at <a href=\""
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.url : stack1), depth0))
    + "\">"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.url : stack1), depth0))
    + "</a></div>";
},"10":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class='info_email'><a target=\"_parent\" href=\"mailto:"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.contact : stack1)) != null ? stack1.email : stack1), depth0))
    + "?subject="
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.title : stack1), depth0))
    + "\" data-sw-translate>Contact the developer</a></div>";
},"12":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "<div class='info_license'><a target=\"_blank\" href='"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.license : stack1)) != null ? stack1.url : stack1), depth0))
    + "'>"
    + escapeExpression(lambda(((stack1 = ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.license : stack1)) != null ? stack1.name : stack1), depth0))
    + "</a></div>";
},"14":function(depth0,helpers,partials,data) {
  var stack1, lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "  , <span style=\"font-variant: small-caps\" data-sw-translate>api version</span>: "
    + escapeExpression(lambda(((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.version : stack1), depth0))
    + "\n    ";
},"16":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <span style=\"float:right\"><a target=\"_blank\" href=\""
    + escapeExpression(((helper = (helper = helpers.validatorUrl || (depth0 != null ? depth0.validatorUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"validatorUrl","hash":{},"data":data}) : helper)))
    + "/debug?url="
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\"><img id=\"validator\" src=\""
    + escapeExpression(((helper = (helper = helpers.validatorUrl || (depth0 != null ? depth0.validatorUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"validatorUrl","hash":{},"data":data}) : helper)))
    + "?url="
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "\"></a>\n    </span>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div class='info' id='api_info'>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.info : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</div>\n<div class='container' id='resources_container'>\n  <div class='authorize-wrapper'></div>\n\n  <ul id='resources'></ul>\n\n  <div class=\"footer\">\n    <h4 style=\"color: #999\">[ <span style=\"font-variant: small-caps\">base url</span>: "
    + escapeExpression(((helper = (helper = helpers.basePath || (depth0 != null ? depth0.basePath : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"basePath","hash":{},"data":data}) : helper)))
    + "\n";
  stack1 = helpers['if'].call(depth0, ((stack1 = (depth0 != null ? depth0.info : depth0)) != null ? stack1.version : stack1), {"name":"if","hash":{},"fn":this.program(14, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "]\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.validatorUrl : depth0), {"name":"if","hash":{},"fn":this.program(16, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </h4>\n    </div>\n</div>\n";
},"useData":true});
this["Handlebars"]["templates"]["oauth2"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "            <li>\n                <input class=\"oauth-scope\" type=\"checkbox\" data-scope=\""
    + escapeExpression(((helper = (helper = helpers.scope || (depth0 != null ? depth0.scope : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"scope","hash":{},"data":data}) : helper)))
    + "\" oauthtype=\""
    + escapeExpression(((helper = (helper = helpers.OAuthSchemeKey || (depth0 != null ? depth0.OAuthSchemeKey : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"OAuthSchemeKey","hash":{},"data":data}) : helper)))
    + "\"/>\n                <label>"
    + escapeExpression(((helper = (helper = helpers.scope || (depth0 != null ? depth0.scope : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"scope","hash":{},"data":data}) : helper)))
    + "</label><br/>\n                <span class=\"api-scope-desc\">"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.OAuthSchemeKey : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "                </span>\n            </li>\n";
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "                        ("
    + escapeExpression(((helper = (helper = helpers.OAuthSchemeKey || (depth0 != null ? depth0.OAuthSchemeKey : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"OAuthSchemeKey","hash":{},"data":data}) : helper)))
    + ")\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<div>\n    <h3 class=\"auth__title\">Select OAuth2.0 Scopes</h3>\n    <p>"
    + escapeExpression(((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper)))
    + "</p>\n    <p>Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.\n        <a href=\"#\">Learn how to use</a>\n    </p>\n    <p><strong> "
    + escapeExpression(((helper = (helper = helpers.appName || (depth0 != null ? depth0.appName : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"appName","hash":{},"data":data}) : helper)))
    + " </strong> API requires the following scopes. Select which ones you want to grant to Swagger UI.</p>\n    <p>Authorization URL: "
    + escapeExpression(((helper = (helper = helpers.authorizationUrl || (depth0 != null ? depth0.authorizationUrl : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"authorizationUrl","hash":{},"data":data}) : helper)))
    + "</p>\n    <p>flow: "
    + escapeExpression(((helper = (helper = helpers.flow || (depth0 != null ? depth0.flow : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"flow","hash":{},"data":data}) : helper)))
    + "</p>\n    <ul class=\"api-popup-scopes\">\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.scopes : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </ul>\n</div>";
},"useData":true});
this["Handlebars"]["templates"]["operation"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return "deprecated";
  },"3":function(depth0,helpers,partials,data) {
  return "            <h4><span data-sw-translate>Warning: Deprecated</span></h4>\n";
  },"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "        <h4><span data-sw-translate>Implementation Notes</span></h4>\n        <div class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>\n";
},"7":function(depth0,helpers,partials,data) {
  return "            <div class='authorize-wrapper authorize-wrapper_operation'></div>\n";
  },"9":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "          <div class=\"response-class\">\n            <h4><span data-sw-translate>Response Class</span> (<span data-sw-translate>Status</span> "
    + escapeExpression(((helper = (helper = helpers.successCode || (depth0 != null ? depth0.successCode : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"successCode","hash":{},"data":data}) : helper)))
    + ")</h4>\n              ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.successDescription : depth0), {"name":"if","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n            <p><span class=\"model-signature\" /></p>\n            <br/>\n            <div class=\"response-content-type\" />\n            </div>\n";
},"10":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "<div class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.successDescription || (depth0 != null ? depth0.successDescription : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"successDescription","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</div>";
},"12":function(depth0,helpers,partials,data) {
  var stack1, buffer = "          <h4 data-sw-translate>Headers</h4>\n          <table class=\"headers\">\n            <thead>\n              <tr>\n                <th style=\"width: 100px; max-width: 100px\" data-sw-translate>Header</th>\n                <th style=\"width: 310px; max-width: 310px\" data-sw-translate>Description</th>\n                <th style=\"width: 200px; max-width: 200px\" data-sw-translate>Type</th>\n                <th style=\"width: 320px; max-width: 320px\" data-sw-translate>Other</th>\n              </tr>\n            </thead>\n            <tbody>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headers : depth0), {"name":"each","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "            </tbody>\n          </table>\n";
},"13":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "              <tr>\n                <td>"
    + escapeExpression(lambda((data && data.key), depth0))
    + "</td>\n                <td>"
    + escapeExpression(lambda((depth0 != null ? depth0.description : depth0), depth0))
    + "</td>\n                <td>"
    + escapeExpression(lambda((depth0 != null ? depth0.type : depth0), depth0))
    + "</td>\n                <td>"
    + escapeExpression(lambda((depth0 != null ? depth0.other : depth0), depth0))
    + "</td>\n              </tr>\n";
},"15":function(depth0,helpers,partials,data) {
  return "          <h4 data-sw-translate>Parameters</h4>\n          <table class='fullwidth parameters'>\n          <thead>\n            <tr>\n            <th style=\"width: 100px; max-width: 100px\" data-sw-translate>Parameter</th>\n            <th style=\"width: 310px; max-width: 310px\" data-sw-translate>Value</th>\n            <th style=\"width: 200px; max-width: 200px\" data-sw-translate>Description</th>\n            <th style=\"width: 100px; max-width: 100px\" data-sw-translate>Parameter Type</th>\n            <th style=\"width: 220px; max-width: 230px\" data-sw-translate>Data Type</th>\n            </tr>\n          </thead>\n          <tbody class=\"operation-params\">\n\n          </tbody>\n          </table>\n";
  },"17":function(depth0,helpers,partials,data) {
  return "          <div style='margin:0;padding:0;display:inline'></div>\n          <h4 data-sw-translate>Response Messages</h4>\n          <table class='fullwidth response-messages'>\n            <thead>\n            <tr>\n              <th data-sw-translate>HTTP Status Code</th>\n              <th data-sw-translate>Reason</th>\n              <th data-sw-translate>Response Model</th>\n              <th data-sw-translate>Headers</th>\n            </tr>\n            </thead>\n            <tbody class=\"operation-status\">\n            </tbody>\n          </table>\n";
  },"19":function(depth0,helpers,partials,data) {
  return "";
},"21":function(depth0,helpers,partials,data) {
  return "          <div class='sandbox_header'>\n            <input class='submit' type='submit' value='Try it out!' data-sw-translate/>\n            <a href='#' class='response_hider' style='display:none' data-sw-translate>Hide Response</a>\n            <span class='response_throbber' style='display:none'></span>\n          </div>\n";
  },"23":function(depth0,helpers,partials,data) {
  return "          <h4 data-sw-translate>Request Headers</h4>\n          <div class='block request_headers'></div>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "  <ul class='operations' >\n    <li class='"
    + escapeExpression(((helper = (helper = helpers.method || (depth0 != null ? depth0.method : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + " operation' id='"
    + escapeExpression(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"parentId","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "'>\n      <div class='heading'>\n        <h3>\n          <span class='http_method'>\n          <a href='#!/"
    + escapeExpression(((helper = (helper = helpers.encodedParentId || (depth0 != null ? depth0.encodedParentId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"encodedParentId","hash":{},"data":data}) : helper)))
    + "/"
    + escapeExpression(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">"
    + escapeExpression(((helper = (helper = helpers.method || (depth0 != null ? depth0.method : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"method","hash":{},"data":data}) : helper)))
    + "</a>\n          </span>\n          <span class='path'>\n          <a href='#!/"
    + escapeExpression(((helper = (helper = helpers.encodedParentId || (depth0 != null ? depth0.encodedParentId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"encodedParentId","hash":{},"data":data}) : helper)))
    + "/"
    + escapeExpression(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.deprecated : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\">"
    + escapeExpression(((helper = (helper = helpers.path || (depth0 != null ? depth0.path : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"path","hash":{},"data":data}) : helper)))
    + "</a>\n          </span>\n        </h3>\n        <ul class='options'>\n          <li>\n          <a href='#!/"
    + escapeExpression(((helper = (helper = helpers.encodedParentId || (depth0 != null ? depth0.encodedParentId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"encodedParentId","hash":{},"data":data}) : helper)))
    + "/"
    + escapeExpression(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "' class=\"toggleOperation\">";
  stack1 = ((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"summary","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</a>\n          </li>\n        </ul>\n      </div>\n      <div class='content' id='"
    + escapeExpression(((helper = (helper = helpers.parentId || (depth0 != null ? depth0.parentId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"parentId","hash":{},"data":data}) : helper)))
    + "_"
    + escapeExpression(((helper = (helper = helpers.nickname || (depth0 != null ? depth0.nickname : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"nickname","hash":{},"data":data}) : helper)))
    + "_content' style='display:none'>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.deprecated : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.description : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.security : depth0), {"name":"if","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.type : depth0), {"name":"if","hash":{},"fn":this.program(9, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.headers : depth0), {"name":"if","hash":{},"fn":this.program(12, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n        <form accept-charset='UTF-8' class='sandbox'>\n          <div style='margin:0;padding:0;display:inline'></div>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.parameters : depth0), {"name":"if","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.responseMessages : depth0), {"name":"if","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isReadOnly : depth0), {"name":"if","hash":{},"fn":this.program(19, data),"inverse":this.program(21, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "        </form>\n        <div class='response' style='display:none'>\n          <h4 class='curl'>Curl</h4>\n          <div class='block curl'></div>\n          <h4 data-sw-translate>Request URL</h4>\n          <div class='block request_url'></div>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.showRequestHeaders : depth0), {"name":"if","hash":{},"fn":this.program(23, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "          <h4 data-sw-translate>Response Body</h4>\n          <div class='block response_body'></div>\n          <h4 data-sw-translate>Response Code</h4>\n          <div class='block response_code'></div>\n          <h4 data-sw-translate>Response Headers</h4>\n          <div class='block response_headers'></div>\n        </div>\n      </div>\n    </li>\n  </ul>\n";
},"useData":true});
this["Handlebars"]["templates"]["param_list"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return " required";
  },"3":function(depth0,helpers,partials,data) {
  return " multiple=\"multiple\"";
  },"5":function(depth0,helpers,partials,data) {
  return " required ";
  },"7":function(depth0,helpers,partials,data) {
  var stack1, buffer = "      <option ";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.hasDefault : depth0), {"name":"unless","hash":{},"fn":this.program(8, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " value=''></option>\n";
},"8":function(depth0,helpers,partials,data) {
  return "  selected=\"\" ";
  },"10":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "\n      <option ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isDefault : depth0), {"name":"if","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "  value='"
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + "'> "
    + escapeExpression(((helper = (helper = helpers.value || (depth0 != null ? depth0.value : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"value","hash":{},"data":data}) : helper)))
    + " ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isDefault : depth0), {"name":"if","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + " </option>\n\n";
},"11":function(depth0,helpers,partials,data) {
  return " selected=\"\"  ";
  },"13":function(depth0,helpers,partials,data) {
  return " (default) ";
  },"15":function(depth0,helpers,partials,data) {
  return "<strong>";
  },"17":function(depth0,helpers,partials,data) {
  return "</strong>";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<td class='code";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.required : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "'><label for='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</label></td>\n<td>\n  <select ";
  stack1 = ((helpers.isArray || (depth0 && depth0.isArray) || helperMissing).call(depth0, depth0, {"name":"isArray","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  buffer += " class=\"parameter ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.required : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\" name=\""
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "\" id=\""
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "\">\n\n";
  stack1 = helpers.unless.call(depth0, (depth0 != null ? depth0.required : depth0), {"name":"unless","hash":{},"fn":this.program(7, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n";
  stack1 = helpers.each.call(depth0, ((stack1 = (depth0 != null ? depth0.allowableValues : depth0)) != null ? stack1.descriptiveValues : stack1), {"name":"each","hash":{},"fn":this.program(10, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  </select>\n</td>\n<td class=\"markdown\">";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.required : depth0), {"name":"if","hash":{},"fn":this.program(15, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.required : depth0), {"name":"if","hash":{},"fn":this.program(17, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
this["Handlebars"]["templates"]["param_readonly_required"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "        <textarea class='body-textarea' readonly='readonly' placeholder='(required)' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0['default'] : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "            "
    + escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"default","hash":{},"data":data}) : helper)))
    + "\n";
},"6":function(depth0,helpers,partials,data) {
  return "            (empty)\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<td class='code required'><label for='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</label></td>\n<td>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isBody : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
this["Handlebars"]["templates"]["param_readonly"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "        <textarea class='body-textarea' readonly='readonly' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n        <div class=\"parameter-content-type\" />\n";
},"3":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0['default'] : depth0), {"name":"if","hash":{},"fn":this.program(4, data),"inverse":this.program(6, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"4":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "            "
    + escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"default","hash":{},"data":data}) : helper)))
    + "\n";
},"6":function(depth0,helpers,partials,data) {
  return "            (empty)\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<td class='code'><label for='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</label></td>\n<td>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isBody : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(3, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
this["Handlebars"]["templates"]["param_required"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isFile : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<input type=\"file\" name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'/>\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0['default'] : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<div class=\"editor_holder\"></div>\n				<textarea class='body-textarea required' placeholder='(required)' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id=\""
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n        <br />\n        <div class=\"parameter-content-type\" />\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<textarea class='body-textarea required' placeholder='(required)' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'></textarea>\n				<div class=\"editor_holder\"></div>\n				<br />\n				<div class=\"parameter-content-type\" />\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isFile : depth0), {"name":"if","hash":{},"fn":this.program(10, data),"inverse":this.program(12, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"10":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<input class='parameter' class='required' type='file' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'/>\n";
},"12":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.renderTextParam || (depth0 && depth0.renderTextParam) || helperMissing).call(depth0, depth0, {"name":"renderTextParam","hash":{},"fn":this.program(13, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"13":function(depth0,helpers,partials,data) {
  return "";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<td class='code required'><label for='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</label></td>\n<td>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isBody : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(9, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td>\n	<strong><span class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</span></strong>\n</td>\n<td>";
  stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\n<td><span class=\"model-signature\"></span></td>\n";
},"useData":true});
this["Handlebars"]["templates"]["param"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isFile : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "			<input type=\"file\" name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'/>\n			<div class=\"parameter-content-type\" />\n";
},"4":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0['default'] : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.program(7, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"5":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<div class=\"editor_holder\"></div>\n				<textarea class='body-textarea' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers['default'] || (depth0 != null ? depth0['default'] : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"default","hash":{},"data":data}) : helper)))
    + "</textarea>\n        <br />\n        <div class=\"parameter-content-type\" />\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "				<textarea class='body-textarea' name='"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "' id='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'></textarea>\n				<div class=\"editor_holder\"></div>\n				<br />\n				<div class=\"parameter-content-type\" />\n";
},"9":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isFile : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.program(10, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"10":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing, buffer = "";
  stack1 = ((helpers.renderTextParam || (depth0 && depth0.renderTextParam) || helperMissing).call(depth0, depth0, {"name":"renderTextParam","hash":{},"fn":this.program(11, data),"inverse":this.noop,"data":data}));
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"11":function(depth0,helpers,partials,data) {
  return "";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<td class='code'><label for='"
    + escapeExpression(((helper = (helper = helpers.valueId || (depth0 != null ? depth0.valueId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"valueId","hash":{},"data":data}) : helper)))
    + "'>"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</label></td>\n<td>\n\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isBody : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(9, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n</td>\n<td class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.description || (depth0 != null ? depth0.description : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"description","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td>";
  stack1 = ((helper = (helper = helpers.paramType || (depth0 != null ? depth0.paramType : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"paramType","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</td>\n<td>\n	<span class=\"model-signature\"></span>\n</td>\n";
},"useData":true});
this["Handlebars"]["templates"]["parameter_content_type"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.consumes : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "  <option value=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</option>\n";
},"4":function(depth0,helpers,partials,data) {
  return "  <option value=\"application/json\">application/json</option>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<label for=\""
    + escapeExpression(((helper = (helper = helpers.parameterContentTypeId || (depth0 != null ? depth0.parameterContentTypeId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"parameterContentTypeId","hash":{},"data":data}) : helper)))
    + "\" data-sw-translate>Parameter content type:</label>\n<select name=\"parameterContentType\" id=\""
    + escapeExpression(((helper = (helper = helpers.parameterContentTypeId || (depth0 != null ? depth0.parameterContentTypeId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"parameterContentTypeId","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.consumes : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</select>\n";
},"useData":true});
this["Handlebars"]["templates"]["popup"] = Handlebars.template({"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "<div class=\"api-popup-dialog-wrapper\">\n    <div class=\"api-popup-title\">"
    + escapeExpression(((helper = (helper = helpers.title || (depth0 != null ? depth0.title : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"title","hash":{},"data":data}) : helper)))
    + "</div>\n    <div class=\"api-popup-content\"></div>\n    <p class=\"error-msg\"></p>\n    <div class=\"api-popup-actions\">\n        <button class=\"api-popup-cancel api-button gray\" type=\"button\">Cancel</button>\n    </div>\n</div>\n<div class=\"api-popup-dialog-shadow\"></div>";
},"useData":true});
this["Handlebars"]["templates"]["resource"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  return " : ";
  },"3":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    <li>\n      <a href='"
    + escapeExpression(((helper = (helper = helpers.url || (depth0 != null ? depth0.url : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"url","hash":{},"data":data}) : helper)))
    + "' data-sw-translate>Raw</a>\n    </li>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, options, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, blockHelperMissing=helpers.blockHelperMissing, buffer = "<div class='heading'>\n  <h2>\n    <a href='#!/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' class=\"toggleEndpointList\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\">"
    + escapeExpression(((helper = (helper = helpers.name || (depth0 != null ? depth0.name : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"name","hash":{},"data":data}) : helper)))
    + "</a> ";
  stack1 = ((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : helperMissing),(options={"name":"summary","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data}),(typeof helper === functionType ? helper.call(depth0, options) : helper));
  if (!helpers.summary) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if (stack1 != null) { buffer += stack1; }
  stack1 = ((helper = (helper = helpers.summary || (depth0 != null ? depth0.summary : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"summary","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  </h2>\n  <ul class='options'>\n    <li>\n      <a href='#!/"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' id='endpointListTogger_"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "' class=\"toggleEndpointList\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-sw-translate>Show/Hide</a>\n    </li>\n    <li>\n      <a href='#' class=\"collapseResource\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-sw-translate>\n        List Operations\n      </a>\n    </li>\n    <li>\n      <a href='#' class=\"expandResource\" data-id=\""
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "\" data-sw-translate>\n        Expand Operations\n      </a>\n    </li>\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.url : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </ul>\n</div>\n<ul class='endpoints' id='"
    + escapeExpression(((helper = (helper = helpers.id || (depth0 != null ? depth0.id : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"id","hash":{},"data":data}) : helper)))
    + "_endpoint_list' style='display:none'>\n\n</ul>\n";
},"useData":true});
this["Handlebars"]["templates"]["response_content_type"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, buffer = "";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.produces : depth0), {"name":"each","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer;
},"2":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "  <option value=\""
    + escapeExpression(lambda(depth0, depth0))
    + "\">"
    + escapeExpression(lambda(depth0, depth0))
    + "</option>\n";
},"4":function(depth0,helpers,partials,data) {
  return "  <option value=\"application/json\">application/json</option>\n";
  },"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<label data-sw-translate for=\""
    + escapeExpression(((helper = (helper = helpers.responseContentTypeId || (depth0 != null ? depth0.responseContentTypeId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"responseContentTypeId","hash":{},"data":data}) : helper)))
    + "\">Response Content Type</label>\n<select name=\"responseContentType\" id=\""
    + escapeExpression(((helper = (helper = helpers.responseContentTypeId || (depth0 != null ? depth0.responseContentTypeId : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"responseContentTypeId","hash":{},"data":data}) : helper)))
    + "\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.produces : depth0), {"name":"if","hash":{},"fn":this.program(1, data),"inverse":this.program(4, data),"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "</select>\n";
},"useData":true});
this["Handlebars"]["templates"]["signature"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, buffer = "\n<div>\n<ul class=\"signature-nav\">\n  <li><a class=\"description-link\" href=\"#\" data-sw-translate>Model</a></li>\n  <li><a class=\"snippet-link\" href=\"#\" data-sw-translate>Example Value</a></li>\n</ul>\n<div>\n\n<div class=\"signature-container\">\n  <div class=\"description\">\n    ";
  stack1 = ((helper = (helper = helpers.signature || (depth0 != null ? depth0.signature : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"signature","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "\n  </div>\n\n  <div class=\"snippet\">\n";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.sampleJSON : depth0), {"name":"if","hash":{},"fn":this.program(2, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.sampleXML : depth0), {"name":"if","hash":{},"fn":this.program(5, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "  </div>\n</div>\n";
},"2":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "      <div class=\"snippet_json\">\n        <pre><code>"
    + escapeExpression(((helper = (helper = helpers.sampleJSON || (depth0 != null ? depth0.sampleJSON : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sampleJSON","hash":{},"data":data}) : helper)))
    + "</code></pre>\n        ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isParam : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n      </div>\n";
},"3":function(depth0,helpers,partials,data) {
  return "<small class=\"notice\" data-sw-translate></small>";
  },"5":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "    <div class=\"snippet_xml\">\n      <pre><code>"
    + escapeExpression(((helper = (helper = helpers.sampleXML || (depth0 != null ? depth0.sampleXML : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"sampleXML","hash":{},"data":data}) : helper)))
    + "</code></pre>\n      ";
  stack1 = helpers['if'].call(depth0, (depth0 != null ? depth0.isParam : depth0), {"name":"if","hash":{},"fn":this.program(3, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "\n    </div>\n";
},"7":function(depth0,helpers,partials,data) {
  var helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression;
  return "    "
    + escapeExpression(((helper = (helper = helpers.signature || (depth0 != null ? depth0.signature : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"signature","hash":{},"data":data}) : helper)))
    + "\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helperMissing=helpers.helperMissing;
  stack1 = ((helpers.ifCond || (depth0 && depth0.ifCond) || helperMissing).call(depth0, (depth0 != null ? depth0.sampleJSON : depth0), "||", (depth0 != null ? depth0.sampleXML : depth0), {"name":"ifCond","hash":{},"fn":this.program(1, data),"inverse":this.program(7, data),"data":data}));
  if (stack1 != null) { return stack1; }
  else { return ''; }
  },"useData":true});
this["Handlebars"]["templates"]["status_code"] = Handlebars.template({"1":function(depth0,helpers,partials,data) {
  var lambda=this.lambda, escapeExpression=this.escapeExpression;
  return "      <tr>\n        <td>"
    + escapeExpression(lambda((data && data.key), depth0))
    + "</td>\n        <td>"
    + escapeExpression(lambda((depth0 != null ? depth0.description : depth0), depth0))
    + "</td>\n        <td>"
    + escapeExpression(lambda((depth0 != null ? depth0.type : depth0), depth0))
    + "</td>\n      </tr>\n";
},"compiler":[6,">= 2.0.0-beta.1"],"main":function(depth0,helpers,partials,data) {
  var stack1, helper, functionType="function", helperMissing=helpers.helperMissing, escapeExpression=this.escapeExpression, buffer = "<td width='15%' class='code'>"
    + escapeExpression(((helper = (helper = helpers.code || (depth0 != null ? depth0.code : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"code","hash":{},"data":data}) : helper)))
    + "</td>\n<td class=\"markdown\">";
  stack1 = ((helper = (helper = helpers.message || (depth0 != null ? depth0.message : depth0)) != null ? helper : helperMissing),(typeof helper === functionType ? helper.call(depth0, {"name":"message","hash":{},"data":data}) : helper));
  if (stack1 != null) { buffer += stack1; }
  buffer += "</td>\n<td width='50%'><span class=\"model-signature\" /></td>\n<td class=\"headers\">\n  <table>\n    <tbody>\n";
  stack1 = helpers.each.call(depth0, (depth0 != null ? depth0.headers : depth0), {"name":"each","hash":{},"fn":this.program(1, data),"inverse":this.noop,"data":data});
  if (stack1 != null) { buffer += stack1; }
  return buffer + "    </tbody>\n  </table>\n</td>";
},"useData":true});
 /*global JSONEditor*/
'use strict';

window.SwaggerUi = Backbone.Router.extend({

  dom_id: 'swagger_ui',

  // Attributes
  options: null,
  api: null,
  headerView: null,
  mainView: null,

  // SwaggerUi accepts all the same options as SwaggerApi
  initialize: function(options) {
    options = options || {};

    if (options.defaultModelRendering !== 'model') {
      options.defaultModelRendering = 'schema';
    }

    if (!options.highlightSizeThreshold) {
      options.highlightSizeThreshold = 100000;
    }

    // Allow dom_id to be overridden
    if (options.dom_id) {
      this.dom_id = options.dom_id;
      delete options.dom_id;
    }

    if (!options.supportedSubmitMethods){
      options.supportedSubmitMethods = [
        'get',
        'put',
        'post',
        'delete',
        'head',
        'options',
        'patch'
      ];
    }

    if (typeof options.oauth2RedirectUrl === 'string') {
      window.oAuthRedirectUrl = options.redirectUrl;
    }

    // Create an empty div which contains the dom_id
    if (! $('#' + this.dom_id).length){
      $('body').append('<div id="' + this.dom_id + '"></div>') ;
    }

    this.options = options;

    // set marked options
    marked.setOptions({gfm: true});

    // Set the callbacks
    var that = this;
    this.options.success = function() { return that.render(); };
    this.options.progress = function(d) { return that.showMessage(d); };
    this.options.failure = function(d) { return that.onLoadFailure(d); };

    // Create view to handle the header inputs
    this.headerView = new SwaggerUi.Views.HeaderView({el: $('#header')});

    // Event handler for when the baseUrl/apiKey is entered by user
    this.headerView.on('update-swagger-ui', function(data) {
      return that.updateSwaggerUi(data);
    });

    // JSon Editor custom theming
     JSONEditor.defaults.iconlibs.swagger = JSONEditor.AbstractIconLib.extend({
      mapping: {
        collapse: 'collapse',
        expand: 'expand'
        },
      icon_prefix: 'swagger-'
      });

  },

  // Set an option after initializing
  setOption: function(option, value) {
    this.options[option] = value;
  },

  // Get the value of a previously set option
  getOption: function(option) {
    return this.options[option];
  },

  // Event handler for when url/key is received from user
  updateSwaggerUi: function(data){
    this.options.url = data.url;
    this.load();
  },

  // Create an api and render
  load: function(){
    // Initialize the API object
    if (this.mainView) {
      this.mainView.clear();
    }

    if (this.authView) {
      this.authView.remove();
    }
    var url = this.options.url;
    if (url && url.indexOf('http') !== 0) {
      url = this.buildUrl(window.location.href.toString(), url);
    }
    if(this.api) {
      this.options.authorizations = this.api.clientAuthorizations.authz;
    }
    this.options.url = url;
    this.headerView.update(url);

    this.api = new SwaggerClient(this.options);
  },

  // collapse all sections
  collapseAll: function(){
    Docs.collapseEndpointListForResource('');
  },

  // list operations for all sections
  listAll: function(){
    Docs.collapseOperationsForResource('');
  },

  // expand operations for all sections
  expandAll: function(){
    Docs.expandOperationsForResource('');
  },

  // This is bound to success handler for SwaggerApi
  //  so it gets called when SwaggerApi completes loading
  render: function(){
    var authsModel;
    this.showMessage('Finished Loading Resource Information. Rendering Swagger UI...');
    this.mainView = new SwaggerUi.Views.MainView({
      model: this.api,
      el: $('#' + this.dom_id),
      swaggerOptions: this.options,
      router: this
    }).render();
    if (!_.isEmpty(this.api.securityDefinitions)){
      authsModel = _.map(this.api.securityDefinitions, function (auth, name) {
        var result = {};
        result[name] = auth;
        return result;
      });
      this.authView = new SwaggerUi.Views.AuthButtonView({
        data: SwaggerUi.utils.parseSecurityDefinitions(authsModel),
        router: this
      });
      $('#auth_container').append(this.authView.render().el);
    }
    this.showMessage();
    switch (this.options.docExpansion) {
      case 'full':
        this.expandAll(); break;
      case 'list':
        this.listAll(); break;
      default:
        break;
    }
    this.renderGFM();

    if (this.options.onComplete){
      this.options.onComplete(this.api, this);
    }

    setTimeout(Docs.shebang.bind(this), 100);
  },

  buildUrl: function(base, url){
    if (url.indexOf('/') === 0) {
      var parts = base.split('/');
      base = parts[0] + '//' + parts[2];
      return base + url;
    } else {
      var endOfPath = base.length;

      if (base.indexOf('?') > -1){
        endOfPath = Math.min(endOfPath, base.indexOf('?'));
      }

      if (base.indexOf('#') > -1){
        endOfPath = Math.min(endOfPath, base.indexOf('#'));
      }

      base = base.substring(0, endOfPath);

      if (base.indexOf('/', base.length - 1 ) !== -1){
        return base + url;
      }

      return base + '/' + url;
    }
  },

  // Shows message on topbar of the ui
  showMessage: function(data){
    if (data === undefined) {
      data = '';
    }
    var $msgbar = $('#message-bar');
    $msgbar.removeClass('message-fail');
    $msgbar.addClass('message-success');
    $msgbar.text(data);
    if(window.SwaggerTranslator) {
      window.SwaggerTranslator.translate($msgbar);
    }
  },

  // shows message in red
  onLoadFailure: function(data){
    if (data === undefined) {
      data = '';
    }
    $('#message-bar').removeClass('message-success');
    $('#message-bar').addClass('message-fail');

    var val = $('#message-bar').text(data);

    if (this.options.onFailure) {
      this.options.onFailure(data);
    }

    return val;
  },

  // Renders GFM for elements with 'markdown' class
  renderGFM: function(){
    $('.markdown').each(function(){
      $(this).html(marked($(this).html()));
    });

    $('.propDesc', '.model-signature .description').each(function () {
      $(this).html(marked($(this).html())).addClass('markdown');
    });
  }

});

window.SwaggerUi.Views = {};
window.SwaggerUi.Models = {};
window.SwaggerUi.Collections = {};
window.SwaggerUi.partials = {};
window.SwaggerUi.utils = {};

// don't break backward compatibility with previous versions and warn users to upgrade their code
(function(){
  window.authorizations = {
    add: function() {
      warn('Using window.authorizations is deprecated. Please use SwaggerUi.api.clientAuthorizations.add().');

      if (typeof window.swaggerUi === 'undefined') {
        throw new TypeError('window.swaggerUi is not defined');
      }

      if (window.swaggerUi instanceof SwaggerUi) {
        window.swaggerUi.api.clientAuthorizations.add.apply(window.swaggerUi.api.clientAuthorizations, arguments);
      }
    }
  };

  window.ApiKeyAuthorization = function() {
    warn('window.ApiKeyAuthorization is deprecated. Please use SwaggerClient.ApiKeyAuthorization.');
    SwaggerClient.ApiKeyAuthorization.apply(window, arguments);
  };

  window.PasswordAuthorization = function() {
    warn('window.PasswordAuthorization is deprecated. Please use SwaggerClient.PasswordAuthorization.');
    SwaggerClient.PasswordAuthorization.apply(window, arguments);
  };

  function warn(message) {
    if ('console' in window && typeof window.console.warn === 'function') {
      console.warn(message);
    }
  }
})();


// UMD
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define(['b'], function (b) {
            return (root.SwaggerUi = factory(b));
        });
    } else if (typeof exports === 'object') {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory(require('b'));
    } else {
        // Browser globals
        root.SwaggerUi = factory(root.b);
    }
}(this, function () {
    return SwaggerUi;
}));

'use strict';

window.SwaggerUi.utils = {
    parseSecurityDefinitions: function (security) {
        var auths = Object.assign({}, window.swaggerUi.api.authSchemes || window.swaggerUi.api.securityDefinitions);
        var oauth2Arr = [];
        var authsArr = [];
        var scopes = [];
        var utils = window.SwaggerUi.utils;

        if (!Array.isArray(security)) { return null; }

        security.forEach(function (item) {
            var singleSecurity = {};
            var singleOauth2Security = {};

            for (var key in item) {
                if (Array.isArray(item[key])) {
                    if (!auths[key]) { continue; }
                    auths[key] = auths[key] || {};
                    if (auths[key].type === 'oauth2') {
                        singleOauth2Security[key] = Object.assign({}, auths[key]);
                        singleOauth2Security[key].scopes = Object.assign({}, auths[key].scopes);
                        for (var i in singleOauth2Security[key].scopes) {
                            if (item[key].indexOf(i) < 0) {
                                delete singleOauth2Security[key].scopes[i];
                            }
                        }
                        singleOauth2Security[key].scopes = utils.parseOauth2Scopes(singleOauth2Security[key].scopes);
                        scopes = _.merge(scopes, singleOauth2Security[key].scopes);
                    } else {
                        singleSecurity[key] = Object.assign({}, auths[key]);
                    }
                } else {
                    if (item[key].type === 'oauth2') {
                        singleOauth2Security[key] = Object.assign({}, item[key]);
                        singleOauth2Security[key].scopes = utils.parseOauth2Scopes(singleOauth2Security[key].scopes);
                        scopes = _.merge(scopes, singleOauth2Security[key].scopes);
                    } else {
                        singleSecurity[key] = item[key];
                    }
                }
            }

            if (!_.isEmpty(singleSecurity)) {
                authsArr.push(singleSecurity);
            }

            if (!_.isEmpty(singleOauth2Security)){
                oauth2Arr.push(singleOauth2Security);
            }
        });

        return {
            auths : authsArr,
            oauth2: oauth2Arr,
            scopes: scopes
        };
    },

    parseOauth2Scopes: function (data) {
        var scopes = Object.assign({}, data);
        var result = [];
        var key;

        for (key in scopes) {
            result.push({scope: key, description: scopes[key]});
        }

        return result;
    }
};
'use strict';

SwaggerUi.Models.ApiKeyAuthModel = Backbone.Model.extend({
    defaults: {
        'in': '',
        name: '',
        title: '',
        value: ''
    },

    initialize: function () {
        this.on('change', this.validate);
    },

    validate: function () {
        var valid = !!this.get('value');

        this.set('valid', valid);

        return valid;
    }
});
'use strict';

SwaggerUi.Views.ApiKeyAuthView = Backbone.View.extend({ // TODO: append this to global SwaggerUi

    events: {
        'change .input_apiKey_entry': 'apiKeyChange'
    },

    selectors: {
        apikeyInput: '.input_apiKey_entry'
    },

    template: Handlebars.templates.apikey_auth,

    initialize: function(opts) {
        this.options = opts || {};
        this.router = this.options.router;
    },

    render: function (){
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    apiKeyChange: function (e) {
        var val = $(e.target).val();
        if (val) {
            this.$(this.selectors.apikeyInput).removeClass('error');
        }

        this.model.set('value', val);
    },

    isValid: function () {
        return this.model.validate();
    },

    highlightInvalid: function () {
        if (!this.isValid()) {
            this.$(this.selectors.apikeyInput).addClass('error');
        }
    }

});
'use strict';

SwaggerUi.Views.AuthButtonView = Backbone.View.extend({
    events: {
        'click .authorize__btn': 'authorizeBtnClick'
    },

    tpls: {
        popup: Handlebars.templates.popup,
        authBtn: Handlebars.templates.auth_button,
        authBtnOperation: Handlebars.templates.auth_button_operation
    },

    initialize: function(opts) {
        this.options = opts || {};
        this.options.data = this.options.data || {};
        this.isOperation = this.options.isOperation;
        this.model = this.model || {};
        this.router = this.options.router;
        this.auths = this.options.data.oauth2.concat(this.options.data.auths);
    },

    render: function () {
        var tplName = this.isOperation ? 'authBtnOperation' : 'authBtn';

        this.$authEl = this.renderAuths(this.auths);
        this.$el.html(this.tpls[tplName](this.model));

        return this;
    },

    authorizeBtnClick: function (e) {
        var authsModel;

        e.preventDefault();

        authsModel = {
            title: 'Available authorizations',
            content: this.$authEl
        };

        // The content of the popup is removed and all events unbound after clicking the 'Cancel' button of the popup.
        // We'll have to re-render the contents before creating a new popup view.
        this.render();

        this.popup = new SwaggerUi.Views.PopupView({model: authsModel});
        this.popup.render();
    },

    renderAuths: function (auths) {
        var $el = $('<div>');
        var isLogout = false;

        auths.forEach(function (auth) {
            var authView = new SwaggerUi.Views.AuthView({data: auth, router: this.router});
            var authEl = authView.render().el;
            $el.append(authEl);
            if (authView.isLogout) {
                isLogout = true;
            }
        }, this);

        this.model.isLogout = isLogout;

        return $el;
    }

});

'use strict';

SwaggerUi.Collections.AuthsCollection = Backbone.Collection.extend({
    constructor: function() {
        var args = Array.prototype.slice.call(arguments);

        args[0] = this.parse(args[0]);

        Backbone.Collection.apply(this, args);
    },

    add: function (model) {
        var args = Array.prototype.slice.call(arguments);

        if (Array.isArray(model)) {
            args[0] = _.map(model, function(val) {
                return this.handleOne(val);
            }, this);
        } else {
            args[0] = this.handleOne(model);
        }

        Backbone.Collection.prototype.add.apply(this, args);
    },

    handleOne: function (model) {
        var result = model;

        if (! (model instanceof Backbone.Model) ) {
            switch (model.type) {
                case 'oauth2':
                    result = new SwaggerUi.Models.Oauth2Model(model);
                    break;
                case 'basic':
                    result = new SwaggerUi.Models.BasicAuthModel(model);
                    break;
                case 'apiKey':
                    result = new SwaggerUi.Models.ApiKeyAuthModel(model);
                    break;
                default:
                    result = new Backbone.Model(model);
            }
        }

        return result;
    },

    isValid: function () {
        var valid = true;

        this.models.forEach(function(model) {
            if (!model.validate()) {
                valid = false;
            }
        });

        return valid;
    },

    isAuthorized: function () {
        return this.length === this.where({ isLogout: true }).length;
    },

    isPartiallyAuthorized: function () {
        return this.where({ isLogout: true }).length > 0;
    },

    parse: function (data) {
        var authz = Object.assign({}, window.swaggerUi.api.clientAuthorizations.authz);

        return _.map(data, function (auth, name) {
            var isBasic = authz[name] && auth.type === 'basic' && authz[name].username && authz[name].password;

            _.extend(auth, {
                title: name
            });

            if (authz[name] || isBasic) {
                _.extend(auth, {
                    isLogout: true,
                    value: isBasic ? undefined : authz[name].value,
                    username: isBasic ? authz[name].username : undefined,
                    password: isBasic ? authz[name].password : undefined,
                    valid: true
                });
            }

            return auth;
        });
    }
});
'use strict';

SwaggerUi.Views.AuthsCollectionView = Backbone.View.extend({

    initialize: function(opts) {
        this.options = opts || {};
        this.options.data = this.options.data || {};
        this.router = this.options.router;

        this.collection = new SwaggerUi.Collections.AuthsCollection(opts.data);

        this.$innerEl = $('<div>');
        this.authViews = [];
    },

    render: function () {
        this.collection.each(function (auth) {
            this.renderOneAuth(auth);
        }, this);

        this.$el.html(this.$innerEl.html() ? this.$innerEl : '');

        return this;
    },

    renderOneAuth: function (authModel) {
        var authViewEl, authView, authViewName;
        var type = authModel.get('type');

        if (type === 'apiKey') {
            authViewName = 'ApiKeyAuthView';
        } else if (type === 'basic' && this.$innerEl.find('.basic_auth_container').length === 0) {
            authViewName = 'BasicAuthView';
        } else if (type === 'oauth2') {
            authViewName = 'Oauth2View';
        }

        if (authViewName) {
            authView = new SwaggerUi.Views[authViewName]({model: authModel, router: this.router});
            authViewEl = authView.render().el;
            this.authViews.push(authView);
        }

        this.$innerEl.append(authViewEl);
    },

    highlightInvalid: function () {
        this.authViews.forEach(function (view) {
            view.highlightInvalid();
        }, this);
    }

});

'use strict';

/* global redirect_uri:true */
/* global clientId */
/* global scopeSeparator */
/* global additionalQueryStringParams */
/* global clientSecret */
/* global onOAuthComplete */
/* global realm */
/*jshint unused:false*/

SwaggerUi.Views.AuthView = Backbone.View.extend({
    events: {
        'click .auth_submit__button': 'authorizeClick',
        'click .auth_logout__button': 'logoutClick'
    },

    tpls: {
        main: Handlebars.templates.auth_view
    },

    selectors: {
        innerEl: '.auth_inner',
        authBtn: '.auth_submit__button'
    },

    initialize: function(opts) {
        this.options = opts || {};
        opts.data = opts.data || {};
        this.router = this.options.router;

        this.authsCollectionView = new SwaggerUi.Views.AuthsCollectionView({data: opts.data});

        this.$el.html(this.tpls.main({
            isLogout: this.authsCollectionView.collection.isAuthorized(),
            isAuthorized: this.authsCollectionView.collection.isPartiallyAuthorized()
        }));
        this.$innerEl = this.$(this.selectors.innerEl);
        this.isLogout = this.authsCollectionView.collection.isPartiallyAuthorized();
    },

    render: function () {
        this.$innerEl.html(this.authsCollectionView.render().el);

        return this;
    },

    authorizeClick: function (e) {
        e.preventDefault();
        e.stopPropagation();

        if (this.authsCollectionView.collection.isValid()) {
            this.authorize();
        } else {
            this.authsCollectionView.highlightInvalid();
        }
    },

    authorize: function () {
        this.authsCollectionView.collection.forEach(function (auth) {
            var keyAuth, basicAuth;
            var type = auth.get('type');

            if (type === 'apiKey') {
                keyAuth = new SwaggerClient.ApiKeyAuthorization(
                    auth.get('name'),
                    auth.get('value'),
                    auth.get('in')
                );

                this.router.api.clientAuthorizations.add(auth.get('title'), keyAuth);
            } else if (type === 'basic') {
                basicAuth = new SwaggerClient.PasswordAuthorization(auth.get('username'), auth.get('password'));
                this.router.api.clientAuthorizations.add(auth.get('title'), basicAuth);
            } else if (type === 'oauth2') {
                this.handleOauth2Login(auth);
            }
        }, this);

        this.router.load();
    },

    logoutClick: function (e) {
        e.preventDefault();

        this.authsCollectionView.collection.forEach(function (auth) {
            window.swaggerUi.api.clientAuthorizations.remove(auth.get('title'));
        });

        this.router.load();
    },

    // taken from lib/swagger-oauth.js
    handleOauth2Login: function (auth) {
        var host = window.location;
        var pathname = location.pathname.substring(0, location.pathname.lastIndexOf('/'));
        var defaultRedirectUrl = host.protocol + '//' + host.host + pathname + '/o2c.html';
        var redirectUrl = window.oAuthRedirectUrl || defaultRedirectUrl;
        var url = null;
        var scopes = _.map(auth.get('scopes'), function (scope) {
            return scope.scope;
        });
        var state, dets, ep;
        window.OAuthSchemeKey = auth.get('title');

        window.enabledScopes = scopes;
        var flow = auth.get('flow');

        if(auth.get('type') === 'oauth2' && flow && (flow === 'implicit' || flow === 'accessCode')) {
            dets = auth.attributes;
            url = dets.authorizationUrl + '?response_type=' + (flow === 'implicit' ? 'token' : 'code');
            window.swaggerUi.tokenName = dets.tokenName || 'access_token';
            window.swaggerUi.tokenUrl = (flow === 'accessCode' ? dets.tokenUrl : null);
            state = window.OAuthSchemeKey;
        }
        else if(auth.get('type') === 'oauth2' && flow && (flow === 'application')) {
            dets = auth.attributes;
            window.swaggerUi.tokenName = dets.tokenName || 'access_token';
            this.clientCredentialsFlow(scopes, dets.tokenUrl, window.OAuthSchemeKey);
            return;
        }
        else if(auth.get('grantTypes')) {
            // 1.2 support
            var o = auth.get('grantTypes');
            for(var t in o) {
                if(o.hasOwnProperty(t) && t === 'implicit') {
                    dets = o[t];
                    ep = dets.loginEndpoint.url;
                    url = dets.loginEndpoint.url + '?response_type=token';
                    window.swaggerUi.tokenName = dets.tokenName;
                }
                else if (o.hasOwnProperty(t) && t === 'accessCode') {
                    dets = o[t];
                    ep = dets.tokenRequestEndpoint.url;
                    url = dets.tokenRequestEndpoint.url + '?response_type=code';
                    window.swaggerUi.tokenName = dets.tokenName;
                }
            }
        }

        redirect_uri = redirectUrl;

        url += '&redirect_uri=' + encodeURIComponent(redirectUrl);
        url += '&realm=' + encodeURIComponent(realm);
        url += '&client_id=' + encodeURIComponent(clientId);
        url += '&scope=' + encodeURIComponent(scopes.join(scopeSeparator));
        url += '&state=' + encodeURIComponent(state);
        for (var key in additionalQueryStringParams) {
            url += '&' + key + '=' + encodeURIComponent(additionalQueryStringParams[key]);
        }

        window.open(url);
    },

    // taken from lib/swagger-oauth.js
    clientCredentialsFlow: function (scopes, tokenUrl, OAuthSchemeKey) {
        var params = {
            'client_id': clientId,
            'client_secret': clientSecret,
            'scope': scopes.join(' '),
            'grant_type': 'client_credentials'
        };
        $.ajax({
            url : tokenUrl,
            type: 'POST',
            data: params,
            success: function (data)
            {
                onOAuthComplete(data, OAuthSchemeKey);
            },
            error: function ()
            {
                onOAuthComplete('');
            }
        });
    }

});

'use strict';

SwaggerUi.Models.BasicAuthModel = Backbone.Model.extend({
    defaults: {
        username: '',
        password: '',
        title: 'basic'
    },

    initialize: function () {
        this.on('change', this.validate);
    },

    validate: function () {
        var valid = !!this.get('password') && !!this.get('username');

        this.set('valid', valid);

        return valid;
    }
});
'use strict';

SwaggerUi.Views.BasicAuthView = Backbone.View.extend({

    initialize: function (opts) {
        this.options = opts || {};
        this.router = this.options.router;
    },

    events: {
        'change .auth_input': 'inputChange'
    },

    selectors: {
        usernameInput: '.basic_auth__username',
        passwordInput: '.basic_auth__password'
    },

    cls: {
        error: 'error'
    },

    template: Handlebars.templates.basic_auth,

    render: function(){
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    },

    inputChange: function (e) {
        var $el = $(e.target);
        var val = $el.val();
        var attr = $el.prop('name');

        if (val) {
            $el.removeClass(this.cls.error);
        }

        this.model.set(attr, val);
    },

    isValid: function () {
        return this.model.validate();
    },

    highlightInvalid: function () {
        if (!this.model.get('username')) {
            this.$(this.selectors.usernameInput).addClass(this.cls.error);
        }
    }
});

'use strict';

SwaggerUi.Views.ContentTypeView = Backbone.View.extend({
  initialize: function() {},

  render: function(){
  	this.model.contentTypeId = 'ct' + Math.random();
    $(this.el).html(Handlebars.templates.content_type(this.model));
    return this;
  }
});
'use strict';

SwaggerUi.Views.HeaderView = Backbone.View.extend({
  events: {
    'click #show-pet-store-icon'    : 'showPetStore',
    'click #explore'                : 'showCustom',
    'keyup #input_baseUrl'          : 'showCustomOnKeyup',
    'keyup #input_apiKey'           : 'showCustomOnKeyup'
  },

  initialize: function(){},

  showPetStore: function(){
    this.trigger('update-swagger-ui', {
      url:'http://petstore.swagger.io/v2/swagger.json'
    });
  },

  showCustomOnKeyup: function(e){
    if (e.keyCode === 13) {
      this.showCustom();
    }
  },

  showCustom: function(e){
    if (e) {
      e.preventDefault();
    }

    this.trigger('update-swagger-ui', {
      url: $('#input_baseUrl').val()
    });
  },

  update: function(url, apiKey, trigger){
    if (trigger === undefined) {
      trigger = false;
    }

    $('#input_baseUrl').val(url);

    if (trigger) {
      this.trigger('update-swagger-ui', {url:url});
    }
  }
});

'use strict';

SwaggerUi.Views.MainView = Backbone.View.extend({
  apisSorter : {
    alpha   : function(a,b){ return a.name.localeCompare(b.name); }
  },
  operationsSorters : {
    alpha   : function(a,b){ return a.path.localeCompare(b.path); },
    method  : function(a,b){ return a.method.localeCompare(b.method); }
  },
  initialize: function(opts){
    var sorterOption, sorterFn, key, value;
    opts = opts || {};

    this.router = opts.router;

    // Sort APIs
    if (opts.swaggerOptions.apisSorter) {
      sorterOption = opts.swaggerOptions.apisSorter;
      if (_.isFunction(sorterOption)) {
        sorterFn = sorterOption;
      } else {
        sorterFn = this.apisSorter[sorterOption];
      }
      if (_.isFunction(sorterFn)) {
        this.model.apisArray.sort(sorterFn);
      }
    }
    // Sort operations of each API
    if (opts.swaggerOptions.operationsSorter) {
      sorterOption = opts.swaggerOptions.operationsSorter;
      if (_.isFunction(sorterOption)) {
        sorterFn = sorterOption;
      } else {
        sorterFn = this.operationsSorters[sorterOption];
      }
      if (_.isFunction(sorterFn)) {
        for (key in this.model.apisArray) {
          this.model.apisArray[key].operationsArray.sort(sorterFn);
        }
      }
    }

    // set up the UI for input
    this.model.auths = [];

    for (key in this.model.securityDefinitions) {
      value = this.model.securityDefinitions[key];

      this.model.auths.push({
        name: key,
        type: value.type,
        value: value
      });
    }

    if ('validatorUrl' in opts.swaggerOptions) {
      // Validator URL specified explicitly
      this.model.validatorUrl = opts.swaggerOptions.validatorUrl;
    } else if (this.model.url.indexOf('localhost') > 0 || this.model.url.indexOf('127.0.0.1') > 0) {
      // Localhost override
      this.model.validatorUrl = null;
    } else {
      // Default validator
      if(window.location.protocol === 'https:') {
        this.model.validatorUrl = 'https://online.swagger.io/validator';
      }
      else {
        this.model.validatorUrl = 'http://online.swagger.io/validator';
      }
    }

    // JSonEditor requires type='object' to be present on defined types, we add it if it's missing
    // is there any valid case were it should not be added ?
    var def;
    for(def in this.model.definitions){
      if (!this.model.definitions[def].type){
        this.model.definitions[def].type = 'object';
      }
    }

  },

  render: function () {
    $(this.el).html(Handlebars.templates.main(this.model));
    this.info = this.$('.info')[0];

    if (this.info) {
      this.info.addEventListener('click', this.onLinkClick, true);
    }

    this.model.securityDefinitions = this.model.securityDefinitions || {};

    // Render each resource

    var resources = {};
    var counter = 0;
    for (var i = 0; i < this.model.apisArray.length; i++) {
      var resource = this.model.apisArray[i];
      var id = resource.name;
      while (typeof resources[id] !== 'undefined') {
        id = id + '_' + counter;
        counter += 1;
      }
      resource.id = id;
      resources[id] = resource;
      this.addResource(resource, this.model.auths);
    }

    $('.propWrap').hover(function onHover(){
      $('.optionsWrapper', $(this)).show();
    }, function offhover(){
      $('.optionsWrapper', $(this)).hide();
    });
    return this;
  },

  addResource: function(resource, auths){
    // Render a resource and add it to resources li
    resource.id = resource.id.replace(/\s/g, '_');

    // Make all definitions available at the root of the resource so that they can
    // be loaded by the JSonEditor
    resource.definitions = this.model.definitions;

    var resourceView = new SwaggerUi.Views.ResourceView({
      model: resource,
      router: this.router,
      tagName: 'li',
      id: 'resource_' + resource.id,
      className: 'resource',
      auths: auths,
      swaggerOptions: this.options.swaggerOptions
    });
    $('#resources', this.el).append(resourceView.render().el);
  },

  clear: function(){
    $(this.el).html('');
  },

  onLinkClick: function (e) {
    var el = e.target;

    if (el.tagName === 'A' && el.href && !el.target) {
        e.preventDefault();
        window.open(el.href, '_blank');
    }
  }
});

'use strict';

SwaggerUi.Models.Oauth2Model = Backbone.Model.extend({
    defaults: {
        scopes: {}
    },

    initialize: function () {
        this.on('change', this.validate);
    },

    setScopes: function (name, val) {
        var auth = _.extend({}, this.attributes);
        var index = _.findIndex(auth.scopes, function(o) {
            return o.scope === name;
        });
        auth.scopes[index].checked = val;

        this.set(auth);
        this.validate();
    },

    validate: function () {
      var valid = false;
      var scp = this.get('scopes');
      var idx =  _.findIndex(scp, function (o) {
         return o.checked === true;
      });

      if(scp.length > 0 && idx >= 0) {
          valid = true;
      }

      if(scp.length === 0) {
          valid = true;
      }

      this.set('valid', valid);

      return valid;
    }
});

'use strict';

SwaggerUi.Views.Oauth2View = Backbone.View.extend({
    events: {
        'change .oauth-scope': 'scopeChange'
    },

    template: Handlebars.templates.oauth2,

    render: function () {
        this.$el.html(this.template(this.model.toJSON()));

        return this;
    },

    scopeChange: function (e) {
        var val = $(e.target).prop('checked');
        var scope = $(e.target).data('scope');

        this.model.setScopes(scope, val);
    }
});
'use strict';

SwaggerUi.Views.OperationView = Backbone.View.extend({
  invocationUrl: null,

  events: {
    'submit .sandbox'         : 'submitOperation',
    'click .submit'           : 'submitOperation',
    'click .response_hider'   : 'hideResponse',
    'click .toggleOperation'  : 'toggleOperationContent',
    'mouseenter .api-ic'      : 'mouseEnter',
    'dblclick .curl'          : 'selectText',
    'change [name=responseContentType]' : 'showSnippet'
  },

  initialize: function(opts) {
    opts = opts || {};
    this.router = opts.router;
    this.auths = opts.auths;
    this.parentId = this.model.parentId;
    this.nickname = this.model.nickname;
    this.model.encodedParentId = encodeURIComponent(this.parentId);

    if (opts.swaggerOptions) {
      this.model.defaultRendering = opts.swaggerOptions.defaultModelRendering;

      if (opts.swaggerOptions.showRequestHeaders) {
        this.model.showRequestHeaders = true;
      }
    }
    return this;
  },

  selectText: function(event) {
    var doc = document,
        text = event.target.firstChild,
        range,
        selection;
    if (doc.body.createTextRange) {
      range = document.body.createTextRange();
      range.moveToElementText(text);
      range.select();
    } else if (window.getSelection) {
      selection = window.getSelection();
      range = document.createRange();
      range.selectNodeContents(text);
      selection.removeAllRanges();
      selection.addRange(range);
    }
  },

  mouseEnter: function(e) {
    var elem = $(this.el).find('.content');
    var x = e.pageX;
    var y = e.pageY;
    var scX = $(window).scrollLeft();
    var scY = $(window).scrollTop();
    var scMaxX = scX + $(window).width();
    var scMaxY = scY + $(window).height();
    var wd = elem.width();
    var hgh = elem.height();

    if (x + wd > scMaxX) {
      x = scMaxX - wd;
    }

    if (x < scX) {
      x = scX;
    }

    if (y + hgh > scMaxY) {
      y = scMaxY - hgh;
    }

    if (y < scY) {
      y = scY;
    }

    var pos = {};
    pos.top = y;
    pos.left = x;
    elem.css(pos);
  },

  // Note: copied from CoffeeScript compiled file
  // TODO: redactor
  render: function() {
    var a, auth, auths, code, contentTypeModel, isMethodSubmissionSupported, k, key, l, len, len1, len2, len3, len4, m, modelAuths, n, o, p, param, q, ref, ref1, ref2, ref3, ref4, ref5, responseContentTypeView, responseSignatureView, schema, schemaObj, scopeIndex, signatureModel, statusCode, successResponse, type, v, value, produces, isXML, isJSON;
    isMethodSubmissionSupported = jQuery.inArray(this.model.method, this.model.supportedSubmitMethods()) >= 0;
    if (!isMethodSubmissionSupported) {
      this.model.isReadOnly = true;
    }
    this.model.description = this.model.description || this.model.notes;
    this.model.oauth = null;
    modelAuths = this.model.authorizations || this.model.security;
    if (modelAuths) {
      if (Array.isArray(modelAuths)) {
        for (l = 0, len = modelAuths.length; l < len; l++) {
          auths = modelAuths[l];
          for (key in auths) {
            for (a in this.auths) {
              auth = this.auths[a];
              if (key === auth.name) {
                if (auth.type === 'oauth2') {
                  this.model.oauth = {};
                  this.model.oauth.scopes = [];
                  ref1 = auth.value.scopes;
                  for (k in ref1) {
                    v = ref1[k];
                    scopeIndex = auths[key].indexOf(k);
                    if (scopeIndex >= 0) {
                      o = {
                        scope: k,
                        description: v
                      };
                      this.model.oauth.scopes.push(o);
                    }
                  }
                }
              }
            }
          }
        }
      } else {
        for (k in modelAuths) {
          v = modelAuths[k];
          if (k === 'oauth2') {
            if (this.model.oauth === null) {
              this.model.oauth = {};
            }
            if (this.model.oauth.scopes === void 0) {
              this.model.oauth.scopes = [];
            }
            for (m = 0, len1 = v.length; m < len1; m++) {
              o = v[m];
              this.model.oauth.scopes.push(o);
            }
          }
        }
      }
    }
    if (typeof this.model.responses !== 'undefined') {
      this.model.responseMessages = [];
      ref2 = this.model.responses;
      for (code in ref2) {
        value = ref2[code];
        schema = null;
        schemaObj = this.model.responses[code].schema;
        if (schemaObj && schemaObj.$ref) {
          schema = schemaObj.$ref;
          if (schema.indexOf('#/definitions/') !== -1) {
            schema = schema.replace(/^.*#\/definitions\//, '');
          }
        }
        this.model.responseMessages.push({
          code: code,
          message: value.description,
          responseModel: schema,
          headers: value.headers,
          schema: schemaObj
        });
      }
    }
    if (typeof this.model.responseMessages === 'undefined') {
      this.model.responseMessages = [];
    }
    signatureModel = null;
    produces = this.model.produces;
    isXML = this.contains(produces, 'xml');
    isJSON = isXML ? this.contains(produces, 'json') : true;

    if (this.model.successResponse) {
      successResponse = this.model.successResponse;
      for (key in successResponse) {
        value = successResponse[key];
        this.model.successCode = key;
        if (typeof value === 'object' && typeof value.createJSONSample === 'function') {
          this.model.successDescription = value.description;
          this.model.headers = this.parseResponseHeaders(value.headers);
          signatureModel = {
            sampleJSON: isJSON ? JSON.stringify(SwaggerUi.partials.signature.createJSONSample(value), void 0, 2) : false,
            isParam: false,
            sampleXML: isXML ? SwaggerUi.partials.signature.createXMLSample(value.name, value.definition, value.models) : false,
            signature: SwaggerUi.partials.signature.getModelSignature(value.name, value.definition, value.models, value.modelPropertyMacro)
          };
        } else {
          signatureModel = {
            signature: SwaggerUi.partials.signature.getPrimitiveSignature(value)
          };
        }
      }
    } else if (this.model.responseClassSignature && this.model.responseClassSignature !== 'string') {
      signatureModel = {
        sampleJSON: this.model.responseSampleJSON,
        isParam: false,
        signature: this.model.responseClassSignature
      };
    }
    $(this.el).html(Handlebars.templates.operation(this.model));
    if (signatureModel) {
      signatureModel.defaultRendering = this.model.defaultRendering;
      responseSignatureView = new SwaggerUi.Views.SignatureView({
        model: signatureModel,
        router: this.router,
        tagName: 'div'
      });
      $('.model-signature', $(this.el)).append(responseSignatureView.render().el);
    } else {
      this.model.responseClassSignature = 'string';
      $('.model-signature', $(this.el)).html(this.model.type);
    }
    contentTypeModel = {
      isParam: false
    };
    contentTypeModel.consumes = this.model.consumes;
    contentTypeModel.produces = this.model.produces;
    ref3 = this.model.parameters;
    for (n = 0, len2 = ref3.length; n < len2; n++) {
      param = ref3[n];
      type = param.type || param.dataType || '';
      if (typeof type === 'undefined') {
        schema = param.schema;
        if (schema && schema.$ref) {
          ref = schema.$ref;
          if (ref.indexOf('#/definitions/') === 0) {
            type = ref.substring('#/definitions/'.length);
          } else {
            type = ref;
          }
        }
      }
      if (type && type.toLowerCase() === 'file') {
        if (!contentTypeModel.consumes) {
          contentTypeModel.consumes = 'multipart/form-data';
        }
      }
      param.type = type;
    }
    responseContentTypeView = new SwaggerUi.Views.ResponseContentTypeView({
      model: contentTypeModel,
      router: this.router
    });
    $('.response-content-type', $(this.el)).append(responseContentTypeView.render().el);
    ref4 = this.model.parameters;
    for (p = 0, len3 = ref4.length; p < len3; p++) {
      param = ref4[p];
      this.addParameter(param, contentTypeModel.consumes);
    }
    ref5 = this.model.responseMessages;
    for (q = 0, len4 = ref5.length; q < len4; q++) {
      statusCode = ref5[q];
      statusCode.isXML = isXML;
      statusCode.isJSON = isJSON;
      if (!_.isUndefined(statusCode.headers)) {
        statusCode.headers = this.parseHeadersType(statusCode.headers);
      }
      this.addStatusCode(statusCode);
    }

    if (Array.isArray(this.model.security)) {
      var authsModel = SwaggerUi.utils.parseSecurityDefinitions(this.model.security);

      authsModel.isLogout = !_.isEmpty(window.swaggerUi.api.clientAuthorizations.authz);
      this.authView = new SwaggerUi.Views.AuthButtonView({
        data: authsModel,
        router: this.router,
        isOperation: true,
        model: {
          scopes: authsModel.scopes
        }
      });
      this.$('.authorize-wrapper').append(this.authView.render().el);
    }

    this.showSnippet();
    return this;
  },

  parseHeadersType: function (headers) {
    var map = {
      'string': {
        'date-time': 'dateTime',
        'date'     : 'date'
      }
    };

    _.forEach(headers, function (header) {
      var value;
      header = header || {};
      value = map[header.type] && map[header.type][header.format];
      if (!_.isUndefined(value)) {
        header.type = value;
      }
    });

    return headers;
  },

  contains: function (produces, type) {
    return produces.filter(function (val) {
      if (val.indexOf(type) > -1) {
        return true;
      }
    }).length;
  },

  parseResponseHeaders: function (data) {
    var HEADERS_SEPARATOR = '; ';
    var headers = _.clone(data);

    _.forEach(headers, function (header) {
      var other = [];
      _.forEach(header, function (value, key) {
        var properties = ['type', 'description'];
        if (properties.indexOf(key.toLowerCase()) === -1) {
          other.push(key + ': ' + value);
        }
      });

      other.join(HEADERS_SEPARATOR);
      header.other = other;
    });

    return headers;
  },

  addParameter: function(param, consumes) {
    // Render a parameter
    param.consumes = consumes;
    param.defaultRendering = this.model.defaultRendering;

    // Copy this param JSON spec so that it will be available for JsonEditor
    if(param.schema){
      $.extend(true, param.schema, this.model.definitions[param.type]);
      param.schema.definitions = this.model.definitions;
      // This is required for JsonEditor to display the root properly
      if(!param.schema.type){
        param.schema.type = 'object';
      }
      // This is the title that will be used by JsonEditor for the root
      // Since we already display the parameter's name in the Parameter column
      // We set this to space, we can't set it to null or space otherwise JsonEditor
      // will replace it with the text "root" which won't look good on screen
      if(!param.schema.title){
        param.schema.title = ' ';
      }
    }

    var paramView = new SwaggerUi.Views.ParameterView({
      model: param,
      tagName: 'tr',
      readOnly: this.model.isReadOnly,
      swaggerOptions: this.options.swaggerOptions
    });
    $('.operation-params', $(this.el)).append(paramView.render().el);
  },

  addStatusCode: function(statusCode) {
    // Render status codes
    statusCode.defaultRendering = this.model.defaultRendering;
    var statusCodeView = new SwaggerUi.Views.StatusCodeView({
      model: statusCode,
      tagName: 'tr',
      router: this.router
    });
    $('.operation-status', $(this.el)).append(statusCodeView.render().el);
  },

  // Note: copied from CoffeeScript compiled file
  // TODO: redactor
  submitOperation: function(e) {
    var error_free, form, isFileUpload, map, opts;
    if (e !== null) {
      e.preventDefault();
    }
    form = $('.sandbox', $(this.el));
    error_free = true;
    form.find('input.required').each(function() {
      $(this).removeClass('error');
      if (jQuery.trim($(this).val()) === '') {
        $(this).addClass('error');
        $(this).wiggle({
          callback: (function(_this) {
            return function() {
              $(_this).focus();
            };
          })(this)
        });
        error_free = false;
      }
    });
    form.find('textarea.required:visible').each(function() {
      $(this).removeClass('error');
      if (jQuery.trim($(this).val()) === '') {
        $(this).addClass('error');
        $(this).wiggle({
          callback: (function(_this) {
            return function() {
              return $(_this).focus();
            };
          })(this)
        });
        error_free = false;
      }
    });
    form.find('select.required').each(function() {
      $(this).removeClass('error');
      if (this.selectedIndex === -1) {
        $(this).addClass('error');
        $(this).wiggle({
          callback: (function(_this) {
            return function() {
              $(_this).focus();
            };
          })(this)
        });
        error_free = false;
      }
    });
    if (error_free) {
      map = this.getInputMap(form);
      isFileUpload = this.isFileUpload(form);
      opts = {
        parent: this
      };
      if (this.options.swaggerOptions) {
        for(var key in this.options.swaggerOptions) {
          opts[key] = this.options.swaggerOptions[key];
        }
      }

      var pi;
      for(pi = 0; pi < this.model.parameters.length; pi++){
        var p = this.model.parameters[pi];
        if( p.jsonEditor && p.jsonEditor.isEnabled()){
          var json = p.jsonEditor.getValue();
          map[p.name] = JSON.stringify(json);
        }
      }

      opts.responseContentType = $('div select[name=responseContentType]', $(this.el)).val();
      opts.requestContentType = $('div select[name=parameterContentType]', $(this.el)).val();
      $('.response_throbber', $(this.el)).show();
      if (isFileUpload) {
        $('.request_url', $(this.el)).html('<pre></pre>');
        $('.request_url pre', $(this.el)).text(this.invocationUrl);

        opts.useJQuery = true;
        map.parameterContentType = 'multipart/form-data';
        this.map = map;
        return this.model.execute(map, opts, this.showCompleteStatus, this.showErrorStatus, this);
      } else {
        this.map = map;
        return this.model.execute(map, opts, this.showCompleteStatus, this.showErrorStatus, this);
      }
    }
  },

  getInputMap: function (form) {
    var map, ref1, l, len, o, ref2, m, len1, val, ref3, n, len2;
    map = {};
    ref1 = form.find('input');
    for (l = 0, len = ref1.length; l < len; l++) {
      o = ref1[l];
      if ((o.value !== null) && jQuery.trim(o.value).length > 0) {
        map[o.name] = o.value;
      }
      if (o.type === 'file') {
        map[o.name] = o.files[0];
      }
    }
    ref2 = form.find('textarea');
    for (m = 0, len1 = ref2.length; m < len1; m++) {
      o = ref2[m];
      val = this.getTextAreaValue(o);
      if ((val !== null) && jQuery.trim(val).length > 0) {
        map[o.name] = val;
      }
    }
    ref3 = form.find('select');
    for (n = 0, len2 = ref3.length; n < len2; n++) {
      o = ref3[n];
      val = this.getSelectedValue(o);
      if ((val !== null) && jQuery.trim(val).length > 0) {
        map[o.name] = val;
      }
    }
    return map;
  },

  isFileUpload: function (form) {
    var ref1, l, len, o;
    var isFileUpload = false;
    ref1 = form.find('input');
    for (l = 0, len = ref1.length; l < len; l++) {
      o = ref1[l];
      if (o.type === 'file') {
        isFileUpload = true;
      }
    }
    return isFileUpload;
  },

  success: function(response, parent) {
    parent.showCompleteStatus(response);
  },

  // wraps a jquery response as a shred response
  wrap: function(data) {
    var h, headerArray, headers, i, l, len, o;
    headers = {};
    headerArray = data.getAllResponseHeaders().split('\r');
    for (l = 0, len = headerArray.length; l < len; l++) {
      i = headerArray[l];
      h = i.match(/^([^:]*?):(.*)$/);
      if (!h) {
        h = [];
      }
      h.shift();
      if (h[0] !== void 0 && h[1] !== void 0) {
        headers[h[0].trim()] = h[1].trim();
      }
    }
    o = {};
    o.content = {};
    o.content.data = data.responseText;
    o.headers = headers;
    o.request = {};
    o.request.url = this.invocationUrl;
    o.status = data.status;
    return o;
  },

  getSelectedValue: function(select) {
    if (!select.multiple) {
      return select.value;
    } else {
      var options = [];
      for (var l = 0, len = select.options.length; l < len; l++) {
        var opt = select.options[l];
        if (opt.selected) {
          options.push(opt.value);
        }
      }
      if (options.length > 0) {
        return options;
      } else {
        return null;
      }
    }
  },

  // handler for hide response link
  hideResponse: function(e) {
    if (e) { e.preventDefault(); }
    $('.response', $(this.el)).slideUp();
    $('.response_hider', $(this.el)).fadeOut();
  },

  // Show response from server
  showResponse: function(response) {
    var prettyJson = JSON.stringify(response, null, '\t').replace(/\n/g, '<br>');
    $('.response_body', $(this.el)).html(_.escape(prettyJson));
  },

  // Show error from server
  showErrorStatus: function(data, parent) {
    parent.showStatus(data);
  },

  // show the status codes
  showCompleteStatus: function(data, parent){
    parent.showStatus(data);
  },

  // Adapted from http://stackoverflow.com/a/2893259/454004
  // Note: directly ported from CoffeeScript
  // TODO: Cleanup CoffeeScript artifacts
  formatXml: function(xml) {
    var contexp, fn, formatted, indent, l, lastType, len, lines, ln, pad, reg, transitions, wsexp;
    reg = /(>)(<)(\/*)/g;
    wsexp = /[ ]*(.*)[ ]+\n/g;
    contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(/\r\n/g, '\n').replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    pad = 0;
    formatted = '';
    lines = xml.split('\n');
    indent = 0;
    lastType = 'other';
    transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };
    fn = function(ln) {
      var fromTo, j, key, padding, type, types, value;
      types = {
        single: Boolean(ln.match(/<.+\/>/)),
        closing: Boolean(ln.match(/<\/.+>/)),
        opening: Boolean(ln.match(/<[^!?].*>/))
      };
      type = ((function() {
        var results;
        results = [];
        for (key in types) {
          value = types[key];
          if (value) {
            results.push(key);
          }
        }
        return results;
      })())[0];
      type = type === void 0 ? 'other' : type;
      fromTo = lastType + '->' + type;
      lastType = type;
      padding = '';
      indent += transitions[fromTo];
      padding = ((function() {
        var m, ref1, results;
        results = [];
        for (j = m = 0, ref1 = indent; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
          results.push('  ');
        }
        return results;
      })()).join('');
      if (fromTo === 'opening->closing') {
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
      } else {
        formatted += padding + ln + '\n';
      }
    };
    for (l = 0, len = lines.length; l < len; l++) {
      ln = lines[l];
      fn(ln);
    }
    return formatted;
  },

  // puts the response data in UI
  showStatus: function(response) {
    var url, content;
    if (response.content === undefined) {
      content = response.data;
      url = response.url;
    } else {
      content = response.content.data;
      url = response.request.url;
    }
    var headers = response.headers;
    content = jQuery.trim(content);

    // if server is nice, and sends content-type back, we can use it
    var contentType = null;
    if (headers) {
      contentType = headers['Content-Type'] || headers['content-type'];
      if (contentType) {
        contentType = contentType.split(';')[0].trim();
      }
    }
    $('.response_body', $(this.el)).removeClass('json');
    $('.response_body', $(this.el)).removeClass('xml');

    var supportsAudioPlayback = function(contentType){
      var audioElement = document.createElement('audio');
      return !!(audioElement.canPlayType && audioElement.canPlayType(contentType).replace(/no/, ''));
    };

    var pre;
    var code;
    if (!content) {
      code = $('<code />').text('no content');
      pre = $('<pre class="json" />').append(code);

      // JSON
    } else if (contentType === 'application/json' || /\+json$/.test(contentType)) {
      var json = null;
      try {
        json = JSON.stringify(JSON.parse(content), null, '  ');
      } catch (_error) {
        json = 'can\'t parse JSON.  Raw result:\n\n' + content;
      }
      code = $('<code />').text(json);
      pre = $('<pre class="json" />').append(code);

      // XML
    } else if (contentType === 'application/xml' || /\+xml$/.test(contentType)) {
      code = $('<code />').text(this.formatXml(content));
      pre = $('<pre class="xml" />').append(code);

      // HTML
    } else if (contentType === 'text/html') {
      code = $('<code />').html(_.escape(content));
      pre = $('<pre class="xml" />').append(code);

      // Plain Text
    } else if (/text\/plain/.test(contentType)) {
      code = $('<code />').text(content);
      pre = $('<pre class="plain" />').append(code);


      // Image
    } else if (/^image\//.test(contentType)) {
      pre = $('<img>').attr('src', url);

      // Audio
    } else if (/^audio\//.test(contentType) && supportsAudioPlayback(contentType)) {
      pre = $('<audio controls>').append($('<source>').attr('src', url).attr('type', contentType));

      // Download
    } else if (headers['Content-Disposition'] && (/attachment/).test(headers['Content-Disposition']) ||
        headers['content-disposition'] && (/attachment/).test(headers['content-disposition']) ||
        headers['Content-Description'] && (/File Transfer/).test(headers['Content-Description']) ||
        headers['content-description'] && (/File Transfer/).test(headers['content-description'])) {

      if ('Blob' in window) {
        var type = contentType || 'text/html';
        var blob = new Blob([content], {type: type});
        var a = document.createElement('a');
        var href = window.URL.createObjectURL(blob);
        var fileName = response.url.substr(response.url.lastIndexOf('/') + 1);
        var download = [type, fileName, href].join(':');

        // Use filename from response header
        var disposition = headers['content-disposition'] || headers['Content-Disposition'];
        if(typeof disposition !== 'undefined') {
          var responseFilename = /filename=([^;]*);?/.exec(disposition);
          if(responseFilename !== null && responseFilename.length > 1) {
            download = responseFilename[1];
          }
        }

        a.setAttribute('href', href);
        a.setAttribute('download', download);
        a.innerText = 'Download ' + fileName;

        pre = $('<div/>').append(a);
      } else {
        pre = $('<pre class="json" />').append('Download headers detected but your browser does not support downloading binary via XHR (Blob).');
      }

      // Location header based redirect download
    } else if(headers.location || headers.Location) {
      window.location = response.url;

      // Anything else (CORS)
    } else {
      code = $('<code />').text(content);
      pre = $('<pre class="json" />').append(code);
    }
    var response_body = pre;
    $('.request_url', $(this.el)).html('<pre></pre>');
    $('.request_url pre', $(this.el)).text(url);
    $('.response_code', $(this.el)).html('<pre>' + response.status + '</pre>');
    $('.response_body', $(this.el)).html(response_body);
    $('.response_headers', $(this.el)).html('<pre>' + _.escape(JSON.stringify(response.headers, null, '  ')).replace(/\n/g, '<br>') + '</pre>');
    $('.response', $(this.el)).slideDown();
    $('.response_hider', $(this.el)).show();
    $('.response_throbber', $(this.el)).hide();


    // adds curl output
    var curlCommand = this.model.asCurl(this.map, {responseContentType: contentType});
    curlCommand = curlCommand.replace('!', '&#33;');
    $( 'div.curl', $(this.el)).html('<pre>' + _.escape(curlCommand) + '</pre>');

    // only highlight the response if response is less than threshold, default state is highlight response
    var opts = this.options.swaggerOptions;

    if (opts.showRequestHeaders) {
      var form = $('.sandbox', $(this.el)),
          map = this.getInputMap(form),
          requestHeaders = this.model.getHeaderParams(map);
      delete requestHeaders['Content-Type'];
      $('.request_headers', $(this.el)).html('<pre>' + _.escape(JSON.stringify(requestHeaders, null, '  ')).replace(/\n/g, '<br>') + '</pre>');
    }

    var response_body_el = $('.response_body', $(this.el))[0];
    // only highlight the response if response is less than threshold, default state is highlight response
    if (opts.highlightSizeThreshold && typeof response.data !== 'undefined' && response.data.length > opts.highlightSizeThreshold) {
      return response_body_el;
    } else {
      return hljs.highlightBlock(response_body_el);
    }
  },

  toggleOperationContent: function (event) {
    var elem = $('#' + Docs.escapeResourceName(this.parentId + '_' + this.nickname + '_content'));
    if (elem.is(':visible')){
      $.bbq.pushState('#/', 2);
      event.preventDefault();
      Docs.collapseOperation(elem);
    } else {
      Docs.expandOperation(elem);
    }
  },

  getTextAreaValue: function(textArea) {
    var param, parsed, result, i;
    if (textArea.value === null || jQuery.trim(textArea.value).length === 0) {
      return null;
    }
    param = this.getParamByName(textArea.name);
    if (param && param.type && param.type.toLowerCase() === 'array') {
      parsed = textArea.value.split('\n');
      result = [];
      for (i = 0; i < parsed.length; i++) {
        if (parsed[i] !== null && jQuery.trim(parsed[i]).length > 0) {
          result.push(parsed[i]);
        }
      }
      return result.length > 0 ? result : null;
    } else {
      return textArea.value;
    }
  },

  showSnippet: function () {
    var contentTypeEl = this.$('[name=responseContentType]');
    var xmlSnippetEl = this.$('.operation-status .snippet_xml, .response-class .snippet_xml');
    var jsonSnippetEl = this.$('.operation-status .snippet_json, .response-class .snippet_json');
    var contentType;

    if (!contentTypeEl.length) { return; }
    contentType = contentTypeEl.val();

    if (contentType.indexOf('xml') > -1) {
      xmlSnippetEl.show();
      jsonSnippetEl.hide();
    } else {
      jsonSnippetEl.show();
      xmlSnippetEl.hide();
    }
  },

  getParamByName: function(name) {
    var i;
    if (this.model.parameters) {
      for(i = 0; i < this.model.parameters.length; i++) {
        if (this.model.parameters[i].name === name) {
          return this.model.parameters[i];
        }
      }
    }
    return null;
  }

});

'use strict';

SwaggerUi.Views.ParameterContentTypeView = Backbone.View.extend({
  initialize: function  () {},

  render: function(){
    this.model.parameterContentTypeId = 'pct' + Math.random();
    $(this.el).html(Handlebars.templates.parameter_content_type(this.model));
    return this;
  }

});
'use strict';

SwaggerUi.Views.ParameterView = Backbone.View.extend({
  events: {
    'change [name=parameterContentType]' : 'toggleParameterSnippet'
  },

  initialize: function(){
    Handlebars.registerHelper('isArray', function(param, opts) {
      var paramType = param.type && param.type.toLowerCase();
      if (paramType === 'array' || param.allowMultiple) {
        return opts.fn(this);
      } else {
        return opts.inverse(this);
      }
    });
  },

  render: function() {
    var type = this.model.type || this.model.dataType;
    var modelType = this.model.modelSignature.type;
    var modelDefinitions = this.model.modelSignature.definitions;
    var schema = this.model.schema || {};
    var consumes = this.model.consumes || [];
    var sampleJSON, signatureView;


    if (typeof type === 'undefined') {
      if (schema.$ref) {
        var ref = schema.$ref;
        if (ref.indexOf('#/definitions/') === 0) {
          type = ref.substring('#/definitions/'.length);
        } else {
          type = ref;
        }
      }
    }

    this.model.type = type;
    this.model.paramType = this.model.in || this.model.paramType;
    this.model.isBody = this.model.paramType === 'body' || this.model.in === 'body';
    this.model.isFile = type && type.toLowerCase() === 'file';

    // Allow for default === false
    if(typeof this.model.default === 'undefined') {
      this.model.default = this.model.defaultValue;
    }

    this.model.hasDefault = (typeof this.model.default !== 'undefined');
    this.model.valueId = 'm' + this.model.name + Math.random();

    if (this.model.allowableValues) {
      this.model.isList = true;
    }

    var isXML = this.contains(consumes, 'xml');
    var isJSON = isXML ? this.contains(consumes, 'json') : true;
    sampleJSON = SwaggerUi.partials.signature.createParameterJSONSample(modelType, modelDefinitions);

    var template = this.template();
    $(this.el).html(template(this.model));

    var signatureModel = {
      sampleJSON: isJSON ? sampleJSON : false,
      sampleXML: sampleJSON && isXML ? SwaggerUi.partials.signature.createXMLSample('', schema, modelDefinitions, true) : false,
      isParam: true,
      signature: SwaggerUi.partials.signature.getParameterModelSignature(modelType, modelDefinitions),
      defaultRendering: this.model.defaultRendering
    };

    if (sampleJSON) {
      signatureView = new SwaggerUi.Views.SignatureView({model: signatureModel, tagName: 'div'});
      $('.model-signature', $(this.el)).append(signatureView.render().el);
    }
    else {
      $('.model-signature', $(this.el)).html(this.model.signature);
    }

    var isParam = false;

    if( this.options.swaggerOptions.jsonEditor && this.model.isBody && this.model.schema){
      var $self = $(this.el);
      this.model.jsonEditor =
        /* global JSONEditor */
        new JSONEditor($('.editor_holder', $self)[0],
                       {schema: this.model.schema, startval : this.model.default,
                        ajax:true,
                        disable_properties:true,
                        disable_edit_json:true,
                        iconlib: 'swagger' });
      // This is so that the signature can send back the sample to the json editor
      // TODO: SignatureView should expose an event "onSampleClicked" instead
      signatureModel.jsonEditor = this.model.jsonEditor;
      $('.body-textarea', $self).hide();
      $('.editor_holder', $self).show();
      $('.parameter-content-type', $self)
        .change(function(e){
            if(e.target.value === 'application/xml'){
              $('.body-textarea', $self).show();
              $('.editor_holder', $self).hide();
              this.model.jsonEditor.disable();
            }
            else {
              $('.body-textarea', $self).hide();
              $('.editor_holder', $self).show();
              this.model.jsonEditor.enable();
            }
        });
      }


    if (this.model.isBody) {
      isParam = true;
    }

    var contentTypeModel = {
      isParam: isParam
    };

    contentTypeModel.consumes = this.model.consumes;

    if (isParam) {
      var parameterContentTypeView = new SwaggerUi.Views.ParameterContentTypeView({model: contentTypeModel});
      $('.parameter-content-type', $(this.el)).append(parameterContentTypeView.render().el);
      this.toggleParameterSnippet();
    }

    else {
      var responseContentTypeView = new SwaggerUi.Views.ResponseContentTypeView({model: contentTypeModel});
      $('.response-content-type', $(this.el)).append(responseContentTypeView.render().el);
      this.toggleResponseSnippet();
    }

    return this;
  },

  contains: function (consumes, type) {
    return consumes.filter(function (val) {
      if (val.indexOf(type) > -1) {
        return true;
      }
    }).length;
  },

  toggleParameterSnippet: function () {
    var contentType = this.$('[name=parameterContentType]').val();

    this.toggleSnippet(contentType);
  },

  toggleResponseSnippet: function () {
    var contentEl = this.$('[name=responseContentType]');

    if (!contentEl.length) { return; }

    this.toggleSnippet(contentEl.val());
  },

  toggleSnippet: function (type) {
    type = type || '';
    if (type.indexOf('xml') > -1) {
      this.$('.snippet_xml').show();
      this.$('.snippet_json').hide();
    } else {
      this.$('.snippet_json').show();
      this.$('.snippet_xml').hide();
    }
  },

  // Return an appropriate template based on if the parameter is a list, readonly, required
  template: function(){
    if (this.model.isList) {
      return Handlebars.templates.param_list;
    } else {
      if (this.options.readOnly) {
        if (this.model.required) {
          return Handlebars.templates.param_readonly_required;
        } else {
          return Handlebars.templates.param_readonly;
        }
      } else {
        if (this.model.required) {
          return Handlebars.templates.param_required;
        } else {
          return Handlebars.templates.param;
        }
      }
    }
  }
});

'use strict';

/* jshint -W122 */
SwaggerUi.partials.signature = (function () {
  // copy-pasted from swagger-js
  var resolveSchema = function (schema) {
    if (_.isPlainObject(schema.schema)) {
      schema = resolveSchema(schema.schema);
    }

    return schema;
  };

  // copy-pasted from swagger-js
  var simpleRef = function (name) {
    if (typeof name === 'undefined') {
      return null;
    }

    if (name.indexOf('#/definitions/') === 0) {
      return name.substring('#/definitions/'.length);
    } else {
      return name;
    }
  };

  // copy-pasted from swagger-js
  var getInlineModel = function(inlineStr) {
    if(/^Inline Model \d+$/.test(inlineStr) && this.inlineModels) {
      var id = parseInt(inlineStr.substr('Inline Model'.length).trim(),10); //
      var model = this.inlineModels[id];
      return model;
    }
    // I'm returning null here, should I rather throw an error?
    return null;
  };

  // copy-pasted from swagger-js
  var formatXml = function(xml) {
    var contexp, fn, formatted, indent, l, lastType, len, lines, ln, pad, reg, transitions, wsexp;
    reg = /(>)(<)(\/*)/g;
    wsexp = /[ ]*(.*)[ ]+\n/g;
    contexp = /(<.+>)(.+\n)/g;
    xml = xml.replace(reg, '$1\n$2$3').replace(wsexp, '$1\n').replace(contexp, '$1\n$2');
    pad = 0;
    formatted = '';
    lines = xml.split('\n');
    indent = 0;
    lastType = 'other';
    transitions = {
      'single->single': 0,
      'single->closing': -1,
      'single->opening': 0,
      'single->other': 0,
      'closing->single': 0,
      'closing->closing': -1,
      'closing->opening': 0,
      'closing->other': 0,
      'opening->single': 1,
      'opening->closing': 0,
      'opening->opening': 1,
      'opening->other': 1,
      'other->single': 0,
      'other->closing': -1,
      'other->opening': 0,
      'other->other': 0
    };
    fn = function(ln) {
      var fromTo, j, key, padding, type, types, value;
      types = {
        single: Boolean(ln.match(/<.+\/>/)),
        closing: Boolean(ln.match(/<\/.+>/)),
        opening: Boolean(ln.match(/<[^!?].*>/))
      };
      type = ((function() {
        var results;
        results = [];
        for (key in types) {
          value = types[key];
          if (value) {
            results.push(key);
          }
        }
        return results;
      })())[0];
      type = type === void 0 ? 'other' : type;
      fromTo = lastType + '->' + type;
      lastType = type;
      padding = '';
      indent += transitions[fromTo];
      padding = ((function() {
        var m, ref1, results;
        results = [];
        for (j = m = 0, ref1 = indent; 0 <= ref1 ? m < ref1 : m > ref1; j = 0 <= ref1 ? ++m : --m) {
          results.push('  ');
        }
        return results;
      })()).join('');
      if (fromTo === 'opening->closing') {
        formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
      } else {
        formatted += padding + ln + '\n';
      }
    };
    for (l = 0, len = lines.length; l < len; l++) {
      ln = lines[l];
      fn(ln);
    }
    return formatted;
  };

  // copy-pasted from swagger-js
  var getModelSignature = function (name, schema, models, modelPropertyMacro) {
    var strongOpen = '<span class="strong">';
    var strongClose = '</span>';

    var optionHtml = function (label, value) {
      return '<tr><td class="optionName">' + label + ':</td><td>' + value + '</td></tr>';
    };


    // Allow for ignoring the 'name' argument.... shifting the rest
    if(_.isObject(arguments[0])) {
      name = void 0;
      schema = arguments[0];
      models = arguments[1];
      modelPropertyMacro = arguments[2];
    }

    models = models || {};

    // Resolve the schema (Handle nested schemas)
    schema = resolveSchema(schema);

    // Return for empty object
    if(_.isEmpty(schema)) {
      return strongOpen + 'Empty' + strongClose;
    }

    // Dereference $ref from 'models'
    if(typeof schema.$ref === 'string') {
      name = simpleRef(schema.$ref);
      schema = models[name];
      if(typeof schema === 'undefined')
      {
        return strongOpen + name + ' is not defined!' + strongClose;
      }
    }

    if(typeof name !== 'string') {
      name = schema.title || 'Inline Model';
    }

    // If we are a Model object... adjust accordingly
    if(schema.definition) {
      schema = schema.definition;
    }

    if(typeof modelPropertyMacro !== 'function') {
      modelPropertyMacro = function(prop){
        return (prop || {}).default;
      };
    }

    var references = {};
    var seenModels = [];
    var inlineModels = 0;

    // Generate current HTML
    var html = processModel(schema, name);

    // Generate references HTML
    while (_.keys(references).length > 0) {
      /* jshint ignore:start */
      _.forEach(references, function (schema, name) {
        var seenModel = _.indexOf(seenModels, name) > -1;

        delete references[name];

        if (!seenModel) {
          seenModels.push(name);

          html += '<br />' + processModel(schema, name);
        }
      });
      /* jshint ignore:end */
    }

    return html;


    function addReference(schema, name, skipRef) {
      var modelName = name;
      var model;

      if (schema.$ref) {
        modelName = schema.title || simpleRef(schema.$ref);
        model = models[simpleRef(schema.$ref)];
      } else if (_.isUndefined(name)) {
        modelName = schema.title || 'Inline Model ' + (++inlineModels);
        model = {definition: schema};
      }

      if (skipRef !== true) {
        references[modelName] = _.isUndefined(model) ? {} : model.definition;
      }

      return modelName;
    }

    function primitiveToHTML(schema) {
      var html = '<span class="propType">';
      var type = schema.type || 'object';

      if (schema.$ref) {
        html += addReference(schema, simpleRef(schema.$ref));
      } else if (type === 'object') {
        if (!_.isUndefined(schema.properties)) {
          html += addReference(schema);
        } else {
          html += 'object';
        }
      } else if (type === 'array') {
        html += 'Array[';

        if (_.isArray(schema.items)) {
          html += _.map(schema.items, addReference).join(',');
        } else if (_.isPlainObject(schema.items)) {
          if (_.isUndefined(schema.items.$ref)) {
            if (!_.isUndefined(schema.items.type) && _.indexOf(['array', 'object'], schema.items.type) === -1) {
              html += schema.items.type;
            } else {
              html += addReference(schema.items);
            }
          } else {
            html += addReference(schema.items, simpleRef(schema.items.$ref));
          }
        } else {
          console.log('Array type\'s \'items\' schema is not an array or an object, cannot process');
          html += 'object';
        }

        html += ']';
      } else {
        html += schema.type;
      }

      html += '</span>';

      return html;
    }

    function primitiveToOptionsHTML(schema, html) {
      var options = '';
      var type = schema.type || 'object';
      var isArray = type === 'array';

      if (!_.isUndefined(schema.description)) {
        html += ': ' + '<span class="propDesc">' + schema.description + '</span>';
      }

      if (schema.enum) {
        html += ' = <span class="propVals">[\'' + schema.enum.join('\', \'') + '\']</span>';
      }

      if (isArray) {
        if (_.isPlainObject(schema.items) && !_.isUndefined(schema.items.type)) {
          type = schema.items.type;
        } else {
          type = 'object';
        }
      }

      if (!_.isUndefined(schema.default)) {
        options += optionHtml('Default', schema.default);
      }

      switch (type) {
      case 'string':
        if (schema.minLength) {
          options += optionHtml('Min. Length', schema.minLength);
        }

        if (schema.maxLength) {
          options += optionHtml('Max. Length', schema.maxLength);
        }

        if (schema.pattern) {
          options += optionHtml('Reg. Exp.', schema.pattern);
        }
        break;
      case 'integer':
      case 'number':
        if (schema.minimum) {
          options += optionHtml('Min. Value', schema.minimum);
        }

        if (schema.exclusiveMinimum) {
          options += optionHtml('Exclusive Min.', 'true');
        }

        if (schema.maximum) {
          options += optionHtml('Max. Value', schema.maximum);
        }

        if (schema.exclusiveMaximum) {
          options += optionHtml('Exclusive Max.', 'true');
        }

        if (schema.multipleOf) {
          options += optionHtml('Multiple Of', schema.multipleOf);
        }

        break;
      }

      if (isArray) {
        if (schema.minItems) {
          options += optionHtml('Min. Items', schema.minItems);
        }

        if (schema.maxItems) {
          options += optionHtml('Max. Items', schema.maxItems);
        }

        if (schema.uniqueItems) {
          options += optionHtml('Unique Items', 'true');
        }

        if (schema.collectionFormat) {
          options += optionHtml('Coll. Format', schema.collectionFormat);
        }
      }

      if (_.isUndefined(schema.items)) {
        if (_.isArray(schema.enum)) {
          var enumString;

          if (type === 'number' || type === 'integer') {
            enumString = schema.enum.join(', ');
          } else {
            enumString = '"' + schema.enum.join('", "') + '"';
          }

          options += optionHtml('Enum', enumString);
        }
      }

      if (options.length > 0) {
        html = '<span class="propWrap">' + html + '<table class="optionsWrapper"><tr><th colspan="2">' + type + '</th></tr>' + options + '</table></span>';
      }

      return html;
    }

    function processModel(schema, name) {
      var type = schema.type || 'object';
      var isArray = schema.type === 'array';
      var html = strongOpen + name + ' ' + (isArray ? '[' : '{') + strongClose;
      var contents;

      if (name) {
        seenModels.push(name);
      }

      if (isArray) {
        if (_.isArray(schema.items)) {
          html += '<div>' + _.map(schema.items, function (item) {
            var type = item.type || 'object';

            if (_.isUndefined(item.$ref)) {
              if (_.indexOf(['array', 'object'], type) > -1) {
                if (type === 'object' && _.isUndefined(item.properties)) {
                  return 'object';
                } else {
                  return addReference(item);
                }
              } else {
                return primitiveToOptionsHTML(item, type);
              }
            } else {
              return addReference(item, simpleRef(item.$ref));
            }
          }).join(',</div><div>');
        } else if (_.isPlainObject(schema.items)) {
          if (_.isUndefined(schema.items.$ref)) {
            if (_.indexOf(['array', 'object'], schema.items.type || 'object') > -1) {
              if ((_.isUndefined(schema.items.type) || schema.items.type === 'object') && _.isUndefined(schema.items.properties)) {
                html += '<div>object</div>';
              } else {
                html += '<div>' + addReference(schema.items) + '</div>';
              }
            } else {
              html += '<div>' + primitiveToOptionsHTML(schema.items, schema.items.type) + '</div>';
            }
          } else {
            html += '<div>' + addReference(schema.items, simpleRef(schema.items.$ref)) + '</div>';
          }
        } else {
          console.log('Array type\'s \'items\' property is not an array or an object, cannot process');
          html += '<div>object</div>';
        }
      } else {
        if (schema.$ref) {
          html += '<div>' + addReference(schema, name) + '</div>';
        } else if (type === 'object') {
          if (_.isPlainObject(schema.properties)) {
            contents = _.map(schema.properties, function (property, name) {
              var propertyIsRequired = (_.indexOf(schema.required, name) >= 0);
              var cProperty = _.cloneDeep(property);

              var requiredClass = propertyIsRequired ? 'required' : '';
              var html = '<span class="propName ' + requiredClass + '">' + name + '</span> (';
              var model;

              // Allow macro to set the default value
              cProperty.default = modelPropertyMacro(cProperty);

              // Resolve the schema (Handle nested schemas)
              cProperty = resolveSchema(cProperty);

              // We need to handle property references to primitives (Issue 339)
              if (!_.isUndefined(cProperty.$ref)) {
                model = models[simpleRef(cProperty.$ref)];

                if (!_.isUndefined(model) && _.indexOf([undefined, 'array', 'object'], model.definition.type) === -1) {
                  // Use referenced schema
                  cProperty = resolveSchema(model.definition);
                }
              }

              html += primitiveToHTML(cProperty);

              if(!propertyIsRequired) {
                html += ', <span class="propOptKey">optional</span>';
              }

              if(property.readOnly) {
                  html += ', <span class="propReadOnly">read only</span>';
              }

              html += ')';

              return '<div' + (property.readOnly ? ' class="readOnly"' : '') + '>' + primitiveToOptionsHTML(cProperty, html);
            }).join(',</div>');
          }

          if (contents) {
            html += contents + '</div>';
          }
        } else {
          html += '<div>' + primitiveToOptionsHTML(schema, type) + '</div>';
        }
      }

      return html + strongOpen + (isArray ? ']' : '}') + strongClose;
    }

  };

  // copy-pasted from swagger-js
  var schemaToJSON = function (schema, models, modelsToIgnore, modelPropertyMacro) {
    // Resolve the schema (Handle nested schemas)
    schema = resolveSchema(schema);

    if(typeof modelPropertyMacro !== 'function') {
      modelPropertyMacro = function(prop){
        return (prop || {}).default;
      };
    }

    modelsToIgnore= modelsToIgnore || {};

    var type = schema.type || 'object';
    var format = schema.format;
    var model;
    var output;

    if (!_.isUndefined(schema.example)) {
      output = schema.example;
    } else if (_.isUndefined(schema.items) && _.isArray(schema.enum)) {
      output = schema.enum[0];
    }

    if (_.isUndefined(output)) {
      if (schema.$ref) {
        model = models[simpleRef(schema.$ref)];

        if (!_.isUndefined(model)) {
          if (_.isUndefined(modelsToIgnore[model.name])) {
            modelsToIgnore[model.name] = model;
            output = schemaToJSON(model.definition, models, modelsToIgnore, modelPropertyMacro);
            delete modelsToIgnore[model.name];
          } else {
            if (model.type === 'array') {
              output = [];
            } else {
              output = {};
            }
          }
        }
      } else if (!_.isUndefined(schema.default)) {
        output = schema.default;
      } else if (type === 'string') {
        if (format === 'date-time') {
          output = new Date().toISOString();
        } else if (format === 'date') {
          output = new Date().toISOString().split('T')[0];
        } else {
          output = 'string';
        }
      } else if (type === 'integer') {
        output = 0;
      } else if (type === 'number') {
        output = 0.0;
      } else if (type === 'boolean') {
        output = true;
      } else if (type === 'object') {
        output = {};

        _.forEach(schema.properties, function (property, name) {
          var cProperty = _.cloneDeep(property);

          // Allow macro to set the default value
          cProperty.default = modelPropertyMacro(property);

          output[name] = schemaToJSON(cProperty, models, modelsToIgnore, modelPropertyMacro);
        });
      } else if (type === 'array') {
        output = [];

        if (_.isArray(schema.items)) {
          _.forEach(schema.items, function (item) {
            output.push(schemaToJSON(item, models, modelsToIgnore, modelPropertyMacro));
          });
        } else if (_.isPlainObject(schema.items)) {
          output.push(schemaToJSON(schema.items, models, modelsToIgnore, modelPropertyMacro));
        } else if (_.isUndefined(schema.items)) {
          output.push({});
        } else {
          console.log('Array type\'s \'items\' property is not an array or an object, cannot process');
        }
      }
    }

    return output;
  };

  // copy-pasted from swagger-js
  var createJSONSample = function (value, modelsToIgnore) {
    modelsToIgnore = modelsToIgnore || {};

    modelsToIgnore[value.name] = value;

    // Response support
    if (value.examples && _.isPlainObject(value.examples) && value.examples['application/json']) {
      value.definition.example = value.examples['application/json'];

      if (_.isString(value.definition.example)) {
        value.definition.example = jsyaml.safeLoad(value.definition.example);
      }
    } else if (!value.definition.example) {
      value.definition.example = value.examples;
    }

    return schemaToJSON(value.definition, value.models, modelsToIgnore, value.modelPropertyMacro);
  };

  // copy-pasted from swagger-js
  var getParameterModelSignature = function (type, definitions) {
      var isPrimitive, listType;

      if (type instanceof Array) {
        listType = true;
        type = type[0];
      }

      // Convert undefined to string of 'undefined'
      if (typeof type === 'undefined') {
        type = 'undefined';
        isPrimitive = true;

      } else if (definitions[type]){
        // a model def exists?
        type = definitions[type]; /* Model */
        isPrimitive = false;

      } else if (getInlineModel(type)) {
        type = getInlineModel(type); /* Model */
        isPrimitive = false;

      } else {
        // We default to primitive
        isPrimitive = true;
      }

      if (isPrimitive) {
        if (listType) {
          return 'Array[' + type + ']';
        } else {
          return type.toString();
        }
      } else {
        if (listType) {
          return 'Array[' + getModelSignature(type.name, type.definition, type.models, type.modelPropertyMacro) + ']';
        } else {
          return getModelSignature(type.name, type.definition, type.models, type.modelPropertyMacro);
        }
      }
  };

  // copy-pasted from swagger-js
  var createParameterJSONSample = function (type, models) {
    var listType, sampleJson, innerType;
    models = models || {};

    listType = (type instanceof Array);
    innerType = listType ? type[0] : type;

    if(models[innerType]) {
      sampleJson = createJSONSample(models[innerType]);
    } else if (getInlineModel(innerType)){
      sampleJson = createJSONSample(getInlineModel(innerType)); // may return null, if type isn't correct
    }


    if (sampleJson) {
      sampleJson = listType ? [sampleJson] : sampleJson;

      if (typeof sampleJson === 'string') {
        return sampleJson;
      } else if (_.isObject(sampleJson)) {
        var t = sampleJson;

        if (sampleJson instanceof Array && sampleJson.length > 0) {
          t = sampleJson[0];
        }

        if (t.nodeName && typeof t === 'Node') {
          var xmlString = new XMLSerializer().serializeToString(t);

          return formatXml(xmlString);
        } else {
          return JSON.stringify(sampleJson, null, 2);
        }
      } else {
        return sampleJson;
      }
    }
  };

  var wrapTag = function (name, value, attrs) {
    var str, attributes;

    attrs = attrs || [];

    attributes = attrs.map(function (attr) {
      return ' ' + attr.name + '="' + attr.value + '"';
    }).join('');

    if (!name) {
      return getErrorMessage('Node name is not provided');
    }

    str = [
      '<', name,
      attributes,
      '>',
      value,
      '</', name, '>'
    ];

    return str.join('');
  };

  var getName = function (name, xml) {
    var result = name || '';

    xml = xml || {};

    if (xml.name) {
      result = xml.name;
    }

    if (xml.prefix) {
      result = xml.prefix + ':' + result;
    }

    return result;
  };

  var getNamespace = function (xml) {
    var namespace = '';
    var name = 'xmlns';

    xml = xml || {};

    if (xml.namespace) {
      namespace = xml.namespace;
    } else {
      return namespace;
    }

    if (xml.prefix) {
      name += ':' + xml.prefix;
    }

    return {
      name: name,
      value: namespace
    };
  };

  var createArrayXML = function (descriptor) {
    var name = descriptor.name;
    var config = descriptor.config;
    var definition = descriptor.definition;
    var models = descriptor.models;
    var value;
    var items = definition.items;
    var xml = definition.xml || {};
    var namespace = getNamespace(xml);
    var attributes = [];

    if (!items) { return getErrorMessage(); }

    value = createSchemaXML(name, items, models, config);

    if (namespace) {
      attributes.push(namespace);
    }

    if (xml.wrapped) {
      value = wrapTag(name, value, attributes);
    }

    return value;
  };

  var getPrimitiveSignature = function (schema) {
    var type, items;

    schema = schema || {};
    items = schema.items || {};
    type = schema.type || '';

    switch (type) {
      case 'object': return 'Object is not a primitive';
      case 'array' : return 'Array[' + (items.format || items.type) + ']';
      default: return schema.format || type;
    }
  };

  var createPrimitiveXML = function (descriptor) {
    var name = descriptor.name;
    var definition = descriptor.definition;
    var primitivesMap = {
      'string': {
        'date': new Date(1).toISOString().split('T')[0],
        'date-time' : new Date(1).toISOString(),
        'default': 'string'
      },
      'integer': {
        'default': 1
      },
      'number': {
        'default': 1.1
      },
      'boolean': {
        'default': true
      }
    };
    var type = definition.type;
    var format = definition.format;
    var xml = definition.xml || {};
    var namespace = getNamespace(xml);
    var attributes = [];
    var value;

    if (_.keys(primitivesMap).indexOf(type) < 0) { return getErrorMessage(); }

    if (_.isArray(definition.enum)){
      value = definition.enum[0];
    } else {
      value = definition.example || primitivesMap[type][format] || primitivesMap[type].default;
    }

    if (xml.attribute) {
      return {name: name, value: value};
    }

    if (namespace) {
      attributes.push(namespace);
    }

    return wrapTag(name, value, attributes);
  };

  function createObjectXML (descriptor) {
    var name = descriptor.name;
    var definition = descriptor.definition;
    var config = descriptor.config;
    var models = descriptor.models;
    var isParam = descriptor.config.isParam;
    var serializedProperties;
    var attrs = [];
    var properties = definition.properties;
    var additionalProperties = definition.additionalProperties;
    var xml = definition.xml;
    var namespace = getNamespace(xml);

    if (namespace) {
      attrs.push(namespace);
    }

    if (!properties && !additionalProperties) { return getErrorMessage(); }

    properties = properties || {};

    serializedProperties = _.map(properties, function (prop, key) {
      var xml, result;

      if (isParam && prop.readOnly) {
        return '';
      }

      xml = prop.xml || {};
      result = createSchemaXML(key, prop, models, config);

      if (xml.attribute) {
        attrs.push(result);
        return '';
      }

      return result;
    }).join('');

    if (additionalProperties) {
      serializedProperties += '<!-- additional elements allowed -->';
    }

    return wrapTag(name, serializedProperties, attrs);
  }

  function getInfiniteLoopMessage (name) {
    return '<!-- Infinite loop $ref:' + name + ' -->';
  }

  function getErrorMessage (details) {
    details = details ? ': ' + details : '';
    return '<!-- invalid XML' + details + ' -->';
  }

  function createSchemaXML (name, definition, models, config) {
    var $ref = _.isObject(definition) ? definition.$ref : null;
    var output, index;
    config = config || {};
    config.modelsToIgnore = config.modelsToIgnore || [];
    var descriptor = _.isString($ref) ? getDescriptorByRef($ref, name, models, config)
        : getDescriptor(name, definition, models, config);

    if (!descriptor) {
      return getErrorMessage();
    }

    switch (descriptor.type) {
      case 'array':
        output = createArrayXML(descriptor); break;
      case 'object':
        output = createObjectXML(descriptor); break;
      case 'loop':
        output = getInfiniteLoopMessage(descriptor.name); break;
      default:
        output = createPrimitiveXML(descriptor);
    }

    if ($ref) {
      index = config.modelsToIgnore.indexOf($ref);
      if (index > -1) {
        config.modelsToIgnore.splice(index, 1);
      }
    }

    return output;
  }

  function Descriptor (name, type, definition, models, config) {
    if (arguments.length < 4) {
      throw new Error();
    }

    this.config = config || {};
    this.config.modelsToIgnore = this.config.modelsToIgnore || [];
    this.name = getName(name, definition.xml);
    this.definition = definition;
    this.models = models;
    this.type = type;
  }

  function getDescriptorByRef($ref, name, models, config) {
    var modelType = simpleRef($ref);
    var model = models[modelType] || {};
    var type = model.definition && model.definition.type ? model.definition.type : 'object';
    name = name || model.name;

    if (config.modelsToIgnore.indexOf($ref) > -1) {
      type = 'loop';
      name = modelType;
    } else {
      config.modelsToIgnore.push($ref);
    }

    if (!model.definition) {
      return null;
    }

    return new Descriptor(name, type, model.definition, models, config);
  }

  function getDescriptor (name, definition, models, config){
    var type = definition.type || 'object';

    if (!definition) {
      return null;
    }

    return new Descriptor(name, type, definition, models, config);
  }

  function createXMLSample (name, definition, models, isParam) {
    var prolog = '<?xml version="1.0"?>';

    return formatXml(prolog + createSchemaXML(name, definition, models, { isParam: isParam } ));
  }

  return {
      getModelSignature: getModelSignature,
      createJSONSample: createJSONSample,
      getParameterModelSignature: getParameterModelSignature,
      createParameterJSONSample: createParameterJSONSample,
      createSchemaXML: createSchemaXML,
      createXMLSample: createXMLSample,
      getPrimitiveSignature: getPrimitiveSignature
  };

})();

'use strict';

SwaggerUi.Views.PopupView = Backbone.View.extend({
    events: {
        'click .api-popup-cancel': 'cancelClick'
    },

    template: Handlebars.templates.popup,
    className: 'api-popup-dialog',

    selectors: {
        content: '.api-popup-content',
        main   : '#swagger-ui-container'
    },

    initialize: function(){
        this.$el.html(this.template(this.model));
    },

    render: function () {
        this.$(this.selectors.content).append(this.model.content);
        $(this.selectors.main).first().append(this.el);
        this.showPopup();

        return this;
    },

    showPopup: function () {
        this.$el.show();
    },

    cancelClick: function () {
        this.remove();
    }

});

'use strict';

SwaggerUi.Views.ResourceView = Backbone.View.extend({
  initialize: function(opts) {
    opts = opts || {};
    this.router = opts.router;
    this.auths = opts.auths;
    if ('' === this.model.description) {
      this.model.description = null;
    }
    if (this.model.description) {
      this.model.summary = this.model.description;
    }
  },

  render: function(){
    var methods = {};


    $(this.el).html(Handlebars.templates.resource(this.model));

    // Render each operation
    for (var i = 0; i < this.model.operationsArray.length; i++) {
      var operation = this.model.operationsArray[i];
      var counter = 0;
      var id = operation.nickname;

      while (typeof methods[id] !== 'undefined') {
        id = id + '_' + counter;
        counter += 1;
      }

      methods[id] = operation;

      operation.nickname = id;
      operation.parentId = this.model.id;
      operation.definitions = this.model.definitions; // make Json Schema available for JSonEditor in this operation
      this.addOperation(operation);
    }

    $('.toggleEndpointList', this.el).click(this.callDocs.bind(this, 'toggleEndpointListForResource'));
    $('.collapseResource', this.el).click(this.callDocs.bind(this, 'collapseOperationsForResource'));
    $('.expandResource', this.el).click(this.callDocs.bind(this, 'expandOperationsForResource'));

    return this;
  },

  addOperation: function(operation) {

    operation.number = this.number;

    // Render an operation and add it to operations li
    var operationView = new SwaggerUi.Views.OperationView({
      model: operation,
      router: this.router,
      tagName: 'li',
      className: 'endpoint',
      swaggerOptions: this.options.swaggerOptions,
      auths: this.auths
    });

    $('.endpoints', $(this.el)).append(operationView.render().el);

    this.number++;

  },
  // Generic Event handler (`Docs` is global)


  callDocs: function(fnName, e) {
    e.preventDefault();
    Docs[fnName](e.currentTarget.getAttribute('data-id'));
  }
});
'use strict';

SwaggerUi.Views.ResponseContentTypeView = Backbone.View.extend({
  initialize: function(){},

  render: function(){
    this.model.responseContentTypeId = 'rct' + Math.random();
    $(this.el).html(Handlebars.templates.response_content_type(this.model));
    return this;
  }
});
'use strict';

SwaggerUi.Views.SignatureView = Backbone.View.extend({
  events: {
    'click a.description-link'       : 'switchToDescription',
    'click a.snippet-link'           : 'switchToSnippet',
    'mousedown .snippet_json'          : 'jsonSnippetMouseDown',
    'mousedown .snippet_xml'          : 'xmlSnippetMouseDown'
  },

  initialize: function () {
  },

  render: function(){

    $(this.el).html(Handlebars.templates.signature(this.model));

    if (this.model.defaultRendering === 'model') {
      this.switchToDescription();
    } else {
      this.switchToSnippet();
    }

    return this;
  },

  // handler for show signature
  switchToDescription: function(e){
    if (e) { e.preventDefault(); }

    $('.snippet', $(this.el)).hide();
    $('.description', $(this.el)).show();
    $('.description-link', $(this.el)).addClass('selected');
    $('.snippet-link', $(this.el)).removeClass('selected');
  },

  // handler for show sample
  switchToSnippet: function(e){
    if (e) { e.preventDefault(); }

    $('.snippet', $(this.el)).show();
    $('.description', $(this.el)).hide();
    $('.snippet-link', $(this.el)).addClass('selected');
    $('.description-link', $(this.el)).removeClass('selected');
  },

  // handler for snippet to text area
  snippetToTextArea: function(val) {
    var textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));

    // Fix for bug in IE 10/11 which causes placeholder text to be copied to "value"
    if ($.trim(textArea.val()) === '' || textArea.prop('placeholder') === textArea.val()) {
      textArea.val(val);
      // TODO move this code outside of the view and expose an event instead
      if( this.model.jsonEditor && this.model.jsonEditor.isEnabled()){
        this.model.jsonEditor.setValue(JSON.parse(this.model.sampleJSON));
      }
    }
  },

  jsonSnippetMouseDown: function (e) {
    if (this.model.isParam) {
      if (e) { e.preventDefault(); }

      this.snippetToTextArea(this.model.sampleJSON);
    }
  },

  xmlSnippetMouseDown: function (e) {
    if (this.model.isParam) {
      if (e) { e.preventDefault(); }

      this.snippetToTextArea(this.model.sampleXML);
    }
  }
});
'use strict';

SwaggerUi.Views.StatusCodeView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function(){
    var responseModel, responseModelView;
    var value = this.router.api.models[this.model.responseModel];
    $(this.el).html(Handlebars.templates.status_code(this.model));

    if (this.router.api.models.hasOwnProperty(this.model.responseModel)) {
      responseModel = {
        sampleJSON: JSON.stringify(SwaggerUi.partials.signature.createJSONSample(value), void 0, 2),
        sampleXML: this.model.isXML ? SwaggerUi.partials.signature.createXMLSample('', this.model.schema, this.router.api.models) : false,
        isParam: false,
        signature: SwaggerUi.partials.signature.getModelSignature(this.model.responseModel, value, this.router.api.models),
        defaultRendering: this.model.defaultRendering
      };
    } else {
      responseModel = {
        signature: SwaggerUi.partials.signature.getPrimitiveSignature(this.model.schema)
      };
    }

    responseModelView = new SwaggerUi.Views.SignatureView({model: responseModel, tagName: 'div'});
    $('.model-signature', this.$el).append(responseModelView.render().el);
    return this;
  }
});}).call(this);
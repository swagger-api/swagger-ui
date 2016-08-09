// swagger-ui.js
// version 2.0.21
/* ========================================================================
 * Bootstrap: scrollspy.js v3.3.6
 * http://getbootstrap.com/javascript/#scrollspy
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // SCROLLSPY CLASS DEFINITION
  // ==========================

  function ScrollSpy(element, options) {
    this.$body          = $(document.body)
    this.$scrollElement = $(element).is(document.body) ? $(window) : $(element)
    this.options        = $.extend({}, ScrollSpy.DEFAULTS, options)
    this.selector       = (this.options.target || '') + ' .nav li > a'
    this.offsets        = []
    this.targets        = []
    this.activeTarget   = null
    this.scrollHeight   = 0

    this.$scrollElement.on('scroll.bs.scrollspy', $.proxy(this.process, this))
    this.refresh()
    this.process()
  }

  ScrollSpy.VERSION  = '3.3.6'

  ScrollSpy.DEFAULTS = {
    offset: 10
  }

  ScrollSpy.prototype.getScrollHeight = function () {
    return this.$scrollElement[0].scrollHeight || Math.max(this.$body[0].scrollHeight, document.documentElement.scrollHeight)
  }

  ScrollSpy.prototype.refresh = function () {
    var that          = this
    var offsetMethod  = 'offset'
    var offsetBase    = 0

    this.offsets      = []
    this.targets      = []
    this.scrollHeight = this.getScrollHeight()

    if (!$.isWindow(this.$scrollElement[0])) {
      offsetMethod = 'position'
      offsetBase   = this.$scrollElement.scrollTop()
    }

    this.$body
      .find(this.selector)
      .map(function () {
        var $el   = $(this)
        var href  = $el.data('target') || $el.attr('href')
        var $href = /^#./.test(href) && $(href)

        return ($href
          && $href.length
          && $href.is(':visible')
          && [[$href[offsetMethod]().top + offsetBase, href]]) || null
      })
      .sort(function (a, b) { return a[0] - b[0] })
      .each(function () {
        that.offsets.push(this[0])
        that.targets.push(this[1])
      })
  }

  ScrollSpy.prototype.process = function () {
    var scrollTop    = this.$scrollElement.scrollTop() + this.options.offset
    var scrollHeight = this.getScrollHeight()
    var maxScroll    = this.options.offset + scrollHeight - this.$scrollElement.height()
    var offsets      = this.offsets
    var targets      = this.targets
    var activeTarget = this.activeTarget
    var i

    if (this.scrollHeight != scrollHeight) {
      this.refresh()
    }

    if (scrollTop >= maxScroll) {
      return activeTarget != (i = targets[targets.length - 1]) && this.activate(i)
    }

    if (activeTarget && scrollTop < offsets[0]) {
      this.activeTarget = null
      return this.clear()
    }

    for (i = offsets.length; i--;) {
      activeTarget != targets[i]
        && scrollTop >= offsets[i]
        && (offsets[i + 1] === undefined || scrollTop < offsets[i + 1])
        && this.activate(targets[i])
    }
  }

  ScrollSpy.prototype.activate = function (target) {
    this.activeTarget = target

    this.clear()

    var selector = this.selector +
      '[data-target="' + target + '"],' +
      this.selector + '[href="' + target + '"]'

    var active = $(selector)
      .parents('li')
      .addClass('active')

    if (active.parent('.dropdown-menu').length) {
      active = active
        .closest('li.dropdown')
        .addClass('active')
    }

    active.trigger('activate.bs.scrollspy')
  }

  ScrollSpy.prototype.clear = function () {
    $(this.selector)
      .parentsUntil(this.options.target, '.active')
      .removeClass('active')
  }


  // SCROLLSPY PLUGIN DEFINITION
  // ===========================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.scrollspy')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.scrollspy', (data = new ScrollSpy(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.scrollspy

  $.fn.scrollspy             = Plugin
  $.fn.scrollspy.Constructor = ScrollSpy


  // SCROLLSPY NO CONFLICT
  // =====================

  $.fn.scrollspy.noConflict = function () {
    $.fn.scrollspy = old
    return this
  }


  // SCROLLSPY DATA-API
  // ==================

  $(window).on('load.bs.scrollspy.data-api', function () {
    $('[data-spy="scroll"]').each(function () {
      var $spy = $(this)
      Plugin.call($spy, $spy.data())
    })
  })

}(jQuery);
/* ========================================================================
 * Bootstrap: affix.js v3.3.6
 * http://getbootstrap.com/javascript/#affix
 * ========================================================================
 * Copyright 2011-2015 Twitter, Inc.
 * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
 * ======================================================================== */


+function ($) {
  'use strict';

  // AFFIX CLASS DEFINITION
  // ======================

  var Affix = function (element, options) {
    this.options = $.extend({}, Affix.DEFAULTS, options)

    this.$target = $(this.options.target)
      .on('scroll.bs.affix.data-api', $.proxy(this.checkPosition, this))
      .on('click.bs.affix.data-api',  $.proxy(this.checkPositionWithEventLoop, this))

    this.$element     = $(element)
    this.affixed      = null
    this.unpin        = null
    this.pinnedOffset = null

    this.checkPosition()
  }

  Affix.VERSION  = '3.3.6'

  Affix.RESET    = 'affix affix-top affix-bottom'

  Affix.DEFAULTS = {
    offset: 0,
    target: window
  }

  Affix.prototype.getState = function (scrollHeight, height, offsetTop, offsetBottom) {
    var scrollTop    = this.$target.scrollTop()
    var position     = this.$element.offset()
    var targetHeight = this.$target.height()

    if (offsetTop != null && this.affixed == 'top') return scrollTop < offsetTop ? 'top' : false

    if (this.affixed == 'bottom') {
      if (offsetTop != null) return (scrollTop + this.unpin <= position.top) ? false : 'bottom'
      return (scrollTop + targetHeight <= scrollHeight - offsetBottom) ? false : 'bottom'
    }

    var initializing   = this.affixed == null
    var colliderTop    = initializing ? scrollTop : position.top
    var colliderHeight = initializing ? targetHeight : height

    if (offsetTop != null && scrollTop <= offsetTop) return 'top'
    if (offsetBottom != null && (colliderTop + colliderHeight >= scrollHeight - offsetBottom)) return 'bottom'

    return false
  }

  Affix.prototype.getPinnedOffset = function () {
    if (this.pinnedOffset) return this.pinnedOffset
    this.$element.removeClass(Affix.RESET).addClass('affix')
    var scrollTop = this.$target.scrollTop()
    var position  = this.$element.offset()
    return (this.pinnedOffset = position.top - scrollTop)
  }

  Affix.prototype.checkPositionWithEventLoop = function () {
    setTimeout($.proxy(this.checkPosition, this), 1)
  }

  Affix.prototype.checkPosition = function () {
    if (!this.$element.is(':visible')) return

    var height       = this.$element.height()
    var offset       = this.options.offset
    var offsetTop    = offset.top
    var offsetBottom = offset.bottom
    var scrollHeight = Math.max($(document).height(), $(document.body).height())

    if (typeof offset != 'object')         offsetBottom = offsetTop = offset
    if (typeof offsetTop == 'function')    offsetTop    = offset.top(this.$element)
    if (typeof offsetBottom == 'function') offsetBottom = offset.bottom(this.$element)

    var affix = this.getState(scrollHeight, height, offsetTop, offsetBottom)

    if (this.affixed != affix) {
      if (this.unpin != null) this.$element.css('top', '')

      var affixType = 'affix' + (affix ? '-' + affix : '')
      var e         = $.Event(affixType + '.bs.affix')

      this.$element.trigger(e)

      if (e.isDefaultPrevented()) return

      this.affixed = affix
      this.unpin = affix == 'bottom' ? this.getPinnedOffset() : null

      this.$element
        .removeClass(Affix.RESET)
        .addClass(affixType)
        .trigger(affixType.replace('affix', 'affixed') + '.bs.affix')
    }

    if (affix == 'bottom') {
      this.$element.offset({
        top: scrollHeight - height - offsetBottom
      })
    }
  }


  // AFFIX PLUGIN DEFINITION
  // =======================

  function Plugin(option) {
    return this.each(function () {
      var $this   = $(this)
      var data    = $this.data('bs.affix')
      var options = typeof option == 'object' && option

      if (!data) $this.data('bs.affix', (data = new Affix(this, options)))
      if (typeof option == 'string') data[option]()
    })
  }

  var old = $.fn.affix

  $.fn.affix             = Plugin
  $.fn.affix.Constructor = Affix


  // AFFIX NO CONFLICT
  // =================

  $.fn.affix.noConflict = function () {
    $.fn.affix = old
    return this
  }


  // AFFIX DATA-API
  // ==============

  $(window).on('load', function () {
    $('[data-spy="affix"]').each(function () {
      var $spy = $(this)
      var data = $spy.data()

      data.offset = data.offset || {}

      if (data.offsetBottom != null) data.offset.bottom = data.offsetBottom
      if (data.offsetTop    != null) data.offset.top    = data.offsetTop

      Plugin.call($spy, data)
    })
  })

}(jQuery);
(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['content_type'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers.each.call(depth0, depth0.produces, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n	<option value=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</option>\n	";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <option value=\"application/json\">application/json</option>\n";
  }

  buffer += "<label for=\"contentType\"></label>\n<select name=\"contentType\">\n";
  stack1 = helpers['if'].call(depth0, depth0.produces, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['global_parameters'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  


  return "<section class=\"c-box-filter\">\n  <form id='mId_selector api_selector'>\n    <div class=\"row\">\n      <div class=\"col-xs-6 col-sm-5\">\n        <label class=\"c-input-label\" for=\"input_mId\">Global Merchant ID (mID)</label>\n        <div class=\"input-group\">\n          <input class=\"c-input-field\" placeholder=\"\" id=\"input_mId\" name=\"input_mId\" type=\"text\"/>\n        </div>\n      </div>\n      <div class=\"col-xs-6 col-sm-5\">\n        <label class=\"c-input-label\" for=\"input_apiToken\">API Token</label>\n        <div class=\"input-group\">\n          <input class=\"c-input-field\" placeholder=\"\" id=\"input_apiToken\" name=\"apiKey\" type=\"text\"/>\n        </div>\n      </div>\n      <div class=\"col-xs-12 col-sm-2\">\n        <small class=\"autofill hidden\"><i class=\"fa fa-magic\"></i>Autofill</small>\n      </div>\n    </div>\n  </form>\n</section>";
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['main'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <div class=\"info_title\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.title)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n      <div class=\"info_description\">";
  stack2 = ((stack1 = ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.description)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</div>\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.termsOfServiceUrl), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.contact), {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      ";
  stack2 = helpers['if'].call(depth0, ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.license), {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    ";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<div class=\"info_tos\"><a href=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.termsOfServiceUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Terms of service</a></div>";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<div class=\"info_contact\"><a href=\"mailto:"
    + escapeExpression(((stack1 = ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.contact)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">Contact the developer</a></div>";
  return buffer;
  }

function program6(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "<div class=\"info_license\"><a href=\""
    + escapeExpression(((stack1 = ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.licenseUrl)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.info),stack1 == null || stack1 === false ? stack1 : stack1.license)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a></div>";
  return buffer;
  }

  buffer += "<div class=\"col-xs-12 col-sm-3\">\n  <nav class=\"rest-api-sidebar hidden-print\">\n      <div id=\"main_nav_container\"></div>\n  </nav>\n</div>\n<div class=\"col-xs-12 col-sm-9\">\n  <div class=\"row\">\n    <div class=\"col-xs-12\">\n      <p class=\"c-t-note\"><i class=\"fa fa-exclamation-circle\"></i>For detailed instructions regarding the V3 API, visit the <a id=\"overviewLink\" href=\"https://docs.clover.com/build/web-apps/web-api/\">Overview</a> page.</p>\n    </div>\n  </div>\n  <div id=\"global_params_container\"></div>\n  <div class=\"info\" id=\"api_info\">\n    ";
  stack1 = helpers['if'].call(depth0, depth0.info, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  <div id=\"resources_container\">\n    <ul id=\"resources\" class=\"nav\">\n    </ul>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['nav'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n	<li>\n		<a class=\"nav-resource-title\" href=\"#"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.viewId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = depth0.id),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n		<ul>\n		";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.typeModels), {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n		</ul>\n	</li>\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n			<li>\n				<a class=\"nav-operation-description\" href=\"#"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.viewId)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "\">"
    + escapeExpression(((stack1 = ((stack1 = depth0.attributes),stack1 == null || stack1 === false ? stack1 : stack1.name)),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</a>\n			</li>\n		";
  return buffer;
  }

  stack1 = helpers.each.call(depth0, depth0.resourcesArray, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['operation'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  
  return "\n  <div class=\"auth\">\n  <span class=\"api-ic ic-error\"></span>";
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n    <div id=\"api_information_panel\">\n    ";
  stack1 = helpers.each.call(depth0, depth0, {hash:{},inverse:self.noop,fn:self.program(4, program4, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </div>\n  ";
  return buffer;
  }
function program4(depth0,data) {
  
  var buffer = "", stack1, stack2;
  buffer += "\n      <div title='";
  stack2 = ((stack1 = depth0.description),typeof stack1 === functionType ? stack1.apply(depth0) : stack1);
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "'>"
    + escapeExpression(((stack1 = depth0.scope),typeof stack1 === functionType ? stack1.apply(depth0) : stack1))
    + "</div>\n    ";
  return buffer;
  }

function program6(depth0,data) {
  
  
  return "</div>";
  }

function program8(depth0,data) {
  
  
  return "\n  <div class='access'>\n    <span class=\"api-ic ic-off\" title=\"click to authenticate\"></span>\n  </div>\n  ";
  }

function program10(depth0,data) {
  
  
  return "\n    <div class=\"row\">\n      <div class=\"col-sm-12\">\n        <h5>Parameters</h5>\n      </div>\n    </div>\n    <div class=\"operation-params\">\n\n    </div>\n    ";
  }

function program12(depth0,data) {
  
  
  return "\n    <div style='margin:0;padding:0;display:inline'></div>\n    <div class=\"row\">\n      <div class=\"col-sm-12\">\n        <h5>Response Messages</h5>\n      </div>\n    </div>\n    <table class='fullwidth'>\n      <thead>\n      <tr>\n        <th>HTTP Status Code</th>\n        <th>Reason</th>\n        <th>Response Model</th>\n      </tr>\n      </thead>\n      <div class=\"col-sm-6 operation-status\">\n      \n      </div>\n    </table>\n    ";
  }

function program14(depth0,data) {
  
  
  return "\n    <div class=\"row\">\n      <div class=\"col-sm-12\">\n        <h5>Response Class</h5>\n      </div>\n    </div>\n    <div class=\"row\">\n      <div class=\"col-sm-12\">\n        <p><span class=\"model-signature\" /></p>\n      </div>\n    </div>\n    ";
  }

  buffer += "<div class=\"heading row\">\n  <div class=\"col-sm-12\">\n    <h4 class=\"human-readable-name\">\n      <a href='#!/";
  if (stack1 = helpers.parentId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class=\"toggleOperation\">";
  if (stack1 = helpers.summary) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.summary; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</a>\n    </h4>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-sm-12 options\">\n    <span class='http_method'>\n    <a href='#!/";
  if (stack1 = helpers.parentId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class=\"toggleOperation\">";
  if (stack1 = helpers.method) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.method; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </span>\n    <span class='path'>\n    <a href='#!/";
  if (stack1 = helpers.parentId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "/";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' class=\"toggleOperation\">";
  if (stack1 = helpers.path) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.path; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a>\n    </span>\n  </div>\n</div>\n<div class=\"content\" id='";
  if (stack1 = helpers.parentId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.parentId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "_";
  if (stack1 = helpers.nickname) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.nickname; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "_content' style='display:none'>\n  ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.oauth) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.oauth; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.oauth) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  stack1 = helpers.each.call(depth0, depth0.oauth, {hash:{},inverse:self.noop,fn:self.program(3, program3, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  options = {hash:{},inverse:self.noop,fn:self.program(6, program6, data),data:data};
  if (stack1 = helpers.oauth) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.oauth; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.oauth) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  ";
  options = {hash:{},inverse:self.noop,fn:self.program(8, program8, data),data:data};
  if (stack1 = helpers.oauth) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.oauth; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.oauth) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  <form accept-charset='UTF-8' class='sandbox'>\n    <div style='margin:0;padding:0;display:inline'></div>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.parameters, {hash:{},inverse:self.noop,fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    <div class=\"row\">\n      <div class=\"col-sm-6\">\n        <button class='c-button-secondary submit ";
  if (stack1 = helpers.method) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.method; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' name='commit' type='button submit'>Submit ";
  if (stack1 = helpers.method) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.method; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</button>\n        <div class='sandbox_header'>\n          <button class='response_hider' type='button' style='display:none' href='#'>Hide Response</button>\n        </div>\n        <div class=\"row\">\n          <div class='response col-sm-12' style='display:none'>\n            <h6>Request URL</h6>\n            <div class='block request_url'></div>\n            <h6>Response Body</h6>\n            <div class='block response_body'></div>\n            <h6>Response Code</h6>\n            <div class='block response_code'></div>\n            <h6>Response Headers</h6>\n            <div class='block response_headers'></div>\n          </div>\n        </div>\n      </div>\n    </div>\n    ";
  stack1 = helpers['if'].call(depth0, depth0.responseMessages, {hash:{},inverse:self.noop,fn:self.program(12, program12, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    ";
  stack1 = helpers['if'].call(depth0, depth0.type, {hash:{},inverse:self.noop,fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </form>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, depth0.isFile, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<label class=\"code c-input-label\" for=\"textInput\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\n				";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers['if'].call(depth0, depth0.defaultValue, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n						<div class=\"parameter-content-type\"></div>\n				";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<textarea class='c-input-textarea body-textarea param-value' name='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.defaultValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.defaultValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n					";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<textarea class='c-input-textarea body-textarea param-value' name='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'></textarea>\n					";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, depth0.defaultValue, {hash:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<input class=\"c-input-text parameter param-value\" minlength='0' name='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' placeholder='' type='text' value='";
  if (stack1 = helpers.defaultValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.defaultValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'/>\n				";
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<input class=\"c-input-text parameter param-value\" minlength='0' name='";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "' placeholder='' type='text' value=''/>\n				";
  return buffer;
  }

function program14(depth0,data) {
  
  
  return "\n			<span class='model-signature'></span>\n		";
  }

function program16(depth0,data) {
  
  
  return "\n			<span class='data-type'></span>\n		";
  }

  buffer += "\n<div class=\"row body-post-params\">\n	<div class=\"col-sm-6\">\n		<div class=\"row\">\n			<div class=\"col-sm-12\">\n					<label class=\"code c-input-label\" for=\"textInput\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\n		";
  stack1 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(9, program9, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</div>\n	</div>\n</div>\n<div class=\"row\">\n	<div class=\"col-sm-12 model\">\n		";
  stack1 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(16, program16, data),fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n	</div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_choice_filter'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n				<option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n			";
  return buffer;
  }

  buffer += "<!-- <button disabled type=\"button\" class=\"close\" data-dismiss=\"modal\" aria-hidden=\"true\">&times;</button> -->\n<div class=\"row param-choice-filter\">\n	<div class=\"col-sm-5\">\n		<select class=\"param-choice\">\n			<option value=\"\" disabled selected> Filter by... </option>\n			";
  stack1 = helpers.each.call(depth0, depth0.allChoices, {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n		</select>\n	</div>\n	<div class=\"col-sm-2\">\n		<select class=\"filter-operator\">\n			<option value=\"==\">==</option>\n			<option value=\"!=\">!=</option>\n			<option value=\">\">&gt;</option>\n			<option value=\"<\">&lt;</option>\n			<option value=\">=\">&gt;=</option>\n			<option value=\"<=\">&lt;=</option>\n		</select>\n	</div>\n	<div class=\"col-sm-5\">\n		<input class=\"filter-argument c-input-field\">\n	</div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_complex_query'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  
  return "\n          <span class='model-signature'></span>\n        ";
  }

function program3(depth0,data) {
  
  
  return "\n          <span class='data-type'></span>\n        ";
  }

  buffer += "<div class=\"row param-complex-query\">\n  <div class=\"col-sm-6\">\n    <div class=\"row\">\n      <div class=\"col-sm-12 param-code\">\n        <label class=\"code required c-input-label\" for=\"textInput\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\n        <div class=\"data-type\">\n        ";
  stack1 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(3, program3, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n        </div>\n        <label class=\"c-input-label\">";
  if (stack1 = helpers.paramType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.paramType; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</label>\n        <form class='query-choices'></form>\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_list'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, options, self=this, helperMissing=helpers.helperMissing, functionType="function", escapeExpression=this.escapeExpression;

function program1(depth0,data) {
  
  
  return " multiple='multiple'";
  }

function program3(depth0,data) {
  
  
  return "\n      ";
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.defaultValue, {hash:{},inverse:self.program(8, program8, data),fn:self.program(6, program6, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program6(depth0,data) {
  
  
  return "\n        ";
  }

function program8(depth0,data) {
  
  var buffer = "", stack1, stack2, options;
  buffer += "\n          ";
  options = {hash:{},inverse:self.program(11, program11, data),fn:self.program(9, program9, data),data:data};
  stack2 = ((stack1 = helpers.isArray || depth0.isArray),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "isArray", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n        ";
  return buffer;
  }
function program9(depth0,data) {
  
  
  return "\n          ";
  }

function program11(depth0,data) {
  
  
  return "\n            <option selected=\"\" value=''></option>\n          ";
  }

function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n        ";
  stack1 = helpers['if'].call(depth0, depth0.isDefault, {hash:{},inverse:self.program(16, program16, data),fn:self.program(14, program14, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n      ";
  return buffer;
  }
function program14(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option selected=\"\" value='";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + " (default)</option>\n        ";
  return buffer;
  }

function program16(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n          <option value='";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.value) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.value; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</option>\n        ";
  return buffer;
  }

function program18(depth0,data) {
  
  
  return "\n      <span class=\"model-signature\"></span>\n    ";
  }

function program20(depth0,data) {
  
  
  return "\n      <span class=\"data-type\"></span>\n    ";
  }

  buffer += "<div class=\"row param-list\">\n  <div class=\"col-sm-10\">\n    <label class=\"code c-input-label\" for=\"textInput\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\n    <input class=\"c-input-field t-item-name\" type=\"text\" id=\"textInput\" />\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-sm-10\">\n    <select ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  stack2 = ((stack1 = helpers.isArray || depth0.isArray),stack1 ? stack1.call(depth0, depth0, options) : helperMissing.call(depth0, "isArray", depth0, options));
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += " class='parameter param-value' name='";
  if (stack2 = helpers.name) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.name; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  buffer += escapeExpression(stack2)
    + "'>\n      ";
  stack2 = helpers['if'].call(depth0, depth0.required, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      ";
  stack2 = helpers.each.call(depth0, ((stack1 = depth0.allowableValues),stack1 == null || stack1 === false ? stack1 : stack1.descriptiveValues), {hash:{},inverse:self.noop,fn:self.program(13, program13, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n    </select>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-sm-10 param-description\">\n    <p>";
  if (stack2 = helpers.description) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.description; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</p>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-sm-10 param-type\">\n    <p>";
  if (stack2 = helpers.paramType) { stack2 = stack2.call(depth0, {hash:{},data:data}); }
  else { stack2 = depth0.paramType; stack2 = typeof stack2 === functionType ? stack2.apply(depth0) : stack2; }
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "</p>\n  </div>\n</div>\n<div class=\"row\">\n  <div class=\"col-sm-10 param-body\">\n    ";
  stack2 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(20, program20, data),fn:self.program(18, program18, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_required'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers['if'].call(depth0, depth0.isFile, {hash:{},inverse:self.program(4, program4, data),fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<input type=\"file\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n					";
  return buffer;
  }

function program4(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						";
  stack1 = helpers['if'].call(depth0, depth0.defaultValue, {hash:{},inverse:self.program(7, program7, data),fn:self.program(5, program5, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  return buffer;
  }
function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n							<textarea class=\"c-input-textarea body-textarea param-value\" placeholder=\"(required)\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.defaultValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.defaultValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</textarea>\n						";
  return buffer;
  }

function program7(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n							<textarea class=\"c-input-textarea body-textarea param-value\" placeholder=\"(required)\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"></textarea>\n							<br />\n							<div class=\"parameter-content-type\" />\n						";
  return buffer;
  }

function program9(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					";
  stack1 = helpers['if'].call(depth0, depth0.isFile, {hash:{},inverse:self.program(12, program12, data),fn:self.program(10, program10, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  return buffer;
  }
function program10(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						<input class=\"parameter param-value\" class=\"required\" type=\"file\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n					";
  return buffer;
  }

function program12(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n						";
  stack1 = helpers['if'].call(depth0, depth0.defaultValue, {hash:{},inverse:self.program(15, program15, data),fn:self.program(13, program13, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n					";
  return buffer;
  }
function program13(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n							<input class=\"c-input-field parameter required param-value\" minlength=\"1\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" type=\"text\" value=\"";
  if (stack1 = helpers.defaultValue) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.defaultValue; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\"/>\n						";
  return buffer;
  }

function program15(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n							<input class=\"c-input-field parameter required param-value\" minlength=\"1\" name=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\" placeholder=\"";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\" type=\"text\" value=\"\"/>\n						";
  return buffer;
  }

function program17(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<p class=\"c-help-text\">";
  if (stack1 = helpers.paramType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.paramType; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;<span class=\"model-signature\"></span></p>\n				";
  return buffer;
  }

function program19(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<p class=\"c-help-text\">";
  if (stack1 = helpers.paramType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.paramType; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;<span class=\"data-type\"></span></p>\n				";
  return buffer;
  }

  buffer += "<div class=\"row\">\n	<div class=\"col-sm-6\">\n		<div class=\"row param-required\">\n  		<div class=\"col-sm-12\">\n		    <label class=\"code required c-input-label\" for=\"textInput\">";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</label>\n				";
  stack1 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(9, program9, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n				";
  stack1 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(19, program19, data),fn:self.program(17, program17, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n			</div>\n		</div>\n	</div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['param_simple_query'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, stack2, functionType="function", escapeExpression=this.escapeExpression, self=this;

function program1(depth0,data) {
  
  var buffer = "";
  buffer += "\n              <option value=\""
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "\">"
    + escapeExpression((typeof depth0 === functionType ? depth0.apply(depth0) : depth0))
    + "</option>\n            ";
  return buffer;
  }

function program3(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<p class=\"c-help-text\">";
  if (stack1 = helpers.paramType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.paramType; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;<span class=\"model-signature\"></span></p>\n				";
  return buffer;
  }

function program5(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n					<p class=\"c-help-text\">";
  if (stack1 = helpers.paramType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.paramType; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "&nbsp;<span class=\"data-type\"></span></p>\n				";
  return buffer;
  }

  buffer += "<div class=\"row param-simple-query\">\n  <div class=\"col-sm-6\">\n    <div class=\"row\">\n      <div class=\"col-sm-12 param-code\">\n        <label class=\"code required c-input-label\" for=\"textInput\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</label>\n        <form class='query-choices'>\n          <select class=\"param-choice c-dropdown-filter param-value\" multiple=\"multiple\" style=\"width: 100%\" placeholder=\"";
  if (stack1 = helpers.paramType) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.paramType; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">\n            ";
  stack2 = helpers.each.call(depth0, ((stack1 = ((stack1 = depth0.choices),stack1 == null || stack1 === false ? stack1 : stack1.attributes)),stack1 == null || stack1 === false ? stack1 : stack1.allChoices), {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n          </select>\n        </form>\n        ";
  stack2 = helpers['if'].call(depth0, depth0.isBody, {hash:{},inverse:self.program(5, program5, data),fn:self.program(3, program3, data),data:data});
  if(stack2 || stack2 === 0) { buffer += stack2; }
  buffer += "\n      </div>\n    </div>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['parameter_content_type'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers.each.call(depth0, depth0.consumes, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <option value=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</option>\n  ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <option value=\"application/json\">application/json</option>\n";
  }

  buffer += "<label for=\"parameterContentType\"></label>\n<select name=\"parameterContentType\">\n";
  stack1 = helpers['if'].call(depth0, depth0.consumes, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['resource'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, options, functionType="function", escapeExpression=this.escapeExpression, self=this, blockHelperMissing=helpers.blockHelperMissing;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += " ";
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += " ";
  return buffer;
  }

  buffer += "<div class='heading row'>\n  <div class=\"col-sm-9\">\n    <h2 class=\"resource-title\">\n      <a href='#!/";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "'>";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</a> ";
  options = {hash:{},inverse:self.noop,fn:self.program(1, program1, data),data:data};
  if (stack1 = helpers.description) { stack1 = stack1.call(depth0, options); }
  else { stack1 = depth0.description; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if (!helpers.description) { stack1 = blockHelperMissing.call(depth0, stack1, options); }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n    </h2>\n  </div>\n  <div class='options col-sm-3 text-right'>\n    <button class=\"button__toggle\" href='#' class=\"collapse_button\">\n      <i class=\"fa fa-minus-square-o\"></i>\n      Hide Operations\n    </button>\n    <button class=\"button__toggle hidden\" href='#' class=\"expand_button\">\n      <i class=\"fa fa-plus-square-o\"></i>\n      Show Operations\n    </button>\n  </div>\n</div>\n<div class=\"row\">\n  <div class='operationTypes' id='";
  if (stack1 = helpers.id) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.id; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "_endpoint_list' style='display:block'>\n\n  </div>\n</div>";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['response_content_type'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", self=this;

function program1(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  ";
  stack1 = helpers.each.call(depth0, depth0.produces, {hash:{},inverse:self.noop,fn:self.program(2, program2, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n";
  return buffer;
  }
function program2(depth0,data) {
  
  var buffer = "", stack1;
  buffer += "\n  <option value=\"";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\">";
  stack1 = (typeof depth0 === functionType ? depth0.apply(depth0) : depth0);
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</option>\n  ";
  return buffer;
  }

function program4(depth0,data) {
  
  
  return "\n  <option value=\"application/json\">application/json</option>\n";
  }

  buffer += "<label for=\"responseContentType\"></label>\n<select name=\"responseContentType\">\n";
  stack1 = helpers['if'].call(depth0, depth0.produces, {hash:{},inverse:self.program(4, program4, data),fn:self.program(1, program1, data),data:data});
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n</select>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['signature'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function";


  buffer += "<div class=\"signature-container row\">\n  <div class=\"description col-sm-6\">\n  <h6>Model</h6>\n      ";
  if (stack1 = helpers.signature) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.signature; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "\n  </div>\n  <div class=\"snippet col-sm-6\">\n  <h6>Model Schema</h6>\n      <pre><code></code></pre>\n      <p class=\"c-t-note notice\"></p>\n  </div>\n</div>\n";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['status_code'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<h6>STATUS CODE</h6>\n<td width='15%' class='code'>";
  if (stack1 = helpers.code) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.code; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</td>\n<td>";
  if (stack1 = helpers.message) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.message; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  if(stack1 || stack1 === 0) { buffer += stack1; }
  buffer += "</td>\n<td width='50%'><span class=\"model-signature\" /></td>";
  return buffer;
  });
})();

(function() {
  var template = Handlebars.template, templates = Handlebars.templates = Handlebars.templates || {};
templates['type'] = template(function (Handlebars,depth0,helpers,partials,data) {
  this.compilerInfo = [4,'>= 1.0.0'];
helpers = this.merge(helpers, Handlebars.helpers); data = data || {};
  var buffer = "", stack1, functionType="function", escapeExpression=this.escapeExpression;


  buffer += "<div class=\"row\">\n  <div class=\"col-sm-12\">\n    <h3 class=\"type\" id=\"";
  if (stack1 = helpers.viewId) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.viewId; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "\">";
  if (stack1 = helpers.name) { stack1 = stack1.call(depth0, {hash:{},data:data}); }
  else { stack1 = depth0.name; stack1 = typeof stack1 === functionType ? stack1.apply(depth0) : stack1; }
  buffer += escapeExpression(stack1)
    + "</h3>\n  </div>\n</div>\n<div class=\"operations\"></div>";
  return buffer;
  });
})();



// Generated by CoffeeScript 1.5.0
(function() {
  var Api, Choices, ContentTypeView, Expansions, Filters, GlobalParametersView, MainView, NavView, Operation, OperationView, Param, ParameterChoiceView, ParameterContentTypeView, ParameterView, Resource, ResourceView, ResponseContentTypeView, Signature, SignatureView, StatusCodeView, SwaggerUiRouter, Type, TypeView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  SwaggerUiRouter = (function(_super) {

    __extends(SwaggerUiRouter, _super);

    function SwaggerUiRouter() {
      SwaggerUiRouter.__super__.constructor.apply(this, arguments);
    }

    SwaggerUiRouter.prototype.options = null;

    SwaggerUiRouter.prototype.api = null;

    SwaggerUiRouter.prototype.headerView = null;

    SwaggerUiRouter.prototype.mainView = null;

    SwaggerUiRouter.prototype.initialize = function(options) {
      var _this = this;
      if (options == null) {
        options = {};
      }
      this.options = options;
      this.options.success = function() {
        return _this.render();
      };
      this.options.progress = function(d) {
        return _this.showMessage(d);
      };
      return this.options.failure = function(d) {
        return _this.onLoadFailure(d);
      };
    };

    SwaggerUiRouter.prototype.load = function() {
      var url, _ref;
      if ((_ref = this.mainView) != null) {
        _ref.clear();
      }
      url = this.options.url;
      if (url.indexOf("http") !== 0) {
        url = this.buildUrl(window.location.href.toString(), url);
      }
      this.options.url = url;
      this.api = new SwaggerApi(this.options);
      return this.api.build();
    };

    SwaggerUiRouter.prototype.render = function() {
      var apiModel,
        _this = this;
      this.showMessage('Finished Loading Resource Information. Rendering Swagger UI...');
      apiModel = new Api(this.api);
      this.mainView = new MainView({
        model: apiModel,
        el: $('#swagger-ui-container')
      }).render();
      this.showMessage();
      if (this.options.onComplete) {
        this.options.onComplete(this.api, this);
      }
      this.setUiLibraries();
      return setTimeout(function() {
        return _this.checkShebang();
      }, 400);
    };

    SwaggerUiRouter.prototype.buildUrl = function(base, url) {
      var endOfPath, parts;
      log("base is " + base);
      if (url.indexOf("/") === 0) {
        parts = base.split("/");
        base = parts[0] + "//" + parts[2];
        return base + url;
      } else {
        endOfPath = base.length;
        if (base.indexOf("?") > -1) {
          endOfPath = Math.min(endOfPath, base.indexOf("?"));
        }
        if (base.indexOf("#") > -1) {
          endOfPath = Math.min(endOfPath, base.indexOf("#"));
        }
        base = base.substring(0, endOfPath);
        if (base.indexOf("/", base.length - 1) !== -1) {
          return base + url;
        }
        return base + "/" + url;
      }
    };

    SwaggerUiRouter.prototype.setUiLibraries = function() {
      var selectPlaceholder;
      selectPlaceholder = $('select.param-choice').attr('placeholder');
      return $('select.param-choice').select2({
        placeholder: selectPlaceholder,
        containerCssClass: 'tpx-select2-container',
        dropdownCssClass: 'tpx-select2-drop',
        dropdownAutoWidth: true
      });
    };

    SwaggerUiRouter.prototype.showMessage = function(data) {
      if (data == null) {
        data = '';
      }
      $('#message-bar').removeClass('message-fail');
      $('#message-bar').addClass('message-success');
      return $('#message-bar').html(data);
    };

    SwaggerUiRouter.prototype.onLoadFailure = function(data) {
      var val;
      if (data == null) {
        data = '';
      }
      $('#message-bar').removeClass('message-success');
      $('#message-bar').addClass('message-fail');
      val = $('#message-bar').html(data);
      if (this.options.onFailure != null) {
        this.options.onFailure(data);
      }
      return val;
    };

    SwaggerUiRouter.prototype.checkShebang = function() {
      var dom_id, fragments, li_content_dom_id, li_dom_id;
      fragments = $.param.fragment().split('/');
      fragments.shift();
      dom_id = 'resource_' + fragments[0];
      $("#" + dom_id).slideto({
        highlight: false
      });
      li_dom_id = fragments.join('_');
      li_content_dom_id = li_dom_id + "_content";
      $('#' + li_content_dom_id).slideDown();
      return $('#' + li_dom_id).slideto({
        highlight: false
      });
    };

    SwaggerUiRouter.prototype.escapeResourceName = function(resource) {
      return resource.replace(/[!"#$%&'()*+,.\/:;<=>?@\[\\\]\^`{|}~]/g, "\\$&");
    };

    return SwaggerUiRouter;

  })(Backbone.Router);

  window.SwaggerUiRouter = SwaggerUiRouter;

  Choices = (function(_super) {

    __extends(Choices, _super);

    function Choices() {
      Choices.__super__.constructor.apply(this, arguments);
    }

    Choices.prototype.initialize = function() {
      this.parseChoices;
      this.valueSetExternally = null;
      this.set("currentValues", {});
      this.set("queryParamString", "");
      return this.update();
    };

    Choices.prototype.parseChoices = function() {
      var choiceArray, choicesString;
      choicesString = this.get("description");
      choiceArray = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]")).split(/[\s,]+/);
      return this.set("allChoices", choiceArray);
    };

    Choices.prototype.setSelectedValue = function(choiceViewId, value) {
      this.get("currentValues")[choiceViewId] = value;
      return this.update();
    };

    Choices.prototype.update = function() {};

    return Choices;

  })(Backbone.Model);

  Expansions = (function(_super) {

    __extends(Expansions, _super);

    function Expansions() {
      Expansions.__super__.constructor.apply(this, arguments);
    }

    Expansions.prototype.initialize = function() {
      this.set("isExpansions", true);
      this.setupChoices();
      this.set("queryParamString", "");
      this.setExpansionTitle();
      return this.update();
    };

    Expansions.prototype.setupChoices = function() {
      var choiceArray, choicesString, currentExpansions, field, _i, _len;
      choicesString = this.get("description");
      choiceArray = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]")).split(/[\s,]+/);
      currentExpansions = {};
      for (_i = 0, _len = choiceArray.length; _i < _len; _i++) {
        field = choiceArray[_i];
        currentExpansions[field] = false;
      }
      this.set("currentExpansions", currentExpansions);
      return this.set("allChoices", choiceArray);
    };

    Expansions.prototype.setExpansionTitle = function() {
      var desc;
      desc = this.get('description');
      return this.set('expansionTitle', desc.slice(0, desc.indexOf('[')));
    };

    Expansions.prototype.setAllExpansions = function(expandedArray) {
      var field, _i, _len;
      this.setupChoices();
      for (_i = 0, _len = expandedArray.length; _i < _len; _i++) {
        field = expandedArray[_i];
        this.get("currentExpansions")[field] = true;
      }
      return this.update();
    };

    Expansions.prototype.setExpansion = function(field, expanded) {
      this.get("currentExpansions")[field] = expanded;
      return this.update();
    };

    Expansions.prototype.expansionFromJSON = function(field) {
      if (!this.get("currentExpansions")[field]) {
        this.get("currentExpansions")[field] = true;
        this.update();
        return this.trigger("expansionFromJSON", field);
      }
    };

    Expansions.prototype.update = function() {
      var currentExpansions, expandedFields, field, queryParamString, unexpandedFields;
      currentExpansions = this.get("currentExpansions");
      queryParamString = "";
      expandedFields = [];
      unexpandedFields = [];
      for (field in currentExpansions) {
        if (!__hasProp.call(currentExpansions, field)) continue;
        if (currentExpansions[field]) {
          expandedFields.push(field);
          queryParamString = queryParamString.concat(field, ",");
        } else {
          unexpandedFields.push(field);
        }
      }
      this.set("queryParamString", queryParamString.slice(0, -1));
      this.set("expandedFields", expandedFields);
      return this.set("unexpandedFields", unexpandedFields);
    };

    return Expansions;

  })(Choices);

  Filters = (function(_super) {

    __extends(Filters, _super);

    function Filters() {
      Filters.__super__.constructor.apply(this, arguments);
    }

    Filters.prototype.initialize = function() {
      this.set("isFilters", true);
      this.parseChoices();
      this.set("currentFilters", {});
      return this.set("queryParamString", "");
    };

    Filters.prototype.parseChoices = function() {
      var choiceArray, choicesString;
      choicesString = this.get("description");
      choiceArray = choicesString.slice(choicesString.indexOf("[") + 1, choicesString.indexOf("]")).split(/[\s,]+/);
      return this.set("allChoices", choiceArray);
    };

    Filters.prototype.setChoiceViewFilter = function(choiceViewId, value) {
      this.get("currentFilters")[choiceViewId] = value;
      return this.update();
    };

    Filters.prototype.removeChoiceViewFilter = function(choiceViewId) {
      delete this.get("currentFilters")[choiceViewId];
      return this.update();
    };

    Filters.prototype.update = function() {
      var currentValues, queryParamString, value, viewId;
      currentValues = this.get("currentFilters");
      queryParamString = "";
      for (viewId in currentValues) {
        if (!__hasProp.call(currentValues, viewId)) continue;
        value = currentValues[viewId];
        queryParamString = queryParamString.concat(value, "&filter=");
      }
      return this.set("queryParamString", queryParamString.slice(0, -8));
    };

    return Filters;

  })(Choices);

  Param = (function(_super) {

    __extends(Param, _super);

    function Param() {
      Param.__super__.constructor.apply(this, arguments);
    }

    Param.prototype.initialize = function() {
      var signature, type;
      if (this.get("paramType") === "query") {
        if (this.get("name") === "expand") {
          this.set("choices", new Expansions({
            description: this.get("description")
          }));
        } else {
          this.set("choices", new Filters({
            description: this.get("description")
          }));
        }
      } else {
        this.set("queryParamString", "");
      }
      type = this.get("type") || this.get("dataType");
      if (type.toLowerCase() === 'file') {
        this.set("isFile", true);
      }
      if (this.get("paramType") === 'body') {
        this.set("isBody", true);
      }
      if (this.get("paramType") === 'query') {
        this.set("isQuery", true);
      }
      if (this.get("name") === 'filter') {
        this.set("isFilter", true);
      }
      if (this.get("name") === 'expand') {
        this.set("isExpand", true);
      }
      signature = this.get("signature");
      if (signature && signature !== 'string') {
        return this.set("abridgedSignature", signature.slice(0, signature.indexOf('}</span>') + 8));
      }
    };

    Param.prototype.getSignatureModel = function() {
      var signatureAttributes, signatureModel;
      signatureModel = null;
      if (this.get("sampleJSON")) {
        signatureAttributes = {
          sampleJSON: this.get("sampleJSON"),
          isParam: true,
          signature: this.get("abridgedSignature"),
          JSONExpansions: this.get("JSONExpansions")
        };
        signatureModel = new Signature(signatureAttributes);
      }
      return signatureModel;
    };

    Param.prototype.setValue = function(value) {
      if (this.get("isExpand")) {
        if (!value) {
          value = [];
        }
        return this.get("choices").setAllExpansions(value);
      } else {
        return this.set("queryParamString", value);
      }
    };

    Param.prototype.getQueryParamString = function() {
      if (this.get("choices")) {
        return this.get("choices").get("queryParamString");
      } else {
        return this.get("queryParamString");
      }
    };

    return Param;

  })(Backbone.Model);

  Signature = (function(_super) {

    __extends(Signature, _super);

    function Signature() {
      Signature.__super__.constructor.apply(this, arguments);
    }

    Signature.prototype.getExpandedJSON = function() {
      var JSONobject, expandedJSON, field, jsonExpansions, unexpandedFields, _i, _len;
      expandedJSON = this.get("sampleJSON");
      if (expandedJSON) {
        jsonExpansions = this.get("JSONExpansions");
        if (jsonExpansions) {
          unexpandedFields = jsonExpansions.get("unexpandedFields");
          JSONobject = $.parseJSON(expandedJSON);
          for (_i = 0, _len = unexpandedFields.length; _i < _len; _i++) {
            field = unexpandedFields[_i];
            JSONobject[field] = "--Expandable Field--";
          }
          expandedJSON = JSON.stringify(JSONobject, null, '  ');
        }
      }
      return expandedJSON;
    };

    return Signature;

  })(Backbone.Model);

  Operation = (function(_super) {

    __extends(Operation, _super);

    function Operation() {
      Operation.__super__.constructor.apply(this, arguments);
    }

    Operation.prototype.initialize = function() {
      var signature;
      this.urlify = this.get("urlify");
      this.getHeaderParams = this.get("getHeaderParams");
      this.supportHeaderParams = this.get("supportHeaderParams");
      this["do"] = this.get("do");
      this.set("method", this.get("method").toUpperCase());
      signature = this.get("responseClassSignature");
      if (signature && signature !== 'string') {
        this.set("abridgedSignature", signature.slice(0, signature.indexOf('}</span>') + 8));
      }
      return this.buildParamModels();
    };

    Operation.prototype.buildParamModels = function() {
      var param, paramBaseData, params, _i, _j, _len, _len1, _ref;
      params = [];
      _ref = this.get("parameters");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        paramBaseData = _ref[_i];
        param = new Param(paramBaseData);
        params.push(param);
        if (param.get("name") === "expand") {
          this.set("JSONExpansions", param.get("choices"));
        }
      }
      for (_j = 0, _len1 = params.length; _j < _len1; _j++) {
        param = params[_j];
        param.set("JSONExpansions", this.get("JSONExpansions"));
      }
      return this.set("parameterModels", params);
    };

    Operation.prototype.getSignatureModel = function() {
      var signatureAttributes, signatureModel;
      signatureModel = null;
      if (this.get("responseSampleJSON")) {
        signatureAttributes = {
          sampleJSON: this.get("responseSampleJSON"),
          isParam: true,
          signature: this.get("abridgedSignature"),
          JSONExpansions: this.get("JSONExpansions")
        };
        signatureModel = new Signature(signatureAttributes);
      }
      return signatureModel;
    };

    return Operation;

  })(Backbone.Model);

  Resource = (function(_super) {

    __extends(Resource, _super);

    function Resource() {
      Resource.__super__.constructor.apply(this, arguments);
    }

    Resource.prototype.initialize = function() {
      var nickname, nicknameCounts, operationsByType, swaggerOperation, type, typeModels, types, _i, _j, _len, _len1, _ref;
      operationsByType = {};
      types = [];
      typeModels = [];
      nicknameCounts = {};
      _ref = this.get('operationsArray');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        swaggerOperation = _ref[_i];
        nickname = swaggerOperation.nickname;
        if (nicknameCounts[nickname]) {
          nicknameCounts[nickname] += 1;
          nickname = nickname + "_" + nicknameCounts[nickname];
        } else {
          nicknameCounts[nickname] = 1;
        }
        swaggerOperation.nickname = nickname;
        swaggerOperation.parentId = this.get('id');
        type = this.getType(swaggerOperation);
        if (typeof operationsByType[type] === 'undefined') {
          operationsByType[type] = [];
          types.push(type);
        }
        operationsByType[type].push(swaggerOperation);
      }
      for (_j = 0, _len1 = types.length; _j < _len1; _j++) {
        type = types[_j];
        typeModels.push(new Type({
          name: type,
          viewId: this.get('name') + "_" + type,
          operationsArray: operationsByType[type]
        }));
      }
      return this.set('typeModels', typeModels);
    };

    Resource.prototype.getType = function(swaggerOperation) {
      var capitalized, word, words, _i, _len;
      words = swaggerOperation.path.match(/\/((\w|\.)+)(\/{\w+}|\/|)$/)[1].split(/_|\./);
      capitalized = [];
      for (_i = 0, _len = words.length; _i < _len; _i++) {
        word = words[_i];
        if (word === "csv") {
          capitalized.push("CSV");
        } else {
          capitalized.push(word.charAt(0).toUpperCase() + word.slice(1));
        }
      }
      return capitalized.join("");
    };

    return Resource;

  })(Backbone.Model);

  Api = (function(_super) {

    __extends(Api, _super);

    function Api() {
      Api.__super__.constructor.apply(this, arguments);
    }

    Api.prototype.initialize = function() {
      var counter, id, resource, resources, wrappedResourceModels, _i, _len, _ref;
      resources = {};
      wrappedResourceModels = [];
      _ref = this.get("apisArray");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resource = _ref[_i];
        counter = 2;
        id = resource.name;
        while (typeof resources[id] !== 'undefined') {
          id = id + "_" + counter;
          counter += 1;
        }
        resource.id = id;
        resource.viewId = 'resource_' + resource.id;
        resources[id] = resource;
        wrappedResourceModels.push(new Resource(resource));
      }
      return this.set("resourcesArray", wrappedResourceModels);
    };

    return Api;

  })(Backbone.Model);

  Type = (function(_super) {

    __extends(Type, _super);

    function Type() {
      Type.__super__.constructor.apply(this, arguments);
    }

    Type.prototype.initialize = function() {
      var operationModels, swaggerOperation, _i, _len, _ref;
      operationModels = [];
      _ref = this.get('operationsArray');
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        swaggerOperation = _ref[_i];
        operationModels.push(new Operation(swaggerOperation));
      }
      return this.set('operationModels', operationModels);
    };

    return Type;

  })(Backbone.Model);

  MainView = (function(_super) {

    __extends(MainView, _super);

    function MainView() {
      MainView.__super__.constructor.apply(this, arguments);
    }

    MainView.prototype.initialize = function() {};

    MainView.prototype.render = function() {
      var counter, resources;
      $(this.el).html(Handlebars.templates.main(this.model));
      resources = {};
      this.resourceViewReferences = [];
      counter = 0;
      this.addGlobalParameters();
      this.addResources();
      this.addNav();
      return this;
    };

    MainView.prototype.addNav = function() {
      var navView;
      navView = new NavView({
        model: this.model,
        tagName: 'ul',
        id: 'main_nav',
        className: 'nav nav-pills nav-stacked'
      });
      $('#main_nav_container', $(this.el)).append(navView.render().el);
      return this.setAffix();
    };

    MainView.prototype.addGlobalParameters = function() {
      $('#global_params_container', $(this.el)).append(new GlobalParametersView({
        model: this.model
      }).render().el);
      return this.setAffixGlobalParameters();
    };

    MainView.prototype.addResources = function() {
      var resource, resourceView, _i, _len, _ref, _results;
      _ref = this.model.get("resourcesArray");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        resource = _ref[_i];
        resourceView = new ResourceView({
          model: resource,
          tagName: 'li',
          id: resource.get("viewId"),
          className: 'resource active'
        });
        _results.push($('#resources', $(this.el)).append(resourceView.render().el));
      }
      return _results;
    };

    MainView.prototype.clear = function() {
      return $(this.el).html('');
    };

    MainView.prototype.setAffix = function() {
      return $("nav.rest-api-sidebar", $(this.el)).affix({
        offset: {
          top: 120,
          bottom: 0
        }
      });
    };

    MainView.prototype.setAffixGlobalParameters = function() {
      return $("#global_params_container", $(this.el)).affix({
        offset: {
          top: 160,
          bottom: 0
        }
      });
    };

    return MainView;

  })(Backbone.View);

  ResourceView = (function(_super) {

    __extends(ResourceView, _super);

    function ResourceView() {
      ResourceView.__super__.constructor.apply(this, arguments);
    }

    ResourceView.prototype.events = {
      'click .expand_button': 'expandOperations',
      'click .collapse_button': 'collapseOperations'
    };

    ResourceView.prototype.initialize = function() {};

    ResourceView.prototype.render = function() {
      $(this.el).html(Handlebars.templates.resource(this.model.toJSON()));
      this.addTypes();
      return this;
    };

    ResourceView.prototype.addTypes = function() {
      var typeModel, typeView, _i, _len, _ref, _results;
      _ref = this.model.get('typeModels');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        typeModel = _ref[_i];
        typeView = new TypeView({
          model: typeModel,
          tagName: 'li',
          id: typeModel.get('viewId')
        });
        _results.push($('.operationTypes', $(this.el)).append(typeView.render().el));
      }
      return _results;
    };

    ResourceView.prototype.expandOperations = function() {
      return $('li#resource_' + swaggerUiRouter.escapeResourceName(this.model.get('id'))).find('div.content').slideDown();
    };

    ResourceView.prototype.collapseOperations = function() {
      return $('li#resource_' + swaggerUiRouter.escapeResourceName(this.model.get('id'))).find('div.content').slideUp();
    };

    return ResourceView;

  })(Backbone.View);

  OperationView = (function(_super) {

    __extends(OperationView, _super);

    function OperationView() {
      OperationView.__super__.constructor.apply(this, arguments);
    }

    OperationView.prototype.invocationUrl = null;

    OperationView.prototype.events = {
      'submit .sandbox': 'submitOperation',
      'click .submit': 'submitOperation',
      'click .response_hider': 'hideResponse',
      'click .toggleOperation': 'toggleOperationContent',
      'click .expandable': 'expandedFromJSON'
    };

    OperationView.prototype.initialize = function() {};

    OperationView.prototype.template = function() {
      return Handlebars.templates.operation;
    };

    OperationView.prototype.render = function() {
      var contentTypeModel, responseContentTypeView, statusCode, template, _i, _len, _ref;
      template = this.template();
      $(this.el).html(template(this.model.toJSON()));
      contentTypeModel = {
        isParam: false
      };
      responseContentTypeView = new ResponseContentTypeView({
        model: contentTypeModel
      });
      $('.response-content-type', $(this.el)).append(responseContentTypeView.render().el);
      this.addParameterViews();
      this.addSignatureView();
      _ref = this.model.get("responseMessages");
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        statusCode = _ref[_i];
        this.addStatusCode(statusCode);
      }
      return this;
    };

    OperationView.prototype.addSignatureView = function() {
      var signatureModel, signatureView;
      signatureModel = this.model.getSignatureModel();
      if (signatureModel) {
        signatureView = new SignatureView({
          model: signatureModel
        });
        return $('.model-signature', $(this.el)).append(signatureView.render().el);
      } else {
        return $('.data-type', $(this.el)).html(this.model.get("type"));
      }
    };

    OperationView.prototype.addParameterViews = function() {
      var param, paramView, _i, _len, _ref, _results;
      _ref = this.model.get("parameterModels");
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        paramView = new ParameterView({
          model: param,
          tagName: 'div'
        });
        _results.push($('.operation-params', $(this.el)).append(paramView.render().el));
      }
      return _results;
    };

    OperationView.prototype.addStatusCode = function(statusCode) {
      var statusCodeView;
      statusCodeView = new StatusCodeView({
        model: statusCode,
        tagName: 'tr'
      });
      return $('.operation-status', $(this.el)).append(statusCodeView.render().el);
    };

    OperationView.prototype.submitOperation = function(ev) {
      var error_free, form, isFileUpload, map, opts, param, value, _i, _len, _ref;
      if (ev != null) {
        ev.preventDefault();
      }
      form = $('.sandbox', $(this.el));
      error_free = true;
      form.find("input.required").each(function() {
        var _this = this;
        $(this).removeClass("error");
        if (jQuery.trim($(this).val()) === "") {
          $(this).addClass("error");
          $(this).wiggle({
            callback: function() {
              return $(_this).focus();
            }
          });
          return error_free = false;
        }
      });
      if (error_free) {
        map = {};
        opts = {
          parent: this
        };
        isFileUpload = false;
        _ref = this.model.get("parameterModels");
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          param = _ref[_i];
          if (param.get("isFile")) {
            isFileUpload = true;
          }
          value = param.getQueryParamString();
          if (value && jQuery.trim(value).length > 0) {
            map[param.get("name")] = value;
          }
        }
        opts.responseContentType = $("div select[name=responseContentType]", $(this.el)).val();
        opts.requestContentType = $("div select[name=parameterContentType]", $(this.el)).val();
        $(".response_throbber", $(this.el)).show();
        if (isFileUpload) {
          return this.handleFileUpload(map, form);
        } else {
          return this.model["do"](map, opts, this.showCompleteStatus, this.showErrorStatus, this);
        }
      }
    };

    OperationView.prototype.success = function(response, parent) {
      return parent.showCompleteStatus(response);
    };

    OperationView.prototype.handleFileUpload = function(map, form) {
      var bodyParam, el, headerParams, o, obj, param, params, _i, _j, _k, _l, _len, _len1, _len2, _len3, _ref, _ref1, _ref2, _ref3,
        _this = this;
      _ref = form.serializeArray();
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        o = _ref[_i];
        if ((o.value != null) && jQuery.trim(o.value).length > 0) {
          map[o.name] = o.value;
        }
      }
      bodyParam = new FormData();
      params = 0;
      _ref1 = this.model.get("parameters");
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        param = _ref1[_j];
        if (param.paramType === 'form') {
          if (map[param.name] !== void 0) {
            bodyParam.append(param.name, map[param.name]);
          }
        }
      }
      headerParams = {};
      _ref2 = this.model.get("parameters");
      for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
        param = _ref2[_k];
        if (param.paramType === 'header') {
          headerParams[param.name] = map[param.name];
        }
      }
      log(headerParams);
      _ref3 = form.find('input[type~="file"]');
      for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
        el = _ref3[_l];
        if (typeof el.files[0] !== 'undefined') {
          bodyParam.append($(el).attr('name'), el.files[0]);
          params += 1;
        }
      }
      log(bodyParam);
      this.invocationUrl = this.model.supportHeaderParams() ? (headerParams = this.model.getHeaderParams(map), this.model.urlify(map, false)) : this.model.urlify(map, true);
      $(".request_url", $(this.el)).html("<pre>" + this.invocationUrl + "</pre>");
      obj = {
        type: this.model.get("method"),
        url: this.invocationUrl,
        headers: headerParams,
        data: bodyParam,
        dataType: 'json',
        contentType: false,
        processData: false,
        error: function(data, textStatus, error) {
          return _this.showErrorStatus(_this.wrap(data), _this);
        },
        success: function(data) {
          return _this.showResponse(data, _this);
        },
        complete: function(data) {
          return _this.showCompleteStatus(_this.wrap(data), _this);
        }
      };
      if (window.authorizations) {
        window.authorizations.apply(obj);
      }
      if (params === 0) {
        obj.data.append("fake", "true");
      }
      jQuery.ajax(obj);
      return false;
    };

    OperationView.prototype.wrap = function(data) {
      var h, headerArray, headers, i, o, _i, _len;
      headers = {};
      headerArray = data.getAllResponseHeaders().split("\r");
      for (_i = 0, _len = headerArray.length; _i < _len; _i++) {
        i = headerArray[_i];
        h = i.split(':');
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
    };

    OperationView.prototype.hideResponse = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      $(".response", $(this.el)).slideUp();
      return $(".response_hider", $(this.el)).fadeOut();
    };

    OperationView.prototype.showResponse = function(response) {
      var prettyJson;
      prettyJson = JSON.stringify(response, null, "\t").replace(/\n/g, "<br>");
      return $(".response_body", $(this.el)).html(escape(prettyJson));
    };

    OperationView.prototype.showErrorStatus = function(data, parent) {
      return parent.showStatus(data);
    };

    OperationView.prototype.showCompleteStatus = function(data, parent) {
      return parent.showStatus(data);
    };

    OperationView.prototype.formatXml = function(xml) {
      var contexp, formatted, indent, lastType, lines, ln, pad, reg, transitions, wsexp, _fn, _i, _len;
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
      _fn = function(ln) {
        var fromTo, j, key, padding, type, types, value;
        types = {
          single: Boolean(ln.match(/<.+\/>/)),
          closing: Boolean(ln.match(/<\/.+>/)),
          opening: Boolean(ln.match(/<[^!?].*>/))
        };
        type = ((function() {
          var _results;
          _results = [];
          for (key in types) {
            value = types[key];
            if (value) {
              _results.push(key);
            }
          }
          return _results;
        })())[0];
        type = type === void 0 ? 'other' : type;
        fromTo = lastType + '->' + type;
        lastType = type;
        padding = '';
        indent += transitions[fromTo];
        padding = ((function() {
          var _j, _ref, _results;
          _results = [];
          for (j = _j = 0, _ref = indent; 0 <= _ref ? _j < _ref : _j > _ref; j = 0 <= _ref ? ++_j : --_j) {
            _results.push('  ');
          }
          return _results;
        })()).join('');
        if (fromTo === 'opening->closing') {
          return formatted = formatted.substr(0, formatted.length - 1) + ln + '\n';
        } else {
          return formatted += padding + ln + '\n';
        }
      };
      for (_i = 0, _len = lines.length; _i < _len; _i++) {
        ln = lines[_i];
        _fn(ln);
      }
      return formatted;
    };

    OperationView.prototype.showStatus = function(response) {
      var code, content, contentType, headers, pre, response_body, url;
      if (response.content === void 0) {
        content = response.data;
        url = response.url;
      } else {
        content = response.content.data;
        url = response.request.url;
      }
      headers = response.headers;
      contentType = headers && headers["Content-Type"] ? headers["Content-Type"].split(";")[0].trim() : null;
      if (!content) {
        code = $('<code />').text("no content");
        pre = $('<pre class="json" />').append(code);
      } else if (contentType === "application/json" || /\+json$/.test(contentType)) {
        code = $('<code />').text(JSON.stringify(JSON.parse(content), null, "  "));
        pre = $('<pre class="json" />').append(code);
      } else if (contentType === "application/xml" || /\+xml$/.test(contentType)) {
        code = $('<code />').text(this.formatXml(content));
        pre = $('<pre class="xml" />').append(code);
      } else if (contentType === "text/html") {
        code = $('<code />').html(content);
        pre = $('<pre class="xml" />').append(code);
      } else if (/^image\//.test(contentType)) {
        pre = $('<img>').attr('src', url);
      } else {
        code = $('<code />').text(content);
        pre = $('<pre class="json" />').append(code);
      }
      response_body = pre;
      $(".request_url", $(this.el)).html("<pre>" + decodeURIComponent(url) + "</pre>");
      $(".response_code", $(this.el)).html("<pre>" + response.status + "</pre>");
      $(".response_body", $(this.el)).html(response_body);
      $(".response_headers", $(this.el)).html("<pre>" + JSON.stringify(response.headers, null, "  ").replace(/\n/g, "<br>") + "</pre>");
      $(".response", $(this.el)).slideDown();
      $(".response_hider", $(this.el)).show();
      $(".response_throbber", $(this.el)).hide();
      return hljs.highlightBlock($('.response_body', $(this.el))[0]);
    };

    OperationView.prototype.toggleOperationContent = function() {
      var $elem;
      $elem = $('#' + swaggerUiRouter.escapeResourceName(this.model.get("parentId")) + "_" + this.model.get("nickname") + "_content");
      if ($elem.is(':visible')) {
        return $elem.slideUp();
      } else {
        return $elem.slideDown();
      }
    };

    return OperationView;

  })(Backbone.View);

  StatusCodeView = (function(_super) {

    __extends(StatusCodeView, _super);

    function StatusCodeView() {
      StatusCodeView.__super__.constructor.apply(this, arguments);
    }

    StatusCodeView.prototype.initialize = function() {};

    StatusCodeView.prototype.render = function() {
      var responseModel, responseModelView, template;
      template = this.template();
      $(this.el).html(template(this.model));
      if (swaggerUi.api.models.hasOwnProperty(this.model.responseModel)) {
        responseModel = {
          sampleJSON: JSON.stringify(swaggerUi.api.models[this.model.responseModel].createJSONSample(), null, 2),
          isParam: false,
          signature: swaggerUi.api.models[this.model.responseModel].getMockSignature()
        };
        responseModelView = new SignatureView({
          model: responseModel,
          tagName: 'div'
        });
        $('.model-signature', this.$el).append(responseModelView.render().el);
      } else {
        $('.data-type', this.$el).html('');
      }
      return this;
    };

    StatusCodeView.prototype.template = function() {
      return Handlebars.templates.status_code;
    };

    return StatusCodeView;

  })(Backbone.View);

  ParameterView = (function(_super) {

    __extends(ParameterView, _super);

    function ParameterView() {
      ParameterView.__super__.constructor.apply(this, arguments);
    }

    ParameterView.prototype.events = {
      'change .param-value': 'valueChanged'
    };

    ParameterView.prototype.initialize = function() {
      this.choices = this.model.get("choices");
      this.listenTo(this.choices, "expansionFromJSON", this.expansionFromJSON);
      if (this.model.get("isFilter")) {
        this.listenTo(this.choices, "change", this.updateChoices);
      }
      return Handlebars.registerHelper('isArray', function(param, opts) {
        if (param.type.toLowerCase() === 'array' || param.allowMultiple) {
          return opts.fn(this);
        } else {
          return opts.inverse(this);
        }
      });
    };

    ParameterView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model.toJSON()));
      this.addSignatureView();
      this.addParameterContentTypeView();
      if (this.model.get("isFilter")) {
        this.addChoiceView();
      }
      return this;
    };

    ParameterView.prototype.template = function() {
      if (this.model.get("isFilter")) {
        return Handlebars.templates.param_complex_query;
      } else {
        if (this.model.get("isExpand")) {
          return Handlebars.templates.param_simple_query;
        } else {
          if (this.model.get("isList")) {
            return Handlebars.templates.param_list;
          } else {
            if (this.model.get("required")) {
              return Handlebars.templates.param_required;
            } else {
              return Handlebars.templates.param;
            }
          }
        }
      }
    };

    ParameterView.prototype.addSignatureView = function() {
      var signatureModel, signatureView;
      signatureModel = this.model.getSignatureModel();
      if (signatureModel && this.model.get("isBody")) {
        signatureView = new SignatureView({
          model: signatureModel
        });
        return $('.model-signature', $(this.el)).append(signatureView.render().el);
      } else {
        return $('.data-type', $(this.el)).html(this.model.get("type"));
      }
    };

    ParameterView.prototype.addParameterContentTypeView = function() {
      var contentTypeModel, isParam, parameterContentTypeView, responseContentTypeView;
      isParam = false;
      if (this.model.get("isBody")) {
        isParam = true;
      }
      contentTypeModel = {
        isParam: isParam
      };
      if (isParam) {
        parameterContentTypeView = new ParameterContentTypeView({
          model: contentTypeModel
        });
        return $('.parameter-content-type', $(this.el)).append(parameterContentTypeView.render().el);
      } else {
        responseContentTypeView = new ResponseContentTypeView({
          model: contentTypeModel
        });
        return $('.response-content-type', $(this.el)).append(responseContentTypeView.render().el);
      }
    };

    ParameterView.prototype.addChoiceView = function(currentValue) {
      var choiceView;
      choiceView = new ParameterChoiceView({
        model: this.choices,
        currentValue: currentValue
      });
      if (currentValue) {
        return $('.query-choices div:last-child', $(this.el)).before(choiceView.render().el);
      } else {
        return $('.query-choices', $(this.el)).append(choiceView.render().el);
      }
    };

    ParameterView.prototype.updateChoices = function() {
      $('input.parameter', $(this.el)).val(this.choices.get("queryParamString"));
      if (!$('.close', $(this.el)).last().prop('disabled')) {
        return this.addChoiceView();
      }
    };

    ParameterView.prototype.removeChoiceView = function(viewId) {
      var view;
      view = this.choiceViews[viewId];
      view.remove();
      delete this.choiceViews[viewId];
      return this.choiceSet();
    };

    ParameterView.prototype.refreshChoiceViews = function() {
      var viewId, _i, _len, _ref, _results;
      _ref = Object.keys(this.choiceViews);
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        viewId = _ref[_i];
        _results.push(this.choiceViews[viewId].render());
      }
      return _results;
    };

    ParameterView.prototype.expansionFromJSON = function(field) {
      var $select, value;
      $select = $('.param-value', $(this.el));
      value = $select.val();
      if (!value) {
        value = [];
      }
      value.push(field);
      return $('.param-value', $(this.el)).val(value).trigger("change");
    };

    ParameterView.prototype.valueChanged = function(ev) {
      var value;
      value = $(ev.currentTarget).val();
      return this.model.setValue(value);
    };

    return ParameterView;

  })(Backbone.View);

  SignatureView = (function(_super) {

    __extends(SignatureView, _super);

    function SignatureView() {
      SignatureView.__super__.constructor.apply(this, arguments);
    }

    SignatureView.prototype.events = {
      'mousedown .snippet': 'snippetToTextArea',
      'click span.expandable': 'expansionFromJSON'
    };

    SignatureView.prototype.initialize = function() {
      return this.listenTo(this.model.get("JSONExpansions"), "change", this.updateSignature);
    };

    SignatureView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model.toJSON()));
      this.switchToSnippet();
      if (this.model.get("isParam")) {
        $('.notice', $(this.el)).html('<i class="fa fa-exclamation-circle"></i>&nbsp;Click above to set as body');
      }
      this.updateSignature();
      return this;
    };

    SignatureView.prototype.template = function() {
      return Handlebars.templates.signature;
    };

    SignatureView.prototype.switchToDescription = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      $(".snippet", $(this.el)).show();
      $(".description", $(this.el)).show();
      $('.description-link', $(this.el)).addClass('selected');
      return $('.snippet-link', $(this.el)).removeClass('selected');
    };

    SignatureView.prototype.switchToSnippet = function(e) {
      if (e != null) {
        e.preventDefault();
      }
      $(".description", $(this.el)).show();
      $(".snippet", $(this.el)).show();
      $('.snippet-link', $(this.el)).addClass('selected');
      return $('.description-link', $(this.el)).removeClass('selected');
    };

    SignatureView.prototype.updateSignature = function() {
      $("code", $(this.el)).html(this.model.getExpandedJSON());
      this.highlightJSON();
      return this.enableExpandableSpans();
    };

    SignatureView.prototype.highlightJSON = function() {
      var _this = this;
      return $("code", $(this.el)).each(function(i, block) {
        return hljs.highlightBlock(block);
      });
    };

    SignatureView.prototype.enableExpandableSpans = function() {
      return $("span.string", $(this.el)).each(function() {
        if ($(this).text() === '"--Expandable Field--"') {
          return $(this).addClass("expandable");
        }
      });
    };

    SignatureView.prototype.expansionFromJSON = function(e) {
      var field;
      field = $(e.currentTarget).parent().prev().text();
      return this.model.get("JSONExpansions").expansionFromJSON(field);
    };

    SignatureView.prototype.snippetToTextArea = function(e) {
      var textArea;
      if (this.isParam) {
        if (e != null) {
          e.preventDefault();
        }
        textArea = $('textarea', $(this.el.parentNode.parentNode.parentNode));
        if ($.trim(textArea.val()) === '') {
          return textArea.val(this.model.get("sampleJSON"));
        }
      }
    };

    return SignatureView;

  })(Backbone.View);

  ContentTypeView = (function(_super) {

    __extends(ContentTypeView, _super);

    function ContentTypeView() {
      ContentTypeView.__super__.constructor.apply(this, arguments);
    }

    ContentTypeView.prototype.initialize = function() {};

    ContentTypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      $('label[for=contentType]', $(this.el)).text('Response Content Type');
      return this;
    };

    ContentTypeView.prototype.template = function() {
      return Handlebars.templates.content_type;
    };

    return ContentTypeView;

  })(Backbone.View);

  ResponseContentTypeView = (function(_super) {

    __extends(ResponseContentTypeView, _super);

    function ResponseContentTypeView() {
      ResponseContentTypeView.__super__.constructor.apply(this, arguments);
    }

    ResponseContentTypeView.prototype.initialize = function() {};

    ResponseContentTypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      $('label[for=responseContentType]', $(this.el)).text('Response Content Type');
      return this;
    };

    ResponseContentTypeView.prototype.template = function() {
      return Handlebars.templates.response_content_type;
    };

    return ResponseContentTypeView;

  })(Backbone.View);

  ParameterContentTypeView = (function(_super) {

    __extends(ParameterContentTypeView, _super);

    function ParameterContentTypeView() {
      ParameterContentTypeView.__super__.constructor.apply(this, arguments);
    }

    ParameterContentTypeView.prototype.initialize = function() {};

    ParameterContentTypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model));
      $('label[for=parameterContentType]', $(this.el)).text('Parameter content type:');
      return this;
    };

    ParameterContentTypeView.prototype.template = function() {
      return Handlebars.templates.parameter_content_type;
    };

    return ParameterContentTypeView;

  })(Backbone.View);

  ParameterChoiceView = (function(_super) {

    __extends(ParameterChoiceView, _super);

    function ParameterChoiceView() {
      ParameterChoiceView.__super__.constructor.apply(this, arguments);
    }

    ParameterChoiceView.prototype.events = {
      'blur input.filter-argument': 'choiceChanged',
      'change select': 'choiceChanged',
      'click .close': 'removeThisView'
    };

    ParameterChoiceView.prototype.initialize = function(options) {
      this.options = options || {};
      return this.currentValue = options.currentValue;
    };

    ParameterChoiceView.prototype.render = function() {
      var modelJSON, template;
      template = this.template();
      modelJSON = this.model.toJSON();
      modelJSON["currentValue"] = this.currentValue;
      $(this.el).html(template(modelJSON));
      $('select', $(this.el)).select2();
      if (this.currentValue) {
        this.enableCloseButton();
      }
      return this;
    };

    ParameterChoiceView.prototype.template = function() {
      return Handlebars.templates.param_choice_filter;
    };

    ParameterChoiceView.prototype.choiceChanged = function() {
      this.enableCloseButton();
      return this.updateFilter();
    };

    ParameterChoiceView.prototype.updateFilter = function() {
      var argument, choice, operator;
      choice = $('.param-choice', $(this.el)).val();
      operator = $('.filter-operator', $(this.el)).val();
      argument = $('.filter-argument', $(this.el)).val();
      if (argument) {
        argument = argument.trim();
      }
      if (choice && argument) {
        this.currentValue = "" + choice + operator + argument;
        return this.model.setChoiceViewFilter(this.cid, this.currentValue);
      } else {
        return this.model.removeChoiceViewFilter(this.cid);
      }
    };

    ParameterChoiceView.prototype.removeThisView = function() {
      if (this.currentValue) {
        this.model.removeChoiceViewFilter(this.cid);
      }
      return this.remove();
    };

    ParameterChoiceView.prototype.enableCloseButton = function() {
      return $('.close', $(this.el)).prop('disabled', false);
    };

    return ParameterChoiceView;

  })(Backbone.View);

  NavView = (function(_super) {

    __extends(NavView, _super);

    function NavView() {
      NavView.__super__.constructor.apply(this, arguments);
    }

    NavView.prototype.initialize = function() {};

    NavView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model.toJSON()));
      return this;
    };

    NavView.prototype.template = function() {
      return Handlebars.templates.nav;
    };

    return NavView;

  })(Backbone.View);

  TypeView = (function(_super) {

    __extends(TypeView, _super);

    function TypeView() {
      TypeView.__super__.constructor.apply(this, arguments);
    }

    TypeView.prototype.initialize = function() {};

    TypeView.prototype.render = function() {
      var template;
      template = this.template();
      $(this.el).html(template(this.model.toJSON()));
      this.addOperations();
      return this;
    };

    TypeView.prototype.template = function() {
      return Handlebars.templates.type;
    };

    TypeView.prototype.addOperations = function() {
      var operationModel, operationView, _i, _len, _ref, _results;
      _ref = this.model.get('operationModels');
      _results = [];
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        operationModel = _ref[_i];
        operationView = new OperationView({
          model: operationModel,
          tagName: 'li'
        });
        _results.push($('.operations', $(this.el)).append(operationView.render().el));
      }
      return _results;
    };

    return TypeView;

  })(Backbone.View);

  GlobalParametersView = (function(_super) {

    __extends(GlobalParametersView, _super);

    function GlobalParametersView() {
      GlobalParametersView.__super__.constructor.apply(this, arguments);
    }

    GlobalParametersView.prototype.events = {
      'change #input_mId': 'setId',
      'change #input_apiToken': 'setToken'
    };

    GlobalParametersView.prototype.initialize = function() {};

    GlobalParametersView.prototype.render = function() {
      $(this.el).html(Handlebars.templates.global_parameters());
      return this;
    };

    GlobalParametersView.prototype.setId = function(ev) {
      return $('[name="mId"]').val($(ev.currentTarget).val()).trigger("change");
    };

    GlobalParametersView.prototype.setToken = function(ev) {
      var key;
      key = $(ev.currentTarget).val();
      if (key && key.trim() !== "") {
        return window.authorizations.add("key", new ApiKeyAuthorization("Authorization", "Bearer " + key, "header"));
      }
    };

    return GlobalParametersView;

  })(Backbone.View);

}).call(this);

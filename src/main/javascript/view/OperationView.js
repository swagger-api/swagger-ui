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
      hljs.highlightBlock(response_body_el);
        var ret = hljs.highlightBlock(response_body_el);

      var to = setInterval(function() {

          console.log('bah')

          if (!response_body_el.classList.contains('hljs')) return;

          //if response_body_el

          clearInterval(to)

          const pi = 3.14159265359;


          function cubicInOut(x) {
            return -2 * Math.pow(x, 3) + 3 * Math.pow(x, 2);
          }

          // Basically cos^n when n is even gives a
          // nice `accelarate, coast, brake;` function over each
          // period, so the integral describes how far we've gone.
          function cosPow6Intg(x) {
            return x - ((15*Math.sin(2*pi*x))/(44*pi)) - ((3*Math.sin(4*pi*x))/(44*pi)) - ((Math.sin(6*pi*x))/(132*pi));
          }

          // Make our transition nice'n'smooth
          function animate(propertySetter, start, end, speed, units, animationCompletedCallback) {

                units = units || 0;
                propertySetter(start + units);

                // Should be in all modern browsers now.
                // We could run a check and if need be use `Date.now()`.
                var start_time = performance.now();
                var change = end - start;
                var duration = Math.abs(change*speed)+1000;

                (function step() {
                    var time_now = performance.now();
                    var elapsed_time = time_now - start_time;
                    requestAnimationFrame(function(ts) { // requestAnimationFrame() === Butter.
                        propertySetter(start + change * cosPow6Intg(elapsed_time/duration) + units);
                        if (elapsed_time >= duration) {
                            propertySetter(end + units);
                            animationCompletedCallback();
                            return;
                        }
                        step();
                    });
                })();

          }


          var ops = swaggerUi.api.apisArray.map(function(api) {

                    var op = api.operation

                    var re = api.operation.path;

                    // This is a workaround for a bug? maybe...
                    // one of the paths has a random parenthese in it..
                    // Will open a ticket if I cant figure it out
                    // before this PR is submitted.
                    //re = re.replace(/\x29/g, ""); // ???

                    // Urls that contain paths have a "virtual" forward-slash in them
                    // Swagger doesn't see if because the route regex captures it.
                    if (op.nickname == 'Node_Files_List_GET') re = re.replace(/{path}/g, "(/.+[^/])"); // ???
                    if (op.nickname == 'Node_File_Detail_GET') re = re.replace(/{path}/g, "(/.*/?)"); // ???
                    //console.log(re)
                    // Create a pattern from the path that will match valid values.
                    // of variable data.
                    var re = re.replace(/{(?:[a-z_])+}/g, "([0-9a-zA-Z]+)");

                    // Turn it into a regular expression.
                    re = re.replace(/\/?<!\x28/g, "\\/");
                    op.re = new RegExp(re);

                    //console.log(op);
                    return op;
          });

          var json_strings = response_body_el.querySelectorAll('.hljs-string');

          console.log(response_body_el)

          var urls = Array.prototype.filter.call(json_strings, function(url_el) {

                    // It's a pretty fair assumption that if a string starts with
                    // one of these it's probably a link. (This is actually how
                    // Swagger looks for urls.)
                    return (
                        url_el.innerHTML.slice(1, 5) == "http" ||
                        url_el.innerHTML.slice(1, 6) == "https"
                    );

          }).map(function(url_el) {
                    // Now we have an array of all the links (or the span tags that
                    // contain them, anyway) that were
                    // in the response; we can do something cool with them.

                    // It's JSON, so strings have quotes around them.
                    var url = url_el.innerHTML.slice(1, -1);

                    // We're gonna want an anchor anyway, but anchors have cool
                    // url 'parsing' properties, so we're gonna use them.
                    // This is consistent across all modern browsers. IE9 and earlier
                    // doesn't like it though.
                    var anchor = document.createElement('a');
                    anchor.href = url;
                    anchor.textContent = url;
                    var pn = anchor.pathname;

                    // For those links that are associated with an operation
                    // in the api...

                    if (ops.map(function(op) {
                            // ...execute the regex associated with this operation on the
                            // api endpoint we're checking right now...
                            op.matched = op.re.exec(pn);
                            return op;

                    }).filter(function(op, i, ops) {
                            // ...to see we have a operation that takes a path that looks like this.
                            return (
                                op.matched && // ENsure there is a match.
                                op.matched[0] == pn // ENsure we match the whole thing.
                            );

                    }).map(function(op) {

                            // Lets populate our link.
                            var target_op_el = document.getElementById('resource_' + op.encodedParentId);
                            url_el.innerHTML = "\"<a href=\"#" + target_op_el.id + "\">" + url +" </a>\"";
                            // Create a link to the raw JSON


                            var params = document.querySelectorAll("#" + target_op_el.id + " div.content .sandbox .parameter.required");
                            Array.prototype.map.call(params, function(param, i) {
                                // Elements of the `matched` array (the result of `[[RegEx]].exec([[string]])`) are captured arguments.
                                param.value = op.matched[i+1];
                            });

                            // If it's not a get request, we're done.
                            // Some guards to make sure we only attach an event to the get
                            // request(avoids deleting files and the like)
                            if (!target_op_el) {
                                console.log('no_el?', target_op_el)
                                return; // Sanity
                            }
                            if (op.method !== 'get') {
                                //console.log(op, 'not a get');
                                return; // Only `GET`s
                            }
                            if (anchor.host !== op.host) {
                                return; // Has to be an OSF api request/
                            }
                            url_el.innerHTML += " <span class='hljs-comment'>/* <a target=\"_blank\" href=\""+url+"?format=json\">raw_json</a> */</span>";



                            // It's a `GET`; make it show us what we want to see when we click it.
                            url_el.addEventListener("click", function(e) {

                                document.querySelector("#" + target_op_el.id + " div.content .sandbox_header .submit").click();
                                animate(function(y) {
                                    window.scrollTo(0, y)
                                }, window.scrollY, target_op_el.offsetTop, .3, null, function() {

                                // update the location bar and show the content of this operation.
                                document.querySelector("#" + target_op_el.id + " .heading a").click();
                                window.location.hash = "!/v2/" + op.nickname; // This may break when we update swagger.
                                var op_
                                var op_content = document.querySelector("#" + target_op_el.id + " div.content");
                                $(op_content).slideDown()

                                // Once we're at the operation, scroll to the response section.
                                var to_v_sbox = document.querySelector("#" + target_op_el.id + ' .sandbox')
                                animate(function(y) {
                                    window.scrollTo(0, y)
                                }, window.scrollY, to_v_sbox.offsetTop, .3, null, function() {});

                            });

                        });

                // If there were no operations that matched, just have the link point to a blank tab.
                }).length <= 0) url_el.innerHTML = "<a target=\"_blank\" href=\""+url+"\">"+url+"</a>";

            })
      }, 200);

      return ret;
  
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

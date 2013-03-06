(function() {
  var OperationView,
    __hasProp = {}.hasOwnProperty,
    __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

  OperationView = (function(_super) {

    __extends(OperationView, _super);

    function OperationView() {
      return OperationView.__super__.constructor.apply(this, arguments);
    }

    OperationView.prototype.events = {
      'submit .sandbox': 'submitOperation',
      'click .submit': 'submitOperation',
      'click .response_hider': 'hideResponse',
      'click .toggleOperation': 'toggleOperationContent'
    };

    OperationView.prototype.initialize = function() {};

    OperationView.prototype.render = function() {
      var contentTypeModel, contentTypeView, isMethodSubmissionSupported, param, responseSignatureView, signatureModel, statusCode, _i, _j, _len, _len1, _ref, _ref1;
      isMethodSubmissionSupported = jQuery.inArray(this.model.httpMethod, this.model.supportedSubmitMethods()) >= 0;
      if (!isMethodSubmissionSupported) {
        this.model.isReadOnly = true;
      }
      $(this.el).html(Handlebars.templates.operation(this.model));
      if (this.model.responseClassSignature && this.model.responseClassSignature !== 'string') {
        signatureModel = {
          sampleJSON: this.model.responseSampleJSON,
          isParam: false,
          signature: this.model.responseClassSignature
        };
        responseSignatureView = new SignatureView({
          model: signatureModel,
          tagName: 'div'
        });
        $('.model-signature', $(this.el)).append(responseSignatureView.render().el);
      } else {
        $('.model-signature', $(this.el)).html(this.model.responseClass);
      }
      contentTypeModel = {
        isParam: false
      };
      if (this.model.supportedContentTypes) {
        contentTypeModel.produces = this.model.supportedContentTypes;
      }
      if (this.model.produces) {
        contentTypeModel.produces = this.model.produces;
      }
      contentTypeView = new ContentTypeView({
        model: contentTypeModel
      });
      $('.content-type', $(this.el)).append(contentTypeView.render().el);
      _ref = this.model.parameters;
      for (_i = 0, _len = _ref.length; _i < _len; _i++) {
        param = _ref[_i];
        this.addParameter(param);
      }
      _ref1 = this.model.errorResponses;
      for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
        statusCode = _ref1[_j];
        this.addStatusCode(statusCode);
      }
      return this;
    };

    OperationView.prototype.addParameter = function(param) {
      var paramView;
      paramView = new ParameterView({
        model: param,
        tagName: 'tr',
        readOnly: this.model.isReadOnly
      });
      return $('.operation-params', $(this.el)).append(paramView.render().el);
    };

    OperationView.prototype.addStatusCode = function(statusCode) {
      var statusCodeView;
      statusCodeView = new StatusCodeView({
        model: statusCode,
        tagName: 'tr'
      });
      return $('.operation-status', $(this.el)).append(statusCodeView.render().el);
    };

    OperationView.prototype.submitOperation = function(e) {
      var bodyParam, consumes, error_free, form, headerParams, invocationUrl, isFileUpload, isFormPost, map, o, obj, param, paramContentTypeField, responseContentTypeField, _i, _j, _k, _l, _len, _len1, _len2, _len3, _len4, _m, _ref, _ref1, _ref2, _ref3, _ref4,
        _this = this;
      if (e != null) {
        e.preventDefault();
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
        _ref = form.serializeArray();
        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
          o = _ref[_i];
          if ((o.value != null) && jQuery.trim(o.value).length > 0) {
            map[o.name] = o.value;
          }
        }
        isFileUpload = form.children().find('input[type~="file"]').size() !== 0;
        isFormPost = false;
        consumes = "application/json";
        if (this.model.consumes && this.model.consumes.length > 0) {
          consumes = this.model.consumes[0];
        } else {
          _ref1 = this.model.parameters;
          for (_j = 0, _len1 = _ref1.length; _j < _len1; _j++) {
            o = _ref1[_j];
            if (o.paramType === 'form') {
              isFormPost = true;
              consumes = false;
            }
          }
          if (isFileUpload) {
            consumes = false;
          } else if (this.model.httpMethod.toLowerCase() === "post" && isFormPost === false) {
            consumes = "application/json";
          }
        }
        if (isFileUpload) {
          bodyParam = new FormData();
          _ref2 = this.model.parameters;
          for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
            param = _ref2[_k];
            if (param.paramType === 'body' && param.name !== 'file') {
              bodyParam.append(param.name, map[param.name]);
            }
          }
          $.each(form.children().find('input[type~="file"]'), function(i, el) {
            return bodyParam.append($(el).attr('name'), el.files[0]);
          });
          console.log(bodyParam);
        } else if (isFormPost) {
          bodyParam = new FormData();
          _ref3 = this.model.parameters;
          for (_l = 0, _len3 = _ref3.length; _l < _len3; _l++) {
            param = _ref3[_l];
            if (map[param.name]) {
              bodyParam.append(param.name, map[param.name]);
            }
          }
        } else {
          bodyParam = null;
          _ref4 = this.model.parameters;
          for (_m = 0, _len4 = _ref4.length; _m < _len4; _m++) {
            param = _ref4[_m];
            if (param.paramType === 'body') {
              bodyParam = map[param.name];
            }
          }
        }
        log("bodyParam = " + bodyParam);
        headerParams = null;
        invocationUrl = this.model.supportHeaderParams() ? (headerParams = this.model.getHeaderParams(map), this.model.urlify(map, false)) : this.model.urlify(map, true);
        log('submitting ' + invocationUrl);
        $(".request_url", $(this.el)).html("<pre>" + invocationUrl + "</pre>");
        $(".response_throbber", $(this.el)).show();
        obj = {
          type: this.model.httpMethod,
          url: invocationUrl,
          headers: headerParams,
          data: bodyParam,
          contentType: consumes,
          dataType: 'json',
          processData: false,
          error: function(xhr, textStatus, error) {
            return _this.showErrorStatus(xhr, textStatus, error);
          },
          success: function(data) {
            return _this.showResponse(data);
          },
          complete: function(data) {
            return _this.showCompleteStatus(data);
          }
        };
        paramContentTypeField = $("td select[name=contentType]", $(this.el)).val();
        if (paramContentTypeField) {
          obj.contentType = paramContentTypeField;
        }
        responseContentTypeField = $('.content > .content-type > div > select[name=contentType]', $(this.el)).val();
        if (responseContentTypeField) {
          obj.headers = obj.headers != null ? obj.headers : {};
          obj.headers.accept = responseContentTypeField;
        }
        jQuery.ajax(obj);
        return false;
      }
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

    OperationView.prototype.showErrorStatus = function(data) {
      return this.showStatus(data);
    };

    OperationView.prototype.showCompleteStatus = function(data) {
      return this.showStatus(data);
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

    OperationView.prototype.showStatus = function(data) {
      var code, pre, response_body;
      try {
        code = $('<code />').text(JSON.stringify(JSON.parse(data.responseText), null, 2));
        pre = $('<pre class="json" />').append(code);
      } catch (error) {
        code = $('<code />').text(this.formatXml(data.responseText));
        pre = $('<pre class="xml" />').append(code);
      }
      response_body = pre;
      $(".response_code", $(this.el)).html("<pre>" + data.status + "</pre>");
      $(".response_body", $(this.el)).html(response_body);
      $(".response_headers", $(this.el)).html("<pre>" + data.getAllResponseHeaders() + "</pre>");
      $(".response", $(this.el)).slideDown();
      $(".response_hider", $(this.el)).show();
      $(".response_throbber", $(this.el)).hide();
      return hljs.highlightBlock($('.response_body', $(this.el))[0]);
    };

    OperationView.prototype.toggleOperationContent = function() {
      var elem;
      elem = $('#' + Docs.escapeResourceName(this.model.resourceName) + "_" + this.model.nickname + "_" + this.model.httpMethod + "_" + this.model.number + "_content");
      if (elem.is(':visible')) {
        return Docs.collapseOperation(elem);
      } else {
        return Docs.expandOperation(elem);
      }
    };

    return OperationView;

  })(Backbone.View);

}).call(this);

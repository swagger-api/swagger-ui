'use strict';

SwaggerUi.Views.MainView = Backbone.View.extend({

  events: {
    'click .mobile-nav, [data-navigator]': 'clickSidebarNav',
    'click [data-resource]': 'clickResource',
    'click [data-tg-switch]': 'toggleToken',
    'click [data-close]': 'closeToken',
    'click #explore' : 'showCustom'
  },

  apisSorter: {
    alpha: function (a, b) {
      return a.name.localeCompare(b.name);
    }
  },
  operationsSorters: {
    alpha: function (a, b) {
      return a.path.localeCompare(b.path);
    },
    method: function (a, b) {
      return a.method.localeCompare(b.method);
    }
  },
  initialize: function (opts) {
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

    if (this.model.swaggerVersion === '2.0') {
      if ('validatorUrl' in opts.swaggerOptions) {

        // Validator URL specified explicitly
        this.model.validatorUrl = opts.swaggerOptions.validatorUrl;

      } else if (this.model.url.indexOf('localhost') > 0) {

        // Localhost override
        this.model.validatorUrl = null;

      } else {

        // Default validator
        this.model.validatorUrl = window.location.protocol + '//online.swagger.io/validator';
      }
    }
  },

  render: function () {
    if (this.model.securityDefinitions) {
      for (var name in this.model.securityDefinitions) {
        var auth = this.model.securityDefinitions[name];
        var button;

        if (auth.type === 'apiKey' && $('#apikey_button').length === 0) {
          button = new SwaggerUi.Views.ApiKeyButton({model: auth, router: this.router}).render().el;
          $('.auth_main_container').append(button);
        }

        if (auth.type === 'basicAuth' && $('#basic_auth_button').length === 0) {
          button = new SwaggerUi.Views.BasicAuthButton({model: auth, router: this.router}).render().el;
          $('.auth_main_container').append(button);
        }
      }
    }

    // Render the outer container for resources
    $(this.el).html(Handlebars.templates.main(this.model));

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
      resource.nmbr = i;

      this.addResource(resource, this.model.auths);
      this.addSidebarHeader(resource, i);
    }

    $('.propWrap').hover(function onHover() {
      $('.optionsWrapper', $(this)).show();
    }, function offhover() {
      $('.optionsWrapper', $(this)).hide();
    });

    if (window.location.hash.length === 0 ) {
      var n = $(this.el).find("#resources_nav [data-resource]").first();
      n.trigger("click");
      $(window).scrollTop(0)
    }

    return this;
  },

  addResource: function (resource, auths) {
    // Render a resource and add it to resources li
    resource.id = resource.id.replace(/\s/g, '_');
    var resourceView = new SwaggerUi.Views.ResourceView({
      model: resource,
      router: this.router,
      tagName: 'li',
      id: 'resource_' + resource.id,
      className: 'resource',
      auths: auths,
      swaggerOptions: this.options.swaggerOptions
    });
    $('#resources').append(resourceView.render().el);
  },

  addSidebarToken: function (resource, i) {
    resource.id = resource.id.replace(/\s/g, '_');
    var sidebarView = new SwaggerUi.Views.SidebarHeaderView({
      model: resource,
      tagName: 'div',
      className: function () {
        return i == 0 ? 'active' : ''
      },
      attributes: {
        "data-resource": 'resource_' + resource.name,
        "label": resource.name
      },
      router: this.router,
      swaggerOptions: this.options.swaggerOptions
    });
    $('#token-generator', $(this.el)).append(sidebarView.render().el);
  },


  addSidebarHeader: function (resource, i) {
    resource.id = resource.id.replace(/\s/g, '_');
    var sidebarView = new SwaggerUi.Views.SidebarHeaderView({
      model: resource,
      tagName: 'div',
      className: function () {
        return i == 0 ? 'active' : ''
      },
      attributes: {
        "data-resource": 'resource_' + resource.name,
        "label": resource.name
      },
      router: this.router,
      swaggerOptions: this.options.swaggerOptions
    });
    $('#resources_nav', $(this.el)).append(sidebarView.render().el);
  },

  clear: function () {
    $(this.el).html('');
  },

  clickSidebarNav: function (e) {
    $('.sticky-nav').toggleClass("nav-open")
  },

  clickResource: function (e) {
    if (!$(e.target).is(".item")) {
      var n = $(e.target).find(".item").first();
      $('.sticky-nav').find("[data-resource].active").removeClass("active");
      $(e.target).find("[data-resource]").first().addClass("active");
      n.trigger("click")
    }
  },

  toggleToken: function (e) {
    var t = $(".token-generator"),
      tg = $("[data-tg-switch]");

    t.toggleClass("hide");
    t.hasClass("hide") ? tg.removeClass("active") : tg.addClass("active");
    t.parents(".sticky-nav").trigger("mobile_nav:update")
  },

  closeToken: function (e) {
    var t = $(".token-generator"),
      tg = $("[data-tg-switch]");

    t.addClass("hide");
    tg.removeClass("active");
    t.parents(".sticky-nav").trigger("mobile_nav:update")
  },

  openToken: function (e) {
    var t = $(".token-generator"),
      tg = $("[data-tg-switch]");

    t.removeClass("hide");
    tg.removeClass("active");
    t.parents(".sticky-nav").trigger("mobile_nav:update")
  },

  showCustom: function(e){
    if (e) {
      e.preventDefault();
    }
    this.trigger('update-swagger-ui', {
      url: $('#input_baseUrl').val(),
      apiKey: $('#input_apiKey').val()
    });
  }
});

'use strict';

SwaggerUi.Views.SidebarHeaderView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  events: {
    'click [data-resource]' : 'clickResource'
  },
  render: function () {
    $(this.el).html(Handlebars.templates.sidebar_header(this.model));

    for (var i = 0; i < this.model.operationsArray.length; i++) {
      var item = this.model.operationsArray[i].operation;
      item.nickname = this.model.operationsArray[i].nickname;
      item.parentId = this.model.operation.parentId;
      this.addSidebarItem(item);
    }

    return this;
  },

  addSidebarItem: function (item) {
    var sidebarItemView = new SwaggerUi.Views.SidebarItemView({
      model: item,
      router: this.router,
      swaggerOptions: this.options.swaggerOptions
    });
    $('.resource_navitems', $(this.el)).append(sidebarItemView.render().el);
  },

  clickResource: function(e) {
    if (!$(e.target).is(".item")) {
      var n = $(this.el).find(".item").first();
      $('.sticky-nav').find("[data-resource].active").removeClass("active");
      $(this.el).find("[data-resource]").first().addClass("active");
      n.trigger("click")
    }
  }
});
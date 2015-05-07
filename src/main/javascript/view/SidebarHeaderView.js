'use strict';

SwaggerUi.Views.SidebarHeaderView = Backbone.View.extend({
  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function(){
    console.log('item model', this.model.operationsArray[0]);
    $(this.el).html(Handlebars.templates.sidebar_header(this.model));


    for (var i = 0; i < this.model.operationsArray.length; i++) {
      var item = this.model.operationsArray[i].operation;
      this.addSidebarItem(item);
    }

    return this;
  },

  addSidebarItem: function(item){
    var sidebarItemView = new SwaggerUi.Views.SidebarItemView({
      model: item,
      router: this.router,
      swaggerOptions: this.options.swaggerOptions
    });
    console.log('model: ', item);
    $('.resource_navitems', $(this.el)).append(sidebarItemView.render().el);
  }
});
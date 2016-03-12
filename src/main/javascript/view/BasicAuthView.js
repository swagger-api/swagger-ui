'use strict';

SwaggerUi.Views.BasicAuthView = Backbone.View.extend({

    initialize: function (opts) {
        this.options = opts || {};
        this.router = this.options.router;
    },

    events: {
        'change .auth_input': 'inputChange'
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

        this.model.set(attr, val);
    },

    isValid: function () {
        return this.model.validate();
    }

});
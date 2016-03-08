'use strict';

SwaggerUi.Views.Oauth2View = Backbone.View.extend({
    events: {
        'change .oauth-scope': 'scopeChange'
    },

    template: Handlebars.templates.oauth2,

    render: function () {
        $(this.el).html(this.template(this.model.toJSON()));

        return this;
    },

    scopeChange: function () {

    }
});
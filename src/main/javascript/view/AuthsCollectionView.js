'use strict';

SwaggerUi.Views.AuthsCollectionView = Backbone.View.extend({

    initialize: function(opts) {
        this.options = opts || {};
        this.options.data = this.options.data || {};
        this.router = this.options.router;

        this.collection = new SwaggerUi.Collections.AuthsCollection(opts.data);

        this.$innerEl = $('<div>');
    },

    render: function () {
        this.collection.each(function (auth) {
            this.renderOneAuth(auth);
        }, this);

        this.$el.html(this.$innerEl.html() ? this.$innerEl : '');

        return this;
    },

    renderOneAuth: function (authModel) {
        var authEl, authView;
        var type = authModel.get('type');

        if (type === 'apiKey') {
            authView = 'ApiKeyAuthView';
        } else if (type === 'basic' && this.$innerEl.find('.basic_auth_container').length === 0) {
            authView = 'BasicAuthView';
        } else if (type === 'oauth2') {
            authView = 'Oauth2View';
        }

        if (authView) {
            authEl = new SwaggerUi.Views[authView]({model: authModel, router: this.router}).render().el;
        }

        this.$innerEl.append(authEl);
    }

});

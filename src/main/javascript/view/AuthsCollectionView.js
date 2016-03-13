'use strict';

SwaggerUi.Views.AuthsCollectionView = Backbone.View.extend({

    initialize: function(opts) {
        this.options = opts || {};
        this.options.data = this.options.data || {};
        this.router = this.options.router;

        this.collection = new SwaggerUi.Collections.AuthsCollection();
        this.collection.add(this.parseData(opts.data));

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
        var authEl;
        var type = authModel.get('type');

        //todo refactor move view name into var and call new with it.
        if (type === 'apiKey') {
            authEl = new SwaggerUi.Views.ApiKeyAuthView({model: authModel, router: this.router}).render().el;
        } else if (type === 'basic' && this.$innerEl.find('.basic_auth_container').length === 0) {
            authEl = new SwaggerUi.Views.BasicAuthView({model: authModel, router: this.router}).render().el;
        } else if (type === 'oauth2') {
            authEl = new SwaggerUi.Views.Oauth2View({model: authModel, router: this.router}).render().el;
        }

        this.$innerEl.append(authEl);
    },

    //todo move into collection
    parseData: function (data) {
        var authz = Object.assign({}, window.swaggerUi.api.clientAuthorizations.authz);

        return _.map(data, function (auth, name) {
            var isBasic = authz.basic && auth.type === 'basic';

            _.extend(auth, {
                title: name
            });

            if (authz[name] || isBasic) {
                _.extend(auth, {
                    isLogout: true,
                    value: isBasic ? undefined : authz[name].value,
                    username: isBasic ? authz.basic.username : undefined,
                    password: isBasic ? authz.basic.password : undefined,
                    valid: true
                });
            }

            return auth;
        });
    }

});

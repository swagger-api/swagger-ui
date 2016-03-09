'use strict';

SwaggerUi.Collections.AuthsCollection = Backbone.Collection.extend({
    add: function (model) {
        var args = Array.prototype.slice.call(arguments);

        if (Array.isArray(model)) {
            args[0] = _.map(model, function(val) {
                return this.handleOne(val);
            }, this);
        } else {
            args[0] = this.handleOne(model);
        }

        Backbone.Collection.prototype.add.apply(this, args);
    },

    handleOne: function (model) {
        var result = model;

        if (! (model instanceof Backbone.Model) ) {
            switch (model.type) {
                case 'oauth2':
                    result = new SwaggerUi.Models.Oauth2Model(model);
                    break;
                default:
                    result = new Backbone.Model(model);
            }
        }

        return result;
    },

    isValid: function () {
        return this.length === this.where({ valid: true }).length;
    },

    isAuthorized: function () {
        return this.length === this.where({ isLogout: true }).length;
    }
});
'use strict';

SwaggerUi.Models.Oauth2Model = Backbone.Model.extend({
    defaults: {
        scopes: {}
    },

    initialize: function () {
        this.on('change', this.validate);
    },

    setScopes: function (name, val) {
        var auth = _.extend({}, this.attributes);
        var index = _.findIndex(auth.scopes, function(o) {
            return o.scope === name;
        });
        auth.scopes[index].checked = val;

        this.set(auth);
    },

    validate: function () {
        var valid =  _.findIndex(this.get('scopes'), function (o) {
           return o.checked === true;
        }) > -1;

        this.set('valid', valid);

        return valid;
    }
});
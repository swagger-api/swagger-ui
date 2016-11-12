'use strict';

SwaggerUi.Models.Oauth2Model = Backbone.Model.extend({
    defaults: {
        scopes: {},
        isPasswordFlow: false,
        clientAuthenticationType: 'none'
    },

    initialize: function () {
        if(this.attributes && this.attributes.scopes) {
            var attributes = _.cloneDeep(this.attributes);
            var i, scopes = [];
            for(i in attributes.scopes) {
                var scope = attributes.scopes[i];
                if(typeof scope.description === 'string') {
                    scopes[scope] = attributes.scopes[i];
                    scopes.push(attributes.scopes[i]);
                }
            }
            attributes.scopes = scopes;
            this.attributes = attributes;
        }

        if (this.attributes && this.attributes.flow) {
            var flow = this.attributes.flow;
            this.set('isPasswordFlow', flow === 'password');
            this.set('requireClientAuthentication', flow === 'application');
            this.set('clientAuthentication', flow === 'password' || flow === 'application');
        }
        this.on('change', this.validate);
    },

    setScopes: function (name, val) {
        var auth = _.extend({}, this.attributes);
        var index = _.findIndex(auth.scopes, function(o) {
            return o.scope === name;
        });
        auth.scopes[index].checked = val;

        this.set(auth);
        this.validate();
    },

    validate: function () {
      var valid = false;
      if (this.get('isPasswordFlow') &&
          (!this.get('username'))) {
          return false;
      }

      if (this.get('clientAuthenticationType') in ['basic', 'request-body'] &&
          (!this.get('clientId'))) {
          return false;
      }

      var scp = this.get('scopes');
      var idx =  _.findIndex(scp, function (o) {
         return o.checked === true;
      });

      if(scp.length > 0 && idx >= 0) {
          valid = true;
      }

      if(scp.length === 0) {
          valid = true;
      }

      this.set('valid', valid);

      return valid;
    }
});

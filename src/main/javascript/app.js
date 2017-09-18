(function() {
    'use strict';

    //TMS IDD url
    var _tmsUrl = 'proxy/tms.platformdev.intapp.com/tms/idd/v1/platform';
    var _keycloakTenantIdDefault = 'intapp';
    var _keycloakClientIdDefault = 'ADMIN-UI';

    window.SwaggerApp = function() {
        hljs.configure({ highlightSizeThreshold: 5000 });

        //get tenant configuration
        $.get(_tmsUrl + '/alias/' + getTenantFromUrl()).then(function(configuration) {
            var keycloak = window.KC = new window.Keycloak({ url: configuration.auth_url, realm: configuration.name, clientId: _keycloakClientIdDefault });

            keycloak.init({ onLoad: 'login-required' }).success(function(authenticated) {
                authenticated && Backbone.history.start(new window.SwaggerUiRouter({app: this}));
            });
        });
    };

    //Check to see if the window is top if not then display button
    $(window).scroll(function(){
        if ($(this).scrollTop() > 100) {
            $('.scrollToTop').fadeIn();
        } else {
            $('.scrollToTop').fadeOut();
        }
    });

    //Click event to scroll to top
    $('.scrollToTop').click(function(){
        $('html, body').animate({scrollTop : 0},800);
        return false;
    });

    //get tenant configuration
    function getTenantConfiguration() {
        $.get(_tmsUrl + '/alias/' + getTenantFromUrl());
    }

    function getTenantFromUrl() {
        var urlParts = window.location.href.replace('https://', '').replace('http://', '').replace('localhost:4200', _keycloakTenantIdDefault).split('.');
        return (urlParts.length > 1) ? urlParts[0] : _keycloakTenantIdDefault;
    }
})();
(function() {
    'use strict';

    window.SwaggerApp = function() {
        hljs.configure({
            highlightSizeThreshold: 5000
        });

        //set main open URL
        /*global Intapp */
        if((typeof window.Intapp !== 'undefined' && window.Intapp.Config.Url)) {
            $('#main-app').attr('href', Intapp.Config.Url);
        } else {
            $('#main-app').attr('href', location.href.replace('/api/swagger', ''));
        }
        //start history
        Backbone.history.start(new window.SwaggerUiRouter({app: this, configs: window.SWAGGER_URLS}));

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
})();
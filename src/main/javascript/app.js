(function() {
    'use strict';

    window.SwaggerApp = function() {
        hljs.configure({
            highlightSizeThreshold: 5000
        });

        Backbone.history.start(new window.SwaggerUiRouter({app: this}));
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
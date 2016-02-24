'use strict';

SwaggerUi.Views.PopupView = Backbone.View.extend({
    events: {
        'click .api-popup-cancel': 'cancelClick'
    },

    template: Handlebars.templates.popup,
    className: 'api-popup-dialog',

    selectors: {
        content: '.api-popup-content',
        main   : '#swagger-ui-container'
    },

    initialize: function(){},

    render: function () {
        var $win, dw, dh, st, dlgWd, dlgHt, top, left;
        $win = $(window);
        dw = $win.width();
        dh = $win.height();
        st = $win.scrollTop();
        this.$el.html(this.template(this.model));
        this.$(this.selectors.content).append(this.model.content);
        $(this.selectors.main).first().append(this.el);
        dlgWd = this.$el.outerWidth();
        dlgHt = this.$el.outerHeight();
        top = (dh -dlgHt)/2 + st;

        left = (dw - dlgWd)/2;

        this.$el.css({
            top: (top < 0? 0 : top) + 'px',
            left: (left < 0? 0 : left) + 'px'
        });
        this.showPopup();

        return this;
    },

    showPopup: function () {
        this.$el.show();
    },

    cancelClick: function () {
        this.remove();
    }

});

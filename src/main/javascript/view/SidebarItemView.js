'use strict';

SwaggerUi.Views.SidebarItemView = Backbone.View.extend({
  events: {
    'click [data-endpoint]': 'clickSidebarItem'
  },

  initialize: function (opts) {
    this.options = opts || {};
    this.router = this.options.router;
  },

  render: function () {
    $(this.el).html(Handlebars.templates.sidebar_item(this.model));
    return this;
  },

  clickSidebarItem: function (e) {
    var elem = $(e.target);
    var eln = $("#" + elem.attr("data-endpoint"));

    if (elem.is(".item")) {
      scroll(elem.attr("data-endpoint"));
      setSelected(elem);
      updateUrl(eln.find(".path a").first().attr("href"))
    }

    /* scroll */
    function scroll(e) {
      var i = $(".sticky-nav").outerHeight();
      var r = $("#" + e).offset().top - i - 10;
      matchMedia() && (r = $("#" + e).offset().top - 10);
      scrollT(r)
    }

    /set selected value and select operation (class) */
    function setSelected(element) {
      {
        var nav = $(".sticky-nav [data-navigator]");
        $("#" + element.attr("data-endpoint"))
      }
      nav.find("[data-resource]").removeClass("active");
      nav.find("[data-selected]").removeAttr("data-selected");
      element.closest("[data-resource]").addClass("active");
      element.attr("data-selected", "");
      $(".sticky-nav").find("[data-selected-value]").html(element.text())
    }

    /* update navigation */
    function updateUrl(element) {
      history.pushState && history.pushState(null, null, element)
    }

    function matchMedia() {
      return window.matchMedia("(min-width: 992px)").matches
    }

    function scrollT(e) {
      if ("self" === e) {
        var n = $(window).scrollTop();
        return $(window).scrollTop(n)
      }
      return $(window).scrollTop(e)
    }

  }

});
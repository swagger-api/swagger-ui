'use strict';


$(function () {

  // Helper function for vertically aligning DOM elements
  // http://www.seodenver.com/simple-vertical-align-plugin-for-jquery/
  $.fn.vAlign = function () {
    return this.each(function () {
      var ah = $(this).height();
      var ph = $(this).parent().height();
      var mh = (ph - ah) / 2;
      $(this).css('margin-top', mh);
    });
  };

  $.fn.stretchFormtasticInputWidthToParent = function () {
    return this.each(function () {
      var p_width = $(this).closest("form").innerWidth();
      var p_padding = parseInt($(this).closest("form").css('padding-left'), 10) + parseInt($(this).closest('form').css('padding-right'), 10);
      var this_padding = parseInt($(this).css('padding-left'), 10) + parseInt($(this).css('padding-right'), 10);
      $(this).css('width', p_width - p_padding - this_padding);
    });
  };

  $('form.formtastic li.string input, form.formtastic textarea').stretchFormtasticInputWidthToParent();

  // Vertically center these paragraphs
  // Parent may need a min-height for this to work..
  $('ul.downplayed li div.content p').vAlign();

  // When a sandbox form is submitted..
  $("form.sandbox").submit(function () {

    var error_free = true;

    // Cycle through the forms required inputs
    $(this).find("input.required").each(function () {

      // Remove any existing error styles from the input
      $(this).removeClass('error');

      // Tack the error style on if the input is empty..
      if ($(this).val() === '') {
        $(this).addClass('error');
        $(this).wiggle();
        error_free = false;
      }

    });

    return error_free;
  });

});

function clippyCopiedCallback() {
  $('#api_key_copied').fadeIn().delay(1000).fadeOut();

  // var b = $("#clippy_tooltip_" + a);
  // b.length != 0 && (b.attr("title", "copied!").trigger("tipsy.reload"), setTimeout(function() {
  //   b.attr("title", "copy to clipboard")
  // },
  // 500))
}

// Logging function that accounts for browsers that don't have window.console
function log() {
  log.history = log.history || [];
  log.history.push(arguments);
  if (this.console) {
    console.log(Array.prototype.slice.call(arguments)[0]);
  }
}

// Handle browsers that do console incorrectly (IE9 and below, see http://stackoverflow.com/a/5539378/7913)
if (Function.prototype.bind && console && typeof console.log === "object") {
  [
    "log", "info", "warn", "error", "assert", "dir", "clear", "profile", "profileEnd"
  ].forEach(function (method) {
      console[method] = this.bind(console[method], console);
    }, Function.prototype.call);
}

window.Docs = {

  shebang: function () {

    // If shebang has an operation nickname in it..
    // e.g. /docs/#!/words/get_search
    var fragments = $.param.fragment().split('/');
    fragments.shift(); // get rid of the bang

    switch (fragments.length) {
      case 1:
        break;
      case 2:
        var target = '#resources_nav [data-resource] [data-endpoint=' + fragments[0] + '_' + fragments[1] + ']',
          n = $('#swagger_sidebar').find(target),
          attr = n.attr('data-selected');

        if (typeof attr == typeof undefined) {
          n.trigger("click");
        }
        break;
    }

  }

};

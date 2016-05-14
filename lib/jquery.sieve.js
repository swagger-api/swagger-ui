/*!
 * jQuery Sieve v0.3.0 (2013-04-04)
 * http://rmm5t.github.io/jquery-sieve/
 * Copyright (c) 2013 Ryan McGeary; Licensed MIT
 */
(function() {
  var $;

  $ = jQuery;

  $.fn.sieve = function(options) {
    var compact;
    compact = function(array) {
      var item, _i, _len, _results;
      _results = [];
      for (_i = 0, _len = array.length; _i < _len; _i++) {
        item = array[_i];
        if (item) {
          _results.push(item);
        }
      }
      return _results;
    };
    return this.each(function() {
      var container, searchBar, settings;
      container = $(this);
      settings = $.extend({
        searchInput: null,
        searchTemplate: "<div style='float:right'><label>Search: <input type='text'></label></div>",
        itemSelector: "tbody tr",
        textSelector: null,
        toggle: function(item, match) {
          return item.toggle(match);
        },
        complete: function() {}
      }, options);
      if (!settings.searchInput) {
        searchBar = $(settings.searchTemplate);
        settings.searchInput = searchBar.find("input");
        container.before(searchBar);
      }
      return settings.searchInput.on("keyup.sieve change.sieve", function() {
        var items, query;
        query = compact($(this).val().toLowerCase().split(/\s+/));
        items = container.find(settings.itemSelector);
        items.each(function() {
          var cells, item, match, q, text, _i, _len;
          item = $(this);
          if (settings.textSelector) {
            cells = item.find(settings.textSelector);
            text = cells.text().toLowerCase();
          } else {
            text = item.text().toLowerCase();
          }
          match = true;
          for (_i = 0, _len = query.length; _i < _len; _i++) {
            q = query[_i];
            match && (match = text.indexOf(q) >= 0);
          }
          return settings.toggle(item, match);
        });
        return settings.complete();
      });
    });
  };

}).call(this);
setTimeout(function(){
    var mylist = $('#resources');
    var listitems = mylist.children('li').get();
    listitems.sort(function(a, b) {
        return $(a).attr('id').toUpperCase().localeCompare($(b).attr('id').toUpperCase());
    })
    $.each(listitems, function(idx, itm) { mylist.append(itm); });
}, 1000);
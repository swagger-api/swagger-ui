'use strict';

Handlebars.registerHelper('sanitize', function(html) {
    // Strip the script tags from the html, and return it as a Handlebars.SafeString
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('renderTextParam', function(param) {
    var result;
    var isArray = param.type.toLowerCase() === 'array' || param.allowMultiple;
    var defaultValue = isArray && Array.isArray(param.default) ? param.default.join('\n') : param.default;

    if (typeof defaultValue === 'undefined') {
        defaultValue = '';
    }

    if(isArray) {
        result = "<textarea class='body-textarea" + (param.required ? " required" : "") + "' name='" + param.name + "'"
            + " placeholder='Provide multiple values in new lines" + (param.required ? " (at least one required)." : ".") + "'>"
            + defaultValue + "</textarea>";
    } else {
        result = "<input class='parameter'" + (param.required ? " class='required'" : "") + " minlength='" + (param.required ? 1 : 0)
            + "' name='" + param.name +"' placeholder='" + (param.required ? "(required)" : "") + "'"
            + " type='text' value='" + defaultValue + "'/>";
    }
    return new Handlebars.SafeString(result);
});
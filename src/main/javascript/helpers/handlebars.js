'use strict';

Handlebars.registerHelper('sanitize', function(html) {
    // Strip the script tags from the html, and return it as a Handlebars.SafeString
    html = html.replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '');
    return new Handlebars.SafeString(html);
});

Handlebars.registerHelper('renderTextParam', function(param) {
    var result, type = 'text';
    var isArray = param.type.toLowerCase() === 'array' || param.allowMultiple;
    var defaultValue = isArray && Array.isArray(param.default) ? param.default.join('\n') : param.default;

    if (typeof defaultValue === 'undefined') {
        defaultValue = '';
    }

    if(param.format && param.format === 'password') {
      type = 'password';
    }

    if(isArray) {
        result = '<textarea class=\'body-textarea' + (param.required ? ' required' : '') + '\' name=\'' + param.name + '\'';
        result += ' placeholder=\'Provide multiple values in new lines' + (param.required ? ' (at least one required).' : '.') + '\'>';
        result += defaultValue + '</textarea>';
    } else {
        var parameterClass = 'parameter';
        if(param.required) {
          parameterClass += ' required';
        }
        result = '<input class=\'' + parameterClass + '\' minlength=\'' + (param.required ? 1 : 0) + '\'';
        result += ' name=\'' + param.name +'\' placeholder=\'' + (param.required ? '(required)' : '') + '\'';
        result += ' type=\'' + type + '\' value=\'' + defaultValue + '\'/>';
    }
    return new Handlebars.SafeString(result);
});
Handlebars.registerHelper('debug', function(optionalValue) {
  console.log('Current Context');
  console.log('====================');
  console.log(this);
 
  if (optionalValue) {
    console.log('Value');
    console.log('====================');
    console.log(optionalValue);
  }
});

Handlebars.registerHelper('get_unique_id', function(){
    return Handlebars.unique_id;
});

Handlebars.registerHelper('new_unique_id', function(){
    if (!Handlebars.unique_id){
        Handlebars.unique_id = 0;
    }
    Handlebars.unique_id++;
    return Handlebars.unique_id;
});
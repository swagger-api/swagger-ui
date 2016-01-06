var appName;
var popupMask;
var popupDialog;
var clientId;
var realm;
var redirect_uri;
var state;
var clientSecret;
var scopeSeparator;
var additionalQueryStringParams;

function handleLogin() {
  var scopes = [];

  var auths = window.swaggerUi.api.authSchemes || window.swaggerUi.api.securityDefinitions,
      passwordFlow = false;

  if(auths) {
    var key;
    var defs = auths;
    for(key in defs) {
      var auth = defs[key];
      if(auth.type === 'oauth2') {
        passwordFlow = auth.flow === 'password';

        if (auth.scopes) {
          var scope;
          if(Array.isArray(auth.scopes)) {
            // 1.2 support
            var i;
            for(i = 0; i < auth.scopes.length; i++) {
              scope = auth.scopes[i];
              scope.OAuthSchemeKey = key;
              scopes.push(scope);
            }
          }
          else {
            // 2.0 support
            for(scope in auth.scopes) {
              scopes.push({scope: scope, description: auth.scopes[scope], OAuthSchemeKey: key});
            }
          }
        }
      }
    }
  }

  if(window.swaggerUi.api
    && window.swaggerUi.api.info) {
    appName = window.swaggerUi.api.info.title;
  }

  $('.api-popup-dialog').remove();

  popupDialog = ['<div class="api-popup-dialog">'];

  if (passwordFlow === true) {
    popupDialog = popupDialog.concat([
      '<fieldset>',
        '<legend class="api-popup-title">Password Auth</legend>',
        '<div><label for="username">Username:</label> <input type="text" name="username" id="username"></div>',
        '<div><label for="password">Password:</label> <input type="password" name="password" id="password"></div>',
      '</fieldset>'
    ]);
  }

  popupDialog = $(popupDialog.concat([
        '<div class="api-popup-title">Select OAuth2.0 Scopes</div>',
        '<div class="api-popup-content">',
          '<p>',
            'Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes. ',
            '<a href="#">Learn how to use</a>',
          '</p>',
          '<p>',
            '<strong>' + appName + '</strong> API requires the following scopes. Select which ones you want to grant to Swagger UI.',
          '</p>',
          '<ul class="api-popup-scopes"></ul>',
          '<p class="error-msg"></p>',
          '<div class="api-popup-actions">',
            '<button class="api-popup-authbtn api-button green" type="button">Authorize</button>',
            '<button class="api-popup-cancel api-button gray" type="button">Cancel</button>',
          '</div>',
        '</div>',
        '</div>']).join(''));

  $(document.body).append(popupDialog);

  //TODO: only display applicable scopes (will need to pass them into handleLogin)
  popup = popupDialog.find('ul.api-popup-scopes').empty();
  for (i = 0; i < scopes.length; i ++) {
    scope = scopes[i];
    str = '<li><input type="checkbox" id="scope_' + i + '" scope="' + scope.scope +'" oauthtype="' + scope.OAuthSchemeKey +'"/>' + '<label for="scope_' + i + '">' + scope.scope ;
    if (scope.description) {
      if ($.map(auths, function(n, i) { return i; }).length > 1) //if we have more than one scheme, display schemes
	    str += '<br/><span class="api-scope-desc">' + scope.description + ' ('+ scope.OAuthSchemeKey+')' +'</span>';
	  else
	    str += '<br/><span class="api-scope-desc">' + scope.description + '</span>';
    }
    str += '</label></li>';
    popup.append(str);
  }

  var $win = $(window),
    dw = $win.width(),
    dh = $win.height(),
    st = $win.scrollTop(),
    dlgWd = popupDialog.outerWidth(),
    dlgHt = popupDialog.outerHeight(),
    top = (dh -dlgHt)/2 + st,
    left = (dw - dlgWd)/2;

  popupDialog.css({
    top: (top < 0? 0 : top) + 'px',
    left: (left < 0? 0 : left) + 'px'
  });

  popupDialog.find('button.api-popup-cancel').click(function() {
    popupMask.hide();
    popupDialog.hide();
    popupDialog.empty();
    popupDialog = [];
  });

  $('button.api-popup-authbtn').unbind();
  popupDialog.find('button.api-popup-authbtn').click(function() {
    popupMask.hide();
    popupDialog.hide();

    var authSchemes = window.swaggerUi.api.authSchemes;

    var host = window.location;
    var pathname = location.pathname.substring(0, location.pathname.lastIndexOf("/"));
    var defaultRedirectUrl = host.protocol + '//' + host.host + pathname + '/o2c.html';
    var redirectUrl = window.oAuthRedirectUrl || defaultRedirectUrl;
    var scopes = [];
    var o = popup.find('input:checked');
    var OAuthSchemeKeys = [];
    for(k =0; k < o.length; k++) {
      var scope = $(o[k]).attr('scope');
      if (scopes.indexOf(scope) === -1)
        scopes.push(scope);
      var OAuthSchemeKey = $(o[k]).attr('oauthtype');
      if (OAuthSchemeKeys.indexOf(OAuthSchemeKey) === -1)
        OAuthSchemeKeys.push(OAuthSchemeKey);
    }

    //TODO: merge not replace if scheme is different from any existing
    //(needs to be aware of schemes to do so correctly)
    window.enabledScopes = scopes;

    for (var key in authSchemes) {
      if (authSchemes.hasOwnProperty(key) && OAuthSchemeKeys.indexOf(key) != -1) { //only look at keys that match this scope.
        var dets = authSchemes[key];
        // RFC 6749 recommends to use state for Implicit and AccessCode Flows:
        // state: An opaque value used by the client to maintain state between
        //        the request and callback. The authorization server includes
        //        this value when redirecting the user-agent back to the
        //        client. The parameter SHOULD be used for preventing
        //        cross-site request forgery as described in Section 10.12.
        // We also use the state as a way to pass the authentication name to match it later.
        state = key + '&' + Math.random();

        if (authSchemes[key].type === 'oauth2' && dets.flow) {
          window.swaggerUi.tokenName = dets.tokenName || 'access_token';
          window.swaggerUi.tokenUrl = (dets.flow !== 'implicit' ? dets.tokenUrl : null);

          if (dets.flow === 'implicit' || dets.flow === 'accessCode') {
            var authorizationUrl = dets.authorizationUrl + '?response_type=' + (dets.flow === 'implicit' ? 'token' : 'code');
            handleImplicitOrAccessCodeFlow(authorizationUrl, scopes, redirectUrl, state);
          }
          else if (dets.flow === 'application') {
            handleClientCredentialsFlow(scopes, key);
          }
          else if (dets.flow === 'password') {
            handlePasswordFlow(scopes, key);
          }
        }
        else if(authSchemes[key].grantTypes) {
          // 1.2 support
          var o = authSchemes[key].grantTypes;
          var authorizationUrl;
          for(var t in o) {
            if(o.hasOwnProperty(t) && t === 'implicit') {
              var dets = o[t];
              var ep = dets.loginEndpoint.url;
              authorizationUrl = dets.loginEndpoint.url + '?response_type=token';
              window.swaggerUi.tokenName = dets.tokenName;
            }
            else if (o.hasOwnProperty(t) && t === 'accessCode') {
              var dets = o[t];
              var ep = dets.tokenRequestEndpoint.url;
              authorizationUrl = dets.tokenRequestEndpoint.url + '?response_type=code';
              window.swaggerUi.tokenName = dets.tokenName;
            }
          }
          handleImplicitOrAccessCodeFlow(authorizationUrl, scopes, redirectUrl, state);
        }
      }
    }

  });

  popupMask.show();
  popupDialog.show();
  return;
}

function handleLogout() {
  for(key in window.swaggerUi.api.clientAuthorizations.authz){
    window.swaggerUi.api.clientAuthorizations.remove(key)
  }
  window.enabledScopes = null;
  $('.api-ic.ic-on').addClass('ic-off');
  $('.api-ic.ic-on').removeClass('ic-on');

  // set the info box
  $('.api-ic.ic-warning').addClass('ic-error');
  $('.api-ic.ic-warning').removeClass('ic-warning');
}

function initOAuth(opts) {
  var o = (opts||{});
  var errors = [];

  appName = (o.appName||errors.push('missing appName'));
  popupMask = (o.popupMask||$('#api-common-mask'));
  popupDialog = (o.popupDialog||$('.api-popup-dialog'));
  clientId = (o.clientId||errors.push('missing client id'));
  clientSecret = (o.clientSecret||null);
  realm = (o.realm||errors.push('missing realm'));
  scopeSeparator = (o.scopeSeparator||' ');
  additionalQueryStringParams = (o.additionalQueryStringParams||{});

  if(errors.length > 0){
    log('auth unable initialize oauth: ' + errors);
    return;
  }

  $('pre code').each(function(i, e) {hljs.highlightBlock(e)});
  $('.api-ic').unbind();
  $('.api-ic').click(function(s) {
    if($(s.target).hasClass('ic-off'))
      handleLogin();
    else {
      handleLogout();
    }
    false;
  });
}

function handleImplicitOrAccessCodeFlow(authorizationUrl, scopes, redirectUrl, state) {
  redirect_uri = redirectUrl;
  authorizationUrl += (
    '&redirect_uri=' + encodeURIComponent(redirectUrl) +
    '&realm=' + encodeURIComponent(realm) +
    '&client_id=' + encodeURIComponent(clientId) +
    '&scope=' + encodeURIComponent(scopes.join(scopeSeparator)) +
    '&state=' + encodeURIComponent(state)
  );
  for (var key in additionalQueryStringParams) {
    authorizationUrl += '&' + key + '=' + encodeURIComponent(additionalQueryStringParams[key]);
  }

  window.open(authorizationUrl);
}

function handleClientCredentialsFlow(scopes, OAuthSchemeKey) {
  var params = {
    'grant_type': 'client_credentials',
    'client_id': clientId,
    'client_secret': clientSecret,
    'scope': scopes.join(' ')
  }
  $.ajax(
  {
    url : window.swaggerUi.tokenUrl,
    type: "POST",
    data: params,
    success:function(data, textStatus, jqXHR)
    {
      onOAuthComplete(data, OAuthSchemeKey);
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      onOAuthComplete("");
    }
  });
}

function handlePasswordFlow(scopes, OAuthSchemeKey) {
  var authParams = {
    'grant_type': 'password',
    'client_id': encodeURIComponent(clientId),
    'client_secret': encodeURIComponent(clientSecret),
    'username': $('#username').val(),
    'password': encodeURIComponent($('#password').val()),
    'scope': scopes.join(' ')
  };

  $.ajax({
    url: window.swaggerUi.tokenUrl,
    type: 'POST',
    data: authParams,
    success: function (data) {
      onOAuthComplete(data, OAuthSchemeKey);
    },
    error: function(data) {
      onOAuthComplete("");
    }
  });
}

window.processOAuthCode = function processOAuthCode(data) {
  var OAuthSchemeKey = data.state;
  var params = {
    'grant_type': 'authorization_code',
    'client_id': clientId,
    'code': data.code,
    'redirect_uri': redirect_uri
  };

  if (clientSecret) {
    params.client_secret = clientSecret;
  }

  $.ajax(
  {
    url : window.swaggerUi.tokenUrl,
    type: 'POST',
    data: params,
    success:function(data, textStatus, jqXHR)
    {
      onOAuthComplete(data, OAuthSchemeKey);
    },
    error: function(jqXHR, textStatus, errorThrown)
    {
      onOAuthComplete("");
    }
  });
};

window.onOAuthComplete = function onOAuthComplete(token, OAuthSchemeKey) {
  if (token) {
    if(token.error) {
      var checkbox = $('input[type=checkbox],.secured')
      checkbox.each(function(pos){
        checkbox[pos].checked = false;
      });
      alert(token.error);
    }
    else {
      if (!OAuthSchemeKey) {
          alert(1);
          if (token.state !== state) {
            alert("OAuth2 security error: State is different, possible CSRF attack.");
          }
          // Implicit and AccessCode Flows is expected to pass a
          // 'OAuthSchemeKey&Math.random()' value
          OAuthSchemeKey = token.state.replace(/^(.*)&/, '$1');
      }
      var b = token[window.swaggerUi.tokenName];
      if (b) {
        // if all roles are satisfied
        var o = null;
        $.each($('.auth .api-ic .api_information_panel'), function(k, v) {
          var children = v;
          if(children && children.childNodes) {
            var requiredScopes = [];
            $.each((children.childNodes), function (k1, v1){
              var inner = v1.innerHTML;
              if(inner)
                requiredScopes.push(inner);
            });
            var diff = [];
            for(var i=0; i < requiredScopes.length; i++) {
              var s = requiredScopes[i];
              if(window.enabledScopes && window.enabledScopes.indexOf(s) == -1) {
                diff.push(s);
              }
            }
            if(diff.length > 0){
              o = v.parentNode.parentNode;
              $(o.parentNode).find('.api-ic.ic-on').addClass('ic-off');
              $(o.parentNode).find('.api-ic.ic-on').removeClass('ic-on');

              // sorry, not all scopes are satisfied
              $(o).find('.api-ic').addClass('ic-warning');
              $(o).find('.api-ic').removeClass('ic-error');
            }
            else {
              o = v.parentNode.parentNode;
              $(o.parentNode).find('.api-ic.ic-off').addClass('ic-on');
              $(o.parentNode).find('.api-ic.ic-off').removeClass('ic-off');

              // all scopes are satisfied
              $(o).find('.api-ic').addClass('ic-info');
              $(o).find('.api-ic').removeClass('ic-warning');
              $(o).find('.api-ic').removeClass('ic-error');
            }
          }
        });
        window.swaggerUi.api.clientAuthorizations.add(OAuthSchemeKey, new SwaggerClient.ApiKeyAuthorization('Authorization', 'Bearer ' + b, 'header'));
      }
    }
  }
};

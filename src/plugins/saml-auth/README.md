# saml-auth

This plugin provides SAML authentication option for swagger-ui. Please note there is some customized step addtion to saml auth flow, e.g. authenticating SAML token.

## Customization

### Component: `AuthorizationPopup`

`AuthorizationPopup` is customized to add:
1. Login options screen.  e.g. otp, saml
2. SAML Login info, errors. e.g. saml error
3. Show Logged-in auth option's component. e.g. to compensate (1) after logged in

### New Component: `DefinitionSelect`

`DefinitionSelect` is a new component to add:
1. A list of available auth options as buttons.

### New Component: `SamlAuth`

`SamlAuth` is a new component to add:
1. SAML login form. e.g. loading state, logout button.
2. Login and logout action for SamlAuth

### StatePlugins

#### samlAuth.actions

`SamAuth.actions` adds:
2. `newSamlAuthErr` - show error when SAML auth failed
3. `authenticateWithSAMLToken` - authenticate with SAML token returned
4. `loginSaml` - redirect to saml login page
5. `logoutSaml` - redirect to saml logout page

### spec.selectors

`spec.selectors` selects:
1. `samlSchemaEntry` - get SAML schema entry from spec

### spec.wrapActions

`spec.wrapActions` wraps:
1. `updateJsonSpec` - handle SAMLToken and SAMLError query params
2. `updateSpec` - add flag and keep loading state for (1)



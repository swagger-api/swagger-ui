/**
 * @prettier
 */

/**
 * English message catalog — the canonical reference and ultimate fallback.
 * Keys use a namespaced dot-notation: <category>.<snake_case_description>.
 */
const en = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "Authorize",
  "button.cancel": "Cancel",
  "button.clear": "Clear",
  "button.close": "Close",
  "button.copy_to_clipboard": "Copy to clipboard",
  "button.download_file": "Download file",
  "button.edit": "Edit",
  "button.execute": "Execute",
  "button.explore": "Explore",
  "button.hide": "Hide",
  "button.logout": "Logout",
  "button.reset": "Reset",
  "button.show": "Show",
  "button.try_it_out": "Try it out",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "Callbacks",
  "label.code": "Code",
  "label.description": "Description",
  "label.details": "Details",
  "label.examples": "Examples",
  "label.headers": "Headers:",
  "label.links": "Links",
  "label.media_type": "Media type",
  "label.models": "Models",
  "label.name": "Name",
  "label.no_links": "No links",
  "label.no_parameters": "No parameters",
  "label.parameter_content_type": "Parameter content type",
  "label.parameters": "Parameters",
  "label.request_body": "Request body",
  "label.request_duration": "Request duration",
  "label.request_url": "Request URL",
  "label.response_body": "Response body",
  "label.response_content_type": "Response content type",
  "label.response_headers": "Response headers",
  "label.responses": "Responses",
  "label.schemas": "Schemas",
  "label.server_response": "Server response",
  "label.snippets": "Snippets",
  "label.type": "Type",
  "label.undocumented": "Undocumented",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "In:",
  "auth.api_key_name": "Name:",
  "auth.api_key_value": "Value:",
  "auth.application": "Application:",
  "auth.authorization_header": "Authorization header",
  "auth.authorization_url": "Authorization URL:",
  "auth.authorized": "Authorized",
  "auth.basic_authorization_title": "Basic authorization",
  "auth.client_credentials_location": "Client credentials location:",
  "auth.client_id": "client_id:",
  "auth.client_secret": "client_secret:",
  "auth.flow": "Flow:",
  "auth.openid_connect_url": "OpenID Connect URL:",
  "auth.password": "password:",
  "auth.password_cap": "Password:",
  "auth.request_body_option": "Request body",
  "auth.scopes_description":
    "Scopes are used to grant an application different levels of access to data on behalf of the end user. Each API may declare one or more scopes.",
  "auth.scopes_required":
    "API requires the following scopes. Select which ones you want to grant to Swagger UI.",
  "auth.scopes_title": "Scopes:",
  "auth.select_all": "select all",
  "auth.select_none": "select none",
  "auth.token_url": "Token URL:",
  "auth.username": "username:",
  "auth.username_cap": "Username:",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "Apply credentials",
  "aria.apply_oauth2_credentials": "Apply given OAuth2 credentials",
  "aria.authorization_button_locked": "authorization button locked",
  "aria.authorization_button_unlocked": "authorization button unlocked",
  "aria.collapse_operation": "Collapse operation",
  "aria.expand_operation": "Expand operation",
  "aria.remove_authorization": "Remove authorization",
  "aria.request_content_type": "Request content type",
  "aria.response_content_type": "Response content type",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "Jump to line {{line}}",
  "errors.title": "Errors",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "Filter by tag",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "Controls ",
  "response.controls_accept_header_suffix": " header.",
  "response.json_parse_error": "Can't parse JSON.  Raw result:\n\n",
  "response.no_blob_support":
    "Download headers detected but your browser does not support downloading binary via XHR (Blob).",
  "response.unrecognized_type_display_as_text":
    "Unrecognized response type; displaying content as text.",
  "response.unrecognized_type_unable_to_display":
    "Unrecognized response type; unable to display.",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "Select a definition",
}

export default en

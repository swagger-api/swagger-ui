/**
 * @prettier
 */

/**
 * Georgian (ქართული) message catalog.
 * ISO 639-1 code: ka  (bibliographic "geo" used in the original dist/lang/geo.js)
 */
const ka = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "ავტორიზაცია",
  "button.cancel": "გაუქმება",
  "button.clear": "გასუფთავება",
  "button.close": "დახურვა",
  "button.copy_to_clipboard": "ბუფერში კოპირება",
  "button.download_file": "ფაილის ჩამოტვირთვა",
  "button.edit": "რედაქტირება",
  "button.execute": "გაშვება",
  "button.explore": "ნახვა",
  "button.hide": "დამალვა",
  "button.logout": "გასვლა",
  "button.reset": "გადატვირთვა",
  "button.show": "გამოჩენა",
  "button.try_it_out": "ცადე",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "Callbacks",
  "label.code": "კოდი",
  "label.description": "აღწერა",
  "label.details": "დეტალები",
  "label.examples": "მაგალითები",
  "label.headers": "ჰედერები:",
  "label.links": "ლინკები",
  "label.media_type": "მედიის ტიპი",
  "label.models": "მოდელები",
  "label.name": "სახელი",
  "label.no_links": "ლინკი არ არის",
  "label.no_parameters": "პარამეტრი არ არის",
  "label.parameter_content_type": "პარამეტრის კონტენტის ტიპი",
  "label.parameters": "პარამეტრები",
  "label.request_body": "მოთხოვნის სხეული",
  "label.request_duration": "მოთხოვნის ხანგრძლივობა",
  "label.request_url": "მოთხოვნის URL",
  "label.response_body": "პასუხის სხეული",
  "label.response_content_type": "პასუხის კონტენტის ტიპი",
  "label.response_headers": "პასუხის ჰედერები",
  "label.responses": "პასუხები",
  "label.schemas": "სქემები",
  "label.server_response": "სერვერის პასუხი",
  "label.snippets": "ფრაგმენტები",
  "label.type": "ტიპი",
  "label.undocumented": "დოკუმენტირებული არ არის",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "სად:",
  "auth.api_key_name": "სახელი:",
  "auth.api_key_value": "მნიშვნელობა:",
  "auth.application": "აპლიკაცია:",
  "auth.authorization_header": "ავტორიზაციის ჰედერი",
  "auth.authorization_url": "ავტორიზაციის URL:",
  "auth.authorized": "ავტორიზებულია",
  "auth.basic_authorization_title": "საბაზო ავტორიზაცია",
  "auth.client_credentials_location": "კლიენტის სერთიფიკატების მდებარეობა:",
  "auth.client_id": "client_id:",
  "auth.client_secret": "client_secret:",
  "auth.flow": "ნაკადი:",
  "auth.openid_connect_url": "OpenID Connect URL:",
  "auth.password": "პაროლი:",
  "auth.password_cap": "პაროლი:",
  "auth.request_body_option": "მოთხოვნის სხეული",
  "auth.scopes_description":
    "Scope-ები გამოიყენება აპლიკაციისთვის მომხმარებლის სახელით მონაცემებზე განსხვავებული წვდომის დონის მინიჭებისთვის. თითოეული API-ი შეიძლება ერთ ან მეტ scope-ს ეყრდნობოდეს.",
  "auth.scopes_required":
    "API-ს სჭირდება შემდეგი scope-ები. აირჩიეთ, რომელი გსურთ Swagger UI-სთვის.",
  "auth.scopes_title": "Scope-ები:",
  "auth.select_all": "ყველას მონიშვნა",
  "auth.select_none": "მოხსენება",
  "auth.token_url": "ტოკენის URL:",
  "auth.username": "მოხმარებელი:",
  "auth.username_cap": "მოხმარებელი:",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "სერთიფიკატების გამოყენება",
  "aria.apply_oauth2_credentials": "მოცემული OAuth2 სერთიფიკატების გამოყენება",
  "aria.authorization_button_locked": "ავტორიზაციის ღილაკი დაბლოკილია",
  "aria.authorization_button_unlocked": "ავტორიზაციის ღილაკი განბლოკილია",
  "aria.collapse_operation": "ოპერაციის ჩაკეცვა",
  "aria.expand_operation": "ოპერაციის გაშლა",
  "aria.remove_authorization": "ავტორიზაციის წაშლა",
  "aria.request_content_type": "მოთხოვნის კონტენტის ტიპი",
  "aria.response_content_type": "პასუხის კონტენტის ტიპი",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "{{line}} სტრიქონზე გადასვლა",
  "errors.title": "შეცდომები",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "ტეგით გაფილტვრა",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "",
  "response.controls_accept_header_suffix": " ჰედერს მართავს.",
  "response.json_parse_error":
    "JSON-ის დამუშავება ვერ მოხერხდა.  ნედლი შედეგი:\n\n",
  "response.no_blob_support":
    "ჩამოტვირთვის ჰედერები გამოვლინდა, მაგრამ თქვენი ბრაუზერი XHR (Blob) საშუალებით ბინარული მონაცემების ჩამოტვირთვას არ უჭერს მხარს.",
  "response.unrecognized_type_display_as_text":
    "პასუხის ტიპი ვერ ამოვიცანით; კონტენტს ტექსტად ვაჩვენებთ.",
  "response.unrecognized_type_unable_to_display":
    "პასუხის ტიპი ვერ ამოვიცანით; ვერ ვაჩვენებთ.",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "განსაზღვრების არჩევა",
}

export default ka

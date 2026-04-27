/**
 * @prettier
 */

/**
 * Spanish (Español) message catalog.
 */
const es = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "Autorizar",
  "button.cancel": "Cancelar",
  "button.clear": "Limpiar",
  "button.close": "Cerrar",
  "button.copy_to_clipboard": "Copiar al portapapeles",
  "button.download_file": "Descargar archivo",
  "button.edit": "Editar",
  "button.execute": "Ejecutar",
  "button.explore": "Explorar",
  "button.hide": "Ocultar",
  "button.logout": "Cerrar sesión",
  "button.reset": "Restablecer",
  "button.show": "Mostrar",
  "button.try_it_out": "Pruébalo",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "Callbacks",
  "label.code": "Código",
  "label.description": "Descripción",
  "label.details": "Detalles",
  "label.examples": "Ejemplos",
  "label.headers": "Cabeceras:",
  "label.links": "Vínculos",
  "label.media_type": "Tipo de medio",
  "label.models": "Modelos",
  "label.name": "Nombre",
  "label.no_links": "Sin vínculos",
  "label.no_parameters": "Sin parámetros",
  "label.parameter_content_type": "Tipo de contenido del parámetro",
  "label.parameters": "Parámetros",
  "label.request_body": "Cuerpo de la solicitud",
  "label.request_duration": "Duración de la solicitud",
  "label.request_url": "URL de la solicitud",
  "label.response_body": "Cuerpo de la respuesta",
  "label.response_content_type": "Tipo de contenido de la respuesta",
  "label.response_headers": "Cabeceras de respuesta",
  "label.responses": "Respuestas",
  "label.schemas": "Esquemas",
  "label.server_response": "Respuesta del servidor",
  "label.snippets": "Fragmentos",
  "label.type": "Tipo",
  "label.undocumented": "No documentado",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "En:",
  "auth.api_key_name": "Nombre:",
  "auth.api_key_value": "Valor:",
  "auth.application": "Aplicación:",
  "auth.authorization_header": "Cabecera de autorización",
  "auth.authorization_url": "URL de autorización:",
  "auth.authorized": "Autorizado",
  "auth.basic_authorization_title": "Autorización básica",
  "auth.client_credentials_location": "Ubicación de credenciales del cliente:",
  "auth.flow": "Flujo:",
  "auth.openid_connect_url": "URL de OpenID Connect:",
  "auth.password": "contraseña:",
  "auth.password_cap": "Contraseña:",
  "auth.request_body_option": "Cuerpo de la solicitud",
  "auth.scopes_description":
    "Los scopes se utilizan para otorgar a una aplicación diferentes niveles de acceso a los datos en nombre del usuario final. Cada API puede declarar uno o más scopes.",
  "auth.scopes_required":
    "La API requiere los siguientes scopes. Seleccione cuáles desea otorgar a Swagger UI.",
  "auth.scopes_title": "Scopes:",
  "auth.select_all": "seleccionar todos",
  "auth.select_none": "seleccionar ninguno",
  "auth.token_url": "URL del token:",
  "auth.username": "nombre de usuario:",
  "auth.username_cap": "Nombre de usuario:",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "Aplicar credenciales",
  "aria.apply_oauth2_credentials":
    "Aplicar las credenciales OAuth2 proporcionadas",
  "aria.authorization_button_locked": "botón de autorización bloqueado",
  "aria.authorization_button_unlocked": "botón de autorización desbloqueado",
  "aria.collapse_operation": "Contraer operación",
  "aria.expand_operation": "Expandir operación",
  "aria.remove_authorization": "Eliminar autorización",
  "aria.request_content_type": "Tipo de contenido de la solicitud",
  "aria.response_content_type": "Tipo de contenido de la respuesta",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "Saltar a la línea {{line}}",
  "errors.title": "Errores",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "Filtrar por etiqueta",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "Controla la cabecera ",
  "response.controls_accept_header_suffix": ".",
  "response.json_parse_error":
    "No se puede analizar el JSON.  Resultado sin formato:\n\n",
  "response.no_blob_support":
    "Encabezados de descarga detectados, pero su navegador no es compatible con la descarga de datos binarios mediante XHR (Blob).",
  "response.unrecognized_type_display_as_text":
    "Tipo de respuesta no reconocido; mostrando contenido como texto.",
  "response.unrecognized_type_unable_to_display":
    "Tipo de respuesta no reconocido; no se puede mostrar.",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "Seleccionar una definición",
}

export default es

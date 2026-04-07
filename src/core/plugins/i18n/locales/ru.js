/**
 * @prettier
 */

/**
 * Russian (Русский) message catalog.
 */
const ru = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "Авторизовать",
  "button.cancel": "Отмена",
  "button.clear": "Очистить",
  "button.close": "Закрыть",
  "button.copy_to_clipboard": "Копировать в буфер обмена",
  "button.download_file": "Скачать файл",
  "button.edit": "Редактировать",
  "button.execute": "Выполнить",
  "button.explore": "Исследовать",
  "button.hide": "Скрыть",
  "button.logout": "Выйти",
  "button.reset": "Сбросить",
  "button.show": "Показать",
  "button.try_it_out": "Попробовать",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "Коллбэки",
  "label.code": "Код",
  "label.description": "Описание",
  "label.details": "Детали",
  "label.examples": "Примеры",
  "label.headers": "Заголовки:",
  "label.links": "Ссылки",
  "label.media_type": "Тип медиа",
  "label.models": "Модели",
  "label.name": "Имя",
  "label.no_links": "Нет ссылок",
  "label.no_parameters": "Нет параметров",
  "label.parameter_content_type": "Тип содержимого параметра",
  "label.parameters": "Параметры",
  "label.request_body": "Тело запроса",
  "label.request_duration": "Продолжительность запроса",
  "label.request_url": "URL запроса",
  "label.response_body": "Тело ответа",
  "label.response_content_type": "Тип содержимого ответа",
  "label.response_headers": "Заголовки ответа",
  "label.responses": "Ответы",
  "label.schemas": "Схемы",
  "label.server_response": "Ответ сервера",
  "label.snippets": "Фрагменты",
  "label.type": "Тип",
  "label.undocumented": "Не задокументировано",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "В:",
  "auth.api_key_name": "Имя:",
  "auth.api_key_value": "Значение:",
  "auth.application": "Приложение:",
  "auth.authorization_header": "Заголовок авторизации",
  "auth.authorization_url": "URL авторизации:",
  "auth.authorized": "Авторизован",
  "auth.basic_authorization_title": "Базовая авторизация",
  "auth.client_credentials_location": "Местонахождение учётных данных клиента:",
  "auth.client_id": "client_id:",
  "auth.client_secret": "client_secret:",
  "auth.flow": "Поток:",
  "auth.openid_connect_url": "URL OpenID Connect:",
  "auth.password": "пароль:",
  "auth.password_cap": "Пароль:",
  "auth.request_body_option": "Тело запроса",
  "auth.scopes_description":
    "Области используются для предоставления приложению разных уровней доступа к данным от имени конечного пользователя. Каждый API может объявлять одну или несколько областей.",
  "auth.scopes_required":
    "API требует следующих областей. Выберите те, которые вы хотите предоставить Swagger UI.",
  "auth.scopes_title": "Области:",
  "auth.select_all": "выбрать все",
  "auth.select_none": "снять выбор",
  "auth.token_url": "URL токена:",
  "auth.username": "имя пользователя:",
  "auth.username_cap": "Имя пользователя:",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "Применить учётные данные",
  "aria.apply_oauth2_credentials": "Применить указанные учётные данные OAuth2",
  "aria.authorization_button_locked": "кнопка авторизации заблокирована",
  "aria.authorization_button_unlocked": "кнопка авторизации разблокирована",
  "aria.collapse_operation": "Свернуть операцию",
  "aria.expand_operation": "Развернуть операцию",
  "aria.remove_authorization": "Удалить авторизацию",
  "aria.request_content_type": "Тип содержимого запроса",
  "aria.response_content_type": "Тип содержимого ответа",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "Перейти к строке {{line}}",
  "errors.title": "Ошибки",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "Фильтровать по тегу",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "Управляет заголовком ",
  "response.controls_accept_header_suffix": ".",
  "response.json_parse_error":
    "Не удаётся разобрать JSON.  Необработанный результат:\n\n",
  "response.no_blob_support":
    "Обнаружены заголовки загрузки, но ваш браузер не поддерживает загрузку двоичных данных через XHR (Blob).",
  "response.unrecognized_type_display_as_text":
    "Нераспознанный тип ответа; содержимое отображается как текст.",
  "response.unrecognized_type_unable_to_display":
    "Нераспознанный тип ответа; отображение невозможно.",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "Выбрать определение",
}

export default ru

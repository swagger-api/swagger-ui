/**
 * @prettier
 */

/**
 * Korean (한국어) message catalog.
 */
const ko = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "인증",
  "button.cancel": "취소",
  "button.clear": "지우기",
  "button.close": "닫기",
  "button.copy_to_clipboard": "클립보드에 복사",
  "button.download_file": "파일 다운로드",
  "button.edit": "수정",
  "button.execute": "실행",
  "button.explore": "탐색",
  "button.hide": "숨기기",
  "button.logout": "로그아웃",
  "button.reset": "초기화",
  "button.show": "표시",
  "button.try_it_out": "직접 해보기",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "콜백",
  "label.code": "코드",
  "label.description": "설명",
  "label.details": "세부 정보",
  "label.examples": "예시",
  "label.headers": "헤더:",
  "label.links": "링크",
  "label.media_type": "미디어 유형",
  "label.models": "모델",
  "label.name": "이름",
  "label.no_links": "링크 없음",
  "label.no_parameters": "파라미터 없음",
  "label.parameter_content_type": "파라미터 콘텐츠 유형",
  "label.parameters": "파라미터",
  "label.request_body": "요청 본문",
  "label.request_duration": "요청 시간",
  "label.request_url": "요청 URL",
  "label.response_body": "응답 본문",
  "label.response_content_type": "응답 콘텐츠 유형",
  "label.response_headers": "응답 헤더",
  "label.responses": "응답",
  "label.schemas": "스키마",
  "label.server_response": "서버 응답",
  "label.snippets": "스니펫",
  "label.type": "유형",
  "label.undocumented": "미문서화",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "위치:",
  "auth.api_key_name": "이름:",
  "auth.api_key_value": "값:",
  "auth.application": "애플리케이션:",
  "auth.authorization_header": "인증 헤더",
  "auth.authorization_url": "인증 URL:",
  "auth.authorized": "인증됨",
  "auth.basic_authorization_title": "기본 인증",
  "auth.client_credentials_location": "클라이언트 자격증명 위치:",
  "auth.client_id": "client_id:",
  "auth.client_secret": "client_secret:",
  "auth.flow": "흐름:",
  "auth.openid_connect_url": "OpenID Connect URL:",
  "auth.password": "비밀번호:",
  "auth.password_cap": "비밀번호:",
  "auth.request_body_option": "요청 본문",
  "auth.scopes_description":
    "스코프는 최종 사용자를 대신하여 애플리케이션에 데이터에 대한 다양한 수준의 액세스를 부여하는 데 사용됩니다. 각 API는 하나 이상의 스코프를 선언할 수 있습니다.",
  "auth.scopes_required":
    "API에는 다음 스코프가 필요합니다. Swagger UI에 부여할 스코프를 선택하세요.",
  "auth.scopes_title": "스코프:",
  "auth.select_all": "전체 선택",
  "auth.select_none": "전체 해제",
  "auth.token_url": "토큰 URL:",
  "auth.username": "사용자 이름:",
  "auth.username_cap": "사용자 이름:",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "자격증명 적용",
  "aria.apply_oauth2_credentials": "주어진 OAuth2 자격증명 적용",
  "aria.authorization_button_locked": "인증 버튼 잠김",
  "aria.authorization_button_unlocked": "인증 버튼 잠금 해제",
  "aria.collapse_operation": "작업 축소",
  "aria.expand_operation": "작업 확장",
  "aria.remove_authorization": "인증 제거",
  "aria.request_content_type": "요청 콘텐츠 유형",
  "aria.response_content_type": "응답 콘텐츠 유형",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "{{line}}번 줄로 이동",
  "errors.title": "오류",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "태그로 필터링",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "",
  "response.controls_accept_header_suffix": " 헤더를 제어합니다.",
  "response.json_parse_error": "JSON을 파싱할 수 없습니다.  원시 결과:\n\n",
  "response.no_blob_support":
    "다운로드 헤더가 감지되었지만 브라우저가 XHR (Blob)을 통한 바이너리 다운로드를 지원하지 않습니다.",
  "response.unrecognized_type_display_as_text":
    "인식되지 않는 응답 유형입니다. 내용을 텍스트로 표시합니다.",
  "response.unrecognized_type_unable_to_display":
    "인식되지 않는 응답 유형입니다. 표시할 수 없습니다.",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "정의 선택",
}

export default ko

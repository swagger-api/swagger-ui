/**
 * @prettier
 */

/**
 * Japanese (日本語) message catalog.
 */
const ja = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "認証",
  "button.cancel": "キャンセル",
  "button.clear": "クリア",
  "button.close": "閉じる",
  "button.copy_to_clipboard": "クリップボードにコピー",
  "button.download_file": "ファイルをダウンロード",
  "button.edit": "編集",
  "button.execute": "実行",
  "button.explore": "探索",
  "button.hide": "非表示",
  "button.logout": "ログアウト",
  "button.reset": "リセット",
  "button.show": "表示",
  "button.try_it_out": "試してみる",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "コールバック",
  "label.code": "コード",
  "label.description": "説明",
  "label.details": "詳細",
  "label.examples": "例",
  "label.headers": "ヘッダ:",
  "label.links": "リンク",
  "label.media_type": "メディアタイプ",
  "label.models": "モデル",
  "label.name": "名前",
  "label.no_links": "リンクなし",
  "label.no_parameters": "パラメータなし",
  "label.parameter_content_type": "パラメータのコンテンツタイプ",
  "label.parameters": "パラメータ",
  "label.request_body": "リクエストボディ",
  "label.request_duration": "リクエスト時間",
  "label.request_url": "リクエストURL",
  "label.response_body": "レスポンスボディ",
  "label.response_content_type": "レスポンスのコンテンツタイプ",
  "label.response_headers": "レスポンスヘッダ",
  "label.responses": "レスポンス",
  "label.schemas": "スキーマ",
  "label.server_response": "サーバレスポンス",
  "label.snippets": "スニペット",
  "label.type": "タイプ",
  "label.undocumented": "未ドキュメント",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "場所:",
  "auth.api_key_name": "名前:",
  "auth.api_key_value": "値:",
  "auth.application": "アプリケーション:",
  "auth.authorization_header": "認証ヘッダ",
  "auth.authorization_url": "認証URL:",
  "auth.authorized": "認証済み",
  "auth.basic_authorization_title": "基本認証",
  "auth.client_credentials_location": "クライアント認証情報の場所:",
  "auth.flow": "フロー:",
  "auth.openid_connect_url": "OpenID Connect URL:",
  "auth.password": "パスワード:",
  "auth.password_cap": "パスワード:",
  "auth.request_body_option": "リクエストボディ",
  "auth.scopes_description":
    "スコープは、エンドユーザーに代わってアプリケーションにデータへの異なるアクセスレベルを付与するために使用されます。各APIは1つ以上のスコープを宣言できます。",
  "auth.scopes_required":
    "APIには以下のスコープが必要です。Swagger UIに付与するスコープを選択してください。",
  "auth.scopes_title": "スコープ:",
  "auth.select_all": "すべて選択",
  "auth.select_none": "選択なし",
  "auth.token_url": "トークンURL:",
  "auth.username": "ユーザ名:",
  "auth.username_cap": "ユーザ名:",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "認証情報を適用",
  "aria.apply_oauth2_credentials": "指定されたOAuth2認証情報を適用",
  "aria.authorization_button_locked": "認証ボタンがロックされています",
  "aria.authorization_button_unlocked": "認証ボタンがロック解除されています",
  "aria.collapse_operation": "操作を折りたたむ",
  "aria.expand_operation": "操作を展開する",
  "aria.remove_authorization": "認証を削除",
  "aria.request_content_type": "リクエストのコンテンツタイプ",
  "aria.response_content_type": "レスポンスのコンテンツタイプ",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "{{line}}行目に移動",
  "errors.title": "エラー",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "タグで絞り込む",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "",
  "response.controls_accept_header_suffix": "ヘッダを制御します。",
  "response.json_parse_error":
    "JSONを解析できません。  未加工の結果:\n\n",
  "response.no_blob_support":
    "ダウンロードヘッダが検出されましたが、お使いのブラウザはXHR (Blob) を通じたバイナリデータのダウンロードをサポートしていません。",
  "response.unrecognized_type_display_as_text":
    "認識できないレスポンスタイプです。コンテンツをテキストとして表示します。",
  "response.unrecognized_type_unable_to_display":
    "認識できないレスポンスタイプです。表示できません。",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "定義を選択",
}

export default ja

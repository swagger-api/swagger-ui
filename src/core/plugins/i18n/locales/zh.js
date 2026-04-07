/**
 * @prettier
 */

/**
 * Chinese Simplified (简体中文) message catalog.
 */
const zh = {
  // ── Buttons / actions ─────────────────────────────────────────────────────
  "button.authorize": "授权",
  "button.cancel": "取消",
  "button.clear": "清除",
  "button.close": "关闭",
  "button.copy_to_clipboard": "复制到剪贴板",
  "button.download_file": "下载文件",
  "button.edit": "编辑",
  "button.execute": "执行",
  "button.explore": "探索",
  "button.hide": "隐藏",
  "button.logout": "退出登录",
  "button.reset": "重置",
  "button.show": "显示",
  "button.try_it_out": "试一下",

  // ── Section / column labels ────────────────────────────────────────────────
  "label.callbacks": "回调",
  "label.code": "代码",
  "label.description": "描述",
  "label.details": "详情",
  "label.examples": "示例",
  "label.headers": "标头：",
  "label.links": "链接",
  "label.media_type": "媒体类型",
  "label.models": "模型",
  "label.name": "名称",
  "label.no_links": "无链接",
  "label.no_parameters": "无参数",
  "label.parameter_content_type": "参数内容类型",
  "label.parameters": "参数",
  "label.request_body": "请求体",
  "label.request_duration": "请求时长",
  "label.request_url": "请求 URL",
  "label.response_body": "响应体",
  "label.response_content_type": "响应内容类型",
  "label.response_headers": "响应头",
  "label.responses": "响应",
  "label.schemas": "模式",
  "label.server_response": "服务器响应",
  "label.snippets": "代码片段",
  "label.type": "类型",
  "label.undocumented": "未文档化",

  // ── Authentication ─────────────────────────────────────────────────────────
  "auth.api_key_in": "位置：",
  "auth.api_key_name": "名称：",
  "auth.api_key_value": "值：",
  "auth.application": "应用程序：",
  "auth.authorization_header": "授权请求头",
  "auth.authorization_url": "授权 URL：",
  "auth.authorized": "已授权",
  "auth.basic_authorization_title": "基本授权",
  "auth.client_credentials_location": "客户端凭据位置：",
  "auth.client_id": "client_id：",
  "auth.client_secret": "client_secret：",
  "auth.flow": "流程：",
  "auth.openid_connect_url": "OpenID Connect URL：",
  "auth.password": "密码：",
  "auth.password_cap": "密码：",
  "auth.request_body_option": "请求体",
  "auth.scopes_description":
    "范围用于代表最终用户向应用程序授予对数据的不同访问级别。每个 API 可以声明一个或多个范围。",
  "auth.scopes_required":
    "API 需要以下范围。请选择您想要授予 Swagger UI 的范围。",
  "auth.scopes_title": "范围：",
  "auth.select_all": "全选",
  "auth.select_none": "取消全选",
  "auth.token_url": "令牌 URL：",
  "auth.username": "用户名：",
  "auth.username_cap": "用户名：",

  // ── Accessibility (aria-labels / titles) ───────────────────────────────────
  "aria.apply_credentials": "应用凭据",
  "aria.apply_oauth2_credentials": "应用给定的 OAuth2 凭据",
  "aria.authorization_button_locked": "授权按钮已锁定",
  "aria.authorization_button_unlocked": "授权按钮已解锁",
  "aria.collapse_operation": "折叠操作",
  "aria.expand_operation": "展开操作",
  "aria.remove_authorization": "删除授权",
  "aria.request_content_type": "请求内容类型",
  "aria.response_content_type": "响应内容类型",

  // ── Errors ────────────────────────────────────────────────────────────────
  "errors.jump_to_line": "跳转到第 {{line}} 行",
  "errors.title": "错误",

  // ── Placeholders ──────────────────────────────────────────────────────────
  "placeholder.filter_by_tag": "按标签过滤",

  // ── Response ──────────────────────────────────────────────────────────────
  "response.controls_accept_header_prefix": "控制 ",
  "response.controls_accept_header_suffix": " 请求头。",
  "response.json_parse_error": "无法解析 JSON。原始结果：\n\n",
  "response.no_blob_support":
    "检测到下载标头，但您的浏览器不支持通过 XHR (Blob) 下载二进制文件。",
  "response.unrecognized_type_display_as_text":
    "无法识别的响应类型；将内容显示为文本。",
  "response.unrecognized_type_unable_to_display":
    "无法识别的响应类型；无法显示。",

  // ── Topbar ────────────────────────────────────────────────────────────────
  "topbar.select_definition": "选择一个定义",
}

export default zh

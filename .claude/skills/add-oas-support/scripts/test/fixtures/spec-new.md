# Fixture Specification 2.0

### Document Object

#### Fixed Fields

| Field Name | Type | Description |
| ---- | :----: | ---- |
| <a name="doc-version"></a>version | `string` | **REQUIRED**. The version. |
| <a name="doc-servers"></a>servers | [[Server Object](#server-object)] | The servers. |
| <a name="doc-items"></a>items | [Item Object](#item-object) \| [Reference Object](#reference-object) | The items. |

### Item Object

#### Fixed Fields

| Field Name | Type | Description |
| ---- | :----: | ---- |
| <a name="item-name"></a>name | `string` | The name. |
| <a name="item-in"></a>in | `string` | Possible values are `"query"`, `"querystring"` or `"path"`. |
| <a name="item-schema"></a>schema | [Schema Object](#schema-object) | The schema. |

### Server Object

#### Fixed Fields

| Field Name | Type | Description |
| ---- | :----: | ---- |
| <a name="server-url"></a>url | `string` | **REQUIRED**. The URL. |
| <a name="server-note"></a>note | `string` | A note. |

#### No Server Object

An example heading that ends in "Object" and has no fields.

### Scheme Object

#### Fixed Fields

| Field Name | Type | Applies To | Description |
| ---- | :----: | ---- | ---- |
| <a name="scheme-type"></a>type | `string` | Any | **REQUIRED**. Valid values are `"apiKey"` or `"http"`. |

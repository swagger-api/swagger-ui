# Fixture Specification 1.0

Exercises diff-spec-versions.mjs: 3.x-style rows (leading pipe) and 2.0-style rows (no pipes,
self-closing anchors), a renamed object, patterned extension rows and an example heading.

### Root Object

#### Fixed Fields

| Field Name | Type | Description |
| ---- | :----: | ---- |
| <a name="root-version"></a>version | `string` | **REQUIRED**. The version. |
| <a name="root-host"></a>host | `string` | The host. |
| <a name="root-items"></a>items | [Item Object](#item-object) | The items. |

### Item Object

##### Fixed Fields
Field Name | Type | Description
---|:---:|---
<a name="itemName"/>name | `string` | **Required.** The name.
<a name="itemIn"></a>in | `string` | Possible values are `"query"` or `"path"`.
<a name="itemSchema"></a>schema | [Schema Object](#schema-object) | The schema.
<a name="itemNote"></a>note | `string` | A note.

##### Patterned Fields
Field Pattern | Type | Description
---|:---:|---
<a name="itemExtensions"></a>^x- | Any | Extensions.

### Old Thing Object

#### Fixed Fields

| Field Name | Type | Description |
| ---- | :----: | ---- |
| <a name="old-thing-label"></a>label | `string` | A label. |

### Scheme Object

#### Fixed Fields

| Field Name | Type | Applies To | Description |
| ---- | :----: | ---- | ---- |
| <a name="scheme-type"></a>type | `string` | Any | **REQUIRED**. Valid values are `"basic"` or `"apiKey"`. |

# Parameter placeholders

Use the `x-placeholder` extension on a Parameter Object to customize the hint
shown in an empty text input. It is supported for `string`, `integer`, and
`number` parameters in Swagger 2.0 and OpenAPI 3.x.

```yaml
parameters:
  - name: clientId
    in: query
    description: Client code
    required: false
    schema:
      type: integer
    x-placeholder: "1"
```

The hint is only displayed when the input is empty. It does not initialize the
parameter value, satisfy required-parameter validation, or get sent in a request.
Existing `example`, `examples`, and `default` behavior is unchanged; an input
initialized from those values displays the hint only after its value is cleared.

The extension must be a non-blank string. If it is missing, blank, or another
type, the input continues to use the parameter name as its placeholder. Numeric
hints must be quoted, as in `x-placeholder: "1"`.

Place the extension on the parameter, not inside `schema`. For Swagger 2.0,
declare `type` directly on the parameter as usual. Dropdowns, file inputs,
array editors, and object editors keep their existing behavior. Request body
properties are not covered by this extension.

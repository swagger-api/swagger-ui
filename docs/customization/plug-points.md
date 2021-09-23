# Plug points

Swagger UI exposes most of its internal logic through the plugin system.

Often, it is beneficial to override the core internals to achieve custom behavior.

### Note: Semantic Versioning

Swagger UI's internal APIs are _not_ part of our public contract, which means that they can change without the major version change.

If your custom plugins wrap, extend, override, or consume any internal core APIs, we recommend specifying a specific minor version of Swagger UI to use in your application, because they will _not_ change between patch versions.

If you're installing Swagger UI via NPM, for example, you can do this by using a tilde:

```js
{
  "dependencies": {
    "swagger-ui": "~3.11.0"
  }
}
```

### `fn.opsFilter`

When using the `filter` option, tag names will be filtered by the user-provided value. If you'd like to customize this behavior, you can override the default `opsFilter` function.

For example, you can implement a multiple-phrase filter:

```js
const MultiplePhraseFilterPlugin = function() {
  return {
    fn: {
      opsFilter: (taggedOps, phrase) => {
        const phrases = phrase.split(", ")

        return taggedOps.filter((val, key) => {
          return phrases.some(item => key.indexOf(item) > -1)
        })
      }
    }
  }
}
```
### Logo component
While using the Standalone Preset the SwaggerUI logo is rendered in the Top Bar.
The logo can be exchanged by replacing the `Logo` component via the plugin api:

```jsx
import React from "react";
const MyLogoPlugin = {
  components: {
    Logo: () => (
      <img alt="My Logo" height="40" src="data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNTM3IiBoZWlnaHQ9IjEzNCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KCiA8Zz4KICA8dGl0bGU+TGF5ZXIgMTwvdGl0bGU+CiAgPHRleHQgdHJhbnNmb3JtPSJtYXRyaXgoMy40Nzc2OSAwIDAgMy4yNjA2NyAtNjczLjEyOCAtNjkxLjk5MykiIHN0cm9rZT0iIzAwMCIgZm9udC1zdHlsZT0ibm9ybWFsIiBmb250LXdlaWdodD0ibm9ybWFsIiB4bWw6c3BhY2U9InByZXNlcnZlIiB0ZXh0LWFuY2hvcj0ic3RhcnQiIGZvbnQtZmFtaWx5PSInT3BlbiBTYW5zIEV4dHJhQm9sZCciIGZvbnQtc2l6ZT0iMjQiIGlkPSJzdmdfMSIgeT0iMjQxLjIyMTkyIiB4PSIxOTYuOTY5MjEiIHN0cm9rZS13aWR0aD0iMCIgZmlsbD0iIzYyYTAzZiI+TXkgTG9nbzwvdGV4dD4KICA8cGF0aCBpZD0ic3ZnXzIiIGQ9Im0zOTUuNjAyNSw1MS4xODM1OWw1My44Nzc3MSwwbDE2LjY0ODYzLC01MS4xODM1OGwxNi42NDg2NCw1MS4xODM1OGw1My44Nzc3LDBsLTQzLjU4NzksMzEuNjMyODNsMTYuNjQ5NDksNTEuMTgzNThsLTQzLjU4NzkyLC0zMS42MzM2OWwtNDMuNTg3OTEsMzEuNjMzNjlsMTYuNjQ5NDksLTUxLjE4MzU4bC00My41ODc5MiwtMzEuNjMyODN6IiBzdHJva2Utd2lkdGg9IjAiIHN0cm9rZT0iIzAwMCIgZmlsbD0iIzYyYTAzZiIvPgogPC9nPgo8L3N2Zz4="/>
    )
  }
}
```


### JSON Schema components
In swagger there are so called JSON Schema components. These are used to render inputs for parameters and components of request bodies with `application/x-www-form-urlencoded` or `multipart/*` media-type.

Internally swagger uses following mapping to find the JSON Schema component from OpenAPI Specification schema information:

For each schema’s type(eg. `string`, `array`, …) and if defined schema’s format (eg. ‘date’, ‘uuid’, …) there is a corresponding component mapping:

**If format defined:**
```js
`JsonSchema_${type}_${format}`
```

**Fallback if `JsonSchema_${type}_${format}` component does not exist or format not defined:**
```js
`JsonSchema_${type}`
```

**Default:**
```js
`JsonSchema_string`
```

With this, one can define custom input components or override existing.

#### Example Date-Picker plugin

If one would like to input date values you could provide a custom plugin to integrate [react-datepicker](https://www.npmjs.com/package/react-datepicker) into swagger-ui.
All you need to do is to create a component to wrap [react-datepicker](https://www.npmjs.com/package/react-datepicker) accordingly to the format.

**There are two cases:**
- ```yaml
  type: string
  format: date
  ```
  The resulting name for mapping to succeed: `JsonSchema_string_date`
- ```yaml
  type: string
  format: date-time
  ```
  The resulting name for mapping to succeed: `JsonSchema_string_date-time`

This creates the need for two components and simple logic to strip any time input in case the format is date:
```js
import React from "react";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

const JsonSchema_string_date = (props) => {
  const dateNumber = Date.parse(props.value);
  const date = dateNumber
    ? new Date(dateNumber)
    : new Date();

  return (
    <DatePicker
      selected={date}
      onChange={d => props.onChange(d.toISOString().substring(0, 10))}
    />
  );
}

const JsonSchema_string_date_time = (props) => {
  const dateNumber = Date.parse(props.value);
  const date = dateNumber
    ? new Date(dateNumber)
    : new Date();

  return (
    <DatePicker
      selected={date}
      onChange={d => props.onChange(d.toISOString())}
      showTimeSelect
      timeFormat="p"
      dateFormat="Pp"
    />
  );
}


export const DateTimeSwaggerPlugin = {
  components: {
    JsonSchema_string_date: JsonSchema_string_date,
    "JsonSchema_string_date-time": JsonSchema_string_date_time
  }
};
```

/**
 * @prettier
 */

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const textMediaTypesGenerators = {
  "text/plain": (_, {idx} = {}) => Number.isInteger(idx) ? `string${idx}` : "string",
  "text/css": (_, {idx} = {}) => Number.isInteger(idx) ? `.selector { border: ${idx}px solid red }` : ".selector { border: 1px solid red }",
  "text/csv": (_, {idx} = {}) => Number.isInteger(idx) ? `value${idx},value${idx+1},value${idx+2}` : "value1,value2,value3",
  "text/html": (_, {idx} = {}) => Number.isInteger(idx) ? `<p>content${idx}</p>` : "<p>content</p>",
  "text/calendar": (_, {idx} = {}) => Number.isInteger(idx) ? `BEGIN:VCALENDAR\nSEQUENCE:${idx}` : "BEGIN:VCALENDAR",
  "text/javascript": (_, {idx} = {}) => Number.isInteger(idx) ? `console.dir('Hello world${idx}!');` : "console.dir('Hello world!');",
  "text/xml": (_, {idx} = {}) => Number.isInteger(idx) ? `<person age="${idx}">John Doe</person>` : '<person age="30">John Doe</person>',
  "text/*": (_, {idx} = {}) => Number.isInteger(idx) ? `string${idx}` : "string",
}

export default textMediaTypesGenerators

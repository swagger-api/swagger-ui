/**
 * @prettier
 */

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const textMediaTypesGenerators = {
  "text/plain": () => "string",
  "text/css": () => ".selector { border: 1px solid red }",
  "text/csv": () => "value1,value2,value3",
  "text/html": () => "<p>content</p>",
  "text/calendar": () => "BEGIN:VCALENDAR",
  "text/javascript": () => "console.dir('Hello world!');",
  "text/xml": () => '<person age="30">John Doe</person>',
  "text/*": () => "string",
}

export default textMediaTypesGenerators

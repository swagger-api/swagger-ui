/**
 * @prettier
 */
import { bytes } from "../../core/random"

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const applicationMediaTypesGenerators = {
  "application/json": (_, {idx} = {}) => Number.isInteger(idx) ? `{"key${idx}":"value${idx}"}` : '{"key":"value"}',
  "application/ld+json": (_, {idx} = {}) => Number.isInteger(idx) ? `{"name": "John Doe${idx}"}` : '{"name": "John Doe"}',
  "application/x-httpd-php": (_, {idx} = {}) => Number.isInteger(idx) ? `<?php echo '<p>Hello World${idx}!</p>'; ?>` : "<?php echo '<p>Hello World!</p>'; ?>",
  "application/rtf": (_, {idx} = {}) => Number.isInteger(idx) ? String.raw`{\rtf1\adeflang${idx}025\ansi\ansicpg1252\uc1` : String.raw`{\rtf1\adeflang1025\ansi\ansicpg1252\uc1`,
  "application/x-sh": (_, {idx} = {}) => Number.isInteger(idx) ? `echo "Hello World${idx}!"` : 'echo "Hello World!"',
  "application/xhtml+xml": (_, {idx} = {}) => Number.isInteger(idx) ? `<p>content${idx}</p>` : "<p>content</p>",
  "application/*": () => bytes(25).toString("binary"),
}

export default applicationMediaTypesGenerators

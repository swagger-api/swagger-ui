/**
 * @prettier
 */
import { bytes } from "../../core/random"

// https://developer.mozilla.org/en-US/docs/Web/HTTP/Basics_of_HTTP/MIME_types/Common_types
const applicationMediaTypesGenerators = {
  "application/json": () => '{"key":"value"}',
  "application/ld+json": () => '{"name": "John Doe"}',
  "application/x-httpd-php": () => "<?php echo '<p>Hello World!</p>'; ?>",
  "application/rtf": () => String.raw`{\rtf1\adeflang1025\ansi\ansicpg1252\uc1`,
  "application/x-sh": () => 'echo "Hello World!"',
  "application/xhtml+xml": () => "<p>content</p>",
  "application/*": () => bytes(25).toString("binary"),
}

export default applicationMediaTypesGenerators

---
id: ui-shell
type: module-design
status: draft
title: UI shell — components, rendering, layout, navigation
parent: architecture
depends-on: [core-runtime, document-lifecycle, auth, oas-versions]
---

## Responsibility

Everything that turns System state into the page and keeps the page navigable. That is the
shared component set in this directory and its containers, plus these base-preset plugins:

- **view** and **view-legacy**: the `getComponent` and `makeMappedContainer` root injects, and
  `render`. view uses React 18+ `createRoot`. view-legacy swaps in the React 16/17 renderer.
- **layout**: the `layout` slice, covering shown/expanded keys, the filter string, and the
  `layout` option. It wraps `specSelectors.taggedOperations` to apply `fn.opsFilter`.
- **filter**: `fn.opsFilter`, which matches operations by tag and path.
- **deep-linking**: syncs the URL hash with expanded tags and operations, and scrolls to the
  target.
- **safe-render**: wraps listed components in an error boundary (`fn.withErrorBoundary`), so one
  failing component renders a fallback instead of blanking the page.
- **syntax-highlighting**, **icons**, **accessibility**: highlighted code views, the icon
  components, and skip-to-operations.
- Styles live in `src/style` (SCSS, all scoped under `.swagger-ui`, except the dark-mode rules).

The base preset's `core-components` and `form-components` plugins register the components
under string names. OAS 2.0 and 3.0 documents render through these components plus the
JSON Schema 5 renderer ([json-schema](../plugins/json-schema-2020-12/SPEC.md)).

## Contracts

- **Lookup by name.** Components obtain one another through `getComponent(name)`, or
  `getComponent(name, true)` for a container mapped to the System, never through `import`. A
  missing name logs a warning and returns `null`, unless `{failSilently: true}` is passed.
- **Sanitization is mandatory for untrusted content.**
  - Markdown from a definition renders only through the `Markdown` provider
    (`providers/markdown.jsx`). It runs DOMPurify, forbids `style`/`form`, strips `style`/`class`
    unless the deprecated `useUnsafeMarkdown` is set, and forces `rel="noopener noreferrer"`.
  - Every `href` built from definition data passes through `sanitizeUrl` (`src/core/utils/url.js`),
    which maps `javascript:`, `data:`, and `vbscript:` to `about:blank`.
  - XSS regressions are covered in `test/unit/xss`.
- **Version-aware layout.** `BaseLayout` reads `isSwagger2`, `isOAS3`, `isOAS31`, and `isOAS32`
  from [oas-versions](../plugins/oas3/SPEC.md). It hands unsupported or ambiguous documents to
  `VersionPragmaFilter`, which the newest version plugin overrides.
- **Large documents are virtualized.** Above fixed thresholds (`src/core/utils/virtualization.ts`:
  100 models, 150 operations), the models list and the operations list render only what is in
  the viewport. This is not configurable. The rejected alternative of virtualizing schema
  property lists, and why it was rejected, is recorded in
  `.claude/implementation/perf-virtualization/README.md`.

## Known limitations

- `JumpToPath` is injected directly in `operation-summary.jsx` instead of through
  `wrapComponents`.
- The deep-linking legacy hash formats are still accepted but deprecated.

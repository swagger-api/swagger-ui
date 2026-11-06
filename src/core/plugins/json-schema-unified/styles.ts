/**
 * @prettier
 */

/**
 * Shared Tailwind class strings of the unified JSON Schema renderer.
 *
 * Each entry reproduces one rule set of the json-schema-2020-12 SCSS (named in
 * the comment above it), including its `_dark-mode.scss` counterpart. Colors
 * come from the `--color-json-schema-*` tokens in `src/style/tailwind.css`.
 *
 * Every class is a complete static literal, so the Tailwind scanner sees it.
 * Combine entries with `classnames`; never build class names from parts.
 *
 * Cross-component selectors of the SCSS (a parent styling a child of another
 * component) are arbitrary variants on the parent that target `data-*` hooks:
 * - `data-json-schema-unified` on the JSONSchema root (`<article>`);
 * - `data-json-schema-title` on the Title keyword's element.
 */

/** `.json-schema-2020-12` (schema root) without its background and padding, see `SCHEMA_BACKGROUND`. */
export const SCHEMA =
  "sui:mt-0 sui:mr-[20px] sui:mb-[15px] sui:ml-[20px] sui:first-of-type:m-[20px] sui:last-of-type:mx-[20px] sui:last-of-type:my-0 sui:rounded-[4px] sui:dark:bg-json-schema-dark-background sui:dark:[&_a]:text-json-schema-dark-link"

/**
 * `.json-schema-2020-12` background and padding, and `--embedded`. The
 * embedded `padding: 0 inherit 0 inherit` is invalid as a shorthand, but the
 * stylesheet build (postcss-preset-env) splits it into longhands, so the
 * compiled CSS applies `padding-top/bottom: 0` and inherits the left/right
 * padding (0 inside the properties list).
 */
export const SCHEMA_BACKGROUND = {
  root: "sui:bg-json-schema-background sui:pt-[12px] sui:pr-0 sui:pb-[12px] sui:pl-[20px]",
  embedded:
    "sui:bg-inherit sui:pt-0 sui:pb-0 sui:pl-[inherit] sui:pr-[inherit]",
} as const

/** `.json-schema-2020-12-body` (`margin: 2px 0` overrides the expansion-border margin). */
export const SCHEMA_BODY =
  "sui:mx-0 sui:my-[2px] sui:border-t-0 sui:border-r-0 sui:border-b-0 sui:border-l sui:border-dashed sui:border-json-schema-border sui:dark:border-json-schema-dark-muted"

/** `--collapsed` modifiers (`display: none`). */
export const HIDDEN = "sui:hidden"

/** `.json-schema-2020-12-keyword` and `.json-schema-2020-12-json-viewer`. */
export const KEYWORD = "sui:mx-0 sui:my-[5px]"

/** `.json-schema-2020-12-keyword__children` and `.json-schema-2020-12-json-viewer__children`. */
export const KEYWORD_CHILDREN =
  "sui:my-0 sui:mr-0 sui:ml-[20px] sui:p-0 sui:border-t-0 sui:border-r-0 sui:border-b-0 sui:border-l sui:border-dashed sui:border-json-schema-border"

/** `.json-schema-2020-12-keyword__name--{primary,secondary,extension}`. */
export const KEYWORD_NAME = {
  primary:
    "sui:ml-[20px] sui:text-[12px] sui:font-bold sui:text-json-schema-text sui:not-italic sui:dark:text-json-schema-dark-text",
  secondary:
    "sui:ml-[20px] sui:text-[12px] sui:font-bold sui:text-json-schema-secondary sui:italic sui:dark:text-json-schema-dark-muted",
  extension:
    "sui:ml-[20px] sui:text-[12px] sui:font-bold sui:text-json-schema-extension sui:italic",
} as const

/** `.json-schema-2020-12-keyword__value--{primary,secondary,extension,warning}`. */
export const KEYWORD_VALUE = {
  primary:
    "sui:text-[12px] sui:font-normal sui:text-json-schema-text sui:not-italic",
  secondary:
    "sui:text-[12px] sui:font-normal sui:text-json-schema-secondary sui:italic sui:dark:text-json-schema-dark-muted",
  extension:
    "sui:text-[12px] sui:font-normal sui:text-json-schema-extension sui:italic",
  warning:
    "sui:text-[12px] sui:font-[family-name:monospace] sui:font-semibold sui:not-italic sui:inline-block sui:ml-[10px] sui:leading-[1.5] sui:py-px sui:px-[4px] sui:rounded-[4px] sui:text-json-schema-warning sui:border sui:border-dashed sui:border-json-schema-warning sui:dark:text-json-schema-dark-warning sui:dark:border-json-schema-dark-warning",
} as const

/**
 * `__name--secondary + __value--secondary::before { content: "=" }`: add to a
 * value element that directly follows a secondary name element.
 */
export const VALUE_AFTER_NAME = "sui:before:content-['=']"

/**
 * JSONViewer name/value tones. `secondary` is the plain viewer; `primary` is
 * the `.json-schema-2020-12-keyword--{enum,const,default,examples}` scope and
 * `extension` the `.json-schema-2020-12-json-viewer-extension-keyword` scope.
 * In dark mode every viewer name/value is muted, whatever the tone.
 */
export const JSON_VIEWER_NAME = {
  primary:
    "sui:ml-[20px] sui:text-[12px] sui:font-bold sui:text-json-schema-text sui:not-italic sui:dark:text-json-schema-dark-muted",
  secondary:
    "sui:ml-[20px] sui:text-[12px] sui:font-bold sui:text-json-schema-secondary sui:italic sui:dark:text-json-schema-dark-muted",
  extension:
    "sui:ml-[20px] sui:text-[12px] sui:font-bold sui:text-json-schema-extension sui:italic sui:dark:text-json-schema-dark-muted",
} as const

export const JSON_VIEWER_VALUE = {
  primary:
    "sui:text-[12px] sui:font-normal sui:text-json-schema-text sui:not-italic sui:dark:text-json-schema-dark-muted sui:before:content-['=']",
  secondary:
    "sui:text-[12px] sui:font-normal sui:text-json-schema-secondary sui:italic sui:dark:text-json-schema-dark-muted sui:before:content-['=']",
  extension:
    "sui:text-[12px] sui:font-normal sui:text-json-schema-extension sui:italic sui:dark:text-json-schema-dark-muted sui:before:content-['=']",
} as const

export type Tone = keyof typeof JSON_VIEWER_NAME

/** `.json-schema-2020-12__attribute` and its `--primary/--muted/--warning` modifiers. */
export const ATTRIBUTE = {
  default:
    "sui:font-[family-name:monospace] sui:text-[12px] sui:lowercase sui:pl-[10px] sui:text-json-schema-text",
  primary:
    "sui:font-[family-name:monospace] sui:text-[12px] sui:lowercase sui:pl-[10px] sui:text-json-schema-prop-type sui:dark:text-json-schema-dark-prop-type",
  muted:
    "sui:font-[family-name:monospace] sui:text-[12px] sui:lowercase sui:pl-[10px] sui:text-json-schema-muted sui:dark:text-json-schema-dark-muted",
  warning:
    "sui:font-[family-name:monospace] sui:text-[12px] sui:lowercase sui:pl-[10px] sui:text-json-schema-warning sui:dark:text-json-schema-dark-warning",
} as const

/**
 * `.json-schema-2020-12-property` (every `<li>` holding a nested schema or
 * viewer entry), including the Title rules scoped to it:
 * `.json-schema-2020-12-property .json-schema-2020-12__title` (any depth).
 */
export const PROPERTY =
  "sui:list-none sui:mx-0 sui:my-[7px] sui:[&_[data-json-schema-title]]:font-[family-name:monospace] sui:[&_[data-json-schema-title]]:font-semibold sui:[&_[data-json-schema-title]]:text-json-schema-text sui:dark:[&_[data-json-schema-title]]:text-json-schema-dark-text sui:[&_[data-json-schema-title]]:text-[12px] sui:[&_[data-json-schema-title]]:align-middle"

/**
 * `.json-schema-2020-12-property--required > .json-schema-2020-12:first-of-type
 * > .json-schema-2020-12-head .json-schema-2020-12__title::after` (the red `*`).
 * The head is the first child of the schema root.
 */
export const PROPERTY_REQUIRED =
  "sui:[&>[data-json-schema-unified]:first-of-type>:first-child_[data-json-schema-title]]:after:content-['*'] sui:[&>[data-json-schema-unified]:first-of-type>:first-child_[data-json-schema-title]]:after:font-bold sui:[&>[data-json-schema-unified]:first-of-type>:first-child_[data-json-schema-title]]:after:text-json-schema-warning sui:dark:[&>[data-json-schema-unified]:first-of-type>:first-child_[data-json-schema-title]]:after:text-json-schema-dark-warning"

/**
 * `.json-schema-2020-12-keyword--patternProperties`: every descendant `<ul>`
 * loses margin/padding/border, and every first-of-type title gets `/…/`.
 */
export const PATTERN_PROPERTIES =
  "sui:[&_ul]:m-0 sui:[&_ul]:p-0 sui:[&_ul]:border-none sui:[&_[data-json-schema-title]:first-of-type]:before:content-['/'] sui:[&_[data-json-schema-title]:first-of-type]:before:text-json-schema-prop-type sui:dark:[&_[data-json-schema-title]:first-of-type]:before:text-json-schema-dark-prop-type sui:[&_[data-json-schema-title]:first-of-type]:after:content-['/'] sui:[&_[data-json-schema-title]:first-of-type]:after:text-json-schema-prop-type sui:dark:[&_[data-json-schema-title]:first-of-type]:after:text-json-schema-dark-prop-type"

/** `.json-schema-2020-12-keyword--properties > ul`. */
export const PROPERTIES_LIST = "sui:m-0 sui:p-0 sui:border-none"

/** `.json-schema-2020-12-keyword--$vocabulary ul` (expansion border, padding untouched). */
export const VOCABULARY_LIST =
  "sui:my-0 sui:mr-0 sui:ml-[20px] sui:border-t-0 sui:border-r-0 sui:border-b-0 sui:border-l sui:border-dashed sui:border-json-schema-border sui:dark:border-json-schema-dark-muted"

/** `.json-schema-2020-12-$vocabulary-uri` and `--disabled`. */
export const VOCABULARY_URI = {
  enabled: "sui:ml-[35px]",
  disabled: "sui:ml-[35px] sui:line-through",
} as const

/**
 * `.json-schema-2020-12-keyword--description` (plain-text and OAS markdown
 * Description). Its `margin-left: 20px` is overridden in the compiled CSS by
 * the later `.json-schema-2020-12-keyword` margin, so only `KEYWORD`'s margin
 * applies. The inner element's `json-schema-2020-12-core-keyword__value--secondary`
 * classes have no styles. `[&_p]:m-0` also wins over the Markdown component's
 * own `.markdown p` margin (utilities are `!important`), as the SCSS rule did.
 */
export const DESCRIPTION =
  "sui:text-json-schema-secondary sui:text-[12px] sui:[&_p]:m-0"

/**
 * The Schema tab's `Model` root, inside json-schema-5's `.model-box`
 * (oas31 `_model.scss`): the root schema has no margin and a 16px title,
 * every schema has no padding and no background, and the accordion /
 * "Expand all" buttons are transparent. In dark mode `.model-box` has the
 * schema's dark background, so transparent looks the same as there.
 */
export const MODEL =
  "sui:[&>[data-json-schema-unified][data-json-schema-level]]:m-0 sui:[&>[data-json-schema-unified][data-json-schema-level]>:first-child_[data-json-schema-title]:first-of-type]:text-[16px] sui:[&_[data-json-schema-unified][data-json-schema-level]]:p-0 sui:not-dark:[&_[data-json-schema-unified][data-json-schema-level]]:bg-transparent sui:not-dark:[&_[data-json-schema-unified]_button]:bg-transparent"

/**
 * `section.models` (`src/style/_models.scss`, `.is-open`,
 * `.models--virtualized`, dark-mode border), plus oas31 `_models.scss`: every
 * top-level schema is `calc(100% - 40px)` wide, scrolls horizontally and has
 * a 16px title.
 */
export const MODELS_SECTION = {
  base: "sui:mx-0 sui:my-[30px] sui:border sui:border-solid sui:border-[rgb(59_65_81/30%)] sui:rounded-[4px] sui:dark:border-[#545d61] sui:[&_[data-json-schema-unified][data-json-schema-level='0']]:w-[calc(100%-40px)] sui:[&_[data-json-schema-unified][data-json-schema-level='0']]:overflow-x-auto sui:[&_[data-json-schema-unified][data-json-schema-level='0']>:first-child_[data-json-schema-title]:first-of-type]:text-[16px]",
  open: "sui:pt-0 sui:px-0 sui:pb-[20px]",
  openVirtualized: "sui:p-0",
  closed: "sui:p-0",
} as const

/** `section.models h4` (headline text, hover tint) and its `.is-open` / dark-mode border. */
export const MODELS_HEADING = {
  base: "sui:flex sui:items-center sui:m-0 sui:pt-[10px] sui:pr-[20px] sui:pb-[10px] sui:pl-[10px] sui:font-[family-name:sans-serif] sui:text-[16px] sui:font-bold sui:text-[#606060] sui:cursor-pointer sui:[transition:all_0.2s] sui:hover:bg-[rgb(0_0_0/2%)] sui:[&_svg]:[transition:all_0.4s]",
  open: "sui:mb-[5px] sui:border-t-0 sui:border-r-0 sui:border-l-0 sui:border-b sui:border-solid sui:border-[rgb(59_65_81/30%)] sui:dark:border-[#545d61]",
  closed: "sui:border-0",
} as const

/**
 * `.models-control` (`all: inherit` from the heading, then `flex: 1`, no
 * border or padding; `src/style/_buttons.scss`) with its dark-mode focus and
 * icon color and the forced-colors icon rule.
 */
export const MODELS_CONTROL = {
  base: "sui:flex sui:flex-1 sui:items-center sui:m-0 sui:p-0 sui:border-none sui:bg-inherit sui:[font:inherit] sui:text-inherit sui:text-start sui:cursor-pointer sui:[transition:inherit] sui:focus:[outline:auto] sui:dark:focus:outline-none sui:dark:[&_svg]:text-[#b7bcbf] sui:forced-colors:[&_svg_path]:forced-color-adjust-none sui:forced-colors:[&_svg_path]:fill-[ButtonText]",
  open: "sui:mb-[5px]",
  closed: "",
} as const

/** `section.models h4 span` (`flex: 1`) and its dark-mode color. */
export const MODELS_CONTROL_LABEL = "sui:flex-1 sui:dark:text-[#e4e6e6]"

/** `section.models .models-scroll`. */
export const MODELS_SCROLL =
  "sui:max-h-[min(60vh,800px)] sui:overflow-y-auto sui:pt-[20px] sui:pb-[5px]"

/** `section.models .models-scroll .models-virtual-item`. */
export const MODELS_VIRTUAL_ITEM = "sui:pb-[15px]"

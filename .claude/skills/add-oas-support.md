---
name: add-oas-support
description: Add support for a new OpenAPI Specification version to Swagger UI
args:
  version:
    description: "OpenAPI version to add support for (e.g., 3.2, 4.0)"
    required: true
    type: string
  type:
    description: "Version type: 'major' for new major version, 'minor' for patch/minor"
    required: false
    type: string
    default: "minor"
---

# Add OpenAPI Specification Version Support

This skill guides you through adding support for a new OpenAPI Specification (OAS) version to Swagger UI, following the established architectural patterns from OAS 3.1 implementation.

---

## 📌 Quick Reference

> **New to this skill?** Skip to [Prerequisites](#prerequisites) for the full guide.
> **Already familiar?** Use this quick reference for rapid development.

### 🚀 Quick Start

```bash
# Major version (e.g., OAS 4.0)
/add-oas-support --version 4.0 --type major

# Minor version (e.g., OAS 3.2)
/add-oas-support --version 3.2 --type minor
```

### 📋 Essential Checklist

#### Phase 1: Specification Analysis ⭐ MOST IMPORTANT
- [ ] Access official spec at **https://spec.openapis.org/oas/v{VERSION}/**
- [ ] Use WebFetch to analyze spec systematically
- [ ] Create specification change document
- [ ] Map changes to components using [mapping table](#step-1d-map-specification-changes-to-swagger-ui-components)

#### Phase 2: Implementation
- [ ] Create plugin directory structure
- [ ] Implement version detection (`isOAS{VERSION}`)
- [ ] Create selector factories
- [ ] Implement components for each spec change
- [ ] Wrap existing components if modified
- [ ] Register plugin in preset (LAST position)

#### Phase 3: Testing & Documentation
- [ ] Add unit tests
- [ ] Add E2E tests with spec examples
- [ ] Update documentation
- [ ] Verify build & run full test suite

### 🔍 WebFetch Queries for Spec Analysis

```javascript
// 1. Fetch main spec differences
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "List all new top-level fields, modified fields, and removed fields compared to version {PREV_VERSION}"
)

// 2. Analyze new feature
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "Describe the '{NEW_FIELD}' field: structure, type, purpose, required/optional, and provide examples"
)

// 3. Check JSON Schema version
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "What JSON Schema version does this use? List changes from {PREV_JSON_SCHEMA_VERSION}"
)

// 4. Security schemes
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "List all security scheme types, highlighting new or changed types"
)
```

### 🗺️ Spec Change → Component Mapping (Quick)

| Spec Change | Component Action | File Location |
|-------------|------------------|---------------|
| **New top-level field (Object)** | Create new component | `components/{field}.jsx` |
| **New top-level field (String)** | Add to info or create display | `components/{field}.jsx` |
| **Modified Info object** | Wrap Info component | `wrap-components/info.jsx` |
| **New info subfield** | Create component + wrap Info | `components/info-{field}.jsx` |
| **New auth type** | Create auth component | `components/auth/{type}.jsx` |
| **Modified security** | Wrap auth selector | `auth-extensions/wrap-selectors.js` |
| **New operation field** | Extend Operation/selector | `spec-extensions/selectors.js` |
| **JSON Schema keyword** | Create keyword component | `json-schema-{V}-extensions/` |
| **JSON Schema version** | Create entire new plugin | `plugins/json-schema-{V}/` |

See [full mapping table with examples](#step-1d-map-specification-changes-to-swagger-ui-components) for detailed guidance.

### 📝 Component Implementation Pattern

**For each new feature:**

1. **Check spec first:**
   ```javascript
   WebFetch(url, "Describe {field} structure, type, examples")
   ```

2. **Create selector:**
   ```javascript
   // spec-extensions/selectors.js
   export const selectNewField = createSelector(
     (state) => state,
     (state) => state.getIn(["spec", "json", "newField"])
   )
   ```

3. **Create component:**
   ```javascript
   // components/new-field.jsx
   const NewField = ({ specSelectors, getComponent }) => {
     const data = specSelectors.selectNewField()
     if (!data) return null
     return <div>{/* render based on spec structure */}</div>
   }
   ```

4. **Register in plugin:**
   ```javascript
   // index.js
   components: { NewField },
   statePlugins: {
     spec: {
       selectors: {
         selectNewField: createOnlyOAS{V}Selector(selectNewField)
       }
     }
   }
   ```

5. **Add tests** (unit + E2E with spec examples)

### ⚠️ Common Pitfalls

1. ❌ **Guessing field structure** → ✅ Always check spec with WebFetch
2. ❌ **Forgetting @prettier pragma** → ✅ Add to all new files
3. ❌ **Wrong plugin load order** → ✅ New plugin LAST in preset
4. ❌ **Using semicolons** → ✅ No semicolons (project convention)
5. ❌ **Single quotes** → ✅ Use double quotes
6. ❌ **Skipping spec examples** → ✅ Use as test fixtures
7. ❌ **Hardcoded assumptions** → ✅ Verify everything in spec

### ✅ Pre-Submit Checklist

- [ ] All spec changes mapped to components
- [ ] All components reference spec in comments
- [ ] Tests use examples from spec
- [ ] Version detection regex correct
- [ ] Plugin loaded last in preset
- [ ] All tests passing (lint + unit + E2E)
- [ ] Build completes successfully
- [ ] Documentation updated
- [ ] No semicolons, double quotes everywhere
- [ ] @prettier pragma in all new files

### 📚 Quick Links

- **OAS Specs:** https://spec.openapis.org/
- **OAS 3.1:** https://spec.openapis.org/oas/v3.1.0/
- **OAS 3.0:** https://spec.openapis.org/oas/v3.0.3/
- **JSON Schema:** https://json-schema.org/
- **CLAUDE.md:** Complete codebase guide

### 🔖 Full Guide Navigation

Need detailed guidance? Jump to these sections:

- **[Prerequisites](#prerequisites)** - Setup and requirements
- **[Architecture Overview](#architecture-overview)** - Plugin system explained
- **[Key Design Patterns](#key-design-patterns-from-oas-31)** - Code patterns from OAS 3.1
- **[Step 1: Analyze Specification](#step-1-analyze-new-oas-version-specification)** - ⭐ Complete spec analysis workflow
  - [1D: Mapping Table](#step-1d-map-specification-changes-to-swagger-ui-components) - 15+ spec change types
  - [1E: Real Examples](#step-1e-examples-oas-31-specification-changes--components) - 6 detailed examples
  - [1H: WebFetch Workflow](#step-1h-using-webfetch-to-analyze-specifications) - Spec analysis with WebFetch
- **[Step 2-17: Implementation](#step-2-create-plugin-directory-structure)** - Complete implementation steps
- **[Practical Workflow](#practical-workflow-from-spec-to-components)** - End-to-end example
- **[Best Practices](#best-practices-iterative-spec-driven-development)** - Spec-driven development
- **[Common Pitfalls](#common-pitfalls)** - What to avoid
- **[Final Checklist](#final-checklist)** - Pre-submission verification

---

**Remember: The specification at https://spec.openapis.org/ is your source of truth!**

---

## Prerequisites

Before starting, ensure:
- You understand the Swagger UI plugin architecture
- You've read the CLAUDE.md guide
- You have the OAS specification document for the new version
- All tests pass: `npm test`

## Architecture Overview

Adding OAS version support involves:

1. **Plugin Creation** - New plugin following established patterns
2. **Version Detection** - Regex-based version identifier
3. **Selector Factories** - Conditional logic for version-specific features
4. **Component Implementation** - New/wrapped components for rendering
5. **State Management** - Redux selectors/actions for new features
6. **Lifecycle Hooks** - afterLoad modifications
7. **Preset Registration** - Plugin loading order
8. **Testing** - Unit and E2E tests
9. **Documentation** - Update guides and README

## Key Design Patterns (from OAS 3.1)

### Pattern 1: Version Detection
```javascript
export const isOAS{VERSION} = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")
  return (
    typeof oasVersion === "string" && /^{MAJOR}\.{MINOR}\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}
```

### Pattern 2: Selector Factories

**createOnlyOAS{VERSION}Selector** - Features exclusive to this version:
```javascript
export const createOnlyOAS{VERSION}Selector =
  (selector) =>
  (state, ...args) =>
  (system) => {
    if (system.getSystem().specSelectors.isOAS{VERSION}()) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(system)
        : selectedValue
    } else {
      return null
    }
  }
```

**createOnlyOAS{VERSION}SelectorWrapper** - Override previous versions:
```javascript
export const createOnlyOAS{VERSION}SelectorWrapper =
  (selector) =>
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.getSystem().specSelectors.isOAS{VERSION}()) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(oriSelector, system)
        : selectedValue
    } else {
      return oriSelector(...args)
    }
  }
```

### Pattern 3: Component Wrappers
```javascript
const ComponentWrapper = createOnlyOAS{VERSION}ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS{VERSION}Component = system.getComponent("OAS{VERSION}Component", true)
  return <OAS{VERSION}Component />
})
```

### Pattern 4: Function Wrapping
```javascript
export const wrapOAS{VERSION}Fn = (fn, system) => {
  const { fn: systemFn, specSelectors } = system
  return Object.fromEntries(
    Object.entries(fn).map(([name, newImpl]) => {
      const oriImpl = systemFn[name]
      const impl = (...args) =>
        specSelectors.isOAS{VERSION}()
          ? newImpl(...args)
          : typeof oriImpl === "function"
            ? oriImpl(...args)
            : undefined
      return [name, impl]
    })
  )
}
```

## Implementation Steps

### Step 1: Analyze New OAS Version Specification

**CRITICAL: Always start by reviewing the official specification at https://spec.openapis.org/**

#### 1A. Access the Official Specification

**Primary Resource:** https://spec.openapis.org/

**Available Versions:**
- OAS 2.0: https://spec.openapis.org/oas/v2.0/
- OAS 3.0.x: https://spec.openapis.org/oas/v3.0.3/
- OAS 3.1.x: https://spec.openapis.org/oas/v3.1.0/
- Future versions will follow the pattern: https://spec.openapis.org/oas/v{MAJOR}.{MINOR}.{PATCH}/

**What to download:**
1. The specification document (usually in HTML or Markdown format)
2. JSON Schema definitions (if available)
3. Example specification files
4. Change log or migration guide (if available)

#### 1B. Systematic Specification Analysis

Use the WebFetch tool to retrieve and analyze the specification:

```bash
# Example for analyzing OAS 4.0 (hypothetical)
WebFetch("https://spec.openapis.org/oas/v4.0.0/", "List all new top-level fields, objects, and keywords introduced in this version compared to OAS 3.1")
```

**Read these sections carefully:**

1. **Version Number Section**
   - Confirm the exact version format (e.g., "4.0.0", "3.2.0")
   - Note any version detection changes

2. **OpenAPI Object (Root Level)**
   - New top-level fields (e.g., `webhooks` in OAS 3.1)
   - Modified existing fields
   - Removed/deprecated fields

3. **Info Object**
   - New fields (e.g., `summary` in OAS 3.1)
   - Changes to `license`, `contact`, etc.

4. **Paths Object & Operations**
   - New operation-level fields
   - Changes to parameters, request bodies, responses
   - New callback syntax or features

5. **Components Object**
   - New component types
   - Schema changes (especially JSON Schema version)
   - New security schemes

6. **Security Object**
   - New authentication types (e.g., `mutualTLS` in OAS 3.1)
   - Changes to OAuth2 flows
   - New security-related fields

7. **Schema Object**
   - JSON Schema version change (critical!)
   - New keywords (e.g., `examples` vs `example`)
   - Type system changes

#### 1C. Create Specification Change Document

Create a structured document listing all changes:

**Template:**
```markdown
# OpenAPI {VERSION} Specification Analysis

## Version Information
- Version: {MAJOR}.{MINOR}.{PATCH}
- Release Date: YYYY-MM-DD
- Previous Version: {PREVIOUS_VERSION}
- JSON Schema Version: Draft {VERSION} or {YEAR}

## New Top-Level Fields
1. **`newField`** (Type: Object)
   - Location: Root level
   - Purpose: Description from spec
   - Required: Yes/No
   - Example from spec: {...}
   - Swagger UI Impact: Needs new component in BaseLayout

## Modified Existing Fields
1. **`info`**
   - New subfields: `summary`, `newField`
   - Changed behavior: Description
   - Swagger UI Impact: Need to wrap Info component

## New Operation-Level Features
1. **`newOperationField`**
   - Purpose: Description
   - Swagger UI Impact: Extend Operation component

## New Authentication Types
1. **`newAuthType`**
   - Type name: "newAuthType"
   - Fields: {...}
   - Swagger UI Impact: New auth component needed

## JSON Schema Changes
- Version change: Draft 2020-12 → Draft 2024
- New keywords: `keyword1`, `keyword2`
- Removed keywords: `oldKeyword`
- Swagger UI Impact: New json-schema plugin needed

## Breaking Changes
1. Removed `x-deprecated-field`
2. Changed behavior of `existingField`
3. Required fields now enforced

## Deprecated Features
1. `oldField` - Use `newField` instead
2. `oldAuthType` - Use `newAuthType` instead

## Examples from Specification
- Link to example files
- Notable edge cases to test
```

#### 1D. Map Specification Changes to Swagger UI Components

**CRITICAL MAPPING GUIDE:** Use this table to determine what components to create/modify:

| Spec Change Type | Swagger UI Component Type | Location | Example from OAS 3.1 |
|-----------------|---------------------------|----------|---------------------|
| **New Top-Level Field (Object)** | New standalone component | `components/{feature-name}.jsx` | `webhooks` → `Webhooks.jsx` |
| **New Top-Level Field (String/Primitive)** | Add to existing layout component or create info component | `components/{field-name}.jsx` | `jsonSchemaDialect` → `JsonSchemaDialect.jsx` |
| **Modified Info Object** | Wrap Info component OR create OAS{VERSION}Info | `wrap-components/info.jsx` | `info.summary` → Wrapped InfoContainer |
| **New Info Subfield** | Create new component, render in Info | `components/info-{field}.jsx` | `info.license.identifier` → OAS31License |
| **Modified License/Contact** | Wrap component | `wrap-components/license.jsx` | `license.identifier` → Wrapped License |
| **New Authentication Type** | New auth component | `components/auth/{type}.jsx` | `mutualTLS` → `MutualTLSAuth.jsx` |
| **Modified Security Scheme** | Wrap auth selector | `auth-extensions/wrap-selectors.js` | mutualTLS → `definitionsToAuthorize` wrapper |
| **New Operation Field** | Extend Operation or create plugin selector | `spec-extensions/selectors.js` | N/A in OAS 3.1 |
| **New Callback Feature** | Extend Callbacks component or wrap | `wrap-components/callbacks.jsx` | Enhanced in OAS 3.1 |
| **New Parameter Type** | Extend Parameters component | `components/parameters/` | N/A in OAS 3.1 |
| **New Response Feature** | Extend Responses component | `components/responses/` | N/A in OAS 3.1 |
| **New Media Type Feature** | Modify media-type component or fn | `oas{PREV}-extensions/fn.js` | File upload detection changes |
| **JSON Schema Keyword** | New keyword component | `json-schema-{VERSION}-extensions/components/keywords/` | `example` → `JSONSchema202012KeywordExample.jsx` |
| **JSON Schema Version Change** | Entire new plugin + samples plugin | `plugins/json-schema-{VERSION}/` | JSON Schema 2020-12 plugin |
| **Modified Schema Rendering** | Wrap schema component | `wrap-components/model.jsx` | Models → OAS31Models wrapper |
| **Version Detection Field** | Update VersionPragmaFilter | `components/version-pragma-filter.jsx` | Updated for isOAS31 |
| **Deprecated Field** | Remove or add deprecation warning | Component showing warning | N/A in OAS 3.1 |

#### 1E. Examples: OAS 3.1 Specification Changes → Components

**Example 1: `webhooks` Top-Level Field**

**From Spec (OAS 3.1):**
```yaml
openapi: 3.1.0
webhooks:
  newPet:
    post:
      requestBody:
        description: Information about a new pet
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/Pet'
      responses:
        '200':
          description: Return a 200 status
```

**Mapping Decision:**
- Type: New top-level field (Object containing operations)
- Location in spec: Root level, same structure as `paths`
- Swagger UI component: New standalone component
- File: `src/core/plugins/oas31/components/webhooks.jsx`
- Rendering: Reuses Operations component to render webhook operations
- Selector: `selectWebhooks` in `spec-extensions/selectors.js`
- Layout integration: Added to BaseLayout or StandaloneLayout

**Example 2: `info.summary` Field**

**From Spec (OAS 3.1):**
```yaml
info:
  title: My API
  summary: A brief summary of the API   # NEW in OAS 3.1
  description: Detailed description...
  version: 1.0.0
```

**Mapping Decision:**
- Type: New subfield in existing Info object
- Location: `info.summary`
- Swagger UI component: Wrap existing Info component
- File: `src/core/plugins/oas31/wrap-components/info.jsx` + `src/core/plugins/oas31/components/info.jsx`
- Selector: `selectInfoSummary` (if needed)
- Rendering: Display summary above or below title

**Example 3: `mutualTLS` Authentication Type**

**From Spec (OAS 3.1):**
```yaml
components:
  securitySchemes:
    myMutualTLS:
      type: mutualTLS    # NEW in OAS 3.1
      description: Client certificate authentication
```

**Mapping Decision:**
- Type: New authentication scheme type
- Location: `components.securitySchemes[name].type`
- Swagger UI component: New auth component
- File: `src/core/plugins/oas31/components/auth/mutual-tls-auth.jsx`
- Selector wrapper: `auth-extensions/wrap-selectors.js` → `definitionsToAuthorize`
- Rendering: Display in authorize modal with certificate upload UI

**Example 4: `license.identifier` Field**

**From Spec (OAS 3.1):**
```yaml
info:
  license:
    name: Apache 2.0
    identifier: Apache-2.0    # NEW in OAS 3.1 (SPDX ID)
    url: https://www.apache.org/licenses/LICENSE-2.0.html
```

**Mapping Decision:**
- Type: New optional field in license object (alternative to url)
- Location: `info.license.identifier`
- Swagger UI component: Wrap License component + create selector
- File: `src/core/plugins/oas31/wrap-components/license.jsx` + selector in `spec-extensions/selectors.js`
- Logic: If `identifier` exists, construct URL from SPDX registry
- Rendering: Make license text a hyperlink to SPDX page

**Example 5: JSON Schema 2020-12 Keywords**

**From Spec (OAS 3.1):**
```yaml
# OAS 3.1 uses JSON Schema 2020-12 which includes:
components:
  schemas:
    Pet:
      type: object
      properties:
        name:
          type: string
          example: Fluffy        # Changed from 'examples' array in OAS 3.0
      xml:                       # Now a JSON Schema keyword, not OAS-specific
        name: pet
      externalDocs:              # Now a JSON Schema keyword
        url: https://example.com
      discriminator:             # Now a JSON Schema keyword
        propertyName: petType
```

**Mapping Decision:**
- Type: JSON Schema version upgrade (Draft 7 → 2020-12)
- Location: Schema objects throughout spec
- Swagger UI components: Entire new plugin
- Files:
  - `src/core/plugins/json-schema-2020-12/` (main plugin)
  - `src/core/plugins/json-schema-2020-12-samples/` (sample generation)
  - `src/core/plugins/json-schema-2020-12/components/keywords/example.jsx`
  - `src/core/plugins/json-schema-2020-12/components/keywords/xml.jsx`
  - `src/core/plugins/json-schema-2020-12/components/keywords/discriminator.jsx`
  - `src/core/plugins/json-schema-2020-12/components/keywords/external-docs.jsx`
- Integration: OAS31 plugin extends JSON Schema 2020-12 keywords in `json-schema-2020-12-extensions/`

**Example 6: `jsonSchemaDialect` Top-Level Field**

**From Spec (OAS 3.1):**
```yaml
openapi: 3.1.0
jsonSchemaDialect: https://spec.openapis.org/oas/3.1/dialect/base  # NEW in OAS 3.1
```

**Mapping Decision:**
- Type: New top-level field (String/URI)
- Location: Root level
- Swagger UI component: Simple display component
- File: `src/core/plugins/oas31/components/json-schema-dialect.jsx`
- Selector: `selectJsonSchemaDialectField` in `spec-extensions/selectors.js`
- Rendering: Show in info section with warning if non-default

#### 1F. Specification Analysis Checklist

Use WebFetch and Read tools to systematically check:

- [ ] **Accessed official spec at https://spec.openapis.org/**
- [ ] **Downloaded specification document**
- [ ] **Read version number section**
- [ ] **Analyzed OpenAPI Object (root level) changes**
- [ ] **Reviewed Info Object modifications**
- [ ] **Checked Paths/Operations changes**
- [ ] **Examined Components Object updates**
- [ ] **Identified Security Scheme changes**
- [ ] **Analyzed Schema Object / JSON Schema version**
- [ ] **Listed all new top-level fields**
- [ ] **Listed all modified existing fields**
- [ ] **Documented breaking changes**
- [ ] **Identified deprecated features**
- [ ] **Found example specifications**
- [ ] **Created specification change document**
- [ ] **Mapped changes to Swagger UI components using table above**
- [ ] **Prioritized implementation order**

#### 1G. Questions to Answer During Analysis

**Version Type:**
- Is this a major version (4.0) or minor version (3.2)?
- Are there breaking changes?
- Is backward compatibility maintained?

**JSON Schema:**
- Does it use a new JSON Schema version?
- What new keywords are available?
- Are there removed/deprecated keywords?

**Top-Level Changes:**
- What new top-level fields are added?
- Which existing fields have new subfields?
- Any removed top-level fields?

**Operation Changes:**
- Are there new operation-level features?
- Changes to parameters, request bodies, responses?
- New callback or link syntax?

**Security Changes:**
- What authentication types are new/changed?
- OAuth2 flow modifications?
- New security requirements?

**Media Type Changes:**
- Are there new media type features?
- File upload handling changes?
- Encoding changes?

**Component Mapping:**
- Which components need to be created from scratch?
- Which existing components need to be wrapped?
- What selectors are required?
- Are new plugins needed (e.g., for JSON Schema)?

**Implementation Priority:**
- What's the critical path for basic rendering?
- Which features can be added incrementally?
- What has the highest user impact?

### Step 1H: Using WebFetch to Analyze Specifications

**Always use WebFetch tool to retrieve and analyze the specification systematically.**

**Step-by-step WebFetch workflow:**

1. **Fetch the specification landing page:**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "Provide a summary of this OpenAPI Specification version, including links to the full specification document and any change logs or migration guides."
)
```

2. **Analyze the specification structure:**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "List all top-level fields in the OpenAPI Object for this version. For each field, indicate if it is new, modified, or unchanged from version {PREVIOUS_VERSION}."
)
```

3. **Deep dive into new features:**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "Describe the '{NEW_FIELD}' field in detail: its type, structure, purpose, whether it's required, and provide examples from the specification."
)
```

4. **Analyze security changes:**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "List all security scheme types supported in this version. Highlight any new or changed security scheme types compared to {PREVIOUS_VERSION}."
)
```

5. **Check JSON Schema compatibility:**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "What version of JSON Schema does this OpenAPI Specification version use? List any specific dialect or modifications to JSON Schema."
)
```

6. **Find example specifications:**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v{VERSION}/",
  "Provide links to example OpenAPI specification files for this version, particularly examples that demonstrate new features."
)
```

**Real example from analyzing OAS 3.1:**

```javascript
// 1. Initial analysis
WebFetch(
  "https://spec.openapis.org/oas/v3.1.0/",
  "List all new fields and features introduced in OpenAPI 3.1.0 compared to OpenAPI 3.0.3"
)

// Response would include:
// - webhooks field (new top-level)
// - info.summary (new)
// - info.license.identifier (new)
// - jsonSchemaDialect (new top-level)
// - mutualTLS security scheme type (new)
// - JSON Schema 2020-12 (changed from Draft 7)

// 2. Deep dive into webhooks
WebFetch(
  "https://spec.openapis.org/oas/v3.1.0/",
  "Explain the 'webhooks' field in detail: structure, purpose, and provide a complete example"
)

// 3. Understand JSON Schema changes
WebFetch(
  "https://spec.openapis.org/oas/v3.1.0/",
  "What are the differences between JSON Schema Draft 7 (used in OAS 3.0) and JSON Schema 2020-12 (used in OAS 3.1) that affect schema definitions?"
)
```

**Pro tip:** Use multiple targeted queries rather than one broad query. This gives more precise information for each component you need to implement.

### Step 2: Create Plugin Directory Structure

**Directory:** `src/core/plugins/oas{VERSION_NUMBER}/`

**Files to Create:**
```
src/core/plugins/oas{VERSION_NUMBER}/
├── index.js                          # Main plugin export
├── fn.js                             # Selector/function factories
├── selectors.js                      # Version-specific selectors (if needed)
├── after-load.js                     # Lifecycle hook
├── auth-extensions/                  # Authentication features
│   └── wrap-selectors.js
├── oas{PREVIOUS_VERSION}-extensions/ # Extensions to previous version
│   └── fn.js
├── spec-extensions/                  # Spec-level features
│   ├── selectors.js
│   └── wrap-selectors.js
├── components/                       # New components
│   ├── version-pragma-filter.jsx
│   ├── {new-feature-1}.jsx
│   └── auth/
│       └── {new-auth-type}.jsx
├── wrap-components/                  # Component wrappers
│   ├── info.jsx
│   ├── license.jsx
│   └── {existing-component}.jsx
└── json-schema-{VERSION}-extensions/ # If new JSON Schema version
    ├── fn.js
    ├── components/keywords/
    └── wrap-components/keywords/
```

**Create the directories:**
```bash
mkdir -p src/core/plugins/oas{VERSION_NUMBER}/{auth-extensions,oas{PREVIOUS_VERSION}-extensions,spec-extensions,components/auth,wrap-components}
```

### Step 3: Implement Version Detection (fn.js)

**File:** `src/core/plugins/oas{VERSION_NUMBER}/fn.js`

**Template:**
```javascript
/**
 * @prettier
 */

/**
 * Detects if a spec is OpenAPI {MAJOR}.{MINOR}.x
 */
export const isOAS{VERSION} = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")
  return (
    typeof oasVersion === "string" &&
    /^{MAJOR}\.{MINOR}\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}

/**
 * Creates a selector that only returns a value for OAS {VERSION} specs
 */
export const createOnlyOAS{VERSION}Selector =
  (selector) =>
  (state, ...args) =>
  (system) => {
    if (system.getSystem().specSelectors.isOAS{VERSION}()) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(system)
        : selectedValue
    } else {
      return null
    }
  }

/**
 * Creates a selector wrapper that uses new impl for OAS {VERSION}, falls back to original
 */
export const createOnlyOAS{VERSION}SelectorWrapper =
  (selector) =>
  (oriSelector, system) =>
  (state, ...args) => {
    if (system.getSystem().specSelectors.isOAS{VERSION}()) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(oriSelector, system)
        : selectedValue
    } else {
      return oriSelector(...args)
    }
  }

/**
 * Creates a system-aware selector
 */
export const createSystemSelector =
  (selector) =>
  (state, ...args) =>
  (system) => {
    const selectedValue = selector(state, system, ...args)
    return typeof selectedValue === "function"
      ? selectedValue(system)
      : selectedValue
  }

/**
 * Creates a component wrapper that only renders for OAS {VERSION}
 */
export const createOnlyOAS{VERSION}ComponentWrapper =
  (Component) =>
  ({ ...props }) => {
    const { specSelectors } = props
    const isOAS{VERSION} = specSelectors.isOAS{VERSION}()

    return isOAS{VERSION} ? <Component {...props} /> : props.Ori()
  }

/**
 * Wraps functions to conditionally use OAS {VERSION} implementations
 */
export const wrapOAS{VERSION}Fn = (fn, system) => {
  const { fn: systemFn, specSelectors } = system
  return Object.fromEntries(
    Object.entries(fn).map(([name, newImpl]) => {
      const oriImpl = systemFn[name]
      const impl = (...args) =>
        specSelectors.isOAS{VERSION}()
          ? newImpl(...args)
          : typeof oriImpl === "function"
            ? oriImpl(...args)
            : undefined
      return [name, impl]
    })
  )
}
```

### Step 4: Create Main Plugin Export (index.js)

**File:** `src/core/plugins/oas{VERSION_NUMBER}/index.js`

**Template:**
```javascript
/**
 * @prettier
 */

import afterLoad from "./after-load.js"
import {
  isOAS{VERSION},
  createSystemSelector,
  createOnlyOAS{VERSION}Selector,
  createOnlyOAS{VERSION}SelectorWrapper,
  createOnlyOAS{VERSION}ComponentWrapper,
} from "./fn.js"

// Import spec extensions
import * as specExtensionsSelectors from "./spec-extensions/selectors.js"
import * as specExtensionsWrapSelectors from "./spec-extensions/wrap-selectors.js"

// Import auth extensions
import * as authExtensionsWrapSelectors from "./auth-extensions/wrap-selectors.js"

// Import OAS{PREVIOUS_VERSION} extensions
import * as oas{PREVIOUS_VERSION}ExtensionsFn from "./oas{PREVIOUS_VERSION}-extensions/fn.js"

// Import components
import VersionPragmaFilter from "./components/version-pragma-filter.jsx"
// Import new feature components here

// Import wrap components
import InfoWrapper from "./wrap-components/info.jsx"
// Import other wrappers here

/**
 * OpenAPI {MAJOR}.{MINOR} Plugin
 *
 * Adds support for OpenAPI Specification {MAJOR}.{MINOR}.x
 *
 * This plugin should be loaded AFTER:
 * - oas{PREVIOUS_VERSION} plugin
 * - json-schema-{JSON_SCHEMA_VERSION} plugin (if applicable)
 *
 * It wraps and overrides components/selectors from previous versions.
 */
const OpenAPI{VERSION}Plugin = ({ fn }) => {
  return {
    fn: {
      oas{VERSION_NUMBER}: {
        isOAS{VERSION},
        createSystemSelector,
        createOnlyOAS{VERSION}Selector,
        createOnlyOAS{VERSION}SelectorWrapper,
        createOnlyOAS{VERSION}ComponentWrapper,
      },
    },
    components: {
      // New components
      OAS{VERSION}VersionPragmaFilter: VersionPragmaFilter,
      // Add new feature components here
    },
    wrapComponents: {
      // Wrapped components
      VersionPragmaFilter: (Ori, system) =>
        system.specSelectors.isOAS{VERSION}()
          ? system.getComponent("OAS{VERSION}VersionPragmaFilter", true)
          : Ori,
      InfoContainer: InfoWrapper,
      // Add other wrappers here
    },
    statePlugins: {
      spec: {
        selectors: {
          // Add version detection selector
          isOAS{VERSION}: createSystemSelector(specExtensionsSelectors.selectIsOAS{VERSION}),
          // Add new feature selectors here
        },
        wrapSelectors: {
          // Wrap previous version selectors if needed
          ...specExtensionsWrapSelectors,
        },
      },
      auth: {
        wrapSelectors: {
          // Add auth extensions if needed
          ...authExtensionsWrapSelectors,
        },
      },
      oas{VERSION_NUMBER}: {
        selectors: {
          // Plugin-specific selectors
        },
      },
    },
    afterLoad,
  }
}

export default OpenAPI{VERSION}Plugin
```

### Step 5: Implement Spec Extensions

**File:** `src/core/plugins/oas{VERSION_NUMBER}/spec-extensions/selectors.js`

**Template:**
```javascript
/**
 * @prettier
 */

import { createSelector } from "reselect"
import { isOAS{VERSION} } from "../fn.js"

/**
 * Detects if the current spec is OAS {VERSION}
 */
export const selectIsOAS{VERSION} = (state, system) => () => {
  const spec = system.specSelectors.specJson()
  return isOAS{VERSION}(spec)
}

// Add selectors for new OAS {VERSION} fields here
// Example:
// export const selectNewField = createSelector(
//   (state) => state,
//   (state) => {
//     const spec = state.getIn(["spec", "json"])
//     return spec.get("newField")
//   }
// )
```

**File:** `src/core/plugins/oas{VERSION_NUMBER}/spec-extensions/wrap-selectors.js`

**Template:**
```javascript
/**
 * @prettier
 */

import { createOnlyOAS{VERSION}SelectorWrapper } from "../fn.js"

// Wrap previous version selectors if behavior changes
// Example:
// export const isOAS{PREVIOUS_VERSION} = createOnlyOAS{VERSION}SelectorWrapper((state) => () => false)

// This makes isOAS{PREVIOUS_VERSION} return false when spec is OAS {VERSION}
```

### Step 6: Create Version Pragma Filter Component

**File:** `src/core/plugins/oas{VERSION_NUMBER}/components/version-pragma-filter.jsx`

**Template:**
```javascript
/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"

const OAS{VERSION}VersionPragmaFilter = ({ bypass, isSwagger2, isOAS3, isOAS{PREVIOUS_VERSION}, isOAS{VERSION} }) => {
  // Handle version detection logic
  const isAmbiguous =
    (isSwagger2 && isOAS3) ||
    (isSwagger2 && isOAS{PREVIOUS_VERSION}) ||
    (isSwagger2 && isOAS{VERSION}) ||
    (isOAS3 && isOAS{PREVIOUS_VERSION}) ||
    (isOAS3 && isOAS{VERSION}) ||
    (isOAS{PREVIOUS_VERSION} && isOAS{VERSION})

  const isMissing = !isSwagger2 && !isOAS3 && !isOAS{PREVIOUS_VERSION} && !isOAS{VERSION}

  if (bypass) {
    return null
  }

  if (isAmbiguous) {
    return (
      <div className="version-pragma">
        <div className="version-pragma__message version-pragma__message--ambiguous">
          <div>
            <h3>Unable to render this document, as it contains multiple OpenAPI version fields.</h3>
          </div>
        </div>
      </div>
    )
  }

  if (isMissing) {
    return (
      <div className="version-pragma">
        <div className="version-pragma__message version-pragma__message--missing">
          <div>
            <h3>Unable to render this document, as it doesn&apos;t contain an OpenAPI version field.</h3>
          </div>
        </div>
      </div>
    )
  }

  return null
}

OAS{VERSION}VersionPragmaFilter.propTypes = {
  bypass: PropTypes.bool,
  isSwagger2: PropTypes.bool.isRequired,
  isOAS3: PropTypes.bool.isRequired,
  isOAS{PREVIOUS_VERSION}: PropTypes.bool.isRequired,
  isOAS{VERSION}: PropTypes.bool.isRequired,
}

OAS{VERSION}VersionPragmaFilter.defaultProps = {
  bypass: false,
}

export default OAS{VERSION}VersionPragmaFilter
```

### Step 7: Implement New Feature Components

For each new feature in the OAS specification:

**Example: New Feature Component**
```javascript
/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"

const NewFeature = ({ getComponent, specSelectors }) => {
  const newFeature = specSelectors.selectNewFeature()

  if (!newFeature || !newFeature.size) {
    return null
  }

  // Render the new feature
  return (
    <div className="opblock-tag-section">
      <h3>New Feature</h3>
      {/* Render logic here */}
    </div>
  )
}

NewFeature.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default NewFeature
```

### Step 8: Create Component Wrappers

**File:** `src/core/plugins/oas{VERSION_NUMBER}/wrap-components/info.jsx`

**Template:**
```javascript
/**
 * @prettier
 */

import { createOnlyOAS{VERSION}ComponentWrapper } from "../fn.js"

const InfoWrapper = createOnlyOAS{VERSION}ComponentWrapper(({ getSystem }) => {
  const system = getSystem()
  const OAS{VERSION}Info = system.getComponent("OAS{VERSION}Info", true)
  return <OAS{VERSION}Info />
})

export default InfoWrapper
```

### Step 9: Implement afterLoad Hook

**File:** `src/core/plugins/oas{VERSION_NUMBER}/after-load.js`

**Template:**
```javascript
/**
 * @prettier
 */

import { wrapOAS{VERSION}Fn } from "./fn.js"

/**
 * afterLoad hook for OAS {VERSION} plugin
 *
 * This hook runs after all plugins are loaded and allows
 * modification of the system's functions and behaviors.
 */
function afterLoad({ fn, getSystem }) {
  const system = getSystem()

  // Override functions that differ in OAS {VERSION}
  if (typeof fn.sampleFromSchema === "function") {
    // Example: Wrap sample generation if JSON Schema version changed
    // const wrappedFns = wrapOAS{VERSION}Fn({
    //   sampleFromSchema: fn.jsonSchema{VERSION}.sampleFromSchema,
    // }, system)
    // Object.assign(this.fn, wrappedFns)
  }

  // Override other functions as needed
  // Example: File upload detection
  // if (typeof fn.isFileUploadIntended === "function") {
  //   const wrappedFns = wrapOAS{VERSION}Fn({
  //     isFileUploadIntended: makeIsFileUploadIntended(system),
  //   }, system)
  //   Object.assign(this.fn, wrappedFns)
  // }
}

export default afterLoad
```

### Step 10: Handle Authentication Changes

If new authentication types are introduced:

**File:** `src/core/plugins/oas{VERSION_NUMBER}/components/auth/{auth-type}.jsx`

**Template:**
```javascript
/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"

const NewAuthType = ({ schema, name, getComponent, onChange, authorized }) => {
  const authValue = authorized && authorized.getIn([name])

  const Input = getComponent("Input")
  const Button = getComponent("Button")

  // Render auth UI
  return (
    <div>
      <h4>{schema.get("description") || `${name} (${schema.get("type")})`}</h4>
      {/* Auth UI here */}
    </div>
  )
}

NewAuthType.propTypes = {
  schema: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  authorized: PropTypes.object,
}

export default NewAuthType
```

**File:** `src/core/plugins/oas{VERSION_NUMBER}/auth-extensions/wrap-selectors.js`

**Template:**
```javascript
/**
 * @prettier
 */

import { createOnlyOAS{VERSION}SelectorWrapper } from "../fn.js"
import { Map } from "immutable"

/**
 * Wraps definitionsToAuthorize to include new auth types
 */
export const definitionsToAuthorize = createOnlyOAS{VERSION}SelectorWrapper(
  (state, system) =>
    (oriSelector) => {
      const definitions = oriSelector()
      const securityDefinitions = system.specSelectors.securityDefinitions() || Map()

      // Add new auth types to definitions
      return definitions.map((definition) => {
        const schema = securityDefinitions.get(definition.get("name"))
        if (schema && schema.get("type") === "newAuthType") {
          // Add new auth type logic
          return definition.set("newAuthType", true)
        }
        return definition
      })
    }
)
```

### Step 11: Register Plugin in Preset

**File:** `src/core/presets/apis/index.js`

**Add import:**
```javascript
import OpenAPI{VERSION}Plugin from "../../plugins/oas{VERSION_NUMBER}/index.js"
```

**Add to preset array (IMPORTANT: add at the end):**
```javascript
export default function PresetApis() {
  return [
    BasePreset,
    OpenAPI30Plugin,
    // ... other plugins
    OpenAPI{PREVIOUS_VERSION}Plugin,
    OpenAPI{VERSION}Plugin,  // Load LAST to override previous versions
  ]
}
```

**Why load last?**
- Wrap-components override previous versions
- Wrap-selectors intercept earlier selectors
- afterLoad modifications apply to dependencies

### Step 12: Add Unit Tests

**Directory:** `test/unit/core/plugins/oas{VERSION_NUMBER}/`

**File:** `test/unit/core/plugins/oas{VERSION_NUMBER}/fn.js`

**Template:**
```javascript
/**
 * @prettier
 */

import { fromJS } from "immutable"
import { isOAS{VERSION} } from "src/core/plugins/oas{VERSION_NUMBER}/fn.js"

describe("oas{VERSION_NUMBER} plugin - fn - isOAS{VERSION}", () => {
  it("should match OpenAPI {MAJOR}.{MINOR}.0", () => {
    const spec = fromJS({ openapi: "{MAJOR}.{MINOR}.0" })
    expect(isOAS{VERSION}(spec)).toBe(true)
  })

  it("should match OpenAPI {MAJOR}.{MINOR}.1", () => {
    const spec = fromJS({ openapi: "{MAJOR}.{MINOR}.1" })
    expect(isOAS{VERSION}(spec)).toBe(true)
  })

  it("should match OpenAPI {MAJOR}.{MINOR}.25", () => {
    const spec = fromJS({ openapi: "{MAJOR}.{MINOR}.25" })
    expect(isOAS{VERSION}(spec)).toBe(true)
  })

  it("should NOT match OpenAPI {MAJOR}.{MINOR}", () => {
    const spec = fromJS({ openapi: "{MAJOR}.{MINOR}" })
    expect(isOAS{VERSION}(spec)).toBe(false)
  })

  it("should NOT match OpenAPI {MAJOR}.{MINOR}.01 (leading zero)", () => {
    const spec = fromJS({ openapi: "{MAJOR}.{MINOR}.01" })
    expect(isOAS{VERSION}(spec)).toBe(false)
  })

  it("should NOT match OpenAPI {DIFFERENT_MAJOR}.{DIFFERENT_MINOR}.0", () => {
    const spec = fromJS({ openapi: "{DIFFERENT_MAJOR}.{DIFFERENT_MINOR}.0" })
    expect(isOAS{VERSION}(spec)).toBe(false)
  })

  it("should NOT match swagger: 2.0", () => {
    const spec = fromJS({ swagger: "2.0" })
    expect(isOAS{VERSION}(spec)).toBe(false)
  })

  it("should handle null spec", () => {
    const spec = fromJS({})
    expect(isOAS{VERSION}(spec)).toBe(false)
  })
})
```

**File:** `test/unit/core/plugins/oas{VERSION_NUMBER}/components/version-pragma-filter.jsx`

**Template:**
```javascript
/**
 * @prettier
 */

import React from "react"
import { shallow } from "enzyme"
import OAS{VERSION}VersionPragmaFilter from "src/core/plugins/oas{VERSION_NUMBER}/components/version-pragma-filter.jsx"

describe("OAS{VERSION}VersionPragmaFilter", () => {
  it("should render nothing when bypass is true", () => {
    const wrapper = shallow(
      <OAS{VERSION}VersionPragmaFilter
        bypass={true}
        isSwagger2={false}
        isOAS3={false}
        isOAS{PREVIOUS_VERSION}={false}
        isOAS{VERSION}={true}
      />
    )
    expect(wrapper.type()).toBe(null)
  })

  it("should render nothing when version is valid", () => {
    const wrapper = shallow(
      <OAS{VERSION}VersionPragmaFilter
        bypass={false}
        isSwagger2={false}
        isOAS3={false}
        isOAS{PREVIOUS_VERSION}={false}
        isOAS{VERSION}={true}
      />
    )
    expect(wrapper.type()).toBe(null)
  })

  it("should render error when version is ambiguous", () => {
    const wrapper = shallow(
      <OAS{VERSION}VersionPragmaFilter
        bypass={false}
        isSwagger2={true}
        isOAS3={false}
        isOAS{PREVIOUS_VERSION}={false}
        isOAS{VERSION}={true}
      />
    )
    expect(wrapper.find(".version-pragma__message--ambiguous")).toHaveLength(1)
  })

  it("should render error when version is missing", () => {
    const wrapper = shallow(
      <OAS{VERSION}VersionPragmaFilter
        bypass={false}
        isSwagger2={false}
        isOAS3={false}
        isOAS{PREVIOUS_VERSION}={false}
        isOAS{VERSION}={false}
      />
    )
    expect(wrapper.find(".version-pragma__message--missing")).toHaveLength(1)
  })
})
```

### Step 13: Add E2E Tests

**Directory:** `test/e2e-cypress/e2e/features/oas{VERSION_NUMBER}/`

**Create test spec file:**
```javascript
/**
 * @prettier
 */

describe("OpenAPI {MAJOR}.{MINOR} features", () => {
  it("should detect OAS {VERSION} version", () => {
    cy.visit("/oas{VERSION_NUMBER}-spec.html")
    cy.get(".information-container .version").should("contain", "{MAJOR}.{MINOR}.0")
  })

  // Add tests for new features
  it("should render new feature X", () => {
    cy.visit("/oas{VERSION_NUMBER}-spec.html")
    cy.get(".opblock-tag-section").should("contain", "New Feature")
  })
})
```

**Add test fixtures:**
- Create sample OAS {VERSION} spec in `test/e2e-cypress/static/documents/oas{VERSION_NUMBER}/`
- Create HTML fixture in `test/e2e-cypress/static/` referencing the spec

### Step 14: Update Documentation

**Files to update:**

1. **README.md** - Add OAS {VERSION} to supported versions
2. **CLAUDE.md** - Add plugin to list and update version compatibility
3. **docs/usage/version-detection.md** - Document new version detection
4. **package.json** - Update description if needed

**Example README.md update:**
```markdown
### OpenAPI Specification Compatibility

- **OpenAPI 2.0** (Swagger)
- **OpenAPI 3.0.x**
- **OpenAPI 3.1.x**
- **OpenAPI {MAJOR}.{MINOR}.x** ⭐ NEW
```

### Step 15: Verify Build

**Run full build:**
```bash
npm run clean
npm run build
```

**Check dist/ output:**
- `dist/swagger-ui.js` - Should include new plugin
- `dist/swagger-ui.css` - Should include new styles (if any)
- Bundle size should be reasonable

**Run artifact tests:**
```bash
npm run test:artifact
```

### Step 16: Run Full Test Suite

```bash
npm run lint-errors      # ESLint errors only
npm run test:unit        # Jest unit tests
npm run cy:ci            # Cypress E2E tests
```

**All tests must pass before submitting PR.**

### Step 17: Create Pull Request

**Commit message format:**
```
feat(oas{VERSION_NUMBER}): add support for OpenAPI {MAJOR}.{MINOR}

Implement OpenAPI {MAJOR}.{MINOR}.x specification support with:
- Version detection and plugin architecture
- New feature X rendering
- New authentication type Y support
- JSON Schema {VERSION} integration (if applicable)

Closes #{ISSUE_NUMBER}
```

**PR checklist:**
- [ ] All tests passing
- [ ] New feature components implemented
- [ ] Unit tests added
- [ ] E2E tests added
- [ ] Documentation updated
- [ ] Build completes successfully
- [ ] No ESLint errors
- [ ] Follows existing code patterns

## Common Pitfalls

1. **Don't forget @prettier pragma** - Add to all new files
2. **Plugin loading order matters** - Load new plugin LAST in preset
3. **Use double quotes** - Project convention
4. **No semicolons** - Project convention
5. **Always use DOMPurify** - For any user-provided HTML
6. **Test with real specs** - Use actual OAS {VERSION} examples
7. **Don't modify core unnecessarily** - Use plugin architecture
8. **Version regex must be exact** - Follow pattern from OAS 3.1
9. **Component wrappers return Ori()** - When not active version
10. **afterLoad runs after all plugins** - Safe to modify system

## JSON Schema Version Changes

If the new OAS version uses a different JSON Schema version:

1. **Create json-schema-{VERSION} plugin** (separate from OAS plugin)
2. **Implement keyword components** for new schema features
3. **Update sample generation** logic
4. **Add schema validation** support
5. **Load json-schema-{VERSION} plugin BEFORE oas{VERSION_NUMBER}** in preset

Example from OAS 3.1 using JSON Schema 2020-12:
- `src/core/plugins/json-schema-2020-12/` - Main plugin
- `src/core/plugins/json-schema-2020-12-samples/` - Sample generation
- Loaded before `oas31` plugin in preset

## Major vs Minor Version Considerations

### Major Version (e.g., 4.0)

**Likely includes:**
- Breaking changes from previous major version
- New top-level fields
- Removed/deprecated features
- Possibly new JSON Schema version
- New authentication paradigms
- Restructured spec format

**Implementation approach:**
- Create completely separate plugin
- May need to create new base components
- Extensive wrapping of previous version components
- Significant selector overrides
- New preset configuration options

### Minor Version (e.g., 3.2)

**Likely includes:**
- Backward-compatible additions
- New optional fields
- Enhanced existing features
- Same JSON Schema version
- Incremental improvements

**Implementation approach:**
- Lighter plugin with focused additions
- Fewer component wrappers needed
- Selective selector additions
- Reuse most of previous version logic
- Simpler afterLoad modifications

## Example: Adding OAS 4.0 (Major)

**Version detection:**
```javascript
export const isOAS40 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")
  return (
    typeof oasVersion === "string" && /^4\.0\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}
```

**Directory:** `src/core/plugins/oas40/`

**Wrap previous version:**
```javascript
// spec-extensions/wrap-selectors.js
export const isOAS31 = createOnlyOAS40SelectorWrapper((state) => () => false)
export const isOAS3 = createOnlyOAS40SelectorWrapper((state) => () => false)
```

**Register in preset:**
```javascript
// src/core/presets/apis/index.js
export default function PresetApis() {
  return [
    BasePreset,
    OpenAPI30Plugin,
    OpenAPI31Plugin,
    OpenAPI40Plugin,  // LAST
  ]
}
```

## Example: Adding OAS 3.2 (Minor)

**Version detection:**
```javascript
export const isOAS32 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")
  return (
    typeof oasVersion === "string" && /^3\.2\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}
```

**Directory:** `src/core/plugins/oas32/`

**Extend OAS 3.1:**
```javascript
// oas31-extensions/fn.js
// Import functions from oas31 and extend as needed
```

**Lighter component wrapping:**
- Only wrap components that change
- Reuse most OAS 3.1 logic
- Minimal selector additions

## Final Checklist

Before marking the task as complete:

- [ ] Plugin created in `src/core/plugins/oas{VERSION_NUMBER}/`
- [ ] Version detection function implemented and tested
- [ ] Selector factories created
- [ ] New feature components implemented
- [ ] Component wrappers created for modified components
- [ ] Spec extension selectors implemented
- [ ] Auth extensions implemented (if new auth types)
- [ ] afterLoad hook implemented
- [ ] Plugin registered in preset (LAST position)
- [ ] Unit tests added and passing
- [ ] E2E tests added and passing
- [ ] Documentation updated (README, CLAUDE.md, docs/)
- [ ] Build completes successfully
- [ ] Artifact tests pass
- [ ] No ESLint errors
- [ ] Code follows project conventions (no semicolons, double quotes, @prettier pragma)
- [ ] All security considerations addressed (DOMPurify, input validation)
- [ ] PR created with proper commit message format

## Practical Workflow: From Spec to Components

This section demonstrates the complete workflow from specification analysis to component implementation.

### Workflow Example: Adding a Hypothetical `workflows` Field

**Scenario:** OAS 4.0 introduces a new `workflows` top-level field for defining reusable workflow definitions.

#### Phase 1: Specification Research

**Step 1: Fetch the spec section**
```javascript
WebFetch(
  "https://spec.openapis.org/oas/v4.0.0/",
  "Describe the 'workflows' field: its structure, purpose, whether it's required, and provide a complete example from the specification."
)
```

**Step 2: Analyze the structure**
```javascript
// Response analysis:
// - Type: Object (Map[string, Workflow Object])
// - Location: Root level (sibling to 'paths')
// - Required: No (optional)
// - Structure: Similar to paths, but defines reusable workflows
// - Example:
workflows:
  onNewUser:
    steps:
      - operationRef: '#/paths/~1users/post'
      - operationRef: '#/paths/~1emails~1welcome/post'
```

**Step 3: Map to component type**
Using the mapping table from Step 1D:
- Change type: New top-level field (Object)
- Component type: New standalone component
- Similar to: `webhooks` in OAS 3.1

#### Phase 2: Component Design

**File structure decision:**
```
src/core/plugins/oas40/
├── components/
│   └── workflows.jsx         # Main component
└── spec-extensions/
    └── selectors.js          # Add selectWorkflows
```

**Component responsibilities:**
1. Select workflows from spec
2. Render workflow list
3. Display workflow steps
4. Link to referenced operations

#### Phase 3: Implementation

**Step 1: Create selector**
```javascript
// src/core/plugins/oas40/spec-extensions/selectors.js

export const selectWorkflows = createSelector(
  (state) => state,
  (state) => {
    const spec = state.getIn(["spec", "json"])
    return spec.get("workflows") || Map()
  }
)
```

**Step 2: Create component**
```javascript
// src/core/plugins/oas40/components/workflows.jsx

/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"
import ImPropTypes from "react-immutable-proptypes"

const Workflows = ({ specSelectors, getComponent }) => {
  const workflows = specSelectors.workflows()

  if (!workflows || !workflows.size) {
    return null
  }

  const Collapse = getComponent("Collapse")

  return (
    <div className="opblock-tag-section">
      <h2 className="opblock-tag">Workflows</h2>
      <div className="opblock-description-wrapper">
        <p>
          Reusable workflow definitions that can be referenced from operations.
        </p>
      </div>
      {workflows.entrySeq().map(([workflowName, workflow]) => (
        <div key={workflowName} className="opblock-workflow">
          <Collapse isOpened={false}>
            <div className="opblock-workflow-header">
              <h3>{workflowName}</h3>
              {workflow.get("description") && (
                <div className="opblock-description">
                  {workflow.get("description")}
                </div>
              )}
            </div>
            <div className="opblock-workflow-steps">
              {workflow.get("steps") && (
                <ul>
                  {workflow.get("steps").map((step, idx) => (
                    <li key={idx}>
                      {step.get("operationRef") || step.get("workflowRef")}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </Collapse>
        </div>
      ))}
    </div>
  )
}

Workflows.propTypes = {
  specSelectors: PropTypes.shape({
    workflows: PropTypes.func.isRequired,
  }).isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default Workflows
```

**Step 3: Register in plugin**
```javascript
// src/core/plugins/oas40/index.js

import Workflows from "./components/workflows.jsx"
import { selectWorkflows } from "./spec-extensions/selectors.js"

const OpenAPI40Plugin = ({ fn }) => {
  return {
    components: {
      Workflows,
    },
    statePlugins: {
      spec: {
        selectors: {
          workflows: createOnlyOAS40Selector(selectWorkflows),
        },
      },
    },
  }
}
```

**Step 4: Add to layout**
```javascript
// Modify layout to include Workflows component
// This would be done in BaseLayout or a wrapper
```

#### Phase 4: Testing

**Step 1: Create test spec**
```yaml
# test/e2e-cypress/static/documents/oas40/workflows-example.yaml
openapi: 4.0.0
info:
  title: Workflows API
  version: 1.0.0
workflows:
  onNewUser:
    description: Workflow triggered when a new user is created
    steps:
      - operationRef: '#/paths/~1users/post'
      - operationRef: '#/paths/~1emails~1welcome/post'
paths:
  /users:
    post:
      summary: Create user
      # ...
```

**Step 2: Create E2E test**
```javascript
// test/e2e-cypress/e2e/features/oas40/workflows.cy.js

describe("OAS 4.0 - Workflows", () => {
  beforeEach(() => {
    cy.visit("/e2e-cypress/static/documents/oas40/workflows-example.yaml")
  })

  it("should render workflows section", () => {
    cy.get(".opblock-tag").contains("Workflows").should("exist")
  })

  it("should display workflow definitions", () => {
    cy.get(".opblock-workflow").should("have.length.greaterThan", 0)
  })

  it("should show workflow steps", () => {
    cy.get(".opblock-workflow-steps ul li").should("exist")
  })
})
```

**Step 3: Create unit test**
```javascript
// test/unit/core/plugins/oas40/components/workflows.jsx

import React from "react"
import { shallow } from "enzyme"
import { fromJS } from "immutable"
import Workflows from "src/core/plugins/oas40/components/workflows.jsx"

describe("Workflows component", () => {
  it("should render workflows from spec", () => {
    const mockWorkflows = fromJS({
      onNewUser: {
        description: "New user workflow",
        steps: [
          { operationRef: "#/paths/~1users/post" }
        ]
      }
    })

    const props = {
      specSelectors: {
        workflows: () => mockWorkflows
      },
      getComponent: (name) => {
        if (name === "Collapse") {
          return ({ children }) => <div>{children}</div>
        }
      }
    }

    const wrapper = shallow(<Workflows {...props} />)
    expect(wrapper.find(".opblock-workflow")).toHaveLength(1)
  })

  it("should render nothing when no workflows", () => {
    const props = {
      specSelectors: {
        workflows: () => fromJS({})
      },
      getComponent: () => null
    }

    const wrapper = shallow(<Workflows {...props} />)
    expect(wrapper.type()).toBe(null)
  })
})
```

### Summary: Spec → Component Mapping Checklist

For each new feature in the specification:

- [ ] **Analyze spec using WebFetch**
  - [ ] Understand structure and purpose
  - [ ] Get examples from spec
  - [ ] Identify data type and location

- [ ] **Map to component type** (using Step 1D table)
  - [ ] Determine if new component or wrapper needed
  - [ ] Identify similar existing components
  - [ ] Plan component hierarchy

- [ ] **Create selector**
  - [ ] Extract data from spec
  - [ ] Use appropriate selector factory
  - [ ] Add to spec-extensions/selectors.js

- [ ] **Implement component**
  - [ ] Follow existing patterns
  - [ ] Use getComponent for sub-components
  - [ ] Add PropTypes validation
  - [ ] Include @prettier pragma

- [ ] **Register in plugin**
  - [ ] Add to components export
  - [ ] Register selector in statePlugins
  - [ ] Add to layout if top-level feature

- [ ] **Create tests**
  - [ ] Unit tests for component
  - [ ] Unit tests for selector
  - [ ] E2E tests with example spec
  - [ ] Test edge cases (missing data, etc.)

- [ ] **Verify with real spec**
  - [ ] Test with example from official spec
  - [ ] Test edge cases mentioned in spec
  - [ ] Verify rendering matches expected behavior

## Resources

- **OAS Specification:** https://spec.openapis.org/
- **OAS 2.0:** https://spec.openapis.org/oas/v2.0/
- **OAS 3.0:** https://spec.openapis.org/oas/v3.0.3/
- **OAS 3.1:** https://spec.openapis.org/oas/v3.1.0/
- **JSON Schema:** https://json-schema.org/
- **Plugin API Docs:** `docs/customization/plugin-api.md`
- **OAS 3.1 Reference:** `src/core/plugins/oas31/`
- **Version Detection:** `src/core/plugins/versions/`
- **CLAUDE.md:** Complete codebase guide

## Best Practices: Iterative Spec-Driven Development

### Continuous Specification Reference

**NEVER implement a feature without checking the spec first.** The specification is your source of truth.

#### During Initial Planning
1. Read the entire specification document
2. Create your component mapping document
3. Prioritize features by importance and dependency

#### During Implementation
**For each component:**

1. **Before writing code:**
   ```javascript
   WebFetch(
     "https://spec.openapis.org/oas/v{VERSION}/",
     "Provide the complete specification for the '{FIELD_NAME}' field, including all properties, data types, constraints, and examples."
   )
   ```

2. **While writing the selector:**
   - Verify the exact field path in the spec
   - Check if field is required or optional
   - Confirm data type (string, object, array, etc.)
   - Note any default values

3. **While writing the component:**
   - Reference spec examples for rendering approach
   - Implement all specified subfields
   - Handle edge cases mentioned in spec
   - Follow spec's field naming exactly

4. **After writing tests:**
   - Use spec examples as test fixtures
   - Test all scenarios mentioned in spec
   - Verify behavior matches spec descriptions

#### Common Mistakes to Avoid

❌ **DON'T:**
- Guess field structure without checking spec
- Assume field behavior from field name
- Skip optional fields thinking they're unimportant
- Implement based on previous version without checking changes
- Use hardcoded strings without verifying in spec

✅ **DO:**
- Read spec section before each component
- Verify field paths with WebFetch
- Check spec examples for edge cases
- Confirm data types and constraints
- Reference spec in code comments

#### Example: Spec-Driven Implementation

**Bad approach (guessing):**
```javascript
// ❌ Guessing the structure
const workflows = spec.get("workflows")
return workflows.map(w => w.name)  // Assumes 'name' exists
```

**Good approach (spec-driven):**
```javascript
// ✅ First check the spec:
// WebFetch result shows workflows is a Map[string, Workflow Object]
// Each workflow has: description, steps (array), parameters (optional)

// Then implement correctly:
const workflows = spec.get("workflows")  // Map[string, Workflow Object]
if (!workflows || !workflows.size) return null

return workflows.entrySeq().map(([workflowName, workflowObject]) => {
  // workflowName is the key, workflowObject contains: description, steps, etc.
  const description = workflowObject.get("description")
  const steps = workflowObject.get("steps") || List()
  // ...
})
```

### Verification Checklist Per Component

Before marking a component complete, verify against spec:

- [ ] **Field location matches spec exactly** (path in spec tree)
- [ ] **Data type implemented correctly** (string, object, array, etc.)
- [ ] **Required fields are handled** (error if missing vs optional)
- [ ] **Optional fields have defaults** (as specified in spec)
- [ ] **All subfields are rendered** (no fields missed)
- [ ] **Constraints are enforced** (min/max, enums, formats)
- [ ] **Examples from spec render correctly** (visual verification)
- [ ] **Edge cases are handled** (empty, null, malformed)
- [ ] **Field descriptions match spec** (for documentation)
- [ ] **Cross-references work** ($ref, operationRef, etc.)

### Documentation Trail

Leave a trail connecting your code to the spec:

```javascript
/**
 * @prettier
 */

/**
 * Workflows Component
 *
 * Renders the 'workflows' field from OpenAPI 4.0 specification.
 *
 * Spec reference: https://spec.openapis.org/oas/v4.0.0/#workflows-object
 *
 * Structure (from spec):
 * workflows:
 *   {workflowName}:
 *     description: string (optional)
 *     steps: array of Step Objects (required)
 *     parameters: Map[string, Parameter] (optional)
 *
 * This component renders a list of workflow definitions, showing
 * workflow steps and their operation references.
 */
const Workflows = ({ specSelectors, getComponent }) => {
  // Implementation referencing spec structure
}
```

### Progressive Implementation Strategy

Implement features in order of dependency and spec structure:

**Phase 1: Core Fields (from spec root)**
1. Version detection (always first)
2. Top-level required fields
3. Top-level optional fields with high usage

**Phase 2: Info Object Enhancements**
1. New info fields
2. Modified license/contact fields
3. Extended metadata fields

**Phase 3: Component Object Extensions**
1. New component types
2. Schema keyword changes (if JSON Schema version changed)
3. Security scheme additions

**Phase 4: Operation-Level Features**
1. New operation fields
2. Parameter enhancements
3. Request/response modifications
4. Callback/link changes

**Phase 5: Advanced Features**
1. Complex interactions (workflows, callbacks, links)
2. Conditional rendering
3. Advanced security features

### Spec Change Impact Analysis

Before implementing, analyze the impact:

| Spec Change | Swagger UI Impact | Implementation Effort | User Impact |
|-------------|-------------------|----------------------|-------------|
| New top-level field | New component + layout change | High | High |
| New info subfield | Wrap or extend Info | Medium | Medium |
| New auth type | New auth component | Medium | High |
| New schema keyword | Keyword component | Low-Medium | Low |
| Field description change | Documentation only | Low | Low |
| Deprecated field | Warning message | Low | Medium |
| Breaking change | Major refactor | High | High |

Prioritize high user impact changes first.

## Questions to Answer During Implementation

### Before Starting
1. What is the exact version number? (e.g., 3.2, 4.0)
2. Have I read the complete specification at https://spec.openapis.org/?
3. Is it a major or minor version change?
4. What is the migration guide URL?

### Specification Analysis
5. Does it use a new JSON Schema version?
6. What are ALL the new top-level fields?
7. What are ALL the modified existing fields?
8. What features are deprecated or removed?

### Component Planning
9. Which components need to be created from scratch?
10. Which existing components need to be wrapped?
11. What selectors need to be added/wrapped?
12. What functions need to be overridden in afterLoad?

### Authentication & Security
13. Are there new authentication types?
14. Do security schemes have new fields?
15. Are there new security requirements or flows?

### Testing Strategy
16. Where are the official example specs?
17. What edge cases are mentioned in the spec?
18. What are the validation rules?

### During Each Component
19. What is the exact field path in the spec?
20. What is the exact data type?
21. Is this field required or optional?
22. What are the constraints (min/max, enum, format)?
23. What are the examples in the spec?
24. How should this render visually?

---

**Remember:**
1. **Always check https://spec.openapis.org/ first**
2. **Use WebFetch to analyze spec sections before coding**
3. **Follow the patterns established by OAS 3.1 implementation**
4. **Verify each component against the specification**
5. **Test with examples from the official spec**
6. **Document the spec reference in code comments**
7. **When in doubt, check the spec again!**

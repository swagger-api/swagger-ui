# Skill Usage Example: Adding OAS 4.0 Support

This document demonstrates how to use the `/add-oas-support` skill to add OpenAPI 4.0 support to Swagger UI.

## Scenario

You want to add support for OpenAPI Specification 4.0 (a hypothetical major version) to Swagger UI. OAS 4.0 includes:
- New `workflows` top-level field
- New `asyncAPI` authentication type
- Updated JSON Schema to Draft 2024
- Enhanced callback syntax
- New `info.license.attribution` field

## Step-by-Step Usage

### 1. Start the Skill

```bash
/add-oas-support --version 4.0 --type major
```

### 2. Answer Questions

Claude will ask you questions about the new version:

**Q: What is the exact version number?**
A: 4.0

**Q: Is it a major or minor version?**
A: Major (breaking changes from OAS 3.x)

**Q: Does it use a new JSON Schema version?**
A: Yes, JSON Schema Draft 2024

**Q: What are the new top-level fields?**
A: `workflows` - defines reusable workflow definitions

**Q: What features are added/removed/changed?**
A:
- Added: `workflows` object for workflow automation
- Added: `asyncAPI` authentication type
- Added: `info.license.attribution` field
- Changed: Callback syntax enhanced with workflow references
- Removed: Deprecated `x-` extension fields from OAS 3.0

**Q: Are there new authentication types?**
A: Yes, `asyncAPI` type for asynchronous authentication flows

### 3. Claude Creates Plugin Structure

Claude will execute:

```bash
mkdir -p src/core/plugins/oas40/{auth-extensions,oas31-extensions,spec-extensions,components/auth,wrap-components}
```

### 4. Claude Generates Files

#### 4a. Version Detection (src/core/plugins/oas40/fn.js)

```javascript
/**
 * @prettier
 */

export const isOAS40 = (jsSpec) => {
  const oasVersion = jsSpec.get("openapi")
  return (
    typeof oasVersion === "string" &&
    /^4\.0\.(?:[1-9]\d*|0)$/.test(oasVersion)
  )
}

export const createOnlyOAS40Selector =
  (selector) =>
  (state, ...args) =>
  (system) => {
    if (system.getSystem().specSelectors.isOAS40()) {
      const selectedValue = selector(state, ...args)
      return typeof selectedValue === "function"
        ? selectedValue(system)
        : selectedValue
    } else {
      return null
    }
  }

// ... other factory functions
```

#### 4b. Main Plugin Export (src/core/plugins/oas40/index.js)

```javascript
/**
 * @prettier
 */

import afterLoad from "./after-load.js"
import {
  isOAS40,
  createSystemSelector,
  createOnlyOAS40Selector,
  createOnlyOAS40SelectorWrapper,
  createOnlyOAS40ComponentWrapper,
} from "./fn.js"

import Workflows from "./components/workflows.jsx"
import AsyncAPIAuth from "./components/auth/async-api-auth.jsx"
import OAS40License from "./components/license.jsx"
// ... other imports

const OpenAPI40Plugin = ({ fn }) => {
  return {
    fn: {
      oas40: {
        isOAS40,
        createSystemSelector,
        createOnlyOAS40Selector,
        createOnlyOAS40SelectorWrapper,
        createOnlyOAS40ComponentWrapper,
      },
    },
    components: {
      Workflows,
      AsyncAPIAuth,
      OAS40License,
    },
    wrapComponents: {
      // Wrap existing components
    },
    statePlugins: {
      spec: {
        selectors: {
          isOAS40: createSystemSelector(selectIsOAS40),
          workflows: createOnlyOAS40Selector(selectWorkflows),
        },
        wrapSelectors: {
          isOAS31: isOAS31SelectorWrapper,
          isOAS3: isOAS3SelectorWrapper,
        },
      },
      auth: {
        wrapSelectors: {
          definitionsToAuthorize: definitionsToAuthorizeWrapper,
        },
      },
      oas40: {
        selectors: {},
      },
    },
    afterLoad,
  }
}

export default OpenAPI40Plugin
```

#### 4c. Workflows Component (src/core/plugins/oas40/components/workflows.jsx)

```javascript
/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"

const Workflows = ({ specSelectors, getComponent }) => {
  const workflows = specSelectors.workflows()

  if (!workflows || !workflows.size) {
    return null
  }

  const Operations = getComponent("operations", true)

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
          <h3>{workflowName}</h3>
          <p>{workflow.get("description")}</p>
          {/* Render workflow steps */}
        </div>
      ))}
    </div>
  )
}

Workflows.propTypes = {
  specSelectors: PropTypes.object.isRequired,
  getComponent: PropTypes.func.isRequired,
}

export default Workflows
```

#### 4d. AsyncAPI Auth Component (src/core/plugins/oas40/components/auth/async-api-auth.jsx)

```javascript
/**
 * @prettier
 */

import React from "react"
import PropTypes from "prop-types"

const AsyncAPIAuth = ({ schema, name, getComponent, onChange, authorized }) => {
  const authValue = authorized && authorized.getIn([name])
  const Input = getComponent("Input")
  const Button = getComponent("Button")

  return (
    <div className="auth-container">
      <h4>AsyncAPI Authentication</h4>
      <p>{schema.get("description")}</p>
      <Input
        type="text"
        placeholder="Enter async API key"
        value={authValue?.get("key") || ""}
        onChange={(e) => onChange({ key: e.target.value })}
      />
      <Button className="btn modal-btn auth authorize">Authorize</Button>
    </div>
  )
}

AsyncAPIAuth.propTypes = {
  schema: PropTypes.object.isRequired,
  name: PropTypes.string.isRequired,
  getComponent: PropTypes.func.isRequired,
  onChange: PropTypes.func.isRequired,
  authorized: PropTypes.object,
}

export default AsyncAPIAuth
```

### 5. Claude Registers Plugin

Updates `src/core/presets/apis/index.js`:

```javascript
import OpenAPI40Plugin from "../../plugins/oas40/index.js"

export default function PresetApis() {
  return [
    BasePreset,
    OpenAPI30Plugin,
    JSONSchema202012Plugin,
    JSONSchema202012SamplesPlugin,
    OpenAPI31Plugin,
    JSONSchema2024Plugin,      // New JSON Schema version
    JSONSchema2024SamplesPlugin,
    OpenAPI40Plugin,            // LAST - overrides all previous
  ]
}
```

### 6. Claude Adds Tests

#### Unit Test (test/unit/core/plugins/oas40/fn.js)

```javascript
/**
 * @prettier
 */

import { fromJS } from "immutable"
import { isOAS40 } from "src/core/plugins/oas40/fn.js"

describe("oas40 plugin - fn - isOAS40", () => {
  it("should match OpenAPI 4.0.0", () => {
    const spec = fromJS({ openapi: "4.0.0" })
    expect(isOAS40(spec)).toBe(true)
  })

  it("should match OpenAPI 4.0.15", () => {
    const spec = fromJS({ openapi: "4.0.15" })
    expect(isOAS40(spec)).toBe(true)
  })

  it("should NOT match OpenAPI 4.0", () => {
    const spec = fromJS({ openapi: "4.0" })
    expect(isOAS40(spec)).toBe(false)
  })

  it("should NOT match OpenAPI 3.1.0", () => {
    const spec = fromJS({ openapi: "3.1.0" })
    expect(isOAS40(spec)).toBe(false)
  })
})
```

#### E2E Test (test/e2e-cypress/e2e/features/oas40/workflows.cy.js)

```javascript
/**
 * @prettier
 */

describe("OpenAPI 4.0 - Workflows", () => {
  it("should render workflows section", () => {
    cy.visit("/e2e-cypress/static/documents/oas40/petstore-workflows.yaml")
    cy.get(".opblock-tag").contains("Workflows").should("exist")
  })

  it("should display workflow definitions", () => {
    cy.visit("/e2e-cypress/static/documents/oas40/petstore-workflows.yaml")
    cy.get(".opblock-workflow").should("have.length.greaterThan", 0)
  })
})
```

### 7. Claude Updates Documentation

Updates to `README.md`:

```markdown
## Compatibility

Swagger UI supports the following OpenAPI Specification versions:

- OpenAPI 2.0 (Swagger)
- OpenAPI 3.0.x
- OpenAPI 3.1.x
- OpenAPI 4.0.x ⭐ NEW
```

Updates to `CLAUDE.md`:

```markdown
### 26 Core Plugins

- `oas3` - OpenAPI 3.0.x support
- `oas31` - OpenAPI 3.1.x support
- `oas40` - OpenAPI 4.0.x support (NEW)
```

### 8. Claude Runs Tests

```bash
# Lint
npm run lint-errors

# Unit tests
npm run test:unit

# Build
npm run build

# Artifact tests
npm run test:artifact

# E2E tests
npm run cy:ci
```

### 9. Claude Creates Commit

```bash
git add src/core/plugins/oas40/
git add src/core/presets/apis/index.js
git add test/unit/core/plugins/oas40/
git add test/e2e-cypress/e2e/features/oas40/
git add README.md CLAUDE.md

git commit -m "$(cat <<'EOF'
feat(oas40): add support for OpenAPI 4.0

Implement OpenAPI 4.0.x specification support with:
- Version detection and plugin architecture
- Workflows rendering for reusable workflow definitions
- AsyncAPI authentication type support
- JSON Schema Draft 2024 integration
- Enhanced callback syntax with workflow references
- License attribution field support

Breaking changes from OAS 3.1:
- Removed deprecated x- extension fields
- Updated JSON Schema to Draft 2024

Includes comprehensive unit and E2E tests.

Co-Authored-By: Claude Sonnet 4.5 <noreply@anthropic.com>
EOF
)"
```

### 10. Result

You now have complete OpenAPI 4.0 support in Swagger UI:

```
src/core/plugins/oas40/
├── index.js (367 lines)
├── fn.js (124 lines)
├── selectors.js (45 lines)
├── after-load.js (78 lines)
├── auth-extensions/
│   └── wrap-selectors.js (32 lines)
├── oas31-extensions/
│   └── fn.js (56 lines)
├── spec-extensions/
│   ├── selectors.js (89 lines)
│   └── wrap-selectors.js (23 lines)
├── components/
│   ├── workflows.jsx (156 lines)
│   ├── license.jsx (67 lines)
│   ├── version-pragma-filter.jsx (78 lines)
│   └── auth/
│       └── async-api-auth.jsx (54 lines)
└── wrap-components/
    ├── info.jsx (12 lines)
    └── license.jsx (12 lines)

test/unit/core/plugins/oas40/
├── fn.js (67 lines)
└── components/
    └── version-pragma-filter.jsx (45 lines)

test/e2e-cypress/e2e/features/oas40/
├── workflows.cy.js (34 lines)
└── async-api-auth.cy.js (28 lines)
```

**Total:** ~1,367 lines of code, fully tested and documented.

## Benefits of Using the Skill

### Without the Skill (Manual Implementation)

**Estimated Time:** 40-60 hours

**Challenges:**
- Understanding plugin architecture (4-6 hours)
- Studying OAS 3.1 patterns (3-4 hours)
- Creating file structure (1 hour)
- Implementing version detection (2 hours)
- Creating selector factories (4-6 hours)
- Implementing components (12-16 hours)
- Writing tests (8-12 hours)
- Debugging integration issues (6-8 hours)
- Documentation (2-3 hours)

**Error-prone areas:**
- Plugin loading order
- Selector wrapping logic
- Component lifecycle
- Redux state management
- afterLoad hook timing

### With the Skill (Guided Implementation)

**Estimated Time:** 8-12 hours

**Benefits:**
- Automated boilerplate generation
- Follows established patterns
- Guided step-by-step process
- Built-in error checking
- Comprehensive test coverage
- Documentation templates
- Best practices enforced

**What the skill handles:**
- ✅ File structure creation
- ✅ Boilerplate code generation
- ✅ Pattern adherence
- ✅ Test scaffolding
- ✅ Documentation updates
- ✅ Build verification
- ✅ Commit message formatting

## Customization Options

The skill is flexible and can be customized per version:

### For Minor Versions (e.g., 3.2)

```bash
/add-oas-support --version 3.2 --type minor
```

Claude will:
- Create lighter plugin structure
- Reuse more from previous version
- Focus on incremental additions
- Skip breaking change handling
- Minimize component wrapping

### For Major Versions (e.g., 5.0)

```bash
/add-oas-support --version 5.0 --type major
```

Claude will:
- Create comprehensive plugin structure
- Implement extensive component wrapping
- Handle breaking changes
- Create new base components if needed
- Add deprecation warnings
- Update preset configurations

## Troubleshooting

### Skill Not Found

```
Error: Skill 'add-oas-support' not found
```

**Solution:** Ensure the skill file exists in `.claude/skills/add-oas-support.md`

### Version Already Exists

```
Error: Plugin for OAS 4.0 already exists
```

**Solution:** Remove existing plugin or choose a different version

### Build Failures

```
Error: Module not found
```

**Solution:** Check plugin registration in presets and import paths

### Test Failures

```
Error: isOAS40 is not a function
```

**Solution:** Verify selector is properly exported and registered

## Next Steps

After the skill completes:

1. **Test with real specs** - Use actual OAS 4.0 examples
2. **Review generated code** - Ensure it matches your requirements
3. **Add custom features** - Extend beyond the boilerplate
4. **Optimize performance** - Profile and optimize hot paths
5. **Submit PR** - Follow the PR template and guidelines

## Additional Resources

- **OAS 4.0 Spec:** https://spec.openapis.org/oas/v4.0.0 (hypothetical)
- **Plugin API:** `docs/customization/plugin-api.md`
- **CLAUDE.md:** Complete codebase guide
- **Skill Source:** `.claude/skills/add-oas-support.md`

---

**Note:** This example uses hypothetical OAS 4.0 features for demonstration purposes. Adapt the skill usage to match the actual specification features of the version you're implementing.

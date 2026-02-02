# CLAUDE.md - Swagger UI Codebase Guide

> **Last Updated:** 2026-01-21
> **Version:** 5.31.0
> **Purpose:** Comprehensive guide for AI assistants working with the Swagger UI codebase

---

## Table of Contents

1. [Repository Overview](#repository-overview)
2. [Project Architecture](#project-architecture)
3. [Development Setup](#development-setup)
4. [Build System](#build-system)
5. [Testing Infrastructure](#testing-infrastructure)
6. [Code Style & Conventions](#code-style--conventions)
7. [Git Workflow](#git-workflow)
8. [Plugin Architecture](#plugin-architecture)
9. [Key Files & Directories](#key-files--directories)
10. [Common Workflows](#common-workflows)
11. [Important Guidelines](#important-guidelines)

---

## Repository Overview

### What is Swagger UI?

Swagger UI is a tool that allows developers to visualize and interact with API resources without having implementation logic in place. It's automatically generated from OpenAPI (formerly Swagger) Specification documents.

### Multi-Package Monorepo Structure

This repository publishes **three different npm packages**:

1. **swagger-ui** (main package)
   - Traditional npm module for single-page applications
   - Entry: `dist/swagger-ui.js`
   - ES Module: `dist/swagger-ui-es-bundle-core.js`
   - Includes dependency resolution via Webpack/Browserify

2. **swagger-ui-dist** (distribution package)
   - Dependency-free module for server-side projects
   - Published separately via GitHub workflow
   - Template location: `swagger-ui-dist-package/`

3. **swagger-ui-react** (React component)
   - React wrapper component
   - Location: `flavors/swagger-ui-react/`
   - Uses React hooks
   - Released separately via GitHub workflow

### OpenAPI Specification Compatibility

- **Current Support:** OpenAPI 2.0, 3.0.x, 3.1.x
- **Latest Version:** v5.31.0 (supports up to OpenAPI 3.1.1)

### License

Apache 2.0 - See LICENSE and NOTICE files for details.

---

## Project Architecture

### Technology Stack

**Core Framework:**
- React 18 (>=16.8.0 <20) - UI components
- Redux 5.0.1 - State management
- Redux Immutable 4.0.0 - Immutable state
- Immutable.js 3.x - Immutable data structures
- React Redux 9.2.0 - React-Redux bindings

**API & Schema Processing:**
- swagger-client 3.36.0 - OpenAPI client
- js-yaml 4.1.1 - YAML parsing
- remarkable 2.0.1 - Markdown rendering

**Security:**
- DOMPurify 3.2.6 - HTML sanitization (CRITICAL for XSS prevention)
- serialize-error 8.1.0 - Error serialization

**Build Tools:**
- Webpack 5.97.1 - Module bundling
- Babel 7.26.x - JavaScript transpilation
- sass-embedded 1.86.0 - SCSS compilation
- PostCSS - CSS processing

**Testing:**
- Jest 29.7.0 - Unit testing
- Cypress 14.2.0 - E2E testing
- Enzyme 3.11.0 - React component testing

**Development:**
- ESLint 8.57.0 - JavaScript linting
- Prettier 3.5.3 - Code formatting
- Stylelint 16.19.1 - CSS linting
- Husky 9.1.7 - Git hooks
- lint-staged 15.5.0 - Pre-commit linting

### Plugin-Based Architecture

Swagger UI uses a **sophisticated plugin system** powered by Redux. The core system (`src/core/system.js`) manages:

- Plugin registration and lifecycle
- Redux store creation and middleware
- State plugin combination
- Action/selector binding
- Configuration management

**26 Core Plugins** (in `src/core/plugins/`):
- `auth` - Authentication handling
- `configs` - Configuration management
- `deep-linking` - URL-based navigation
- `download-url` - Spec downloading
- `err` - Error handling and transformation
- `filter` - API filtering
- `icons` - Icon components
- `json-schema-2020-12` - JSON Schema 2020-12 support
- `json-schema-2020-12-samples` - Sample generation
- `json-schema-5` - JSON Schema Draft 5 support
- `json-schema-5-samples` - Sample generation for Draft 5
- `layout` - Layout system
- `logs` - Logging
- `oas3` - OpenAPI 3.0.x support
- `oas31` - OpenAPI 3.1.x support
- `on-complete` - Completion callbacks
- `request-snippets` - Code snippet generation
- `safe-render` - Safe component rendering
- `spec` - Specification handling
- `swagger-client` - API client integration
- `syntax-highlighting` - Code highlighting
- `util` - Utilities
- `versions` - Version detection
- `view` - View rendering
- `view-legacy` - Legacy view support

---

## Development Setup

### Prerequisites

- **Node.js:** >=22.11.0 (Node 20.x recommended, as defined in `.nvmrc`)
- **npm:** >=10.9.0
- **Git:** Any version
- **JDK 7+:** Required for Nightwatch.js integration tests

### Installation Steps

```bash
# Clone the repository
git clone https://github.com/swagger-api/swagger-ui.git
cd swagger-ui

# Install dependencies
npm install

# Initialize Husky (optional, for git hooks)
npx husky init

# Start development server
npm run dev

# Open http://localhost:3200/
```

### Development Server

The `npm run dev` command starts a hot-reloading Webpack dev server on **port 3200**.

### Using Local API Definitions

Edit `dev-helpers/dev-helper-initializer.js` to change the spec URL:

```javascript
// Replace
url: "https://petstore.swagger.io/v2/swagger.json",

// With
url: "./examples/your-local-api-definition.yaml",
```

**Important:** Local files must be in the `dev-helpers/` directory or subdirectory. Use `dev-helpers/examples/` (already in `.gitignore`).

---

## Build System

### Babel Environments

Three Babel environments configured in `babel.config.js`:

1. **development/production** - Browser builds with `modules: "auto"`
2. **commonjs** - CommonJS modules with `modules: "commonjs"` for Node.js
3. **esm** - ES modules with `modules: false` for modern bundlers

### Babel Aliases

```javascript
{
  root: ".",
  core: "./src/core"
}
```

### Browserslist Environments

Defined in `.browserslistrc`:

- `[browser-production]` - Production browser targets
- `[browser-development]` - Latest Chrome, Firefox, Safari
- `[isomorphic-production]` - Browser + Node targets
- `[node-production]` - Maintained Node versions
- `[node-development]` - Node 22

### Build Commands

```bash
# Full build (stylesheets + all bundles)
npm run build

# Individual builds
npm run build:core              # Core bundle (browser)
npm run build:bundle            # Isomorphic bundle
npm run build:standalone        # Standalone preset
npm run build:es:bundle         # ES module bundle
npm run build:es:bundle:core    # ES module core
npm run build-stylesheets       # CSS only

# Clean build artifacts
npm run clean
```

### Build Output (dist/)

- `swagger-ui.js` - Core bundle (CommonJS)
- `swagger-ui.css` - Compiled styles
- `swagger-ui-bundle.js` - Isomorphic bundle
- `swagger-ui-standalone-preset.js` - Standalone preset
- `swagger-ui-es-bundle.js` - ES module bundle
- `swagger-ui-es-bundle-core.js` - ES module core
- `oauth2-redirect.html` - OAuth2 redirect page

### Webpack Configurations

Located in `webpack/` directory:

- `_config-builder.js` - Base configuration
- `core.js` - Core build
- `bundle.js` - Bundle build
- `standalone.js` - Standalone build
- `es-bundle.js` - ES bundle
- `es-bundle-core.js` - ES core bundle
- `stylesheets.js` - CSS build
- `dev.js` - Development server
- `dev-e2e.js` - E2E testing server

---

## Testing Infrastructure

### Unit Tests (Jest)

**Configuration:** `config/jest/jest.unit.config.js`

**Environment:** jsdom (simulates browser environment)

**Location:** `test/unit/`

**Command:**
```bash
npm run test:unit
```

**Key Features:**
- 37 unit test files
- Tests for core plugins, components, system
- XSS security tests
- Silent mode enabled by default (set to `false` for console output)
- Module name mapper for SVG and standalone imports
- Transform ignore patterns for node_modules exceptions

**Setup Files:**
- `test/unit/jest-shim.js` - Polyfills and shims
- `test/unit/setup.js` - Test environment setup

### E2E Tests (Cypress)

**Configuration:** `cypress.config.js`

**Location:** `test/e2e-cypress/`

**Base URL:** http://localhost:3230/

**Commands:**
```bash
# Run all E2E tests
npm run cy:ci

# Interactive Cypress runner
npm run cy:dev

# Headless run
npm run cy:run

# Start servers and run tests
npm run cy:start     # Starts webpack + mock API
```

**Structure:**
- `test/e2e-cypress/e2e/` - Test specs (99 test files)
- `test/e2e-cypress/static/` - Test fixtures and documents
- `test/e2e-cypress/support/` - Test helpers and commands

**Test Categories:**
- `a11y/**/*cy.js` - Accessibility tests
- `security/**/*cy.js` - Security tests
- `bugs/**/*cy.js` - Bug regression tests
- `features/**/*cy.js` - Feature tests

**Mock API Server:**
```bash
npm run cy:mock-api  # JSON Server on port 3204
```

### Artifact Tests

**Configuration:** `config/jest/jest.artifact.config.js`

**Purpose:** Verify build artifacts export correctly

**Command:**
```bash
npm run test:artifact
```

### Complete Test Suite

```bash
npm test  # Runs: lint-errors + test:unit + cy:ci
```

### CI/CD Testing

**GitHub Actions Workflow:** `.github/workflows/nodejs.yml`

**Two Jobs:**
1. **build** - Lint, unit tests, build, artifact tests
2. **e2e-tests** - Cypress tests (matrix strategy with 3 containers)

**Branches:** `master`, `next`

---

## Code Style & Conventions

### ESLint Configuration

**File:** `.eslintrc.js`

**Parser:** `@babel/eslint-parser`

**Key Rules:**
- `semi: [2, "never"]` - **No semicolons**
- `quotes: [2, "double"]` - **Double quotes** (allow template literals)
- `no-unused-vars: 2` - Error on unused variables
- `camelcase: ["error"]` - Enforce camelCase (with exceptions for UNSAFE_, request generators, etc.)
- `no-console: [2, {allow: ["warn", "error"]}]` - Only `console.warn` and `console.error` allowed
- `react/jsx-no-bind: 1` - Warning for JSX bind
- `react/jsx-filename-extension: 2` - JSX only in `.jsx` files
- `import/no-extraneous-dependencies: 2` - Error on extraneous dependencies

**Extends:**
- `eslint:recommended`
- `plugin:react/recommended`
- `plugin:prettier/recommended`

### Prettier Configuration

**File:** `.prettierrc.yaml`

**Settings:**
```yaml
semi: false              # No semicolons
trailingComma: es5       # ES5 trailing commas
endOfLine: lf            # Unix line endings
requirePragma: true      # Require @prettier pragma
insertPragma: true       # Insert @prettier pragma
```

**IMPORTANT:** Prettier requires `@prettier` pragma comment at the top of files:
```javascript
/**
 * @prettier
 */
```

### Stylelint Configuration

**File:** `stylelint.config.js`

**Custom Syntax:** `postcss-scss`

**Rules:**
- Uses `stylelint-prettier` plugin
- Prettier integration without pragma requirement

### Pre-commit Hooks

**Husky:** `.husky/pre-commit` runs `npx lint-staged`

**Lint-staged Configuration:** `.lintstagedrc`
```json
{
  "*.{js,jsx}": ["eslint --max-warnings 0"],
  "*.scss": ["stylelint '**/*.scss'"]
}
```

**Critical:** All staged JS/JSX/SCSS files are linted with **zero warnings tolerance**.

### File Structure Conventions

**Components:**
- Location: `src/core/components/`
- Extension: `.jsx` (React components)
- Format: PascalCase for component names

**Styles:**
- Location: `src/style/`
- Extension: `.scss`
- Format: SCSS with PostCSS processing
- Dark mode: `_dark-mode.scss`

**Tests:**
- Unit: `test/unit/` (mirrors source structure)
- E2E: `test/e2e-cypress/e2e/`
- Naming: `*.test.js`, `*.spec.js`, `*.cy.js` (Cypress)

---

## Git Workflow

### Branch Strategy

**Main Branches:**
- `master` - Production releases
- `next` - Next version development

**Feature Branches:**
- Should branch from `master` or `next`
- Use descriptive names

### Commit Conventions

**Format:** Conventional Commits (enforced by commitlint)

**Structure:**
```
<type>(<scope>): <subject>

<body>

<footer>
```

**Types:**
- `feat` - New feature
- `fix` - Bug fix
- `docs` - Documentation changes
- `style` - Code style changes (formatting)
- `refactor` - Code refactoring
- `test` - Test additions/changes
- `chore` - Build/tooling changes
- `perf` - Performance improvements

**Example:**
```
feat(oas3): add support for OpenAPI 3.1.1 callbacks

Implement callback rendering for OAS 3.1.1 specifications
with proper schema resolution and example generation.

Fixes #12345
```

### Pull Request Process

**Template:** `.github/pull_request_template.md`

**Required Sections:**
1. **Description** - Detailed change description
2. **Motivation and Context** - Why the change is needed
3. **How Has This Been Tested?** - Manual testing details
4. **Screenshots** - If UI changes

**Checklist:**
- [ ] Code type (no code/dependencies/bug fix/improvement/feature)
- [ ] Breaking changes identification
- [ ] Documentation updates
- [ ] Test coverage
- [ ] All tests passing

**CI Checks:**
- ESLint (error-only mode)
- Unit tests (Jest)
- Build verification
- Artifact tests
- E2E tests (Cypress)

### Release Process

**Tool:** release-it with conventional-changelog

**Command:**
```bash
npm run automated-release
```

**Workflows:**
- `.github/workflows/release-swagger-ui.yml`
- `.github/workflows/release-swagger-ui-dist.yml`
- `.github/workflows/release-swagger-ui-react.yml`
- `.github/workflows/release-swagger-ui-packagist.yml`

---

## Plugin Architecture

### Core System (`src/core/system.js`)

The plugin system is the heart of Swagger UI. It uses Redux for state management with a custom plugin registration system.

### Plugin Structure

Each plugin is a JavaScript object/function that returns:

```javascript
{
  statePlugins: {
    [pluginName]: {
      actions: {},      // Redux actions
      reducers: {},     // Redux reducers
      selectors: {},    // Reselect selectors
      wrapActions: {},  // Action middleware
      wrapSelectors: {} // Selector middleware
    }
  },
  components: {},       // React components
  fn: {},              // Utility functions
  rootInjects: {},     // Root-level injections
  afterLoad: Function  // Lifecycle hook
}
```

### Key Plugin Locations

**Core Plugins:** `src/core/plugins/`

Each plugin has:
- `index.js` - Main export
- `actions.js` - Redux actions
- `reducers.js` - Redux reducers
- `selectors.js` - State selectors
- `wrap-actions.js` - Action middleware
- `wrap-selectors.js` - Selector middleware
- Component files (`.jsx`)

### Creating a Plugin

See documentation: `docs/customization/plugin-api.md`

### Preset System

**Base Preset:** `src/core/presets/base.js`

**Standalone Preset:** `src/standalone/presets/standalone.js`

Presets are collections of plugins bundled together for specific use cases.

---

## Key Files & Directories

### Critical Source Files

```
src/
├── core/
│   ├── system.js                 # Plugin system & Redux store
│   ├── components/               # 59 React components
│   ├── plugins/                  # 26 core plugins
│   ├── presets/                  # Preset configurations
│   ├── utils/                    # Utility functions
│   └── config/                   # Configuration system
├── standalone/
│   ├── plugins/                  # TopBar, StandaloneLayout
│   └── presets/                  # Standalone preset
├── style/                        # SCSS stylesheets
│   ├── _dark-mode.scss          # Dark mode styles
│   └── main.scss                # Main stylesheet entry
└── index.js                      # Main package entry
```

### Configuration Files

```
.
├── package.json                  # Dependencies & scripts
├── babel.config.js              # Babel configuration
├── .eslintrc.js                 # ESLint rules
├── .prettierrc.yaml             # Prettier settings
├── stylelint.config.js          # Stylelint rules
├── .browserslistrc              # Browser targets
├── .nvmrc                       # Node version (20.x)
├── .lintstagedrc                # Pre-commit linting
└── cypress.config.js            # Cypress E2E config
```

### Build & Tooling

```
webpack/
├── _config-builder.js           # Base Webpack config
├── core.js                      # Core build
├── bundle.js                    # Bundle build
├── standalone.js                # Standalone build
├── es-bundle.js                 # ES bundle build
├── es-bundle-core.js           # ES core bundle
├── stylesheets.js              # CSS compilation
├── dev.js                       # Dev server
└── dev-e2e.js                  # E2E dev server

config/jest/
├── jest.unit.config.js          # Unit test config
└── jest.artifact.config.js      # Artifact test config
```

### Documentation

```
docs/
├── usage/
│   ├── installation.md
│   ├── configuration.md
│   ├── cors.md
│   ├── oauth2.md
│   ├── deep-linking.md
│   ├── version-detection.md
│   └── limitations.md
├── customization/
│   ├── overview.md
│   ├── plugin-api.md
│   └── custom-layout.md
└── development/
    ├── setting-up.md
    └── scripts.md
```

### Testing

```
test/
├── unit/                        # Jest unit tests (37 files)
│   ├── setup.js                # Test environment setup
│   └── jest-shim.js           # Polyfills
├── e2e-cypress/                 # Cypress E2E tests (99 files)
│   ├── e2e/                    # Test specs
│   ├── static/                 # Fixtures
│   └── support/                # Helpers
└── e2e-selenium/               # Legacy Selenium tests
```

### Distribution

```
flavors/
└── swagger-ui-react/            # React component wrapper

swagger-ui-dist-package/         # Template for dist package

dist/                            # Build output (generated)
├── swagger-ui.js
├── swagger-ui.css
├── swagger-ui-bundle.js
├── swagger-ui-standalone-preset.js
├── swagger-ui-es-bundle.js
├── swagger-ui-es-bundle-core.js
└── oauth2-redirect.html
```

---

## Common Workflows

### Making Code Changes

1. **Read before modifying:**
   ```bash
   # ALWAYS read files before editing them
   # Understand the existing code structure
   ```

2. **Follow the style guide:**
   - Use double quotes
   - No semicolons
   - Add `@prettier` pragma to new files
   - Use `.jsx` extension for React components

3. **Run linters:**
   ```bash
   npm run lint          # Check for errors and warnings
   npm run lint-fix      # Auto-fix JavaScript issues
   npm run lint-styles   # Check SCSS
   npm run lint-styles-fix  # Auto-fix SCSS
   ```

4. **Test your changes:**
   ```bash
   npm run test:unit     # Run unit tests
   npm run cy:dev        # Interactive E2E testing
   npm run build         # Verify build works
   npm run test:artifact # Verify artifacts
   ```

### Adding a New Component

1. Create component in `src/core/components/` or appropriate plugin directory
2. Use `.jsx` extension
3. Add `@prettier` pragma
4. Follow React best practices (functional components, hooks)
5. Add PropTypes validation
6. Create corresponding test in `test/unit/`
7. Export from plugin's `index.js` if needed

### Adding a New Plugin

1. Create directory in `src/core/plugins/[plugin-name]/`
2. Create `index.js` with plugin structure
3. Add actions, reducers, selectors as needed
4. Register plugin in preset (e.g., `src/core/presets/base.js`)
5. Add tests in `test/unit/core/plugins/[plugin-name]/`
6. Document the plugin

### Fixing a Bug

1. **Reproduce the bug:**
   - Add a failing test in `test/unit/` or `test/e2e-cypress/`
   - Document reproduction steps

2. **Fix the issue:**
   - Make minimal changes to fix the bug
   - Avoid refactoring unless necessary
   - Ensure the test now passes

3. **Verify:**
   ```bash
   npm run test:unit
   npm run build
   npm run test:artifact
   ```

4. **Create PR:**
   - Reference the issue number
   - Include before/after behavior
   - Add screenshots if UI-related

### Adding a Feature

1. **Plan the feature:**
   - Review existing architecture
   - Identify affected plugins/components
   - Consider OpenAPI spec compatibility

2. **Implement:**
   - Follow plugin architecture patterns
   - Add configuration options if needed
   - Update presets if necessary

3. **Test thoroughly:**
   - Unit tests for logic
   - Component tests for UI
   - E2E tests for integration
   - Test with various OpenAPI specs

4. **Document:**
   - Update `docs/` if user-facing
   - Add JSDoc comments for APIs
   - Update README if needed

### Security Considerations

1. **XSS Prevention:**
   - ALWAYS use DOMPurify for user-provided HTML
   - Sanitize all external input
   - Review `test/unit/xss/` for examples
   - Never use `dangerouslySetInnerHTML` without sanitization

2. **Input Validation:**
   - Validate API responses
   - Handle malformed OpenAPI specs gracefully
   - Check for prototype pollution

3. **Dependency Security:**
   ```bash
   npm run security-audit     # Run security audit
   ```

### Working with OpenAPI Specs

**Testing Different Versions:**
- OAS 2.0: Use `src/core/plugins/swagger-client/`
- OAS 3.0.x: Use `src/core/plugins/oas3/`
- OAS 3.1.x: Use `src/core/plugins/oas31/`

**Adding Test Specs:**
- Add to `test/e2e-cypress/static/documents/`
- Reference in E2E tests

---

## Important Guidelines

### DO's ✅

1. **Always read files before modifying them**
2. **Follow the no-semicolon convention**
3. **Use double quotes for strings**
4. **Add `@prettier` pragma to all new files**
5. **Use `.jsx` extension for React components**
6. **Write tests for new features and bug fixes**
7. **Run linters before committing** (automatic via husky)
8. **Use DOMPurify for HTML sanitization**
9. **Follow conventional commit format**
10. **Update documentation for user-facing changes**
11. **Test with multiple OpenAPI spec versions**
12. **Check browser compatibility** (see `.browserslistrc`)
13. **Use the plugin architecture** - don't modify core unnecessarily
14. **Preserve backward compatibility** unless explicitly breaking
15. **Run full test suite before submitting PR**

### DON'Ts ❌

1. **Don't use semicolons** - project convention
2. **Don't use single quotes** - use double quotes
3. **Don't skip the @prettier pragma** - required for formatting
4. **Don't put React in `.js` files** - use `.jsx`
5. **Don't commit files in `dev-helpers/`** (except core files)
6. **Don't commit build artifacts** (`dist/` is gitignored)
7. **Don't skip tests** - they run in CI
8. **Don't bypass ESLint** - pre-commit hook enforces
9. **Don't use `console.log`** - only `console.warn` and `console.error`
10. **Don't render unsanitized HTML** - XSS vulnerability
11. **Don't modify `package-lock.json` manually**
12. **Don't push directly to `master` or `next`**
13. **Don't ignore Cypress test failures**
14. **Don't add dependencies without justification**
15. **Don't break the build** - verify with `npm run build`

### When Working with AI Assistants

**Before Making Changes:**
1. Read the affected files completely
2. Understand the plugin architecture
3. Check for existing tests
4. Review related documentation

**During Development:**
1. Make minimal, focused changes
2. Follow existing patterns in the codebase
3. Add tests alongside code changes
4. Run linters frequently

**After Changes:**
1. Verify all tests pass
2. Check build completes successfully
3. Test artifact exports
4. Review for security issues
5. Update relevant documentation

**Communication:**
- Be explicit about file locations
- Use line number references (e.g., `src/core/system.js:96`)
- Provide context for changes
- Mention any breaking changes clearly

### Performance Considerations

1. **Immutable.js:**
   - Use Immutable data structures for state
   - Use `.toJS()` sparingly (expensive)
   - Prefer Immutable operations

2. **React:**
   - Use React.memo for pure components
   - Implement shouldComponentUpdate for class components
   - Avoid inline function definitions in render

3. **Redux:**
   - Use reselect for memoized selectors
   - Keep reducers pure and fast
   - Avoid large state trees

4. **Bundle Size:**
   - Check bundle size with `npm run deps-size`
   - Review dependency licenses with `npm run deps-license`
   - Consider code splitting for large features

### Debugging Tips

**Development Server:**
```bash
npm run dev
# Open http://localhost:3200/
# Hot reload enabled
# Unminified stack traces
```

**Redux DevTools:**
- Extension supported
- State inspection available
- Time-travel debugging

**Cypress Interactive Mode:**
```bash
npm run cy:dev
# Visual test runner
# Step-through debugging
# Network inspection
```

**Jest Watch Mode:**
```bash
npm run test:unit -- --watch
# Re-run on file changes
# Filter by file name or test name
```

**Source Maps:**
- Generated for all builds
- Enable in browser DevTools
- Original source debugging

---

## Quick Reference

### Essential Commands

```bash
# Development
npm run dev              # Start dev server (port 3200)
npm start                # Static file server (port 3002)

# Building
npm run build            # Full production build
npm run clean            # Remove dist/

# Testing
npm test                 # Full test suite (lint + unit + E2E)
npm run test:unit        # Jest unit tests
npm run cy:dev           # Cypress interactive
npm run cy:ci            # Cypress CI mode
npm run test:artifact    # Artifact verification

# Linting
npm run lint             # ESLint (errors + warnings)
npm run lint-errors      # ESLint (errors only)
npm run lint-fix         # Auto-fix ESLint issues
npm run lint-styles      # Stylelint
npm run lint-styles-fix  # Auto-fix Stylelint issues

# Security
npm run security-audit   # Run npm audit

# Dependencies
npm run deps-check       # Size and license report
```

### File Paths

```
Core System:           src/core/system.js
Main Entry:            src/index.js
React Entry:           flavors/swagger-ui-react/index.jsx
Components:            src/core/components/
Plugins:               src/core/plugins/
Styles:                src/style/
Tests (Unit):          test/unit/
Tests (E2E):           test/e2e-cypress/e2e/
Build Output:          dist/
```

### Port Reference

- **3200** - Development server (webpack-dev-server)
- **3002** - Static file server (local-web-server)
- **3204** - Mock API server (json-server)
- **3230** - E2E test server (webpack-dev-server)

---

## Additional Resources

### Documentation

- **Setup Guide:** `docs/development/setting-up.md`
- **Scripts Reference:** `docs/development/scripts.md`
- **Plugin API:** `docs/customization/plugin-api.md`
- **Configuration:** `docs/usage/configuration.md`
- **OAuth2 Setup:** `docs/usage/oauth2.md`

### External Links

- **Homepage:** https://swagger.io/tools/swagger-ui/
- **Repository:** https://github.com/swagger-api/swagger-ui
- **npm (main):** https://www.npmjs.com/package/swagger-ui
- **npm (dist):** https://www.npmjs.com/package/swagger-ui-dist
- **npm (react):** https://www.npmjs.com/package/swagger-ui-react
- **OpenAPI Spec:** https://spec.openapis.org/

### Community

- **Issues:** https://github.com/swagger-api/swagger-ui/issues
- **Good First Issues:** https://github.com/swagger-api/swagger-ui/issues?q=is%3Aissue+is%3Aopen+label%3A%22Good+first+issue%22
- **Security:** security@swagger.io
- **Contributing:** https://github.com/swagger-api/.github/blob/HEAD/CONTRIBUTING.md

---

**Note:** This document should be updated whenever major architectural changes, new conventions, or significant workflows are introduced to the codebase.

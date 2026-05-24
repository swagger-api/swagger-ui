# Helpful scripts

Any of the scripts below can be run by typing `npm run <script name>` in the project's root directory.

### Developing
Script name | Description
--- | ---
`dev` | Spawn a hot-reloading dev server on port 3200.
`deps-check` | Generate a size and licensing report on Swagger UI's dependencies.
`lint` | Report ESLint style errors and warnings.
`lint-errors` | Report ESLint style errors, without warnings.
`lint-fix` | Attempt to fix style errors automatically.
`lint-styles` | Report Stylelint style errors and warnings.
`lint-styles-fix` | Attempt to fix Stylelint errors and warnings automatically.
`watch` | Rebuild the core files in `/dist` when the source code changes. Useful for `npm link` with Swagger Editor.

### Building
Script name | Description
--- | ---
`build` | Build a new set of JS and CSS assets, and output them to `/dist`.
`build-bundle` | Build `swagger-ui-bundle.js` only (commonJS). 
`build-core` | Build `swagger-ui.(js\|css)` only (commonJS).
`build-standalone` | Build `swagger-ui-standalone-preset.js` only (commonJS).
`build-stylesheets` | Build `swagger-ui.css` only.
`build:es:bundle` | Build `swagger-ui-es-bundle.js` only (es2015).
`build:es:bundle:core` | Build `swagger-ui-es-bundle-core.js` only (es2015).

### Testing
Script name | Description
--- | ---
`test` | Run unit tests in Node, run Cypress end-to-end tests, and run ESLint in errors-only mode.
`test:unit` | Run Jest unit tests in Node.
`e2e` | Run end-to-end tests (requires JDK and Selenium).
`e2e-cypress` | Run end-to-end browser tests with Cypress.
`dev-e2e-cypress` | Dev mode, open Cypress runner and manually select tests to run.
`lint` | Run ESLint test
`test:artifact` | Run list of bundle artifact tests in Jest
`test:artifact:umd:bundle` | Run unit test that confirms `swagger-ui-bundle` exports as a Function
`test:artifact:es:bundle` | Run unit test that confirms `swagger-ui-es-bundle` exports as a Function
`test:artifact:es:bundle:core` | Run unit test that confirms `swagger-ui-es-bundle-core` exports as a Function

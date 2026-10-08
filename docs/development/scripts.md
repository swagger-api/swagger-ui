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
`test` | Run ESLint in errors-only mode, unit tests in Node, and Playwright end-to-end tests.
`test:unit` | Run Jest unit tests in Node.
`e2e` | Run end-to-end browser tests with Playwright. Starts the webpack dev server and the mock API automatically (reuses them if already running outside CI).
`e2e:ui` | Open the Playwright UI mode to run and debug tests interactively.
`e2e:headed` | Run the Playwright tests in a visible browser.
`e2e:report` | Open the last Playwright HTML report.
`e2e:server` | Start only the webpack dev server used by the end-to-end tests (port 3230).
`e2e:mock-api` | Start only the mock API used by the end-to-end tests (port 3204).
`lint` | Run ESLint test
`test:artifact` | Run list of bundle artifact tests in Jest
`test:artifact:umd:bundle` | Run unit test that confirms `swagger-ui-bundle` exports as a Function
`test:artifact:es:bundle` | Run unit test that confirms `swagger-ui-es-bundle` exports as a Function
`test:artifact:es:bundle:core` | Run unit test that confirms `swagger-ui-es-bundle-core` exports as a Function

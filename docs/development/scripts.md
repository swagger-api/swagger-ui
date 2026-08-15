# Helpful scripts

Any of the scripts below can be run by typing `npm run <script name>` in the project's root directory.

### Developing
Script name | Description
--- | ---
`dev` | Spawn a hot-reloading dev server on port 3200.
`start` | Serve the contents of `dist/` on port 3002 and open it in the default browser.
`serve-static` | Serve the contents of `dist/` on port 3002 without opening a browser.
`deps-check` | Generate a size and licensing report on Swagger UI's dependencies.
`deps-license` | Generate the dependency license CSVs only.
`deps-size` | Generate the dependency bundle-size report only.
`lint` | Report ESLint style errors and warnings.
`lint-errors` | Report ESLint style errors, without warnings.
`lint-fix` | Attempt to fix style errors automatically.
`lint-styles` | Report Stylelint style errors and warnings.
`lint-styles-fix` | Attempt to fix Stylelint errors and warnings automatically.

### Building
Script name | Description
--- | ---
`build` | Build a new set of JS and CSS assets, and output them to `/dist`.
`build-all-bundles` | Build every JS bundle in parallel (no stylesheets, no clean step).
`build-stylesheets` | Build `swagger-ui.css` only.
`build:core` | Build `swagger-ui.js` only (CommonJS, browser).
`build:bundle` | Build `swagger-ui-bundle.js` only (CommonJS, isomorphic).
`build:standalone` | Build `swagger-ui-standalone-preset.js` only (CommonJS).
`build:es:bundle` | Build `swagger-ui-es-bundle.js` only (ES module, isomorphic).
`build:es:bundle:core` | Build `swagger-ui-es-bundle-core.js` only (ES module, browser).
`clean` | Remove the `dist/` directory.

### Testing
Script name | Description
--- | ---
`test` | Run ESLint in errors-only mode, Jest unit tests, and the full Cypress end-to-end suite.
`test:unit` | Run Jest unit tests in Node.
`test:artifact` | Run the bundle artifact tests in Jest, which verify that each built bundle exports correctly.
`cy:ci` | Start the dev server and mock API, then run all Cypress tests headlessly.
`cy:dev` | Start the dev server and mock API, then open the interactive Cypress runner.
`cy:run` | Run Cypress tests headlessly against an already-running server.
`cy:open` | Open the interactive Cypress runner against an already-running server.
`cy:start` | Start the Cypress webpack dev server and the JSON-server mock API in parallel.
`cy:server` | Start the Cypress webpack dev server only.
`cy:mock-api` | Start the JSON-server mock API on port 3204 only.

### Security
Script name | Description
--- | ---
`security-audit` | Run both the moderate-threshold audit on all dependencies and the low-threshold audit on production dependencies.
`security-audit:all` | Run `npm audit` on every dependency at the moderate threshold.
`security-audit:prod` | Run `npm audit` on production dependencies only at the low threshold.

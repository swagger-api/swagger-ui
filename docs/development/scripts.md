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
`watch` | Rebuild the core files in `/dist` when the source code changes. Useful for `npm link` with Swagger Editor.

### Building
Script name | Description
--- | ---
`build` | Build a new set of JS and CSS assets, and output them to `/dist`.
`build-bundle` | Build `swagger-ui-bundle.js` only.
`build-core` | Build `swagger-ui.(js\|css)` only.
`build-standalone` | Build `swagger-ui-standalone-preset.js` only.
`build-stylesheets` | Build `swagger-ui.css` only.

### Testing
Script name | Description
--- | ---
`test` | Run unit tests in Node and run ESLint in errors-only mode.
`just-test` | Run unit tests in the browser with Karma.
`just-test-in-node` | Run unit tests in Node.
`e2e` | Run end-to-end tests (requires JDK and Selenium).

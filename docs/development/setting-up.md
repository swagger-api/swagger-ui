# Setting up a dev environment

SwaggerUI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

### Prerequisites

- git, any version
- **Node.js >=22.11.0** and **npm >=10.9.0** are the minimum required versions that this repo runs on, but we always recommend using the latest version of Node.js.



### Steps

1. `git clone https://github.com/swagger-api/swagger-ui.git`
2. `cd swagger-ui`
3. `npm install`
4. `npx husky init` (optional)
5. `npm run dev`
6. Wait a bit
7. Open http://localhost:3200/

### Using your own local api definition with local dev build

You can specify a local file in `dev-helpers/dev-helper-initializer.js` by changing the `url` parameter. This local file MUST be located in the `dev-helpers` directory or a subdirectory. As a convenience and best practice, we recommend that you create a subdirectory, `dev-helpers/examples`, which is already specified in `.gitignore`.

replace
```
url: "https://petstore.swagger.io/v2/swagger.json",
```

with
```
url: "./examples/your-local-api-definition.yaml",
```

Files in `dev-helpers` should NOT be committed to git. The exception is if you are fixing something in `index.html`, `oauth2-redirect.html`, `dev-helper-initializer.js`, or introducing a new support file.

## Bonus points

- Swagger UI includes an ESLint rule definition. If you use a graphical editor, consider installing an ESLint plugin, which will point out syntax and style errors for you as you code.
  - The linter runs as part of the PR test sequence, so don't think you can get away with not paying attention to it!

# Setting up a dev environment

Swagger UI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

### Prerequisites

- git, any version

SwaggerUI Node.js support closely follows [Node.js Release Statuses](https://nodejs.org/en/about/releases/)
and is only expected to work on `Current`, `Active LTS` and `Maintanenace LTS` versions of Node.js.
SwaggerUI may also work on `Pending` or `EOL` versions of Node.js, but it's not guaranteed.

### Steps

1. `git clone https://github.com/swagger-api/swagger-ui.git`
2. `cd swagger-ui`
3. `npm run dev`
4. Wait a bit
5. Open http://localhost:3200/

### Using your own local api definition with local dev build

You can specify a local file in `dev-helpers/swagger-initializer.js` by changing the `url` parameter. This local file MUST be located in the `dev-helpers` directory or a subdirectory. As a convenience and best practice, we recommend that you create a subdirectory, `dev-helpers/examples`, which is already specified in `.gitignore`.

replace
```
url: "https://petstore.swagger.io/v2/swagger.json",
```

with
```
url: "./examples/your-local-api-definition.yaml",
```

Files in `dev-helpers` should NOT be committed to git. The exception is if you are fixing something in `index.html`, `oauth2-redirect.html`, `swagger-initializer.js`, or introducing a new support file.

## Bonus points

- Swagger UI includes an ESLint rule definition. If you use a graphical editor, consider installing an ESLint plugin, which will point out syntax and style errors for you as you code.
  - The linter runs as part of the PR test sequence, so don't think you can get away with not paying attention to it!

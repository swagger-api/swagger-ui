# Setting up a dev environment

Swagger UI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

### Prerequisites

- git, any version
- NPM >=6.12.x

Generally, we recommend the following guidelines from [Node.js Releases](https://nodejs.org/en/about/releases/) to only use Active LTS or Maintenance LTS releases.

Current Node.js:
- Node.js 16.x
- NPM >=7.10.x

Current Node.js Active LTS:
- Node.js 14.x
- NPM >=6.12.x

Current Node.js Maintenance LTS:
- Node.js >=12.4
- NPM >= 6.12.x


### Steps

1. `git clone https://github.com/swagger-api/swagger-ui.git`
2. `cd swagger-ui`
3. `npm run dev`
4. Wait a bit
5. Open http://localhost:3200/

### Using your own local api definition with local dev build

You can specify a local file in `dev-helpers/index.html` by changing the `url` parameter. This local file MUST be located in the `dev-helpers` directory or a subdirectory. As a convenience and best practice, we recommend that you create a subdirectory, `dev-helpers/examples`, which is already specified in `.gitignore`.

replace
```
url: "https://petstore.swagger.io/v2/swagger.json",
```

with
```
url: "./examples/your-local-api-definition.yaml",
```

Files in `dev-helpers` should NOT be committed to git. The exception is if you are fixing something in `index.html` or `oauth2-redirect.html`, or introducing a new support file.

## Bonus points

- Swagger UI includes an ESLint rule definition. If you use a graphical editor, consider installing an ESLint plugin, which will point out syntax and style errors for you as you code.
  - The linter runs as part of the PR test sequence, so don't think you can get away with not paying attention to it!

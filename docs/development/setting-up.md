# Setting up a dev environment

Swagger UI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

### Prerequisites

- git, any version
- NPM 6.x

Generally, we recommend following guidelines from [Node.js Releases](https://nodejs.org/en/about/releases/) to only use Active LTS or Maintenance LTS releases.

Current Node.js Active LTS:
- Node.js 12.x
- NPM 6.x

Current Node.js Maintenance LTS:
- Node.js 10.x
- NPM 6.x

Unsupported Node.js LTS that should still work:
- Node.js 8.13.0 or greater
- NPM 6.x

### Steps

1. `git clone https://github.com/swagger-api/swagger-ui.git`
2. `cd swagger-ui`
3. `npm install`
4. `npm run dev`
5. Wait a bit
6. Open http://localhost:3200/

## Bonus points

- Swagger UI includes an ESLint rule definition. If you use a graphical editor, consider installing an ESLint plugin, which will point out syntax and style errors for you as you code.
  - The linter runs as part of the PR test sequence, so don't think you can get away with not paying attention to it!

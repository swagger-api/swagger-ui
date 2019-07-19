# Setting up a dev environment

Swagger UI includes a development server that provides hot module reloading and unminified stack traces, for easier development.

### Prerequisites

- Node.js `6.0.0` or greater
- npm `3.0.0` or greater
- git, any version


### Steps

1. `git clone git@github.com:swagger-api/swagger-ui.git`
2. `cd swagger-ui`
3. `npm install`
4. `npm run dev`
5. Wait a bit
6. Open http://localhost:3200/

## Bonus points

- Swagger UI includes an ESLint rule definition. If you use a graphical editor, consider installing an ESLint plugin, which will point out syntax and style errors for you as you code.
  - The linter runs as part of the PR test sequence, so don't think you can get away with not paying attention to it!

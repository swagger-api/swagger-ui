# Swagger OSS Documentation Plan

Notes: 
- I came across GitBook recently, and it looks like a great way to host documentation. Example: https://jonas.github.io/tig/, https://codiechanel.gitbooks.io/gitbook-demo/content/

### Swagger-UI

##### Usage (12h)
- Downloading the project via npm, git submodules, packagist, unkpg cdn
- How to integrate with generic JS, React
- How to use Docker image (basic + Docker Compose)
- Configuration options and their individual docs
- Instance method (`initOAuth`, etc) documentation

##### Customization (16h)
- Plugin system overview
  - State machine: Redux
  - Actions, Wrap Actions, Reducers, Selectors, Wrap Selectors, Components, Wrap Components
  - Plugins vs. Presets (compare w. Babel: presets are collections of plugins)
- Example custom plugins for common use cases (on spec update, replace a component, etc)
- Example third-party plugin served via npm
- Example custom layout
- Disclaimer: plugins and components are not part of our public API. We'll make our best effort to minimize breaking changes, but you should pin a version if you're making heavy customizations.
- 

##### Core Development (8h)
- Application architecture overview
  - React + Redux + Reselect
  - Custom plugin system (Editor is a plugin)
- How to set up a local dev environment
- Contribution guidelines
- Linter and testing instructions
- GitHub Issues workflow (priorities, labels, code review, etc)
- Writing tests (JS unit, Enzyme unit, Nightwatch e2e)

### Swagger-Editor

##### Usage (6h)
- Downloading the project via npm, git submodules, packagist, unkpg, direct clone
- How to integrate with generic JS, React
- How to use Docker image (basic + Docker Compose)
- Editor-specific configuration options

##### Customization (4h)
- How to extend the validation and autocomplete systems

##### Development (4h)
- Validation and autocomplete system architecture
- How to develop Editor and UI simultaneously with `npm link`

### Swagger-Client (8h)
- Basic usage in browser + Node
- File uploads in browser + Node
- Instance method documentation (`buildRequest`, `execute`, etc)

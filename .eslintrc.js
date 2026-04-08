/**
 * @prettier
 */
const path = require("node:path")

module.exports = {
  parser: "@babel/eslint-parser",
  env: {
    browser: true,
    node: true,
    es6: true,
    jest: true,
    "jest/globals": true,
  },
  parserOptions: {
    ecmaFeatures: { jsx: true },
    babelOptions: { configFile: path.join(__dirname, "babel.config.js") },
  },
  extends: [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:jsx-a11y/recommended",
    "plugin:prettier/recommended",
  ],
  plugins: ["react", "import", "jest", "prettier", "jsx-a11y"],
  settings: {
    react: {
      pragma: "React",
      version: "15.0",
    },
  },
  rules: {
    semi: [2, "never"],
    strict: 0,
    quotes: [
      2,
      "double",
      {
        avoidEscape: true,
        allowTemplateLiterals: true,
      },
    ],
    "no-unused-vars": 2,
    "no-multi-spaces": 1,
    camelcase: [
      "error",
      {
        allow: [
          "^UNSAFE_",
          "^requestSnippetGenerator_",
          "^JsonSchema_",
          "^curl_",
          "^dom_",
          "^api_",
          "^client_",
          "^grant_",
          "^code_",
          "^redirect_",
          "^spec",
        ],
      },
    ],
    "no-use-before-define": [2, "nofunc"],
    "no-underscore-dangle": 0,
    "no-unused-expressions": 1,
    "comma-dangle": 0,
    "no-console": [
      2,
      {
        allow: ["warn", "error"],
      },
    ],
    "react/jsx-no-bind": 1,
    "react/jsx-no-target-blank": 2,
    "react/display-name": 0,
    "import/no-extraneous-dependencies": 2,
    "react/jsx-filename-extension": 2,
    // autoFocus on the first field of a modal is an accepted a11y pattern
    "jsx-a11y/no-autofocus": 0,
    // Non-interactive elements with onClick need design-level refactoring; warn for now
    "jsx-a11y/click-events-have-key-events": 1,
    "jsx-a11y/no-static-element-interactions": 1,
    "jsx-a11y/no-noninteractive-element-interactions": 1,
    // Scope checkbox labels have accessible text nested at depth 3
    "jsx-a11y/label-has-associated-control": ["error", { depth: 3 }],
  },
}

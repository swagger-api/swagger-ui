const browser = {
  presets: [
    [
      "@babel/preset-env",
      {
        debug: false,
        modules: "auto",
        useBuiltIns: false,
        forceAllTransforms: false,
        ignoreBrowserslistConfig: false,
      }
    ],
    "@babel/preset-react",
  ],
    plugins: [
    [
      "@babel/plugin-transform-runtime",
      {
        corejs: { version: 3, proposals: false },
        absoluteRuntime: false,
        helpers: true,
        regenerator: false,
        version: "^7.22.11",
      }
    ],
    [
      "transform-react-remove-prop-types",
      {
        additionalLibraries: [
          "react-immutable-proptypes"
        ]
      }
    ],
    [
      "babel-plugin-module-resolver",
      {
        alias: {
          root: ".",
          core: "./src/core",
        }
      }
    ]
  ],
}

module.exports = {
  env: {
    commonjs: {
      presets: [
        [
          "@babel/preset-env",
          {
            debug: false,
            modules: "commonjs",
            loose: true,
            useBuiltIns: false,
            forceAllTransforms: false,
            ignoreBrowserslistConfig: false,
          }
        ],
        "@babel/preset-react",
      ],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: { version: 3, proposals: false },
            absoluteRuntime: false,
            helpers: true,
            regenerator: false,
            version: "^7.22.11",
          }
        ],
        [
          "transform-react-remove-prop-types",
          {
            additionalLibraries: [
              "react-immutable-proptypes"
            ]
          }
        ],
        [
          "babel-plugin-module-resolver",
          {
            alias: {
              root: ".",
              core: "./src/core",
            }
          }
        ]
      ],
    },
    esm: {
      presets: [
        [
          "@babel/env",
          {
            debug: false,
            modules: false,
            ignoreBrowserslistConfig: false,
            useBuiltIns: false,
          }
        ],
        "@babel/preset-react"
      ],
      plugins: [
        [
          "@babel/plugin-transform-runtime",
          {
            corejs: { version: 3, proposals: false },
            absoluteRuntime: false,
            helpers: true,
            regenerator: false,
            version: "^7.22.11",
          }
        ],
        [
          "transform-react-remove-prop-types",
          {
            additionalLibraries: [
              "react-immutable-proptypes"
            ]
          }
        ],
        [
          "babel-plugin-module-resolver",
          {
            alias: {
              root: ".",
              core: "./src/core",
            }
          }
        ]
      ]
    },
    development: browser,
    production: browser,
  },
}


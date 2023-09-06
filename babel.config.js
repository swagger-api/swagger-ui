module.exports = {
  "env": {
    "commonjs": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "debug": false,
            "modules": "commonjs",
            "loose": true,
            "targets": "maintained node versions",
            "forceAllTransforms": false,
            "ignoreBrowserslistConfig": true,
          }
        ],
        "@babel/preset-react",
      ],
      "plugins": [
        [
          "transform-react-remove-prop-types",
          {
            "additionalLibraries": [
              "react-immutable-proptypes"
            ]
          }
        ],
      ],
    },
    "esm": {
      "presets": [
        [
          "@babel/env",
          {
            "debug": false,
            "modules": false,
            "ignoreBrowserslistConfig": false,
            "useBuiltIns": false,
            "include": [
              "@babel/plugin-proposal-logical-assignment-operators"
            ]
          }
        ],
        "@babel/preset-react"
      ],
      "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 3,
            "absoluteRuntime": false,
            "version": "^7.11.2"
          }
        ],
        [
          "transform-react-remove-prop-types",
          {
            "additionalLibraries": [
              "react-immutable-proptypes"
            ]
          }
        ],
        [
          "babel-plugin-module-resolver",
          {
            "alias": {
              "root": ".",
              "core": "./src/core",
            }
          }
        ]
      ]
    },
    "test": {
      "presets": [
        [
          "@babel/env",
          {
            "targets": {
              "node": "16.13.2"
            },
            "ignoreBrowserslistConfig": true,
            "useBuiltIns": false,
          }
        ],
        "@babel/preset-react"
      ],
      "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 3,
            "absoluteRuntime": false,
            "version": "^7.11.2"
          }
        ],
        [
          "transform-react-remove-prop-types",
          {
            "additionalLibraries": [
              "react-immutable-proptypes"
            ]
          }
        ],
        [
          "babel-plugin-module-resolver",
          {
            "alias": {
              "root": ".",
              "core": "./src/core",
            }
          }
        ]
      ]
    },
    "development": {
      "presets": [
        [
          "@babel/env",
          {
            "ignoreBrowserslistConfig": false,
            "useBuiltIns": false,
            "include": [
              "@babel/plugin-proposal-logical-assignment-operators"
            ]
          }
        ],
        "@babel/preset-react"
      ],
      "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 3,
            "absoluteRuntime": false,
            "version": "^7.11.2"
          }
        ],
        [
          "transform-react-remove-prop-types",
          {
            "additionalLibraries": [
              "react-immutable-proptypes"
            ]
          }
        ],
        [
          "babel-plugin-module-resolver",
          {
            "alias": {
              "root": ".",
              "core": "./src/core",
            }
          }
        ]
      ]
    },
    "production": {
      "presets": [
        [
          "@babel/env",
          {
            "ignoreBrowserslistConfig": false,
            "useBuiltIns": false,
            "include": [
              "@babel/plugin-proposal-logical-assignment-operators"
            ]
          }
        ],
        "@babel/preset-react"
      ],
      "plugins": [
        "@babel/plugin-transform-class-properties",
        "@babel/plugin-transform-nullish-coalescing-operator",
        "@babel/plugin-transform-object-rest-spread",
        "@babel/plugin-transform-optional-chaining",
        [
          "@babel/plugin-transform-runtime",
          {
            "corejs": 3,
            "absoluteRuntime": false,
            "version": "^7.11.2"
          }
        ],
        [
          "transform-react-remove-prop-types",
          {
            "additionalLibraries": [
              "react-immutable-proptypes"
            ]
          }
        ],
        [
          "babel-plugin-module-resolver",
          {
            "alias": {
              "root": ".",
              "core": "./src/core",
            }
          }
        ]
      ]
    },
  }
}


module.exports = {
  "env": {
    "commonjs": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "debug": false,
            "modules": "commonjs",
            "targets": {
              "node": "8"
            },
            "forceAllTransforms": false,
            "ignoreBrowserslistConfig": true
          }
        ],
        "@babel/preset-react",
      ],
      "plugins": [
        [
          "@babel/plugin-transform-modules-commonjs",
          {
            "loose": true
          }
        ],
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
      ]
    },
    "es": {
      "presets": [
        [
          "@babel/preset-env",
          {
            "debug": false,
            "modules": false
          }
        ],
        "@babel/preset-react",
      ],
      "plugins": [
        [
          "@babel/plugin-transform-runtime",
          {
            "absoluteRuntime": false,
            "corejs": 3,
            "version": "^7.11.2"
          }
        ],
        "@babel/proposal-class-properties",
        "@babel/proposal-object-rest-spread",
        "@babel/plugin-proposal-optional-chaining",
      ]
    },
    "development": {
      "presets": [
        [
          "@babel/env",
          {
            "targets": {
              "browsers": [
                /* benefit of C/S/FF/Edge only? */
                "> 1%",
                "last 2 versions",
                "Firefox ESR",
                "not dead"
              ]
            },
            "useBuiltIns": false,
            "corejs": { version: 3 },
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
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-optional-chaining",
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
              "components": "./src/core/components",
              "containers": "./src/core/containers",
              "core": "./src/core",
              "plugins": "./src/plugins",
              "img": "./src/img",
              "corePlugins": "./src/core/plugins",
              "less": "./src/less"
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
              "node": "10"
            },
            "useBuiltIns": false,
            "corejs": { version: 3 }
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
        "@babel/plugin-proposal-class-properties",
        "@babel/plugin-proposal-optional-chaining",
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
              "components": "./src/core/components",
              "containers": "./src/core/containers",
              "core": "./src/core",
              "plugins": "./src/plugins",
              "img": "./src/img",
              "corePlugins": "./src/core/plugins",
              "less": "./src/less"
            }
          }
        ]
      ]
    }
  }
}


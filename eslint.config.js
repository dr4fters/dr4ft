const path = require("path");
const js = require("@eslint/js");
const globals = require("globals");
const react = require("eslint-plugin-react");
const importX = require("eslint-plugin-import-x");
const { includeIgnoreFile } = require("@eslint/compat");

module.exports = [
  includeIgnoreFile(path.join(__dirname, ".gitignore")),
  js.configs.recommended,
  react.configs.flat.recommended,
  importX.flatConfigs.errors,
  {
    languageOptions: {
      ecmaVersion: "latest",
      sourceType: "module",
      parserOptions: {
        ecmaFeatures: {
          jsx: true
        }
      },
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.mocha,
        BUILD_DATE: "readonly"
      }
    },
    rules: {
      "indent": [
        "error",
        2
      ],
      "linebreak-style": [
        "error",
        "unix"
      ],
      "quotes": [
        "error",
        "double"
      ],
      "semi": [
        "error",
        "always"
      ],
      "no-unused-vars" : [
        "warn", {
          caughtErrors: "none"
        }
      ],
      "camelcase": [
        "warn", {
          ignoreDestructuring: true,
          allow: [
            "^balance_colors$"
          ]
        }
      ],
      "no-multi-spaces": [
        "error"
      ],
      "no-trailing-spaces": "error",
      "import-x/namespace": 0,
      "import-x/named": 0
    },
    settings: {
      "react": {
        "version": "19.3"
      },
      "import-x/resolver-next": [
        importX.createNodeResolver({
          extensions: [".js", ".jsx"]
        })
      ]
    }
  }
];

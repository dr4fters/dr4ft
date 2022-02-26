module.exports = {
  "env": {
    "browser": true,
    "es6": true,
    "node": true
  },
  "extends": [
    "eslint:recommended",
    "plugin:react/recommended",
    "plugin:import/errors"
  ],
  "parserOptions": {
    "ecmaVersion": 9,
    "requireConfigFile": false,
    "ecmaFeatures": {
      "jsx": true
    },
    "sourceType": "module"
  },
  "parser": "@babel/eslint-parser",
  "plugins": [
    "react"
  ],
  "rules": {
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
      "warn"
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
    "import/namespace": 0,
    "import/named": 0
  },
  "settings": {
    "react": {
      "version": "detect"
    },
    "import/resolver": {
      "node": {
        "extensions": [".js", ".jsx"]
      }
    }
  }
};

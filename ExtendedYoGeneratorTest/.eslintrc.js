const path = require("path");

module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        "plugin:@manuth/typescript/recommended-requiring-type-checking"
    ],
    env: {
        node: true,
        es6: true
    },
    parserOptions: {
        sourceType: "module",
        project: [
            path.join(__dirname, "tsconfig.json"),
            path.join(__dirname, "tsconfig.eslint.json")
        ]
    }
};

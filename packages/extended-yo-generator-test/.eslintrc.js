const Path = require("path");

module.exports = {
    parser: "@typescript-eslint/parser",
    extends: [
        Path.join("..", "..", ".eslintrc.js")
    ],
    parserOptions: {
        project: [
            Path.join(__dirname, "tsconfig.json"),
            Path.join(__dirname, "tsconfig.eslint.json")
        ]
    }
};

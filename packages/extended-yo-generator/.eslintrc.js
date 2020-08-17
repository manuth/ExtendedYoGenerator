const Path = require("path");

module.exports = {
    extends: [
        Path.join("..", "..", ".eslintrc.js")
    ],
    parserOptions: {
        project: [
            Path.join(__dirname, "tsconfig.json"),
            Path.join(__dirname, "tsconfig.eslint.json"),
            Path.join(__dirname, "src", "tests", "tsconfig.json")
        ]
    }
};

const { join } = require("path");

module.exports = {
    extends: [
        join("..", "..", ".eslintrc.js")
    ],
    parserOptions: {
        project: [
            join(__dirname, "tsconfig.json"),
            join(__dirname, "tsconfig.eslint.json")
        ]
    }
};

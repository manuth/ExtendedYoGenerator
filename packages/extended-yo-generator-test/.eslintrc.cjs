const { join } = require("path");

module.exports = {
    extends: [
        join("..", "..", ".eslintrc.cjs")
    ],
    parserOptions: {
        project: [
            join(__dirname, "tsconfig.json"),
            join(__dirname, "tsconfig.eslint.json"),
            join(__dirname, "src", "tests", "tsconfig.json")
        ]
    }
};

const Path = require("path");

module.exports = {
    root: true,
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
            Path.join(__dirname, "tsconfig.json"),
            Path.join(__dirname, "tsconfig.eslint.json")
        ]
    },
    rules: {
        "jsdoc/require-jsdoc": [
            "warn",
            {
                require: {
                    ClassDeclaration: true,
                    ClassExpression: true,
                    ArrowFunctionExpression: false,
                    FunctionDeclaration: true,
                    FunctionExpression: true,
                    MethodDefinition: true
                },
                contexts: [
                    "TSEnumDeclaration",
                    "TSEnumMember",
                    "TSInterfaceDeclaration",
                    "ClassProperty",
                    "TSTypeAliasDeclaration",
                    "TSPropertySignature",
                    "TSAbstractMethodDefinition",
                    "TSCallSignatureDeclaration",
                    "TSConstructSignatureDeclaration",
                    "TSMethodSignature",
                    "TSDeclareFunction",
                    "VariableDeclaration > VariableDeclarator:not([id.typeAnnotation]) > ArrowFunctionExpression"
                ]
            }
        ],
        "generator-star-spacing": [
            "error", {
                before: false,
                after: true,
                anonymous: "neither"
            }
        ]
    }
};

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
            path.join(__dirname, "tsconfig.eslint.json"),
            path.join(__dirname, "test", "TestGenerator", "tsconfig.json")
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
        ]
    }
};

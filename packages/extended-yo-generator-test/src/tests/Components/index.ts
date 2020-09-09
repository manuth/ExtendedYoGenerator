import TestGenerator = require("../../generators/app");
import { TestContext } from "../../TestContext";
import { FileMappingTesterTests } from "./FileMappingTester.test";
import { JavaScriptFileMappingTesterTests } from "./JavaScriptFileMappingTester.test";
import { JSONFileMappingTesterTests } from "./JSONFileMappingTester.test";

/**
 * Registers tests for components.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TestGenerator>): void
{
    suite(
        "Components",
        () =>
        {
            FileMappingTesterTests(context);
            JSONFileMappingTesterTests(context);
            JavaScriptFileMappingTesterTests(context);
        });
}

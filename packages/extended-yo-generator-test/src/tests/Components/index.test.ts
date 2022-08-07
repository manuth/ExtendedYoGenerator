import { basename } from "node:path";
import { TestContext } from "../../TestContext.js";
import { TestGenerator } from "../../TestGenerator.js";
import { FileMappingTesterTests } from "./FileMappingTester.test.js";
import { JavaScriptFileMappingTesterTests } from "./JavaScriptFileMappingTester.test.js";
import { JSONFileMappingTesterTests } from "./JSONFileMappingTester.test.js";

/**
 * Registers tests for components.
 *
 * @param context
 * The test-context.
 */
export function ComponentTests(context: TestContext<TestGenerator>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            FileMappingTesterTests(context);
            JSONFileMappingTesterTests(context);
            JavaScriptFileMappingTesterTests(context);
        });
}

import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { BaseGeneratorFactoryTests } from "./BaseGeneratorFactory.test.js";
import { ObjectExtensionFactoryTests } from "./ObjectExtensionFactory.test.js";

/**
 * Registers tests for extensibility-components.
 *
 * @param context
 * The test-context.
 */
export function ExtensibilityTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            BaseGeneratorFactoryTests(context);
            ObjectExtensionFactoryTests(context);
        });
}

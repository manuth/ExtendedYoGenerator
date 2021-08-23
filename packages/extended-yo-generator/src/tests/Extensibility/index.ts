import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { BaseGeneratorFactoryTests } from "./BaseGeneratorFactory.test";
import { ObjectExtensionFactoryTests } from "./ObjectExtensionFactory.test";

/**
 * Registers tests for extensibility-components.
 *
 * @param context
 * The test-context.
 */
export function ExtensibilityTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(__dirname),
        () =>
        {
            BaseGeneratorFactoryTests(context);
            ObjectExtensionFactoryTests(context);
        });
}

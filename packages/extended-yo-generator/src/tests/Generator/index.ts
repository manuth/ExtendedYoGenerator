import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { BaseGeneratorFactoryTests } from "./BaseGeneratorFactory.test";
import { ExtendedGeneratorTests } from "./GeneratorTests.test";

/**
 * Registers the generator-tests.
 *
 * @param context
 * The context to use.
 */
export function GeneratorTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    ExtendedGeneratorTests(context);
    BaseGeneratorFactoryTests(context);
}

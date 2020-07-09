import { TestContext } from "@manuth/extended-yo-generator-test";
import { ExtendedGeneratorTests } from "./GeneratorTests.test";
import { ITestOptions } from "./ITestOptions";
import { TestGenerator } from "./TestGenerator/TestGenerator";

/**
 * Registers the generator-tests.
 *
 * @param context
 * The context to use.
 */
export function GeneratorTests(context: TestContext<TestGenerator, ITestOptions>): void
{
    ExtendedGeneratorTests(context);
}

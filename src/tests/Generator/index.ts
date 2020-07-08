import { TestContext } from "../TestContext";
import { ExtendedGeneratorTests } from "./GeneratorTests.test";

/**
 * Registers the generator-tests.
 *
 * @param context
 * The context to use.
 */
export function GeneratorTests(context: TestContext): void
{
    ExtendedGeneratorTests(context);
}

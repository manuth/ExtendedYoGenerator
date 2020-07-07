import { TestContext } from "../TestContext";
import { TSGeneratorTests } from "./TSGeneratorGenerator.test";

/**
 * Registers the generator-tests.
 *
 * @param context
 * The context to use.
 */
export function GeneratorTests(context: TestContext): void
{
    TSGeneratorTests(context);
}

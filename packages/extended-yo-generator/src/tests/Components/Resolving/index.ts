import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { PropertyResolverTests } from "./PropertyResolver.test";

/**
 * Registers tests about resolving.
 *
 * @param context
 * The test-context to use.
 */
export function ResolvingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Resolving",
        () =>
        {
            require("./Resolver.test");
            PropertyResolverTests(context);
        });
}

import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { PropertyResolverTests } from "./PropertyResolver.test";
import { ResolverTests } from "./Resolver.test";

/**
 * Registers tests for components related to resolving.
 *
 * @param context
 * The test-context.
 */
export function ResolvingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Resolving",
        () =>
        {
            ResolverTests(context);
            PropertyResolverTests(context);
        });
}

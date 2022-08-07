import { basename } from "path";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { PropertyResolverTests } from "./PropertyResolver.test.js";
import { ResolverTests } from "./Resolver.test.js";

/**
 * Registers tests for components related to resolving.
 *
 * @param context
 * The test-context.
 */
export function ResolvingTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        basename(new URL(".", import.meta.url).pathname),
        () =>
        {
            ResolverTests(context);
            PropertyResolverTests(context);
        });
}

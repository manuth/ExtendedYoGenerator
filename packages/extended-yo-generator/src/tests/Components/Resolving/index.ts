import { TestContext } from "@manuth/extended-yo-generator-test";
import { ITestOptions } from "../../Generator/ITestOptions";
import { TestGenerator } from "../../Generator/TestGenerator/TestGenerator";
import { PropertyResolverTests } from "./PropertyResolver.test";

/**
 * Registers tests about resolving.
 *
 * @param context
 * The test-context to use.
 */
export function ResolvingTests(context: TestContext<TestGenerator, ITestOptions>): void
{
    suite(
        "Resolving",
        () =>
        {
            require("./Resolver.test");
            PropertyResolverTests(context);
        });
}

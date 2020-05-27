import { TestContext } from "../../TestContext";
import { PropertyResolverTests } from "./PropertyResolver.test";

/**
 * Registers tests about resolving.
 *
 * @param context
 * The test-context to use.
 */
export function ResolvingTests(context: TestContext)
{
    suite(
        "Resolving",
        () =>
        {
            require("./Resolver.test");
            PropertyResolverTests(context);
        });
}

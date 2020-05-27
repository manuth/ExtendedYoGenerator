import { Resolvable } from "../../../Components/Resolving/Resolvable";
import { ResolverTest } from "./ResolverTest";

/**
 * Options for the resolver.
 */
export interface IResolverTestOptions
{
    /**
     * A test-value.
     */
    TestValue: Resolvable<ResolverTest, null, string>;

    /**
     * A test-promise.
     */
    TestPromise: Resolvable<ResolverTest, null, Promise<string>>;

    /**
     * A test-method.
     */
    TestFunction: Resolvable<ResolverTest, null, () => string>;
}

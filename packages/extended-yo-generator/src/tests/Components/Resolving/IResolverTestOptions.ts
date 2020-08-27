import { ResolvableAsync } from "../../../Components/Resolving/ResolvableAsync";
import { ResolverTest } from "./ResolverTest";

/**
 * Options for the resolver.
 */
export interface IResolverTestOptions
{
    /**
     * A test-value.
     */
    TestValue: ResolvableAsync<ResolverTest, null, null, string>;

    /**
     * A test-promise.
     */
    TestPromise: ResolvableAsync<ResolverTest, null, null, Promise<string>>;

    /**
     * A test-method.
     */
    TestFunction: ResolvableAsync<ResolverTest, null, null, () => string>;
}

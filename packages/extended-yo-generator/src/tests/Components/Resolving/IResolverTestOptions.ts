import { ResolvableAsync } from "../../../Components/Resolving/ResolvableAsync.js";
import { ResolverTest } from "./ResolverTest.js";

/**
 * Options for the {@link ResolverTest `ResolverTest`} class.
 */
export interface IResolverTestOptions
{
    /**
     * A test-value.
     */
    TestValue: ResolvableAsync<ResolverTest, unknown, unknown, string>;

    /**
     * A test-promise.
     */
    TestPromise: ResolvableAsync<ResolverTest, unknown, unknown, Promise<string>>;

    /**
     * A test-method.
     */
    TestFunction: ResolvableAsync<ResolverTest, unknown, unknown, () => string>;
}

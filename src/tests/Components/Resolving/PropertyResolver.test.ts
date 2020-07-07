import Assert = require("assert");
import { TestContext } from "../../TestContext";
import { IResolverTestOptions } from "./IResolverTestOptions";
import { ResolverTest } from "./ResolverTest";

/**
 * Registers tests for the `PropertyResolver` class.
 *
 * @param context
 * The test-context to use.
 */
export function PropertyResolverTests(context: TestContext): void
{
    suite(
        "PropertyResolver",
        () =>
        {
            let propertResolver: ResolverTest;
            let testValue = "this is a test";
            let testPromise = context.CreatePromise(testValue);
            let testFunction = context.CreateFunction(testValue);

            let resolverOptions: IResolverTestOptions = {
                TestValue: null,
                TestPromise: null,
                TestFunction: null
            };

            suiteSetup(
                async () =>
                {
                    propertResolver = new ResolverTest(
                        await context.Generator,
                        resolverOptions);
                });

            setup(
                () =>
                {
                    resolverOptions.TestValue = testValue;
                    resolverOptions.TestPromise = context.CreateFunction(testPromise);
                    resolverOptions.TestFunction = context.CreatePromiseFunction(testFunction);
                });

            suite(
                "Promise<T> ResolveProperty<T>(TTarget target, Resolvable<TTarget, TSettings, T> value)",
                () =>
                {
                    test(
                        "Checking whether properties are resolved correctly…",
                        async () =>
                        {
                            Assert.strictEqual(await propertResolver.TestValue, testValue);
                            Assert.strictEqual(await propertResolver.TestPromise, await testPromise);
                            Assert.strictEqual(await propertResolver.TestFunction, testFunction);
                        });

                    test(
                        "Checking whether the target-object can be used within a resolve-method…",
                        async () =>
                        {
                            resolverOptions.TestValue = async (target) =>
                            {
                                return `${await target.TestPromise}${await target.TestFunction}`;
                            };

                            Assert.strictEqual(await propertResolver.TestValue, `${await propertResolver.TestPromise}${await propertResolver.TestFunction}`);
                        });
                });
        });
}
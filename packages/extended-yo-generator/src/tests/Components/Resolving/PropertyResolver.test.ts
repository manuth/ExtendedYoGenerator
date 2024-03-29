import { doesNotReject, strictEqual } from "node:assert";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { PropertyResolver } from "../../../Components/Resolving/PropertyResolver.js";
import { IResolverTestOptions } from "./IResolverTestOptions.js";
import { ResolverTest } from "./ResolverTest.js";

/**
 * Registers tests for the {@link PropertyResolver `PropertyResolver<TObject, TTarget, TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context.
 */
export function PropertyResolverTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof<PropertyResolver<any, any, any, any>>(),
        () =>
        {
            let propertyResolver: ResolverTest;
            let testValue = "this is a test";
            let testPromise = context.CreatePromise(testValue);
            let testFunction = context.CreateFunction(testValue);

            let resolverOptions: IResolverTestOptions = {
                TestValue: null,
                TestPromise: null,
                TestFunction: null
            };

            suiteSetup(
                async function()
                {
                    this.timeout(30 * 1000);

                    propertyResolver = new ResolverTest(
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
                nameof<PropertyResolver<any, any, any, any>>(),
                () =>
                {
                    test(
                        "Checking whether properties are resolved correctly…",
                        async () =>
                        {
                            strictEqual(await propertyResolver.TestValue, testValue);
                            strictEqual(await propertyResolver.TestPromise, await testPromise);
                            strictEqual(await propertyResolver.TestFunction, testFunction);
                        });

                    test(
                        "Checking whether the target-object can be used within a resolve-method…",
                        async () =>
                        {
                            resolverOptions.TestValue = async (target) =>
                            {
                                return `${await target.TestPromise}${await target.TestFunction}`;
                            };

                            strictEqual(await propertyResolver.TestValue, `${await propertyResolver.TestPromise}${await propertyResolver.TestFunction}`);
                        });

                    test(
                        "Checking whether the `thisArg` of functions is set properly…",
                        async () =>
                        {
                            let testInstance = new
                                /**
                                 * Provides a class for testing the resolver.
                                 */
                                class TestClass implements IResolverTestOptions
                                {
                                    /**
                                     * @inheritdoc
                                     */
                                    public TestValue = context.RandomString;

                                    /**
                                     * @inheritdoc
                                     */
                                    public get TestPromise(): Promise<string>
                                    {
                                        let result = this.TestValue;

                                        return (
                                            async () =>
                                            {
                                                return result;
                                            })();
                                    }

                                    /**
                                     * @inheritdoc
                                     */
                                    public TestFunction: IResolverTestOptions["TestFunction"] = null;
                                }();

                            let testResolver = new ResolverTest(await context.Generator, testInstance);
                            doesNotReject(() => testResolver.TestPromise);
                            strictEqual(await testResolver.TestPromise, testInstance.TestValue);
                        });
                });
        });
}

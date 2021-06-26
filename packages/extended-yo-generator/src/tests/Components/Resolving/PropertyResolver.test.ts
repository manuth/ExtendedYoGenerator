import { doesNotReject, strictEqual } from "assert";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { PropertyResolver } from "@manuth/extended-yo-generator/src/Components/Resolving/PropertyResolver";
import { Random } from "random-js";
import { IResolverTestOptions } from "./IResolverTestOptions";
import { ResolverTest } from "./ResolverTest";

/**
 * Registers tests for the {@link PropertyResolver `PropertyResolver<TObject, TTarget, TSettings, TOptions>`} class.
 *
 * @param context
 * The test-context to use.
 */
export function PropertyResolverTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "PropertyResolver",
        () =>
        {
            let random: Random;
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
                async function()
                {
                    this.timeout(0);
                    random = new Random();

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
                "ResolveProperty",
                () =>
                {
                    test(
                        "Checking whether properties are resolved correctly…",
                        async () =>
                        {
                            strictEqual(await propertResolver.TestValue, testValue);
                            strictEqual(await propertResolver.TestPromise, await testPromise);
                            strictEqual(await propertResolver.TestFunction, testFunction);
                        });

                    test(
                        "Checking whether the target-object can be used within a resolve-method…",
                        async () =>
                        {
                            resolverOptions.TestValue = async (target) =>
                            {
                                return `${await target.TestPromise}${await target.TestFunction}`;
                            };

                            strictEqual(await propertResolver.TestValue, `${await propertResolver.TestPromise}${await propertResolver.TestFunction}`);
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
                                    public TestValue = random.string(10);

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

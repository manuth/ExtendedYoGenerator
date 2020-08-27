import Assert = require("assert");
import { TestContext, TestGenerator, ITestGeneratorOptions, ITestOptions } from "@manuth/extended-yo-generator-test";
import { Resolvable } from "../../../Components/Resolving/Resolvable";
import { Resolver } from "../../../Components/Resolving/Resolver";

/**
 * Registers tests for the `Resolver` class.
 *
 * @param context
 * The context of the test-execution.
 */
export function ResolverTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        "Resolver",
        () =>
        {
            /**
             * Represents a test-implementation of the `Resolver` class.
             */
            class TestResolver extends Resolver<null, null, null>
            {
                /**
                 * @inheritdoc
                 *
                 * @param target
                 * The component.
                 *
                 * @param generator
                 * The generator of the component.
                 *
                 * @param value
                 * The value to resolve.
                 *
                 * @returns
                 * The resolved value.
                 */
                public Resolve<T>(target: null, generator: null, value: Resolvable<null, null, null, T>): T
                {
                    return super.Resolve<T>(target, generator, value);
                }
            }

            suite(
                "Resolve",
                async () =>
                {
                    let resolver: TestResolver;
                    let testValue = "test";
                    let testPromise = context.CreatePromise(testValue);

                    /**
                     * A test function.
                     */
                    let testFunction = (): void => { };

                    suiteSetup(
                        () =>
                        {
                            resolver = new TestResolver();
                        });

                    test(
                        "Checking whether values can be resolved no mather whether they are functions, promises or plain values…",
                        async () =>
                        {
                            Assert.strictEqual(testValue, resolver.Resolve(null, null, testValue));
                            Assert.strictEqual(testValue, await resolver.Resolve<Promise<string>>(null, null, context.CreatePromise(testValue)));
                            Assert.strictEqual(testValue, resolver.Resolve(null, null, context.CreateFunction(testValue)));
                            Assert.strictEqual(testValue, resolver.Resolve<Promise<string>>(null, null, context.CreatePromiseFunction(testValue)));
                        });

                    test(
                        "Checking whether nested promises act as expected…",
                        async () =>
                        {
                            Assert.strictEqual(await testPromise, await resolver.Resolve<Promise<string>>(null, null, testPromise));
                            Assert.strictEqual(await testPromise, await resolver.Resolve(null, null, context.CreatePromise(testPromise)));
                            Assert.strictEqual(await testPromise, await resolver.Resolve<Promise<string>>(null, null, context.CreateFunction(testPromise)));
                            Assert.strictEqual(await testPromise, await resolver.Resolve<Promise<Promise<string>>>(null, null, context.CreatePromiseFunction(testPromise)));
                        });

                    test(
                        "Checking whether plain functions cannot be resolved…",
                        () =>
                        {
                            // @ts-ignore
                            Assert.notStrictEqual(testFunction, resolver.Resolve(null, null, testFunction));
                        });

                    test(
                        "Checking whether functions can be resolved otherwise…",
                        async () =>
                        {
                            Assert.strictEqual(testFunction, await resolver.Resolve<Promise<() => void>>(null, null, context.CreatePromise(testFunction)));
                            Assert.strictEqual(testFunction, resolver.Resolve<() => void>(null, null, context.CreateFunction(testFunction)));
                            Assert.strictEqual(testFunction, await resolver.Resolve<Promise<() => void>>(null, null, context.CreatePromiseFunction(testFunction)));
                        });

                    test(
                        "Checking whether properties are resolved lazily…",
                        async () =>
                        {
                            let value = "hello world";
                            let test: typeof value = null;

                            let result = new Promise(
                                (resolve) =>
                                {
                                    setTimeout(
                                        () =>
                                        {
                                            test = value;
                                            resolve(value);
                                        },
                                        1);
                                });

                            Assert.strictEqual(test, null);
                            await result;
                            Assert.strictEqual(test, value);
                        });
                });
        });
}

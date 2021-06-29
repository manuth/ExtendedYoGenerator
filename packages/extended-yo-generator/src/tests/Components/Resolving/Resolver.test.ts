import { notStrictEqual, strictEqual } from "assert";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { Resolvable } from "../../../Components/Resolving/Resolvable";
import { Resolver } from "../../../Components/Resolving/Resolver";

/**
 * Registers tests for the {@link Resolver `Resolver<TTarget, TSettings, TOptions>`} class.
 *
 * @param context
 * The context of the test-execution.
 */
export function ResolverTests(context: TestContext<TestGenerator, ITestGeneratorOptions<ITestOptions>>): void
{
    suite(
        nameof(Resolver),
        () =>
        {
            /**
             * Represents a test-implementation of the {@link Resolver `Resolver<TTarget, TSettings, TOptions>`} class.
             */
            class TestResolver extends Resolver<null, null, null>
            {
                /**
                 * @inheritdoc
                 *
                 * @template T
                 * The type of the value to resolve.
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
                public override Resolve<T>(target: null, generator: null, value: Resolvable<null, null, null, T>): T
                {
                    return super.Resolve<T>(target, generator, value);
                }
            }

            suite(
                nameof<TestResolver>((resolver) => resolver.Resolve),
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
                        `Checking whether values can be resolved no mather whether they are \`${nameof(Function)}\`s, \`${nameof(Promise)}\`s or plain values…`,
                        async () =>
                        {
                            strictEqual(testValue, resolver.Resolve(null, null, testValue));
                            strictEqual(testValue, await resolver.Resolve<Promise<string>>(null, null, context.CreatePromise(testValue)));
                            strictEqual(testValue, resolver.Resolve(null, null, context.CreateFunction(testValue)));
                            strictEqual(testValue, await resolver.Resolve<Promise<string>>(null, null, context.CreatePromiseFunction(testValue)));
                        });

                    test(
                        `Checking whether nested \`${nameof(Promise)}\`s act as expected…`,
                        async () =>
                        {
                            strictEqual(await testPromise, await resolver.Resolve<Promise<string>>(null, null, testPromise));
                            strictEqual(await testPromise, await resolver.Resolve(null, null, context.CreatePromise(testPromise)));
                            strictEqual(await testPromise, await resolver.Resolve<Promise<string>>(null, null, context.CreateFunction(testPromise)));
                            strictEqual(await testPromise, await resolver.Resolve<Promise<Promise<string>>>(null, null, context.CreatePromiseFunction(testPromise)));
                        });

                    test(
                        `Checking whether plain \`${nameof(Function)}\`s cannot be resolved…`,
                        () =>
                        {
                            notStrictEqual(testFunction, resolver.Resolve<any>(null, null, testFunction));
                        });

                    test(
                        `Checking whether \`${nameof(Function)}\` can be resolved otherwise…`,
                        async () =>
                        {
                            strictEqual(testFunction, await resolver.Resolve<Promise<() => void>>(null, null, context.CreatePromise(testFunction)));
                            strictEqual(testFunction, resolver.Resolve<() => void>(null, null, context.CreateFunction(testFunction)));
                            strictEqual(testFunction, await resolver.Resolve<Promise<() => void>>(null, null, context.CreatePromiseFunction(testFunction)));
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

                            strictEqual(test, null);
                            await result;
                            strictEqual(test, value);
                        });
                });
        });
}

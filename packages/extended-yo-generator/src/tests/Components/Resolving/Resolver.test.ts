import { notStrictEqual, strictEqual } from "node:assert";
import { ITestGeneratorOptions, ITestOptions, TestContext, TestGenerator } from "@manuth/extended-yo-generator-test";
import { Resolvable } from "../../../Components/Resolving/Resolvable.js";
import { Resolver } from "../../../Components/Resolving/Resolver.js";

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
                            strictEqual(resolver.Resolve(null, null, testValue), testValue);
                            strictEqual(await resolver.Resolve<Promise<string>>(null, null, context.CreatePromise(testValue)), testValue);
                            strictEqual(resolver.Resolve(null, null, context.CreateFunction(testValue)), testValue);
                            strictEqual(await resolver.Resolve<Promise<string>>(null, null, context.CreatePromiseFunction(testValue)), testValue);
                        });

                    test(
                        `Checking whether nested \`${nameof(Promise)}\`s act as expected…`,
                        async () =>
                        {
                            strictEqual(await resolver.Resolve<Promise<string>>(null, null, testPromise), await testPromise);
                            strictEqual(await resolver.Resolve(null, null, context.CreatePromise(testPromise)), await testPromise);
                            strictEqual(await resolver.Resolve<Promise<string>>(null, null, context.CreateFunction(testPromise)), await testPromise);
                            strictEqual(await resolver.Resolve<Promise<Promise<string>>>(null, null, context.CreatePromiseFunction(testPromise)), await testPromise);
                        });

                    test(
                        `Checking whether plain \`${nameof(Function)}\`s cannot be resolved…`,
                        () =>
                        {
                            notStrictEqual(resolver.Resolve<any>(null, null, testFunction), testFunction);
                        });

                    test(
                        `Checking whether \`${nameof(Function)}\` can be resolved otherwise…`,
                        async () =>
                        {
                            strictEqual(await resolver.Resolve<Promise<() => void>>(null, null, context.CreatePromise(testFunction)), testFunction);
                            strictEqual(resolver.Resolve<() => void>(null, null, context.CreateFunction(testFunction)), testFunction);
                            strictEqual(await resolver.Resolve<Promise<() => void>>(null, null, context.CreatePromiseFunction(testFunction)), testFunction);
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

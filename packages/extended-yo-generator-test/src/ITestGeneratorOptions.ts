import { GeneratorOptions } from "@manuth/extended-yo-generator";

/**
 * Options for the test-generator.
 *
 * @template T
 * The type of the test-options.
 */
export interface ITestGeneratorOptions<T> extends GeneratorOptions
{
    /**
     * Options for the test-generator.
     */
    TestGeneratorOptions?: T;
}

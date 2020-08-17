import { GeneratorOptions } from "@manuth/extended-yo-generator";

/**
 * Options for the test-generator.
 */
export interface ITestGeneratorOptions<T> extends GeneratorOptions
{
    /**
     * Options for the test-generator.
     */
    TestGeneratorOptions: T;
}

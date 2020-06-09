import { ITestGeneratorOptions } from "./ITestGeneratorOptions";

/**
 * Options for the test-generator.
 */
export interface ITestOptions extends Record<string, any>
{
    /**
     * Options for the test-generator.
     */
    testGeneratorOptions: ITestGeneratorOptions;
}

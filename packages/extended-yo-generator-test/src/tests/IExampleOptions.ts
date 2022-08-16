import { ITestOptions } from "../ITestOptions.js";

/**
 * Provides options for testing.
 */
export interface IExampleOptions extends ITestOptions
{
    /**
     * An option for testing.
     */
    testOption?: string;
}

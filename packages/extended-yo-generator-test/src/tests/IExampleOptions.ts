import { ITestOptions } from "../ITestOptions";

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

/**
 * Represents options for the `TestGenerator`.
 */
export interface ITestOptions
{
    /**
     * Gets or sets an option for testing.
     */
    testOption: string;

    /**
     * Gets or sets other options.
     */
    [key: string]: unknown;
}

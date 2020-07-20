import { IGeneratorSettings } from "@manuth/extended-yo-generator";

/**
 * Provides settings for the test-generator.
 */
export interface ITestGeneratorSettings extends IGeneratorSettings
{
    /**
     * Gets or sets additional settings.
     */
    [key: string]: string;
}

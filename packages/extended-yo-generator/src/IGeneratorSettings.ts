import { GeneratorSettingKey } from "./GeneratorSettingKey.js";

/**
 * Represents settings of a generator.
 */
export interface IGeneratorSettings
{
    /**
     * Gets or sets the components to install.
     */
    [GeneratorSettingKey.Components]: string[];
}

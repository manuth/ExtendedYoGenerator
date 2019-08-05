import { Answers } from "inquirer";
import { GeneratorSetting } from "./GeneratorSetting";

/**
 * Represents settings of a generator.
 */
export interface IGeneratorSettings
{
    /**
     * Gets or sets the components to install.
     */
    [GeneratorSetting.Components]: string[];
}
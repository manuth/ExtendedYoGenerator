import { Answers } from "inquirer";
import { GeneratorSetting } from "./GeneratorSetting";

/**
 * Represents settings of a generator.
 */
export interface IGeneratorSettings extends Answers
{
    /**
     * Gets or sets a specific setting.
     */
    [key: string]: any;

    /**
     * Gets or sets the components to install.
     */
    [GeneratorSetting.Components]: string[];
}
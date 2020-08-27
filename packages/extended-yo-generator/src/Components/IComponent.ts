import { Question } from "yeoman-generator";
import { IFileMapping } from "./IFileMapping";

/**
 * Represents a component.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IComponent<TSettings, TOptions>
{
    /**
     * Gets or sets the id of the component.
     */
    ID: string;

    /**
     * Gets or sets the human-readable name of the component.
     */
    DisplayName: string;

    /**
     * Gets or sets a value indicating whether the component is enabled by default.
     */
    DefaultEnabled?: boolean;

    /**
     * Gets or sets additional quetions related to the component.
     */
    Questions?: Array<Question<TSettings>>;

    /**
     * Gets or sets the file-mappings of the component.
     */
    FileMappings: Array<IFileMapping<TSettings, TOptions>>;
}

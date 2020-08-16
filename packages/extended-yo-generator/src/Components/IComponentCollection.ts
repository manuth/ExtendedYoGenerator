import { IComponentCategory } from "./IComponentCategory";

/**
 * Represents a set of components.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IComponentCollection<TSettings, TOptions>
{
    /**
     * Gets or sets the question to show when asking to choose components.
     */
    Question: string;

    /**
     * Gets or sets the component-categories.
     */
    Categories: Array<IComponentCategory<TSettings, TOptions>>;
}

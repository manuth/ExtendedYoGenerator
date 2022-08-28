import { IUniqueObject } from "../IUniqueObject.js";
import { IComponent } from "./IComponent.js";

/**
 * Represents a category which contains components.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IComponentCategory<TSettings, TOptions> extends IUniqueObject
{
    /**
     * Gets or sets the human-readable name of the category.
     */
    DisplayName: string;

    /**
     * Gets or sets the components of the category.
     */
    Components: Array<IComponent<TSettings, TOptions>>;
}

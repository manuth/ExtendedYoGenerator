import { IComponentCategory } from "./IComponentCategory";

/**
 * Represents a set of components.
 */
export interface IComponentCollection<TSettings>
{
    /**
     * Gets or sets the question to show when asking to choose components.
     */
    Question: string;

    /**
     * Gets or sets the component-categories.
     */
    Categories: Array<IComponentCategory<TSettings>>;
}

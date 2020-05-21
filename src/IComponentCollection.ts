import { Answers } from "inquirer";
import { IComponentCategory } from "./IComponentCategory";

/**
 * Represents a set of components.
 */
export interface IComponentCollection<T extends Answers>
{
    /**
     * Gets or sets the question to show when asking to choose components.
     */
    Question: string;

    /**
     * Gets or sets the component-categories.
     */
    Categories: Array<IComponentCategory<T>>;
}
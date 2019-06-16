import { Answers } from "inquirer";
import { IComponentCategory } from "./IComponentCategory";

/**
 * Represents provided components.
 */
export interface IComponentProvider<T extends Answers>
{
    /**
     * Gets or sets the question to show when asking to choose components.
     */
    Question: string;

    /**
     * Gets or sets the provided categories.
     */
    Categories: Array<IComponentCategory<T>>;
}
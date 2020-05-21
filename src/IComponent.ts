import { Answers } from "inquirer";
import { Question } from "yeoman-generator";
import { IFileMapping } from "./IFileMapping";

/**
 * Represents a component.
 */
export interface IComponent<T extends Answers>
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
     * Gets or sets the file-mappings of the component.
     */
    FileMappings: Array<IFileMapping<T>> | Promise<Array<IFileMapping<T>>> | ((settings: T) => Array<IFileMapping<T>> | Promise<Array<IFileMapping<T>>>);

    /**
     * Gets or sets additional quetions related to the component.
     */
    Questions?: Array<Question<T>>;
}
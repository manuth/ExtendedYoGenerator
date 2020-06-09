import { Question } from "yeoman-generator";
import { Component } from "./Component";
import { IFileMapping } from "./IFileMapping";
import { Resolvable } from "./Resolving/Resolvable";

/**
 * Represents a component.
 */
export interface IComponent<TSettings>
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
    FileMappings: Resolvable<Component<TSettings>, TSettings, Array<IFileMapping<TSettings>>>;
}

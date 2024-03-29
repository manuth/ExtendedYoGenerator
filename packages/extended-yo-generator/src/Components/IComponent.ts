import { Question } from "yeoman-generator";
import { IUniqueObject } from "../IUniqueObject.js";
import { Component } from "./Component.js";
import { IFileMapping } from "./FileManagement/IFileMapping.js";
import { Resolvable } from "./Resolving/Resolvable.js";

/**
 * Represents a component.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IComponent<TSettings, TOptions> extends IUniqueObject
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
     * Gets or sets additional questions related to the component.
     */
    Questions?: Array<Question<TSettings>>;

    /**
     * Gets or sets the file-mappings of the component.
     */
    FileMappings: Resolvable<Component<TSettings, TOptions>, TSettings, TOptions, Array<IFileMapping<TSettings, TOptions>>>;
}

import { Question } from "yeoman-generator";
import { IGenerator } from "../IGenerator";
import { FileMapping } from "./FileMapping";
import { IComponent } from "./IComponent";
import { PropertyResolver } from "./Resolving/PropertyResolver";

/**
 * Represents a component.
 *
 * @template TSettings
 * The type of the settings of the component.
 */
export class Component<TSettings> extends PropertyResolver<IComponent<TSettings>, Component<TSettings>, TSettings>
{
    /**
     * Initializes a new instance of the `Component<TSettings>` class.
     *
     * @param generator
     * The generator of the component.
     *
     * @param component
     * The options of the component.
     */
    public constructor(generator: IGenerator<TSettings>, component: IComponent<TSettings>)
    {
        super(generator, component);
    }

    /**
     * Gets the id of the component.
     */
    public get ID(): string
    {
        return this.Object.ID;
    }

    /**
     * Gets the human-readable name of the component.
     */
    public get DisplayName(): string
    {
        return this.Object.DisplayName;
    }

    /**
     * Gets a value indicating whether the component is enabled by default.
     */
    public get DefaultEnabled(): boolean
    {
        return this.Object.DefaultEnabled;
    }

    /**
     * Gets additional questions related to the component.
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return this.Object.Questions;
    }

    /**
     * Gets or sets the file-mappings of the component.
     */
    public get FileMappings(): Promise<Array<FileMapping<TSettings>>>
    {
        return (async () =>
        {
            return (await this.ResolveProperty(this, this.Object.FileMappings)).map(
                (fileMapping) =>
                {
                    return new FileMapping(this.Generator, fileMapping);
                });
        })();
    }
}
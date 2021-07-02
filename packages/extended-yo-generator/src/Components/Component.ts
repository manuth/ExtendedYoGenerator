import { Question } from "yeoman-generator";
import { FileMappingOptionCollection } from "../Collections/FileMappingOptionCollection";
import { ObjectCollection } from "../Collections/ObjectCollection";
import { IGenerator } from "../IGenerator";
import { FileMapping } from "./FileManagement/FileMapping";
import { IComponent } from "./IComponent";
import { PropertyResolver } from "./Resolving/PropertyResolver";

/**
 * Represents a component.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class Component<TSettings, TOptions> extends PropertyResolver<IComponent<TSettings, TOptions>, Component<TSettings, TOptions>, TSettings, TOptions> implements IComponent<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link Component `Component<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the component.
     *
     * @param component
     * The options of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, component: IComponent<TSettings, TOptions>)
    {
        super(generator, component);
    }

    /**
     * Gets or sets the id of the component.
     */
    public get ID(): string
    {
        return this.Object.ID;
    }

    /**
     * @inheritdoc
     */
    public set ID(value: string)
    {
        this.Object.ID = value;
    }

    /**
     * Gets or sets the human-readable name of the component.
     */
    public get DisplayName(): string
    {
        return this.Object.DisplayName;
    }

    /**
     * @inheritdoc
     */
    public set DisplayName(value: string)
    {
        this.Object.DisplayName = value;
    }

    /**
     * Gets or sets a value indicating whether the component is enabled by default.
     */
    public get DefaultEnabled(): boolean
    {
        return this.Object.DefaultEnabled;
    }

    /**
     * @inheritdoc
     */
    public set DefaultEnabled(value: boolean)
    {
        this.Object.DefaultEnabled = value;
    }

    /**
     * Gets the a component for editing the questions of the component.
     */
    public get QuestionCollection(): ObjectCollection<Question<TSettings>>
    {
        return new ObjectCollection(this.Object.Questions ?? []);
    }

    /**
     * Gets additional questions related to the component.
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return this.QuestionCollection.Items;
    }

    /**
     * Gets a component for editing the file-mappings of the component.
     */
    public get FileMappingCollection(): FileMappingOptionCollection
    {
        return new FileMappingOptionCollection(
            this.Generator,
            this.ResolveProperty(this, this.Object.FileMappings).map(
                (fileMapping) =>
                {
                    return new FileMapping(this.Generator, fileMapping);
                }));
    }

    /**
     * Gets the file-mappings of the component.
     */
    public get FileMappings(): Array<FileMapping<TSettings, TOptions>>
    {
        return this.FileMappingCollection.Items;
    }
}

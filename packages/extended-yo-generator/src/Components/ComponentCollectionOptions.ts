import { GeneratorOptions } from "yeoman-generator";
import { IGenerator } from "../IGenerator.js";
import { IGeneratorSettings } from "../IGeneratorSettings.js";
import { ComponentCollection } from "./ComponentCollection.js";
import { GeneratorComponent } from "./GeneratorComponent.js";
import { IComponentCategory } from "./IComponentCategory.js";
import { IComponentCollection } from "./IComponentCollection.js";

/**
 * Provides options for creating a {@link ComponentCollection `ComponentCollection<TSettings, TOptions>`}.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class ComponentCollectionOptions<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, ComponentCollection<TSettings, TOptions>> implements IComponentCollection<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ComponentCollectionOptions `ComponentCollectionOptions<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the collection.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public abstract get Question(): string;

    /**
     * @inheritdoc
     */
    public abstract get Categories(): Array<IComponentCategory<TSettings, TOptions>>;

    /**
     * @inheritdoc
     */
    public get Resolved(): ComponentCollection<TSettings, TOptions>
    {
        return new ComponentCollection(this.Generator, this);
    }
}

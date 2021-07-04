import { GeneratorOptions } from "yeoman-generator";
import { IGenerator } from "../IGenerator";
import { IGeneratorSettings } from "../IGeneratorSettings";
import { ComponentCollection } from "./ComponentCollection";
import { GeneratorComponent } from "./GeneratorComponent";
import { IComponentCategory } from "./IComponentCategory";
import { IComponentCollection } from "./IComponentCollection";

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

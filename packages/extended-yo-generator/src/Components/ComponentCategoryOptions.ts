import { GeneratorOptions } from "yeoman-generator";
import { IGenerator } from "../IGenerator";
import { IGeneratorSettings } from "../IGeneratorSettings";
import { ComponentCategory } from "./ComponentCategory";
import { GeneratorComponent } from "./GeneratorComponent";
import { IComponent } from "./IComponent";

/**
 * Provides data for creating a {@link ComponentCategory `ComponentCategory<TSettings, TOptions>`}.
 */
export abstract class ComponentCategoryOptions<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, ComponentCategory<TSettings, TOptions>>
{
    /**
     * Initializes a new instance of the {@link ComponentCategoryOptions `ComponentCategoryOptions<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the category.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public abstract get DisplayName(): string;

    /**
     * @inheritdoc
     */
    public abstract get Components(): Array<IComponent<TSettings, TOptions>>;

    /**
     * @inheritdoc
     */
    public get Resolved(): ComponentCategory<TSettings, TOptions>
    {
        return new ComponentCategory(this.Generator, this);
    }
}

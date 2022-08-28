import { GeneratorOptions } from "yeoman-generator";
import { IGenerator } from "../IGenerator.js";
import { IGeneratorSettings } from "../IGeneratorSettings.js";
import { ComponentCategory } from "./ComponentCategory.js";
import { GeneratorComponent } from "./GeneratorComponent.js";
import { IComponent } from "./IComponent.js";
import { IComponentCategory } from "./IComponentCategory.js";

/**
 * Provides data for creating a {@link ComponentCategory `ComponentCategory<TSettings, TOptions>`}.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class ComponentCategoryOptions<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, ComponentCategory<TSettings, TOptions>> implements IComponentCategory<TSettings, TOptions>
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

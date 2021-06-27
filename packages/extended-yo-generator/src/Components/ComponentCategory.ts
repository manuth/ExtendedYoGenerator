import { IGenerator } from "../IGenerator";
import { Component } from "./Component";
import { IComponentCategory } from "./IComponentCategory";
import { PropertyResolver } from "./Resolving/PropertyResolver";

/**
 * Represents a component-category.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ComponentCategory<TSettings, TOptions> extends PropertyResolver<IComponentCategory<TSettings, TOptions>, ComponentCategory<TSettings, TOptions>, TSettings, TOptions> implements IComponentCategory<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ComponentCategory `ComponentCategory<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the category.
     *
     * @param componentCategory
     * The options of the category.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, componentCategory: IComponentCategory<TSettings, TOptions>)
    {
        super(generator, componentCategory);
    }

    /**
     * @inheritdoc
     */
    public get ID(): string
    {
        return this.Object.ID;
    }

    /**
     * Gets or sets the human-readable name of the category.
     */
    public get DisplayName(): string
    {
        return this.Object.DisplayName;
    }

    /**
     * Gets the components of the category.
     */
    public get Components(): Array<Component<TSettings, TOptions>>
    {
        return this.Object.Components.map(
            (component) =>
            {
                return new Component(this.Generator, component);
            });
    }
}

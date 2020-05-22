import { IGenerator } from "../IGenerator";
import { PropertyResolver } from "./Resolving/PropertyResolver";
import { IComponentCategory } from "./IComponentCategory";
import { Component } from "./Component";

/**
 * Represents a component-category.
 */
export class ComponentCategory<TSettings> extends PropertyResolver<IComponentCategory<TSettings>, ComponentCategory<TSettings>, TSettings>
{
    /**
     * Initializes a new instance of the `ComponentCategory<TSettings>` class.
     *
     * @param generator
     * The generator of the category.
     *
     * @param componentCategory
     * The options of the category.
     */
    public constructor(generator: IGenerator<TSettings>, componentCategory: IComponentCategory<TSettings>)
    {
        super(generator, componentCategory);
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
    public get Components(): Array<Component<TSettings>>
    {
        return this.Object.Components.map(
            (component) =>
            {
                return new Component(this.Generator, component);
            });
    }
}

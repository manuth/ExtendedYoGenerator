import { ComponentOptionCollection } from "../Collections/ComponentOptionCollection";
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
     * An object for editing the components of this category.
     */
    private components: ComponentOptionCollection = null;

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
     * @inheritdoc
     */
    public set ID(value: string)
    {
        this.Object.ID = value;
    }

    /**
     * Gets or sets the human-readable name of the category.
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
     * Gets an object for editing the components of the category.
     */
    public get ComponentCollection(): ComponentOptionCollection
    {
        if (this.components === null)
        {
            this.components = new ComponentOptionCollection(
                this.Generator,
                () =>
                {
                    return this.Object.Components.map(
                        (component) =>
                        {
                            return new Component(this.Generator, component);
                        });
                });
        }

        return this.components;
    }

    /**
     * Gets the components of the category.
     */
    public get Components(): Array<Component<TSettings, TOptions>>
    {
        return this.ComponentCollection.Items;
    }
}

import { ComponentCollectionEditor } from "../Collections/ComponentCollectionEditor.js";
import { IGenerator } from "../IGenerator.js";
import { Component } from "./Component.js";
import { IComponentCategory } from "./IComponentCategory.js";
import { PropertyResolver } from "./Resolving/PropertyResolver.js";

/**
 * Represents a component-category.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ComponentCategory<TSettings, TOptions> extends PropertyResolver<IComponentCategory<TSettings, TOptions>, ComponentCategory<TSettings, TOptions>, TSettings, TOptions>
{
    /**
     * An object for editing the components of this category.
     */
    private components: ComponentCollectionEditor = null;

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
     * Gets the components of the category.
     */
    public get Components(): ComponentCollectionEditor
    {
        if (this.components === null)
        {
            this.components = new ComponentCollectionEditor(
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
     * @inheritdoc
     */
    public get Result(): IComponentCategory<TSettings, TOptions>
    {
        return {
            ID: this.ID,
            DisplayName: this.DisplayName,
            Components: this.Components.Items.map((item) => item.Result)
        };
    }
}

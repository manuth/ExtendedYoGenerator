import { Component } from "../Components/Component.js";
import { IComponent } from "../Components/IComponent.js";
import { IGenerator } from "../IGenerator.js";
import { PropertyResolverCollectionEditor } from "./PropertyResolverCollectionEditor.js";

/**
 * Represents a set of components.
 */
export class ComponentCollectionEditor extends PropertyResolverCollectionEditor<IComponent<any, any>, Component<any, any>>
{
    /**
     * Initializes a new instance of the {@link ComponentCollectionEditor `ComponentCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<Component<any, any>>);

    /**
     * Initializes a new instance of the {@link ComponentCollectionEditor `ComponentCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param itemProvider
     * A function for providing the items.
     */
    public constructor(generator: IGenerator<any, any>, itemProvider: () => Array<Component<any, any>>);

    /**
     * Initializes a new instance of the {@link ComponentCollectionEditor `ComponentCollectionEditor`} class.
     *
     * @param args
     * The arguments for initializing the new collection.
     */
    public constructor(...args: unknown[])
    {
        super(...(args as [any, any]));
    }

    /**
     * @inheritdoc
     *
     * @param options
     * The options of the file-mapping.
     *
     * @returns
     * A newly created {@link Component `Component<TSettings, TOptions>`}.
     */
    protected CreateItem(options: IComponent<unknown, unknown>): Component<unknown, unknown>
    {
        return new Component(this.Generator, options);
    }
}

import { Component } from "../Components/Component";
import { IComponent } from "../Components/IComponent";
import { IGenerator } from "../IGenerator";
import { PropertyResolverCollection } from "./PropertyResolverCollection";

/**
 * Represents a set of components.
 */
export class ComponentOptionCollection extends PropertyResolverCollection<IComponent<any, any>, Component<any, any>>
{
    /**
     * Initializes a new instance of the {@link ComponentOptionCollection `ComponentOptionCollection`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<Component<any, any>>);

    /**
     * Initializes a new instance of the {@link ComponentOptionCollection `ComponentOptionCollection`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param itemProvider
     * A function for providing the items.
     */
    public constructor(generator: IGenerator<any, any>, itemProvider: () => Array<Component<any, any>>);

    /**
     * Initializes a new instance of the {@link ComponentOptionCollection `ComponentOptionCollection`} class.
     *
     * @param args
     * The arguments for initializing the new collection.
     */
    public constructor(...args: any[])
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
    protected CreateItem(options: IComponent<any, any>): Component<any, any>
    {
        return new Component(this.Generator, options);
    }
}

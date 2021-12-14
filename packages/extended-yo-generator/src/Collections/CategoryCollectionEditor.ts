import { ComponentCategory } from "../Components/ComponentCategory";
import { IComponentCategory } from "../Components/IComponentCategory";
import { IGenerator } from "../IGenerator";
import { PropertyResolverCollectionEditor } from "./PropertyResolverCollectionEditor";

/**
 * Represents a set of component-categories.
 */
export class CategoryCollectionEditor extends PropertyResolverCollectionEditor<IComponentCategory<any, any>, ComponentCategory<any, any>>
{
    /**
     * Initializes a new instance of the {@link CategoryCollectionEditor `CategoryCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<ComponentCategory<any, any>>);

    /**
     * Initializes a new instance of the {@link CategoryCollectionEditor `CategoryCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param itemProvider
     * A function for providing the items to edit.
     */
    public constructor(generator: IGenerator<any, any>, itemProvider: () => Array<ComponentCategory<any, any>>);

    /**
     * Initializes a new instance of the {@link CategoryCollectionEditor `CategoryCollectionEditor`} class.
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
     * A newly created {@link ComponentCategory `ComponentCategory<TSettings, TOptions>`}.
     */
    protected CreateItem(options: IComponentCategory<unknown, unknown>): ComponentCategory<unknown, unknown>
    {
        return new ComponentCategory(this.Generator, options);
    }
}

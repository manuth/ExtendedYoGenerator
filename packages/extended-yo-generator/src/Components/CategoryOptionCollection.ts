import { IGenerator } from "../IGenerator";
import { ComponentCategory } from "./ComponentCategory";
import { IComponentCategory } from "./IComponentCategory";
import { PropertyResolverCollection } from "./PropertyResolverCollection";

/**
 * Represents a set of component-categories.
 */
export class CategoryOptionCollection extends PropertyResolverCollection<IComponentCategory<any, any>, ComponentCategory<any, any>>
{
    /**
     * Initializes a new instance of the {@link CategoryOptionCollection `CategoryOptionCollection`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<ComponentCategory<any, any>>)
    {
        super(generator, items);
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
    protected CreateItem(options: IComponentCategory<any, any>): ComponentCategory<any, any>
    {
        return new ComponentCategory(this.Generator, options);
    }
}
import { ComponentCategory } from "../Components/ComponentCategory";
import { IComponentCategory } from "../Components/IComponentCategory";
import { IGenerator } from "../IGenerator";
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
     * A newly created {@link ComponentCategory `ComponentCategory<TSettings, TOptions>`}.
     */
    protected CreateItem(options: IComponentCategory<any, any>): ComponentCategory<any, any>
    {
        return new ComponentCategory(this.Generator, options);
    }
}

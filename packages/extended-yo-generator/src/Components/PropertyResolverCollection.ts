import { Constructor } from "../Constructor";
import { IUniqueObject } from "./IUniqueObject";
import { Predicate } from "./Predicate";
import { PropertyResolver } from "./Resolving/PropertyResolver";
import { UniqueObjectCollection } from "./UniqueObjectCollection";

/**
 * Provides the functionality to edit a collection of {@link PropertyResolver `PropertyResolver<TObject, TTarget, TSettings, TOptions>`}s.
 *
 * @template T
 * The type of the items to edit.
 */
export class PropertyResolverCollection<T extends IUniqueObject & PropertyResolver<any, any, any, any>> extends UniqueObjectCollection<T>
{
    /**
     * Initializes a new instance of the {@link PropertyResolverCollection `PropertyResolverCollection<T>`} class.
     *
     * @param items
     * The items to edit.
     */
    public constructor(items: T[])
    {
        super(items);
    }

    /**
     * @inheritdoc
     *
     * @param filter
     * The filter to convert.
     *
     * @returns
     * A predicate which represents the specified {@link filter `filter`}.
     */
    protected override GetPredicate(filter: string | Constructor<T> | Predicate<T>): Predicate<T>
    {
        if (
            typeof filter !== "string" &&
            this.IsConstructor(filter))
        {
            return (item) => item.Object instanceof filter;
        }
        else
        {
            return super.GetPredicate(filter);
        }
    }
}

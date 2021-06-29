import { Constructor } from "../Constructor";
import { Filter } from "../Filter";
import { IUniqueObject } from "../IUniqueObject";
import { Predicate } from "../Predicate";
import { ObjectCollection } from "./ObjectCollection";

/**
 * Provides the functionality to edit a collection of {@link IUniqueObject `IUniqueObject`}s.
 *
 * @template T
 * The type of the items to edit.
 */
export class UniqueObjectCollection<T extends IUniqueObject> extends ObjectCollection<T>
{
    /**
     * Initializes a new instance of the {@link UniqueObjectCollection `UniqueObjectCollection<T>`} class.
     *
     * @param items
     * The items of the collection.
     */
    public constructor(items: T[])
    {
        super(items);
    }

    /**
     * Gets the item with the specified {@link id `id`}.
     *
     * @param id
     * The id of the item to get.
     *
     * @returns
     * The item with the specified {@link id `id`}.
     */
    public override Get(id: string): T;

    /**
     * Gets the item with the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to get.
     *
     * @returns
     * The item with the specified {@link type `type`}.
     */
    public override Get(type: Constructor<T>): T;

    /**
     * Gets the item which applies to the specified {@link predicate `predicate`}.
     *
     * @param predicate
     * The predicate for finding the item to get.
     *
     * @returns
     * The item which applies to the specified {@link predicate `predicate`}.
     */
    public override Get(predicate: Predicate<T>): T;

    /**
     * Gets the item indicated by the specified {@link filter `filter`}.
     *
     * @param filter
     * The item to get.
     *
     * @returns
     * The item indicated by the specified {@link filter `filter`}.
     */
    public override Get(filter: string | Constructor<T> | Predicate<T>): T
    {
        return super.Get(filter as any);
    }

    /**
     * Replaces the item with the specified {@link id `id`} with the specified {@link item `item`}.
     *
     * @param id
     * The id of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(id: string, item: T): void;

    /**
     * Replaces the item with the specified {@link id `id`} with a replacement created by the specified {@link filter `filter`}.
     *
     * @param id
     * The id of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(id: string, filter: Filter<T>): void;

    /**
     * Replaces the item with the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(type: Constructor<T>, item: T): void;

    /**
     * Replaces the item with the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(type: Constructor<T>, filter: Filter<T>): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with the specified {@link item `item`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(predicate: Predicate<T>, item: T): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with a replacement created by the {@link filter `filter`}.
     *
     * @param predicate
     * The item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(predicate: Predicate<T>, filter: Filter<T>): void;

    /**
     * Replaces the item which matches the {@link filter `filter`} with the specified {@link replacement `replacement`}.
     *
     * @param filter
     * A filter for determining the item to replace.
     *
     * @param replacement
     * The replacement for the item.
     */
    public override Replace(filter: string | Constructor<T> | Predicate<T>, replacement: T | Filter<T>): void
    {
        super.Replace(filter as any, replacement as any);
    }

    /**
     * Removes the item with the specified {@link id `id`}.
     *
     * @param id
     * The id of the item to remove.
     */
    public override Remove(id: string): void;

    /**
     * Removes the item with the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to remove.
     */
    public override Remove(type: Constructor<T>): void;

    /**
     * Removes the item which applies to the specified {@link predicate `predicate`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     */
    public override Remove(predicate: Predicate<T>): void;

    /**
     * Removes the item indicated by the specified {@link filter `filter`}.
     *
     * @param filter
     * The item to remove.
     */
    public override Remove(filter: string | Constructor<T> | Predicate<T>): void
    {
        super.Remove(filter as any);
    }

    /**
     * @inheritdoc
     *
     * @param filter
     * The filter to find an index by.
     *
     * @returns
     * The index of the item that was found.
     */
    protected override FindIndexes(filter: string | Constructor<T> | Predicate<T>): number[]
    {
        return super.FindIndexes(filter as any);
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
        if (typeof filter === "string")
        {
            return (item) => item.ID === filter;
        }
        else if (this.IsConstructor(filter))
        {
            return (item) => item instanceof filter;
        }
        else
        {
            return filter;
        }
    }
}

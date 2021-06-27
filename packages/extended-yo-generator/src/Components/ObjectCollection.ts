import { Constructor } from "../Constructor";
import { Filter } from "./Filter";
import { Predicate } from "./Predicate";

/**
 * Provides the functionality to edit a collection of objects.
 *
 * @template T
 * The type of the items to edit.
 */
export class ObjectCollection<T extends Partial<Record<string, any>>>
{
    /**
     * The items of the collection.
     */
    private items: T[];

    /**
     * Initializes a new instance of the {@link ObjectCollection `ObjectCollection<T>`} class.
     *
     * @param items
     * The items of the collection.
     */
    public constructor(items: T[])
    {
        this.items = items;
    }

    /**
     * Gets the items of the collection.
     */
    protected get Items(): T[]
    {
        return this.items;
    }

    /**
     * Replaces the item with the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public Replace(type: Constructor<T>, item: T): void;

    /**
     * Replaces the item with the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public Replace(type: Constructor<T>, filter: Filter<T>): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with the specified {@link item `item`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public Replace(predicate: Predicate<T>, item: T): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with a replacement created by the {@link filter `filter`}.
     *
     * @param predicate
     * The item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public Replace(predicate: Predicate<T>, filter: Filter<T>): void;

    /**
     * Replaces the item which matches the {@link filter `filter`} with the specified {@link replacement `replacement`}.
     *
     * @param filter
     * The item to replace.
     *
     * @param replacement
     * The replacement of the item.
     */
    public Replace(filter: Constructor<T> | Predicate<T>, replacement: T | Filter<T>): void
    {
        if (typeof replacement !== "function")
        {
            this.Replace(filter as any, () => replacement);
        }
        else
        {
            let index = this.FindIndex(filter);
            this.Items[index] = replacement(this.Items[index]);
        }
    }

    /**
     * Removes the item with the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to remove.
     */
    public Remove(type: Constructor<T>): void;

    /**
     * Removes the item which applies to the specified {@link predicate `predicate`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     */
    public Remove(predicate: Predicate<T>): void;

    /**
     * Removes the item indicated by the specified {@link filter `filter`}.
     *
     * @param filter
     * The item to remove.
     */
    public Remove(filter: Constructor<T> | Predicate<T>): void
    {
        this.Items.splice(this.FindIndex(filter), 1);
    }

    /**
     * Adds the specified {@link item `item`} to the collection.
     *
     * @param item
     * The item to add.
     */
    public Add(item: T): void
    {
        this.Items.push(item);
    }

    /**
     * Finds the index of the first item which applies to the specified {@link filter `filter`}.
     *
     * @param filter
     * The filter to find an index by.
     *
     * @returns
     * The index of the item that was found.
     */
    protected FindIndex(filter: Constructor<T> | Predicate<T>): number
    {
        let result = this.Items.findIndex(this.GetPredicate(filter));

        if (typeof result === "number")
        {
            return result;
        }
        else
        {
            throw new RangeError(`An item which applies to the specified filter \`${filter}\` doesn't exist!`);
        }
    }

    /**
     * Checks whether the specified {@link func `func`} is a constructor.
     *
     * @param func
     * ¨The function to check.
     *
     * @returns
     * A value indicating whether the specified {@link func `func`} is a constructor.
     */
    protected IsConstructor<T extends any>(func: ((...args: any[]) => any) | Constructor<T>): func is Constructor<T>
    {
        try
        {
            Reflect.construct(String, [], func);
            return true;
        }
        catch
        {
            return false;
        }
    }

    /**
     * Converts the specified {@link filter `filter`} to a {@link Predicate `Predicate<T>`}.
     *
     * @param filter
     * The filter to convert.
     *
     * @returns
     * A predicate which represents the specified {@link filter `filter`}.
     */
    protected GetPredicate(filter: Constructor<T> | Predicate<T>): Predicate<T>
    {
        if (this.IsConstructor(filter))
        {
            return (item) => item instanceof filter;
        }
        else
        {
            return filter;
        }
    }
}

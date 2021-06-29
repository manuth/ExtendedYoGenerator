import { AbstractConstructor } from "../AbstractConstructor";
import { Filter } from "../Filter";
import { Predicate } from "../Predicate";

/**
 * Provides the functionality to edit a collection of objects.
 *
 * @template T
 * The type of the items in this collection.
 */
export class ObjectCollection<T extends Partial<Record<string, any>>> extends Array<T>
{
    /**
     * Initializes a new instance of the {@link ObjectCollection `ObjectCollection<T>`} class.
     *
     * @param items
     * The items of the collection.
     */
    public constructor(items: T[]);

    /**
     * Initializes a new instance of the {@link ObjectCollection `ObjectCollection<T>`} class.
     *
     * @param args
     * The arguments for initializing the new collection.
     */
    public constructor(...args: any[])
    {
        if (
            args.length === 1 &&
            Array.isArray(args[0]))
        {
            args = args[0];
        }

        super(...args);
    }

    /**
     * Gets the item with the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to get.
     *
     * @returns
     * The item with the specified {@link type `type`}.
     */
    public Get(type: AbstractConstructor<T>): T;

    /**
     * Gets the item which applies to the specified {@link predicate `predicate`}.
     *
     * @param predicate
     * The predicate for finding the item to get.
     *
     * @returns
     * The item which applies to the specified {@link predicate `predicate`}.
     */
    public Get(predicate: Predicate<T>): T;

    /**
     * Gets the item indicated by the specified {@link filter `filter`}.
     *
     * @param filter
     * The item to get.
     *
     * @returns
     * The item indicated by the specified {@link filter `filter`}.
     */
    public Get(filter: AbstractConstructor<T> | Predicate<T>): T
    {
        return this[this.FindIndexes(filter)[0]];
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
    public Replace(type: AbstractConstructor<T>, item: T): void;

    /**
     * Replaces the item with the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public Replace(type: AbstractConstructor<T>, filter: Filter<T>): void;

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
     * Replaces the item which matches the {@link predicate `predicate`} with a replacement created by the specified {@link filter `filter`}.
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
     * A filter for determining the item to replace.
     *
     * @param replacement
     * The replacement for the item.
     */
    public Replace(filter: AbstractConstructor<T> | Predicate<T>, replacement: T | Filter<T>): void
    {
        if (typeof replacement !== "function")
        {
            this.Replace(filter as any, () => replacement);
        }
        else
        {
            for (let index of this.FindIndexes(filter).reverse())
            {
                this[index] = replacement(this[index]);
            }
        }
    }

    /**
     * Removes the item with the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to remove.
     */
    public Remove(type: AbstractConstructor<T>): void;

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
    public Remove(filter: AbstractConstructor<T> | Predicate<T>): void
    {
        for (let i of this.FindIndexes(filter).reverse())
        {
            this.splice(i, 1);
        }
    }

    /**
     * Adds the specified {@link item `item`} to the collection.
     *
     * @param item
     * The item to add.
     */
    public Add(item: T): void
    {
        this.push(item);
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
    protected FindIndexes(filter: AbstractConstructor<T> | Predicate<T>): number[]
    {
        let result: number[] = [];

        for (let i = 0; i < this.length; i++)
        {
            if (this.GetPredicate(filter)(this[i]))
            {
                result.push(i);
            }
        }

        return result;
    }

    /**
     * Checks whether the specified {@link func `func`} is a constructor.
     *
     * @template T
     * The type of the object that can be instantiated.
     *
     * @param func
     * The function to check.
     *
     * @returns
     * A value indicating whether the specified {@link func `func`} is a constructor.
     */
    protected IsConstructor<T extends any>(func: ((...args: any[]) => any) | AbstractConstructor<T>): func is AbstractConstructor<T>
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
    protected GetPredicate(filter: AbstractConstructor<T> | Predicate<T>): Predicate<T>
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

import { AbstractConstructor } from "../AbstractConstructor";
import { Filter } from "../Filter";
import { Predicate } from "../Predicate";
import { CollectionActionType } from "./CollectionActionType";
import { IAdditionAction } from "./IAdditionAction";
import { IRemovalAction } from "./IRemovalAction";
import { ISubstitutionAction } from "./ISubstitutionAction";

/**
 * Provides the functionality to edit a collection of objects.
 *
 * @template T
 * The type of the items in this collection.
 */
export class ObjectCollectionEditor<T extends any>
{
    /**
     * A function for providing the items.
     */
    private itemProvider: () => readonly T[];

    /**
     * The actions to apply to the inner collection.
     */
    private actions: Array<IRemovalAction<T> | ISubstitutionAction<T> | IAdditionAction<T>> = [];

    /**
     * Initializes a new instance of the {@link ObjectCollectionEditor `ObjectCollectionEditor<T>`} class.
     *
     * @param items
     * The items of the collection.
     */
    public constructor(items: T[]);

    /**
     * Initializes a new instance of the {@link ObjectCollectionEditor `ObjectCollectionEditor<T>`} class.
     *
     * @param itemProvider
     * A function for providing the items to edit.
     */
    public constructor(itemProvider: () => T[]);

    /**
     * Initializes a new instance of the {@link ObjectCollectionEditor `ObjectCollectionEditor<T>`} class.
     *
     * @param items
     * The items for initializing the new collection.
     */
    public constructor(items: T[] | (() => T[]))
    {
        if (Array.isArray(items))
        {
            this.itemProvider = () => items;
        }
        else
        {
            this.itemProvider = items;
        }
    }

    /**
     * Gets the source of the collection.
     */
    protected get Source(): T[]
    {
        return [
            ...this.itemProvider()
        ];
    }

    /**
     * Gets the items of the collection.
     */
    public get Items(): T[]
    {
        let items = this.Source;

        for (let action of this.Actions)
        {
            this.ExecuteAction(items, action);
        }

        return items;
    }

    /**
     * Gets the actions to apply to the inner collection.
     */
    protected get Actions(): Array<IRemovalAction<T> | ISubstitutionAction<T> | IAdditionAction<T>>
    {
        return this.actions;
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
        let items = this.Items;
        let index = this.FindIndexes(items, this.GetPredicate(filter)).next().value;

        if (index === null)
        {
            throw new RangeError(`An item which applies to the specified filter \`${filter}\` doesn't exist!`);
        }
        else
        {
            return items[index];
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
        this.AddRange([item]);
    }

    /**
     * Adds the specified {@link items `items`} to the collection.
     *
     * @param items
     * The items to add.
     */
    public AddRange(items: T[]): void
    {
        this.Actions.push(
            {
                Type: CollectionActionType.Addition,
                Items: items
            });
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
            this.Actions.push(
                {
                    Type: CollectionActionType.Substitution,
                    Filter: this.GetPredicate(filter),
                    Replacement: replacement as Filter<T>
                });
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
        this.Actions.push(
            {
                Type: CollectionActionType.Removal,
                Filter: this.GetPredicate(filter)
            });
    }

    /**
     * Clears the collection.
     */
    public Clear(): void
    {
        this.Actions.splice(0, this.Actions.length);
        this.Remove(() => true);
    }

    /**
     * Finds the index of the specified {@link items `items`} which apply to the specified {@link filter `filter`}.
     *
     * @param items
     * The items to search for the specified {@link filter `filter`}.
     *
     * @param filter
     * The filter to find an index by.
     *
     * @returns
     * The index of the item that was found.
     */
    protected FindIndexes(items: readonly T[], filter: Predicate<T>): Generator<number, null>
    {
        let self = this;

        return function*(): Generator<number, null>
        {
            for (let i = 0; i < items.length; i++)
            {
                if (self.GetPredicate(filter)(items[i]))
                {
                    yield i;
                }
            }

            return null;
        }();
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

    /**
     * Executes the specified {@link action `action`} on the specified {@link items `items`}.
     *
     * @param items
     * The items to execute the action on.
     *
     * @param action
     * The action to execute.
     */
    protected ExecuteAction(items: T[], action: IRemovalAction<T> | ISubstitutionAction<T> | IAdditionAction<T>): void
    {
        switch (action.Type)
        {
            case CollectionActionType.Addition:
                items.push(...action.Items);
                break;
            case CollectionActionType.Substitution:
            case CollectionActionType.Removal:
                let innerAction: (indexes: number[]) => void;

                if (action.Type === CollectionActionType.Removal)
                {
                    innerAction = (indexes) =>
                    {
                        for (let index of indexes.reverse())
                        {
                            items.splice(index, 1);
                        }
                    };
                }
                else
                {
                    innerAction = (indexes) =>
                    {
                        for (let index of indexes)
                        {
                            items[index] = action.Replacement(items[index]);
                        }
                    };
                }

                let indexGenerator = this.FindIndexes(items, action.Filter);
                let indexes: number[] = [];

                for (let current = indexGenerator.next(); !current.done; current = indexGenerator.next())
                {
                    indexes.push(current.value);
                }

                innerAction(indexes);
                break;
        }
    }
}

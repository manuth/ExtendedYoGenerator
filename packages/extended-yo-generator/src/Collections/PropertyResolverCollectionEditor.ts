import { AbstractConstructor } from "../AbstractConstructor";
import { PropertyResolver } from "../Components/Resolving/PropertyResolver";
import { Filter } from "../Filter";
import { IGenerator } from "../IGenerator";
import { IUniqueObject } from "../IUniqueObject";
import { Predicate } from "../Predicate";
import { UniqueObjectCollectionEditor } from "./UniqueObjectCollectionEditor";

/**
 * Provides the functionality to edit a collection of {@link PropertyResolver `PropertyResolver<TObject, TTarget, TSettings, TOptions>`}s.
 *
 * @template TObject
 * The type of the unresolved objects in this collection.
 *
 * @template TTarget
 * The type of the resolved objects in this collection.
 */
export abstract class PropertyResolverCollectionEditor<TObject extends IUniqueObject, TTarget extends PropertyResolver<TObject, any, any, any> & IUniqueObject> extends UniqueObjectCollectionEditor<TTarget>
{
    /**
     * The generator of the collection.
     */
    private generator: IGenerator<any, any>;

    /**
     * Initializes a new instance of the {@link PropertyResolverCollectionEditor `PropertyResolverCollectionEditor<TObject, TTarget>`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: TTarget[]);

    /**
     * Initializes a new instance of the {@link PropertyResolverCollectionEditor `PropertyResolverCollectionEditor<TObject, TTarget>`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param itemProvider
     * A function for providing the items.
     */
    public constructor(generator: IGenerator<any, any>, itemProvider: () => TTarget[]);

    /**
     * Initializes a new instance of the {@link PropertyResolverCollectionEditor `PropertyResolverCollectionEditor<TObject, TTarget>`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items for initializing the new collection.
     */
    public constructor(generator: IGenerator<any, any>, items: any)
    {
        super(items);
        this.generator = generator;
    }

    /**
     * Gets the generator of the collection.
     */
    protected get Generator(): IGenerator<any, any>
    {
        return this.generator;
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
    public override Get(id: string): TTarget;

    /**
     * Gets the item with the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to get.
     *
     * @returns
     * The item with the specified {@link type `type`}.
     */
    public override Get(type: AbstractConstructor<TTarget>): TTarget;

    /**
     * Gets the item with an {@link PropertyResolver.Object `Object`} of the the specified {@link type `type`}.
     *
     * @param type
     * The type of the item to get.
     *
     * @returns
     * The item with an {@link PropertyResolver.Object `Object`} of the specified {@link type `type`}.
     */
    public override Get(type: AbstractConstructor<TObject>): TTarget;

    /**
     * Gets the item which applies to the specified {@link predicate `predicate`}.
     *
     * @param predicate
     * The predicate for finding the item to get.
     *
     * @returns
     * The item which applies to the specified {@link predicate `predicate`}.
     */
    public override Get(predicate: Predicate<TTarget>): TTarget;

    /**
     * Gets the item indicated by the specified {@link filter `filter`}.
     *
     * @param filter
     * The item to get.
     *
     * @returns
     * The item indicated by the specified {@link filter `filter`}.
     */
    public override Get(filter: string | AbstractConstructor<TObject | TTarget> | Predicate<TTarget>): TTarget
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
    public override Replace(id: string, item: TObject): void;

    /**
     * Replaces the item with the specified {@link id `id`} with the specified {@link item `item`}.
     *
     * @param id
     * The id of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(id: string, item: TTarget): void;

    /**
     * Replaces the item with the specified {@link id `id`} with a replacement created by the specified {@link filter `filter`}.
     *
     * @param id
     * The id of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(id: string, filter: Filter<TTarget>): void;

    /**
     * Replaces the item with the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(type: AbstractConstructor<TTarget>, item: TTarget): void;

    /**
     * Replaces the item with the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(type: AbstractConstructor<TTarget>, item: TObject): void;

    /**
     * Replaces the item with an {@link PropertyResolver.Object `Object`} of the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(type: AbstractConstructor<TObject>, item: TTarget): void;

    /**
     * Replaces the item with an {@link PropertyResolver.Object `Object`} of the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(type: AbstractConstructor<TObject>, item: TObject): void;

    /**
     * Replaces the item with the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(type: AbstractConstructor<TTarget>, filter: Filter<TTarget>): void;

    /**
     * Replaces the item with an {@link PropertyResolver.Object `Object`} of the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(type: AbstractConstructor<TObject>, filter: Filter<TTarget>): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with the specified {@link item `item`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(predicate: Predicate<TTarget>, item: TTarget): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with the specified {@link item `item`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public override Replace(predicate: Predicate<TTarget>, item: TObject): void;

    /**
     * Replaces the item which matches the {@link predicate `predicate`} with a replacement created by the {@link filter `filter`}.
     *
     * @param predicate
     * The item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public override Replace(predicate: Predicate<TTarget>, filter: Filter<TTarget>): void;

    /**
     * Replaces the item which matches the {@link filter `filter`} with the specified {@link replacement `replacement`}.
     *
     * @param filter
     * A filter for determining the item to replace.
     *
     * @param replacement
     * The replacement for the item.
     */
    public override Replace(filter: string | AbstractConstructor<TObject | TTarget> | Predicate<TTarget>, replacement: TObject | TTarget | Filter<TTarget>): void
    {
        if (
            typeof replacement !== "function" &&
            !(replacement instanceof PropertyResolver))
        {
            super.Replace(filter as any, this.CreateItem(replacement));
        }
        else
        {
            super.Replace(filter as any, replacement as any);
        }
    }

    /**
     * Replaces the object of the item with the specified {@link id `id`} with the specified {@link item `item`}.
     *
     * @param id
     * The id of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public ReplaceObject(id: string, item: TObject): void;

    /**
     * Replaces the object of the item with the specified {@link id `id`} with a replacement created by the specified {@link filter `filter`}.
     *
     * @param id
     * The id of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public ReplaceObject(id: string, filter: Filter<TTarget, TObject>): void;

    /**
     * Replaces the object of the item with the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public ReplaceObject(type: AbstractConstructor<TTarget>, item: TObject): void;

    /**
     * Replaces the object of the item with the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public ReplaceObject(type: AbstractConstructor<TTarget>, item: TObject): void;

    /**
     * Replaces the object of the item with an {@link PropertyResolver.Object `Object`} of the specified {@link type `type`} with the specified {@link item `item`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public ReplaceObject(type: AbstractConstructor<TObject>, item: TObject): void;

    /**
     * Replaces the object of the item with the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public ReplaceObject(type: AbstractConstructor<TTarget>, filter: Filter<TTarget, TObject>): void;

    /**
     * Replaces the object of the item with an {@link PropertyResolver.Object `Object`} of the specified {@link type `type`} with a replacement created by the {@link filter `filter`}.
     *
     * @param type
     * The type of the item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public ReplaceObject(type: AbstractConstructor<TObject>, filter: Filter<TTarget, TObject>): void;

    /**
     * Replaces the object of the item which matches the {@link predicate `predicate`} with the specified {@link item `item`}.
     *
     * @param predicate
     * The predicate for finding the item to replace.
     *
     * @param item
     * The replacement of the item.
     */
    public ReplaceObject(predicate: Predicate<TTarget>, item: TObject): void;

    /**
     * Replaces the object of the item which matches the {@link predicate `predicate`} with a replacement created by the {@link filter `filter`}.
     *
     * @param predicate
     * The item to replace.
     *
     * @param filter
     * A method for creating the replacement for the item.
     */
    public ReplaceObject(predicate: Predicate<TTarget>, filter: Filter<TTarget, TObject>): void;

    /**
     * Replaces the item which matches the {@link filter `filter`} with the specified {@link replacement `replacement`}.
     *
     * @param filter
     * A filter for determining the item to replace.
     *
     * @param replacement
     * The replacement for the item.
     */
    public ReplaceObject(filter: string | AbstractConstructor<TObject | TTarget> | Predicate<TTarget>, replacement: TObject | Filter<TTarget, TObject>): void
    {
        if (typeof replacement === "function")
        {
            this.Replace(filter as any, (item) => this.CreateItem(replacement(item)));
        }
        else
        {
            this.Replace(filter as any, replacement);
        }
    }

    /**
     * Adds the specified {@link item `item`} to the collection.
     *
     * @param item
     * The item to add.
     */
    public override Add(item: TObject): void;

    /**
     * Adds the specified {@link item `item`} to the collection.
     *
     * @param item
     * The item to add.
     */
    public override Add(item: TTarget): void;

    /**
     * Adds the specified {@link item `item`} to the collection.
     *
     * @param item
     * The item to add.
     */
    public override Add(item: any): void
    {
        super.Add(item);
    }

    /**
     * @inheritdoc
     *
     * @param items
     * The items to add.
     */
    public override AddRange(items: TTarget[]): void;

    /**
     * @inheritdoc
     *
     * @param items
     * The items to add.
     */
    public override AddRange(items: TObject[]): void;

    /**
     * @inheritdoc
     *
     * @param items
     * The items to add.
     */
    public override AddRange(items: Array<TObject | TTarget>): void
    {
        let internalItems: TTarget[] = [];

        for (let item of items)
        {
            if (item instanceof PropertyResolver)
            {
                internalItems.push(item);
            }
            else
            {
                internalItems.push(this.CreateItem(item));
            }
        }

        super.AddRange(internalItems);
    }

    /**
     * Creates a new item for the specified {@link options `options`}.
     *
     * @param options
     * The options for the new item.
     */
    protected abstract CreateItem(options: TObject): TTarget;

    /**
     * @inheritdoc
     *
     * @param filter
     * The filter to convert.
     *
     * @returns
     * A predicate which represents the specified {@link filter `filter`}.
     */
    protected override GetPredicate(filter: string | AbstractConstructor<TObject | TTarget> | Predicate<TObject | TTarget>): Predicate<TTarget>
    {
        if (
            typeof filter !== "string" &&
            this.IsConstructor(filter))
        {
            return (item) => (item instanceof filter || item.Object instanceof filter);
        }
        else
        {
            return super.GetPredicate(filter);
        }
    }
}

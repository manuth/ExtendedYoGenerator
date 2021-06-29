import { AbstractConstructor } from "../AbstractConstructor";
import { PropertyResolver } from "../Components/Resolving/PropertyResolver";
import { Filter } from "../Filter";
import { IGenerator } from "../IGenerator";
import { IUniqueObject } from "../IUniqueObject";
import { Predicate } from "../Predicate";
import { UniqueObjectCollection } from "./UniqueObjectCollection";

/**
 * Provides the functionality to edit a collection of {@link PropertyResolver `PropertyResolver<TObject, TTarget, TSettings, TOptions>`}s.
 *
 * @template TObject
 * The type of the unresolved objects in this collection.
 *
 * @template TTarget
 * The type of the resolved objects in this collection.
 */
export abstract class PropertyResolverCollection<TObject extends IUniqueObject, TTarget extends PropertyResolver<TObject, any, any, any> & IUniqueObject> extends UniqueObjectCollection<TTarget>
{
    /**
     * The generator of the collection.
     */
    private generator: IGenerator<any, any>;

    /**
     * Initializes a new instance of the {@link PropertyResolverCollection `PropertyResolverCollection<T>`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: TTarget[]);

    /**
     * Initializes a new instance of the {@link PropertyResolverCollection `PropertyResolverCollection<T>`} class.
     *
     * @param args
     * The arguments for initializing the new collection.
     */
    public constructor(...args: any[])
    {
        let generator: IGenerator<any, any>;
        let params: any[];

        if (
            args.length === 2 &&
            nameof<IGenerator<any, any>>((generator) => generator.Settings) in args[0] &&
            Array.isArray(args[1]))
        {
            generator = args[0];
            params = args[1];
        }
        else
        {
            params = args;
        }

        super(params);
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
    public override Replace(filter: string | AbstractConstructor<TTarget> | Predicate<TTarget>, replacement: TObject | TTarget | Filter<TTarget>): void
    {
        if (
            typeof replacement !== "function" &&
            !(replacement instanceof PropertyResolver))
        {
            super.Replace(
                filter as any,
                (item) =>
                {
                    item.Object = replacement;
                    return item;
                });
        }
        else
        {
            super.Replace(filter as any, replacement as any);
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
    public override Add(item: TObject | TTarget): void
    {
        if (item instanceof PropertyResolver)
        {
            super.Add(item);
        }
        else
        {
            super.Add(this.CreateItem(item));
        }
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
            return (item) => item.Object instanceof filter;
        }
        else
        {
            return super.GetPredicate(filter);
        }
    }
}

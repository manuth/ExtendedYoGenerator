import { IGenerator } from "../IGenerator";
import { ComponentCategory } from "./ComponentCategory";
import { IComponentCollection } from "./IComponentCollection";
import { PropertyResolver } from "./Resolving/PropertyResolver";

/**
 * Represents a set of components.
 */
export class ComponentCollection<TSettings> extends PropertyResolver<IComponentCollection<TSettings>, ComponentCollection<TSettings>, TSettings>
{
    /**
     * Initrializes a new instance of the `ComponentCollection<TSettings>` class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param componentCollection
     * The options of the collection.
     */
    public constructor(generator: IGenerator<TSettings>, componentCollection: IComponentCollection<TSettings>)
    {
        super(generator, componentCollection);
    }

    /**
     * Gets the question to show when asking to choose components.
     */
    public get Question(): string
    {
        return this.Object.Question;
    }

    /**
     * Gets the component-categories.
     */
    public get Categories(): Array<ComponentCategory<TSettings>>
    {
        return this.Object.Categories.map(
            (category) =>
            {
                return new ComponentCategory(this.Generator, category);
            });
    }
}

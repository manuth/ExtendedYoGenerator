import { IGenerator } from "../IGenerator";
import { ComponentCategory } from "./ComponentCategory";
import { IComponentCollection } from "./IComponentCollection";
import { PropertyResolver } from "./Resolving/PropertyResolver";

/**
 * Represents a set of components.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class ComponentCollection<TSettings, TOptions> extends PropertyResolver<IComponentCollection<TSettings, TOptions>, ComponentCollection<TSettings, TOptions>, TSettings, TOptions> implements IComponentCollection<TSettings, TOptions>
{
    /**
     * Initrializes a new instance of the {@link ComponentCollection `ComponentCollection<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param componentCollection
     * The options of the collection.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, componentCollection: IComponentCollection<TSettings, TOptions>)
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
    public get Categories(): Array<ComponentCategory<TSettings, TOptions>>
    {
        return this.Object.Categories.map(
            (category) =>
            {
                return new ComponentCategory(this.Generator, category);
            });
    }
}

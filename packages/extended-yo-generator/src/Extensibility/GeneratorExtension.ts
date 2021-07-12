// eslint-disable-next-line node/no-unpublished-import
import type { InstantiateOptions } from "yeoman-environment";
import { GeneratorOptions } from "yeoman-generator";
import { GeneratorConstructor } from "../GeneratorConstructor";
import { ObjectExtension } from "./ObjectExtension";

/**
 * Represents a generator-extension.
 *
 * @template T
 * The type of the base generator.
 */
export abstract class GeneratorExtension<T extends GeneratorConstructor> extends ObjectExtension<T>
{
    /**
     * Initializes a new instance of the {@link GeneratorExtension `GeneratorExtension<T>`} class.
     */
    protected constructor()
    {
        super();
    }

    /**
     * Gets the file-mappings of the base-generator.
     */
    protected get BaseFileMappings(): InstanceType<T>["ResolvedFileMappings"]
    {
        return null;
    }

    /**
     * Gets the components of the base-generator.
     */
    protected get BaseComponents(): InstanceType<T>["ComponentCollection"]
    {
        return null;
    }

    /**
     * Instantiates the base generator.
     *
     * @param args
     * The arguments for creating the base generator.
     *
     * @returns
     * The newly created base generator.
     */
    protected InstantiateBaseGenerator(...args: ConstructorParameters<T>): InstanceType<T>
    {
        return null;
    }

    /**
     * Gets the options for instantiating the base generator.
     *
     * @returns
     * The options for instantiating the base generator.
     */
    protected GetBaseGeneratorOptions(): InstantiateOptions<GeneratorOptions>
    {
        return null;
    }
}

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
}

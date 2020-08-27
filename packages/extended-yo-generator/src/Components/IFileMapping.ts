import { FileMapping } from "./FileMapping";
import { FileProcessor } from "./FileProcessor";
import { ResolveFunction } from "./Resolving/ResolveFunction";

/**
 * Represents a file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IFileMapping<TSettings, TOptions>
{
    /**
     * Gets or sets the path to the template of the component.
     */
    Source?: string;

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination: string;

    /**
     * Gets or sets the context to use for copying the file-entry.
     */
    Context?: ResolveFunction<FileMapping<TSettings, TOptions>, TSettings, TOptions, any>;

    /**
     * Gets or sets the method to execute for processing the file-mapping.
     */
    Processor?: FileProcessor<TSettings, TOptions>;
}

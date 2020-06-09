import { FileMapping } from "./FileMapping";
import { FileProcessor } from "./FileProcessor";
import { Resolvable } from "./Resolving/Resolvable";
import { ResolveFunction } from "./Resolving/ResolveFunction";

/**
 * Represents a file-mapping.
 */
export interface IFileMapping<TSettings>
{
    /**
     * Gets or sets the path to the template of the component.
     */
    Source?: Resolvable<FileMapping<TSettings>, TSettings, string>;

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination: Resolvable<FileMapping<TSettings>, TSettings, string>;

    /**
     * Gets or sets the context to use for copying the file-entry.
     */
    Context?: ResolveFunction<FileMapping<TSettings>, TSettings, any>;

    /**
     * Gets or sets the method to execute for processing the file-mapping.
     */
    Processor?: FileProcessor<TSettings>;
}

import { IUniqueObject } from "../../IUniqueObject.js";
import { AsyncResolveFunction } from "../Resolving/AsyncResolveFunction.js";
import { Resolvable } from "../Resolving/Resolvable.js";
import { FileMapping } from "./FileMapping.js";
import { FileProcessor } from "./FileProcessor.js";

/**
 * Represents a {@link FileMapping `FileMapping<TSettings, TOptions>`}.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export interface IFileMapping<TSettings, TOptions> extends IUniqueObject
{
    /**
     * Gets or sets the path to the template of the component.
     */
    Source?: Resolvable<FileMapping<TSettings, TOptions>, TSettings, TOptions, string>;

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination: Resolvable<FileMapping<TSettings, TOptions>, TSettings, TOptions, string>;

    /**
     * Gets or sets the context to use for copying the file-entry.
     */
    Context?: AsyncResolveFunction<FileMapping<TSettings, TOptions>, TSettings, TOptions, any>;

    /**
     * Gets or sets the method to execute for processing the file-mapping.
     */
    Processor?: FileProcessor<TSettings, TOptions>;
}

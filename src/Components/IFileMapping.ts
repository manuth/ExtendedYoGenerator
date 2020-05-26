import { Generator } from "../Generator";
import { IGeneratorSettings } from "../IGeneratorSettings";
import { Resolvable } from "./Resolving/Resolvable";
import { ResolveFunction } from "./Resolving/ResolveFunction";
import { IGenerator } from "../IGenerator";
import { FileMapping } from "./FileMapping";

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
    Processor?: (target: FileMapping<TSettings>, generator: IGenerator<TSettings>, context?: any) => void | Promise<void>;
}

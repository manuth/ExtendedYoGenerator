import { IGenerator } from "../IGenerator";
import { FileMapping } from "./FileMapping";

/**
 * Represents a component for processing files.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export type FileProcessor<TSettings, TOptions> =
    /**
     * Processes a file.
     *
     * @param target
     * The file-mapping to process.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @returns
     * The file-processing task.
     */
    (target: FileMapping<TSettings, TOptions>, generator: IGenerator<TSettings, TOptions>) => (void | Promise<void>);

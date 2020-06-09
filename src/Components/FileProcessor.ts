import { IGenerator } from "../IGenerator";
import { FileMapping } from "./FileMapping";

/**
 * Represents a component for processing files.
 *
 * @template T
 * The settings.
 */
export type FileProcessor<T> =
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
    (target: FileMapping<T>, generator: IGenerator<T>) => (void | Promise<void>);

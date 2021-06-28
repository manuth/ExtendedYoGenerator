import { Generator } from "./Generator";

/**
 * Represents a generator-base.
 */
export interface IBaseGenerator<T extends Generator<any, any>>
{
    /**
     * Gets the base-generator.
     */
    Base: T;

    /**
     * Gets the file-mappings of the base-generator.
     */
    BaseFileMappings: T["ResolvedFileMappings"];

    /**
     * Gets the components of the base-generator.
     */
    BaseComponents: T["ComponentCollection"];
}

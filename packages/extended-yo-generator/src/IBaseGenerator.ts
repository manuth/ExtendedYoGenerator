import { Generator } from "./Generator";
import { IObjectExtension } from "./IObjectExtension";

/**
 * Represents a generator-extension.
 */
export interface IGeneratorExtension<T extends Generator<any, any>> extends IObjectExtension<T>
{
    /**
     * Gets the file-mappings of the base-generator.
     */
    BaseFileMappings: T["ResolvedFileMappings"];

    /**
     * Gets the components of the base-generator.
     */
    BaseComponents: T["ComponentCollection"];
}

import { GeneratorConstructor } from "./GeneratorConstructor";
import { IObjectExtension } from "./IObjectExtension";

/**
 * Represents a generator-extension.
 *
 * @template T
 * The type of the base generator.
 */
export interface IGeneratorExtension<T extends GeneratorConstructor> extends IObjectExtension<T>
{
    /**
     * Gets the file-mappings of the base-generator.
     */
    BaseFileMappings: InstanceType<T>["ResolvedFileMappings"];

    /**
     * Gets the components of the base-generator.
     */
    BaseComponents: InstanceType<T>["ComponentCollection"];
}

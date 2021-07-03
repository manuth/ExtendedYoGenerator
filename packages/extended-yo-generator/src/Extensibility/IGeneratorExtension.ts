import { GeneratorConstructor } from "../GeneratorConstructor";

/**
 * Represents a generator-extension.
 *
 * @template T
 * The type of the base generator.
 */
export interface IGeneratorExtension<T extends GeneratorConstructor>
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

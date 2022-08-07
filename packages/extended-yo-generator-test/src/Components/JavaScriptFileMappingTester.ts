import { createRequire } from "module";
import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { FileMappingTester } from "./FileMappingTester.js";

/**
 * Provides the functionality to test javascript file-mappings.
 *
 * @template TGenerator
 * The type of the generator for testing the file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 *
 * @template TFileMapping
 * The type of the file-mapping to test.
 */
export class JavaScriptFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>> extends FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>
{
    /**
     * A component for resolving modules.
     */
    private moduleResolver: NodeRequire = null;

    /**
     * Initializes a new instance of the {@link JavaScriptFileMappingTester `JavaScriptFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * Gets a component for resolving modules.
     */
    protected get ModuleResolver(): NodeRequire
    {
        if (this.moduleResolver === null)
        {
            this.moduleResolver = createRequire(import.meta.url);
        }

        return this.moduleResolver;
    }

    /**
     * Requires the javascript-file.
     *
     * @returns
     * The exported members of the file.
     */
    public async Require(): Promise<any>
    {
        let require = this.ModuleResolver;
        let fileName = require.resolve(this.FileMapping.Destination);

        if (fileName in require.cache)
        {
            delete require.cache[fileName];
        }

        return require(fileName);
    }
}

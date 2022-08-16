import { GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { parse } from "comment-json";
import { FileMappingTester } from "./FileMappingTester.js";

/**
 * Provides the functionality to test json files-mappings.
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
export class JSONFileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>> extends FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>
{
    /**
     * Initializes a new instance of the {@link JSONFileMappingTester `JSONFileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        super(generator, fileMapping);
    }

    /**
     * Gets the parsed content of the source-file.
     *
     * @returns
     * The parsed content of the source-file.
     */
    public async ParseSource(): Promise<any>
    {
        return this.Parse(await this.ReadSource());
    }

    /**
     * Gets the parsed content of the output-file.
     *
     * @returns
     * The parsed content of the output-file.
     */
    public async ParseOutput(): Promise<any>
    {
        return this.Parse(await this.ReadOutput());
    }

    /**
     * Parses the specified {@link text `text`}.
     *
     * @param text
     * The text to parse.
     *
     * @returns
     * The parsed representation of the specified {@link text `text`}.
     */
    public Parse(text: string): any
    {
        return parse(text);
    }
}

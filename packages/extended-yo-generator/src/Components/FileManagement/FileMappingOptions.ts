import { readFile } from "fs-extra";
import { GeneratorOptions } from "yeoman-generator";
import { IGenerator } from "../../IGenerator";
import { IGeneratorSettings } from "../../IGeneratorSettings";
import { GeneratorComponent } from "../GeneratorComponent";
import { FileMapping } from "./FileMapping";
import { IFileMapping } from "./IFileMapping";

/**
 * Provides data for creating a {@link FileMapping `FileMapping<TSettings, TOptions>`}.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class FileMappingOptions<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, FileMapping<TSettings, TOptions>> implements IFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link FileMappingOptions `FileMappingOptions<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public get Source(): string
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public abstract get Destination(): string;

    /**
     * @inheritdoc
     */
    public get Resolved(): FileMapping<TSettings, TOptions>
    {
        return new FileMapping(this.Generator, this);
    }

    /**
     * @inheritdoc
     *
     * @returns
     * The context of the file-mapping.
     */
    public async Context(): Promise<any>
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public async Processor?(): Promise<void>;

    /**
     * Reads the contents of the source-file.
     *
     * @returns
     * The contents of the source-file.
     */
    public async ReadSource(): Promise<string>
    {
        return this.ReadFile(this.Resolved.Source);
    }

    /**
     * Reads the contents of the file located at the specified {@link path `path`}.
     *
     * @param path
     * The path to the file to read.
     *
     * @returns
     * The contents of the file.
     */
    protected async ReadFile(path: string): Promise<string>
    {
        return (await readFile(path)).toString();
    }

    /**
     * Writes the specified {@link content `content`} to the file located at the specified {@link path `path`}.
     *
     * @param path
     * The path to the file to write.
     *
     * @param content
     * The content to write.
     */
    protected async WriteFile(path: string, content: string): Promise<void>
    {
        this.Generator.fs.write(path, content);
    }

    /**
     * Writes the specified {@link content `content`} to the destination-file.
     *
     * @param content
     * The content to write.
     */
    protected async WriteOutput(content: string): Promise<void>
    {
        return this.WriteFile(this.Resolved.Destination, content);
    }
}

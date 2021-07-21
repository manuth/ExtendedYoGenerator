import { strictEqual } from "assert";
import { FileMapping, GeneratorOptions, IFileMapping, IGenerator, IGeneratorSettings } from "@manuth/extended-yo-generator";
import { pathExists, readFile, remove } from "fs-extra";

/**
 * Provides the functionality to test a file-mapping.
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
export class FileMappingTester<TGenerator extends IGenerator<TSettings, TOptions>, TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions, TFileMapping extends IFileMapping<TSettings, TOptions>>
{
    /**
     * The generator of the file-mapping.
     */
    private generator: TGenerator;

    /**
     * The file-mapping to test.
     */
    private fileMapping: TFileMapping;

    /**
     * Initializes a new instance of the {@link FileMappingTester `FileMappingTester<TGenerator, TSettings, TOptions, TFileMapping>`} class.
     *
     * @param generator
     * The generator of the file-mapping
     *
     * @param fileMapping
     * The file-mapping to test.
     */
    public constructor(generator: TGenerator, fileMapping: TFileMapping)
    {
        this.generator = generator;
        this.fileMapping = fileMapping;
    }

    /**
     * Gets the generator of the file-mapping.
     */
    public get Generator(): TGenerator
    {
        return this.generator;
    }

    /**
     * Gets the options of the file-mapping.
     */
    public get FileMappingOptions(): TFileMapping
    {
        return this.fileMapping;
    }

    /**
     * Gets the file-mapping to test.
     */
    public get FileMapping(): FileMapping<TSettings, TOptions>
    {
        return new FileMapping(this.Generator, this.FileMappingOptions);
    }

    /**
     * Gets a value indicating whether the file-mapping output exists.
     */
    public get Exists(): Promise<boolean>
    {
        return pathExists(this.FileMapping.Destination);
    }

    /**
     * Processes the file-mapping.
     */
    public async Run(): Promise<void>
    {
        let fileMapping = this.FileMapping;
        await fileMapping.Processor();
        await this.Commit();
    }

    /**
     * Reads the contents of the file with the specified {@link fileName `fileName`}.
     *
     * @param fileName
     * The name of the file to read.
     *
     * @returns
     * The contents of the file with the specified {@link fileName `fileName`}.
     */
    public async ReadFile(fileName: string): Promise<string>
    {
        return (await readFile(fileName)).toString();
    }

    /**
     * Writes content into the specified file.
     *
     * @param fileName
     * The name of the file to write the content to.
     *
     * @param content
     * The content to write.
     */
    public async WriteFile(fileName: string, content: string): Promise<void>
    {
        this.Generator.fs.write(fileName, content);
        return this.Commit();
    }

    /**
     * Writes content to the source-file.
     *
     * @param content
     * The content to write.
     */
    public async WriteSource(content: string): Promise<void>
    {
        return this.WriteFile(this.FileMapping.Source, content);
    }

    /**
     * Writes content to the destination-file.
     *
     * @param content
     * The content to write.
     */
    public async WriteOutput(content: string): Promise<void>
    {
        return this.WriteFile(this.FileMapping.Destination, content);
    }

    /**
     * Commits the changes made to the temporary file-system.
     */
    public async Commit(): Promise<void>
    {
        return new Promise(
            (resolve, reject) =>
            {
                this.Generator.fs.commit(
                    (error) =>
                    {
                        if (error)
                        {
                            reject(error);
                        }
                        else
                        {
                            resolve();
                        }
                    });
            });
    }

    /**
     * Reads the contents of the source-file.
     *
     * @returns
     * The contents of the source-file.
     */
    public async ReadSource(): Promise<string>
    {
        return this.ReadFile(this.FileMapping.Source);
    }

    /**
     * Reads the contents of the output-file.
     *
     * @returns
     * The contents of the output-file.
     */
    public async ReadOutput(): Promise<string>
    {
        return this.ReadFile(this.FileMapping.Destination);
    }

    /**
     * Asserts the content of the file-mapping output.
     *
     * @param expected
     * The expected content.
     */
    public async AssertContent(expected: string): Promise<void>
    {
        strictEqual(await this.ReadOutput(), expected);
    }

    /**
     * Cleans the file-mapping output.
     */
    public async Clean(): Promise<void>
    {
        if (this.Generator.fs.exists(this.FileMapping.Destination))
        {
            this.Generator.fs.delete(this.FileMapping.Destination);
            await this.Commit();
        }

        if (await this.Exists)
        {
            return remove(this.FileMapping.Destination);
        }
    }
}

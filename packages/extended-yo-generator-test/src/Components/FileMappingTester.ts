import Assert = require("assert");
import { GeneratorOptions, IGenerator, IGeneratorSettings, IFileMapping, FileMapping } from "@manuth/extended-yo-generator";
import { readFile, pathExists, remove } from "fs-extra";

/**
 * Provides the functionality to test a file-mapping.
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
     * Initializes a new instance of the `FileMappingTester` class.
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
        return (
            async () =>
            {
                return pathExists(this.FileMapping.Destination);
            })();
    }

    /**
     * Gets the content of the file-mapping output.
     */
    public get Content(): Promise<string>
    {
        return (
            async () =>
            {
                return (await readFile(this.FileMapping.Destination)).toString();
            })();
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
    public async WriteDestination(content: string): Promise<void>
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
     * Asserts the content of the file-mapping output.
     *
     * @param expected
     * The expected content.
     */
    public async AssertContent(expected: string): Promise<void>
    {
        Assert.strictEqual(await this.Content, expected);
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

        if (await pathExists(this.FileMapping.Destination))
        {
            return remove(this.FileMapping.Destination);
        }
    }
}

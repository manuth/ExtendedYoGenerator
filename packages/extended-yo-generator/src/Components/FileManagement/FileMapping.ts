import { isAbsolute } from "path";
import { IGenerator } from "../../IGenerator";
import { AsyncResolveFunction } from "../Resolving/AsyncResolveFunction";
import { PathResolver } from "../Resolving/PathResolver";
import { PropertyResolver } from "../Resolving/PropertyResolver";
import { Resolvable } from "../Resolving/Resolvable";
import { FileProcessor } from "./FileProcessor";
import { IFileMapping } from "./IFileMapping";

/**
 * Represents a file-mapping.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export class FileMapping<TSettings, TOptions> extends PropertyResolver<IFileMapping<TSettings, TOptions>, FileMapping<TSettings, TOptions>, TSettings, TOptions> implements IFileMapping<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link FileMapping `FileMapping<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param fileMapping
     * The options of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>, fileMapping: IFileMapping<TSettings, TOptions>)
    {
        super(generator, fileMapping);
    }

    /**
     * @inheritdoc
     */
    public get ID(): string
    {
        return this.Object.ID;
    }

    /**
     * @inheritdoc
     */
    public set ID(value: string)
    {
        this.Object.ID = value;
    }

    /**
     * Gets or sets the path to the template of the component.
     */
    public get Source(): string
    {
        return this.ResolvePath(this.Object.Source, (...path) => this.Generator.templatePath(...path));
    }

    /**
     * @inheritdoc
     */
    public set Source(value: Resolvable<FileMapping<TSettings, TOptions>, TSettings, TOptions, string>)
    {
        this.Object.Source = value;
    }

    /**
     * Gets or sets the destination to save the component to.
     */
    public get Destination(): string
    {
        return this.ResolvePath(this.Object.Destination, (...path) => this.Generator.destinationPath(...path));
    }

    /**
     * @inheritdoc
     */
    public set Destination(value: Resolvable<FileMapping<TSettings, TOptions>, TSettings, TOptions, string>)
    {
        this.Object.Destination = value;
    }

    /**
     * Gets or sets the context to use for copying the file-entry.
     */
    public get Context(): () => Promise<any>
    {
        return () => this.ResolveProperty(this, this.Object.Context);
    }

    /**
     * @inheritdoc
     */
    public set Context(value: AsyncResolveFunction<FileMapping<TSettings, TOptions>, TSettings, TOptions, any>)
    {
        this.Object.Context = value;
    }

    /**
     * Gets or sets the method to execute for processing the file-mapping.
     */
    public get Processor(): () => void | Promise<void>
    {
        if (this.Object.Processor)
        {
            return () => this.Object.Processor(this, this.Generator);
        }
        else
        {
            return async () =>
            {
                if (await this.Context())
                {
                    this.Generator.fs.copyTpl(this.Source, this.Destination, await this.Context());
                }
                else
                {
                    this.Generator.fs.copy(this.Source, this.Destination);
                }
            };
        }
    }

    /**
     * @inheritdoc
     */
    protected set Processor(value: FileProcessor<TSettings, TOptions>)
    {
        this.Object.Processor = value;
    }

    /**
     * Resolves the path from the options with the specified {@link resolver `resolver`}.
     *
     * @param path
     * The path to resolve.
     *
     * @param resolver
     * The {@link PathResolver `PathResolver`} to use.
     *
     * @returns
     * The resolved path.
     */
    protected ResolvePath(path: Resolvable<FileMapping<TSettings, TOptions>, TSettings, TOptions, string>, resolver: PathResolver): string
    {
        let result = this.ResolveProperty(this, path);

        if (
            !result ||
            isAbsolute(result))
        {
            return result;
        }
        else
        {
            return resolver(result);
        }
    }
}

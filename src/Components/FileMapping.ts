import Path = require("path");
import { isNullOrUndefined } from "util";
import { IFileMapping } from "./IFileMapping";
import { IGenerator } from "../IGenerator";
import { PropertyResolver } from "./Resolving/PropertyResolver";
import { Resolvable } from "./Resolving/Resolvable";

/**
 * Represents a file-mapping.
 */
export class FileMapping<TSettings> extends PropertyResolver<IFileMapping<TSettings>, FileMapping<TSettings>, TSettings>
{
    /**
     * Initializes a new instance of the `FileMapping<TSettings>` class.
     *
     * @param generator
     * The generator of the file-mapping.
     *
     * @param fileMapping
     * The options of the file-mapping.
     */
    public constructor(generator: IGenerator<TSettings>, fileMapping: IFileMapping<TSettings>)
    {
        super(generator, fileMapping);
    }

    /**
     * Gets the path to the template of the component.
     */
    public get Source(): Promise<string>
    {
        return this.ResolvePath(this.Object.Source, (...path) => this.Generator.templatePath(...path));
    }

    /**
     * Gets the destination to save the component to.
     */
    public get Destination(): Promise<string>
    {
        return this.ResolvePath(this.Object.Destination, (...path) => this.Generator.destinationPath(...path));
    }

    /**
     * Gets the context to use for copying the file-entry.
     */
    public get Context(): Promise<any>
    {
        return this.ResolveProperty(this, this.Object.Context);
    }

    /**
     * Gets the method to execute for processing the file-mapping.
     */
    public get Processor(): (target: FileMapping<TSettings>, generator: IGenerator<TSettings>) => (void | Promise<void>)
    {
        if (this.Object.Processor)
        {
            return this.Object.Processor;
        }
        else
        {
            return async (target, generator) =>
            {
                if (await target.Context)
                {
                    generator.fs.copy(await target.Source, await target.Destination);
                }
                else
                {
                    generator.fs.copyTpl(await target.Source, await target.Destination, await target.Context);
                }
            };
        }
    }

    /**
     * 
     * @param path
     * The path to resolve.
     *
     * @param resolver
     */
    protected ResolvePath(path: Resolvable<FileMapping<TSettings>, TSettings, string>, resolver: (...path: string[]) => string): Promise<string>
    {
        return (async () =>
        {
            let result = await this.ResolveProperty(this, path);
            
            if (
                isNullOrUndefined(result) ||
                Path.isAbsolute(result))
            {
                return result;
            }
            else
            {
                return resolver(result);
            }
        })();
    }
}

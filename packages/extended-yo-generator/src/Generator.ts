import { dirname, join, resolve } from "node:path";
import fs from "fs-extra";
import pkgUp from "pkg-up";
// eslint-disable-next-line @typescript-eslint/tslint/config
import YeomanGenerator, { Question } from "yeoman-generator";
import { FileMappingCollectionEditor } from "./Collections/FileMappingCollectionEditor.js";
import { ObjectCollectionEditor } from "./Collections/ObjectCollectionEditor.js";
import { ComponentCollection } from "./Components/ComponentCollection.js";
import { FileMapping } from "./Components/FileManagement/FileMapping.js";
import { IFileMapping } from "./Components/FileManagement/IFileMapping.js";
import { IComponentCollection } from "./Components/IComponentCollection.js";
import { BaseGeneratorFactory } from "./Extensibility/BaseGeneratorFactory.js";
import { GeneratorExtensionConstructor } from "./Extensibility/GeneratorExtensionConstructor.js";
import { GeneratorConstructor } from "./GeneratorConstructor.js";
import { GeneratorSettingKey } from "./GeneratorSettingKey.js";
import { IGenerator } from "./IGenerator.js";
import { IGeneratorSettings } from "./IGeneratorSettings.js";

const { ensureDirSync } = fs;

/**
 * Represents a yeoman-generator.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class Generator<TSettings extends IGeneratorSettings = IGeneratorSettings, TOptions extends YeomanGenerator.GeneratorOptions = YeomanGenerator.GeneratorOptions> extends YeomanGenerator<TOptions> implements IGenerator<TSettings, TOptions>
{
    /**
     * The path to the root of the module of the generator.
     */
    private moduleRootPath: string;

    /**
     * The settings of the generator.
     */
    private settings: TSettings = {} as TSettings;

    /**
     * Initializes a new instance of the {@link Generator `Generator<TSettings, TOptions>`} class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: TOptions)
    {
        super(args, options);
        this.ModuleRoot = dirname(pkgUp.sync({ cwd: this.resolved }));
    }

    /**
     * Gets or sets the root of the module containing this generator.
     */
    protected get ModuleRoot(): string
    {
        return this.moduleRootPath;
    }

    /**
     * @inheritdoc
     */
    protected set ModuleRoot(value: string)
    {
        this.moduleRootPath = resolve(value);
    }

    /**
     * Gets the name of the root of the template-folder.
     */
    public get TemplateRoot(): string
    {
        return "";
    }

    /**
     * Gets the options for the components the user can select.
     */
    public get Components(): IComponentCollection<TSettings, TOptions>
    {
        return null;
    }

    /**
     * Gets the components the user can select.
     */
    public get ComponentCollection(): ComponentCollection<TSettings, TOptions>
    {
        if (this.Components)
        {
            return new ComponentCollection(this, this.Components);
        }
        else
        {
            return null;
        }
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [];
    }

    /**
     * Gets all questions including questions for the components.
     */
    public get QuestionCollection(): ObjectCollectionEditor<Question<TSettings>>
    {
        return new ObjectCollectionEditor(
            [
                ...this.Questions ?? [],
                ...this.ComponentCollection?.Questions ?? []
            ]);
    }

    /**
     * Gets the options for the file-mappings of the generator.
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return [];
    }

    /**
     * Gets the file-mappings of the generator.
     */
    public get ResolvedFileMappings(): FileMappingCollectionEditor
    {
        return new FileMappingCollectionEditor(
            this,
            (this.FileMappings ?? []).map((fileMapping) => new FileMapping(this, fileMapping)));
    }

    /**
     * Gets the file-mappings to process.
     */
    public get FileMappingCollection(): FileMappingCollectionEditor
    {
        let result = this.ResolvedFileMappings;

        for (let category of this.ComponentCollection?.Categories?.Items ?? [])
        {
            for (let component of category.Components.Items)
            {
                if ((this.Settings[GeneratorSettingKey.Components] ?? []).includes(component.ID))
                {
                    result.AddRange(component.FileMappings.Items);
                }
            }
        }

        return result;
    }

    /**
     * @inheritdoc
     */
    public get Settings(): TSettings
    {
        return this.settings;
    }

    /**
     * Creates a base-generator class to extend.
     *
     * @template T
     * The type of the constructor of the base-generator.
     *
     * @param base
     * The class to extend and to instantiate a base-generator.
     */
    public static ComposeWith<T extends GeneratorConstructor>(base: T): GeneratorExtensionConstructor<T>;

    /**
     * Creates a base-generator class to extend from.
     *
     * @template T
     * The type of the constructor of the base-generator.
     *
     * @param base
     * The class to extend and to instantiate a base-generator.
     *
     * @param namespaceOrPath
     * Either a plain path or the namespace or path of a generator for resolving the module-root of the base-generator.
     */
    public static ComposeWith<T extends GeneratorConstructor>(base: T, namespaceOrPath: string): GeneratorExtensionConstructor<T>;

    /**
     * Creates a constructor for extending a generator.
     *
     * @template T
     * The type of the constructor of the base-generator.
     *
     * @param base
     * The constructor of the base-generator.
     *
     * @param namespaceOrPath
     * The namespace or the path of the generator.
     *
     * @returns
     * A constructor for extending the specified {@link base `base`}-generator.
     */
    public static ComposeWith<T extends GeneratorConstructor>(base: T, namespaceOrPath?: string): GeneratorExtensionConstructor<T>
    {
        return BaseGeneratorFactory.Create(base, namespaceOrPath);
    }

    /**
     * @inheritdoc
     *
     * @param rootPath
     * The new destination root path.
     *
     * @returns
     * The {@link Generator.destinationRoot `destinationRoot`} of the generator.
     */
    public override destinationRoot(rootPath?: string): string
    {
        // This piece of code temporarily fixes [yeoman/generator#309](https://github.com/yeoman/environment/issues/309) as a workaround.
        if (rootPath)
        {
            ensureDirSync(rootPath);
            process.chdir(rootPath);
            this.env.cwd = rootPath;
        }

        return super.destinationRoot(rootPath);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path.
     */
    public modulePath(...path: string[]): string
    {
        return join(this.ModuleRoot, ...path);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path.
     */
    public commonTemplatePath(...path: string[]): string
    {
        return this.modulePath("templates", ...path);
    }

    /**
     * @inheritdoc
     *
     * @param path
     * The path that is to be joined.
     *
     * @returns
     * The joined path.
     */
    public override templatePath(...path: string[]): string
    {
        return this.commonTemplatePath(...(this.TemplateRoot ? [this.TemplateRoot] : []), ...path);
    }

    /**
     * Initializes the generator.
     */
    public async initializing(): Promise<void>
    { }

    /**
     * Gathers all information for executing the generator and saves them to the {@link Generator.Settings `Settings`}.
     */
    public async prompting(): Promise<void>
    {
        Object.assign(this.Settings, await this.prompt(this.QuestionCollection.Items));
        this.log();
    }

    /**
     * Writes all files for the components.
     */
    public async writing(): Promise<void>
    {
        for (let fileMapping of this.FileMappingCollection.Items)
        {
            await this.ProcessFile(fileMapping);
        }
    }

    /**
     * Installs all required dependencies.
     */
    public async install(): Promise<void>
    { }

    /**
     * Finalizes the generation-process.
     */
    public async end(): Promise<void>
    { }

    /**
     * Wraps the specified {@link value `value`} in a promise.
     *
     * @template T
     * The type of the {@link value `value`} to wrap.
     *
     * @param value
     * The value to convert.
     *
     * @returns
     * A promise which resolves to the specified {@link value `value`}.
     */
    protected CreatePromise<T>(value: T): Promise<T>
    {
        return (
            async () =>
            {
                return value;
            })();
    }

    /**
     * Processes a file-mapping.
     *
     * @param fileMapping
     * The file-mapping to process.
     */
    protected async ProcessFile(fileMapping: FileMapping<TSettings, TOptions>): Promise<void>
    {
        let result = fileMapping.Processor();

        if (result instanceof Promise)
        {
            return result;
        }
    }
}

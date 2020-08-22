import Path = require("path");
import { isNullOrUndefined } from "util";
import chalk = require("chalk");
import { ChoiceCollection, Separator } from "inquirer";
import PkgUp = require("pkg-up");
import YeomanGenerator = require("yeoman-generator");
import { Question } from "yeoman-generator";
import { BaseConstructorCreator } from "./BaseConstructorCreator";
import { ComponentCollection } from "./Components/ComponentCollection";
import { FileMapping } from "./Components/FileMapping";
import { IComponentCollection } from "./Components/IComponentCollection";
import { IFileMapping } from "./Components/IFileMapping";
import { CompositeConstructor } from "./CompositeConstructor";
import { GeneratorConstructor } from "./GeneratorConstructor";
import { GeneratorSettingKey } from "./GeneratorSettingKey";
import { IGenerator } from "./IGenerator";
import { IGeneratorSettings } from "./IGeneratorSettings";

/**
 * Represents a yeoman-generator.
 *
 * @template T
 * The type of the settings of the generator.
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
     * Initializes a new instance of the `Generator` class.
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
        this.ModuleRoot = Path.dirname(PkgUp.sync({ cwd: this.resolved }));
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
        this.moduleRootPath = Path.resolve(value);
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
    public get QuestionCollection(): Array<Question<TSettings>>
    {
        let result: Array<Question<TSettings>> = [];
        let components: ChoiceCollection<TSettings> = [];
        let defaults: string[] = [];

        if (this.ComponentCollection)
        {
            for (let category of this.ComponentCollection.Categories ?? [])
            {
                components.push(new Separator(category.DisplayName));

                for (let component of category.Components)
                {
                    let isDefault = component.DefaultEnabled ?? false;

                    components.push(
                        {
                            value: component.ID,
                            name: component.DisplayName,
                            checked: isDefault
                        });

                    if (isDefault)
                    {
                        defaults.push(component.ID);
                    }

                    for (let i = 0; i < component.Questions?.length ?? 0; i++)
                    {
                        let question = component.Questions[i];
                        let when = question.when;

                        question.when = async (settings: TSettings) =>
                        {
                            if ((settings[GeneratorSettingKey.Components] ?? []).includes(component.ID))
                            {
                                if (i === 0)
                                {
                                    this.log();
                                    this.log(`${chalk.red(">>")} ${chalk.bold(component.DisplayName)} ${chalk.red("<<")}`);
                                }

                                if (!isNullOrUndefined(when))
                                {
                                    if (typeof when === "function")
                                    {
                                        return when(settings);
                                    }
                                    else
                                    {
                                        return when;
                                    }
                                }
                                else
                                {
                                    return true;
                                }
                            }
                            else
                            {
                                return false;
                            }
                        };

                        result.push(question);
                    }
                }
            }

            result.unshift(
                {
                    type: "checkbox",
                    name: GeneratorSettingKey.Components,
                    message: this.Components.Question,
                    choices: components,
                    default: defaults
                });
        }

        result.unshift(...(this.Questions ?? []));
        return result;
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
    public get ResolvedFileMappings(): Array<FileMapping<TSettings, TOptions>>
    {
        return (this.FileMappings ?? []).map((fileMapping) => new FileMapping(this, fileMapping));
    }

    /**
     * Gets the file-mappings to process.
     */
    public get FileMappingCollection(): Promise<Array<FileMapping<TSettings, TOptions>>>
    {
        return (
            async () =>
            {
                let result = this.ResolvedFileMappings;

                for (let category of this.ComponentCollection?.Categories ?? [])
                {
                    for (let component of category.Components)
                    {
                        if ((this.Settings[GeneratorSettingKey.Components] ?? []).includes(component.ID))
                        {
                            result.push(...await component.FileMappings);
                        }
                    }
                }

                return result;
            })();
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
     * @param base
     * The class to extend and to instanciate a base-generator.
     */
    public static ComposeWith<T extends GeneratorConstructor>(base: T): CompositeConstructor<T>;

    /**
     * Creates a base-generator class to extend from.
     *
     * @param base
     * The class to extend and to instanciate a base-generator.
     *
     * @param namespaceOrPath
     * The namespace or path of a generator for resolving the module-root of the base-generator.
     */
    public static ComposeWith<T extends GeneratorConstructor>(base: T, namespaceOrPath: string): CompositeConstructor<T>;

    /**
     * Creates a constructor for extending a generator.
     *
     * @param base
     * The constructor of the base-generator.
     *
     * @param namespaceOrPath
     * The namespace or the path of the generator.
     *
     * @returns
     * A constructor for extending the specified `base`-generator.
     */
    public static ComposeWith<T extends GeneratorConstructor>(base: T, namespaceOrPath?: string): CompositeConstructor<T>
    {
        return BaseConstructorCreator.Create(base, namespaceOrPath);
    }

    /**
     * @inheritdoc
     *
     * @param rootPath
     * The new destination root path.
     *
     * @param skipEnvironment
     * A value indicating whether `this.env.cwd` and the current working directory shouldn't be changed.
     *
     * @returns
     * The `destinationRoot` of the generator.
     */
    public destinationRoot(rootPath?: string, skipEnvironment?: boolean): string
    {
        return super.destinationRoot(rootPath, skipEnvironment);
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
        return Path.join(this.ModuleRoot, ...path);
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
    public templatePath(...path: string[]): string
    {
        return this.commonTemplatePath(...(this.TemplateRoot ? [this.TemplateRoot] : []), ...path);
    }

    /**
     * Initializes the generator.
     */
    public async initializing(): Promise<void>
    { }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting(): Promise<void>
    {
        Object.assign(this.Settings, await this.prompt(this.QuestionCollection));
        this.log();
    }

    /**
     * Writes all files for the components.
     */
    public async writing(): Promise<void>
    {
        for (let fileMapping of await this.FileMappingCollection)
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
     * Processes a file-mapping.
     *
     * @param fileMapping
     * The file-mapping to process.
     */
    protected async ProcessFile(fileMapping: FileMapping<TSettings, TOptions>): Promise<void>
    {
        let result = fileMapping.Processor(fileMapping, this);

        if (result instanceof Promise)
        {
            return result;
        }
    }
}

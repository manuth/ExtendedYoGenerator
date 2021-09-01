// eslint-disable-next-line node/no-unpublished-import
import type { InstantiateOptions } from "yeoman-environment";
import { GeneratorOptions } from "yeoman-generator";
import { FileMappingCollectionEditor } from "../Collections/FileMappingCollectionEditor";
import { ComponentCollection } from "../Components/ComponentCollection";
import { IFileMapping } from "../Components/FileManagement/IFileMapping";
import { IComponentCollection } from "../Components/IComponentCollection";
import { Generator } from "../Generator";
import { GeneratorConstructor } from "../GeneratorConstructor";
import { GeneratorExtensionConstructor } from "./GeneratorExtensionConstructor";
import { IBaseGeneratorContext } from "./IBaseGeneratorContext";
import { ObjectExtensionFactory } from "./ObjectExtensionFactory";

/**
 * Provides the functionality to create base-generators.
 *
 * @template T
 * The type of the constructor of the base generator.
 */
export class BaseGeneratorFactory<T extends GeneratorConstructor> extends ObjectExtensionFactory<T>
{
    /**
     * A component for preprocessing the base-class.
     *
     * @param base
     * The base-class to process.
     */
    private classProcessor: (base: T) => void;

    /**
     * Initializes a new instance of the {@link BaseGeneratorFactory `BaseGeneratorFactory`} class.
     */
    protected constructor()
    {
        super();
    }

    /**
     * Gets the default instance of the {@link BaseGeneratorFactory `BaseGeneratorFactory<T>`} class.
     */
    protected static override get Default(): BaseGeneratorFactory<any>
    {
        return new BaseGeneratorFactory();
    }

    /**
     * Creates a new base-constructor.
     *
     * @template TBase
     * The type of the constructor of the base generator.
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @param namespaceOrPath
     * The namespace or path to the generator with the specified {@link base `base`}-constructor.
     *
     * @returns
     * The generated constructor.
     */
    public static override Create<TBase extends GeneratorConstructor>(base: TBase, namespaceOrPath?: string): GeneratorExtensionConstructor<TBase>
    {
        return this.Default.Create(base, namespaceOrPath);
    }

    /**
     * Creates a new base-constructor.
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @param namespaceOrPath
     * The namespace or path to the generator with the specified {@link base `base`}-constructor.
     *
     * @returns
     * The generated constructor.
     */
    public override Create(base: T, namespaceOrPath?: string): GeneratorExtensionConstructor<T>
    {
        let self = this;

        return class BaseGenerator extends (super.Create(base) as GeneratorExtensionConstructor<T>)
        {
            /**
             * A context which provides data for the base-generator.
             */
            private baseGeneratorContext: IBaseGeneratorContext;

            /**
             * Initializes a new instance of the {@link BaseGenerator `BaseGenerator`} class.
             *
             * @param args
             * A set of arguments for the generator.
             *
             * @param options
             * A set of options for the generator.
             */
            public constructor(args: string | string[], options: GeneratorOptions)
            {
                super(args, options);
            }

            /**
             * @inheritdoc
             */
            protected override get BaseComponents(): ComponentCollection<any, any>
            {
                return this.baseGeneratorContext.ComponentResolver();
            }

            /**
             * @inheritdoc
             */
            protected override get BaseFileMappings(): FileMappingCollectionEditor
            {
                return this.baseGeneratorContext.FileMappingResolver();
            }

            /**
             * @inheritdoc
             */
            public override get Components(): IComponentCollection<any, any>
            {
                return this.Base.ComponentCollection.Result;
            }

            /**
             * @inheritdoc
             */
            public override get FileMappings(): Array<IFileMapping<any, any>>
            {
                return this.Base.ResolvedFileMappings.Items;
            }

            /**
             * @inheritdoc
             *
             * @param args
             * The arguments for initializing the base.
             *
             * @returns
             * The newly created base object.
             */
            protected override Initialize(...args: ConstructorParameters<T>): void
            {
                let resolvedKey = nameof<Generator>((generator) => generator.resolved);
                self.classProcessor = () => { };

                if (namespaceOrPath)
                {
                    if (resolvedKey in base)
                    {
                        let resolvedPath: string = (base as any)[resolvedKey];
                        self.classProcessor = (base) => (base as any)[resolvedKey] = resolvedPath;
                    }
                    else
                    {
                        self.classProcessor = (base) => delete (base as any)[resolvedKey];
                    }

                    try
                    {
                        (base as any)[resolvedKey] = (this.env.get(namespaceOrPath) as any)?.[resolvedKey] ?? namespaceOrPath;
                    }
                    catch
                    {
                        (base as any)[resolvedKey] = namespaceOrPath;
                    }
                }
            }

            /**
             * @inheritdoc
             *
             * @param args
             * The arguments for initializing the base.
             *
             * @returns
             * The newly created base object.
             */
            protected override InitializeBase(...args: ConstructorParameters<T>): InstanceType<T>
            {
                let generator = this;
                let result = this.InstantiateBaseGenerator(...args);
                self.classProcessor(base);

                let settingsPropertyName = nameof<Generator>((generator) => generator.Settings);
                let fileMappingPropertyName = nameof<Generator>((generator) => generator.ResolvedFileMappings);
                let componentPropertyName = nameof<Generator>((generator) => generator.ComponentCollection);
                let destinationPathName = nameof<Generator>((generator) => generator.destinationPath);
                let destinationRootName = nameof<Generator>((generator) => generator.destinationRoot);
                let propertyDescriptors = self.GetAllProperties(base);
                let settingsProperty = propertyDescriptors[settingsPropertyName];
                let fileMappingProperty = propertyDescriptors[fileMappingPropertyName];
                let componentProperty = propertyDescriptors[componentPropertyName];
                let destinationPath = propertyDescriptors[destinationPathName];
                let destinationRoot = propertyDescriptors[destinationRootName];

                this.baseGeneratorContext = {
                    ComponentResolver: componentProperty.get.bind(result),
                    FileMappingResolver: fileMappingProperty.get.bind(result)
                };

                settingsProperty = {
                    ...settingsProperty,
                    get()
                    {
                        return generator.Settings;
                    }
                };

                fileMappingProperty = {
                    ...fileMappingProperty,
                    get()
                    {
                        return generator.BaseFileMappings;
                    }
                };

                componentProperty = {
                    ...componentProperty,
                    get()
                    {
                        return generator.BaseComponents;
                    }
                };

                destinationRoot = {
                    ...destinationRoot,
                    value: (...args: any[]) => this.destinationRoot(...args)
                };

                destinationPath = {
                    ...destinationPath,
                    value: (...args: any[]) => this.destinationPath(...args)
                };

                Object.defineProperties(
                    result,
                    {
                        [settingsPropertyName]: settingsProperty,
                        [fileMappingPropertyName]: fileMappingProperty,
                        [componentPropertyName]: componentProperty,
                        [destinationRootName]: destinationRoot,
                        [destinationPathName]: destinationPath
                    });

                return result;
            }

            /**
             * @inheritdoc
             *
             * @param args
             * The arguments for creating the base generator.
             *
             * @returns
             * The newly created base generator.
             */
            protected override InstantiateBaseGenerator(...args: ConstructorParameters<T>): InstanceType<T>
            {
                let instanceOptions = this.GetBaseGeneratorOptions(...args);
                return this.env.instantiate(base, instanceOptions) as InstanceType<T>;
            }

            /**
             * @inheritdoc
             *
             * @param args
             * The arguments for creating the base generator.
             *
             * @returns
             * The options for instantiating the base generator.
             */
            protected override GetBaseGeneratorOptions(...args: ConstructorParameters<T>): InstantiateOptions<GeneratorOptions>
            {
                return {
                    arguments: args[0],
                    options: {
                        ...args[1]
                    }
                };
            }
        } as GeneratorExtensionConstructor<T>;
    }
}

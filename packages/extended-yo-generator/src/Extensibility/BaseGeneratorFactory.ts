import { FileMappingCollectionEditor } from "../Collections/FileMappingCollectionEditor";
import { ComponentCollection } from "../Components/ComponentCollection";
import { IFileMapping } from "../Components/FileManagement/IFileMapping";
import { IComponentCollection } from "../Components/IComponentCollection";
import { Generator } from "../Generator";
import { GeneratorConstructor } from "../GeneratorConstructor";
import { GeneratorExtensionConstructor } from "./GeneratorExtensionConstructor";
import { IGeneratorExtension } from "./IBaseGenerator";
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
     * The namespace or the path of the generator to extend.
     */
    private namespaceOrPath: string = null;

    /**
     * A component for preprocessing the base-class.
     *
     * @param base
     * The base-class to process.
     */
    private classProcessor: (base: T) => void;

    /**
     * A component for resolving the components of the base.
     */
    private baseComponentResolver: () => ComponentCollection<any, any>;

    /**
     * A component for resolving the file-mappings of the base.
     */
    private baseFileMappingResolver: () => FileMappingCollectionEditor;

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
        this.namespaceOrPath = namespaceOrPath;

        return class BaseGenerator extends super.Create(base) implements IGeneratorExtension<T>
        {
            /**
             * Initializes a new instance of the {@link BaseGenerator `BaseGenerator`} class.
             *
             * @param params
             * The arguments of the constructor.
             */
            public constructor(...params: any[])
            {
                super(...params);
            }

            /**
             * @inheritdoc
             */
            public get BaseComponents(): ComponentCollection<any, any>
            {
                return self.baseComponentResolver();
            }

            /**
             * @inheritdoc
             */
            public get BaseFileMappings(): FileMappingCollectionEditor
            {
                return self.baseFileMappingResolver();
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
        } as GeneratorExtensionConstructor<T>;
    }

    /**
     * @inheritdoc
     *
     * @param base
     * The constructor of the base type.
     *
     * @param instance
     * The instance of the extension type.
     *
     * @param args
     * The arguments for initializing the base.
     *
     * @returns
     * The newly created base object.
     */
    protected override Initialize(base: T, instance: InstanceType<GeneratorExtensionConstructor<T>>, ...args: any[]): void
    {
        let resolvedKey = nameof<Generator>((generator) => generator.resolved);
        this.classProcessor = () => { };

        if (this.namespaceOrPath)
        {
            if (resolvedKey in base)
            {
                let resolvedPath: string = (base as any)[resolvedKey];
                this.classProcessor = (base) => (base as any)[resolvedKey] = resolvedPath;
            }
            else
            {
                this.classProcessor = (base) => delete (base as any)[resolvedKey];
            }

            try
            {
                (base as any)[resolvedKey] = (instance.env.get(this.namespaceOrPath) as any)?.[resolvedKey] ?? this.namespaceOrPath;
            }
            catch
            {
                (base as any)[resolvedKey] = this.namespaceOrPath;
            }
        }
    }

    /**
     * @inheritdoc
     *
     * @param base
     * The constructor of the base type.
     *
     * @param instance
     * The instance of the extension type.
     *
     * @param args
     * The arguments for initializing the base.
     *
     * @returns
     * The newly created base object.
     */
    protected override InitializeBase(base: T, instance: InstanceType<GeneratorExtensionConstructor<T>>, ...args: any[]): InstanceType<T>
    {
        let instanceOptions = { options: instance.options };
        let result = instance.env.instantiate(base, instanceOptions) as InstanceType<T>;
        this.classProcessor(base);

        let settingsPropertyName = nameof<Generator>((generator) => generator.Settings);
        let fileMappingPropertyName = nameof<Generator>((generator) => generator.ResolvedFileMappings);
        let componentPropertyName = nameof<Generator>((generator) => generator.ComponentCollection);
        let destinationPathName = nameof<Generator>((generator) => generator.destinationPath);
        let destinationRootName = nameof<Generator>((generator) => generator.destinationRoot);
        let propertyDescriptors = this.GetAllProperties(base);
        let settingsProperty = propertyDescriptors[settingsPropertyName];
        let fileMappingProperty = propertyDescriptors[fileMappingPropertyName];
        let componentProperty = propertyDescriptors[componentPropertyName];
        let destinationPath = propertyDescriptors[destinationPathName];
        let destinationRoot = propertyDescriptors[destinationRootName];
        this.baseComponentResolver = componentProperty.get.bind(result);
        this.baseFileMappingResolver = fileMappingProperty.get.bind(result);

        settingsProperty = {
            ...settingsProperty,
            get()
            {
                return instance.Settings;
            }
        };

        fileMappingProperty = {
            ...fileMappingProperty,
            get()
            {
                return instance.BaseFileMappings;
            }
        };

        componentProperty = {
            ...componentProperty,
            get()
            {
                return instance.BaseComponents;
            }
        };

        destinationRoot = {
            ...destinationRoot,
            value: (...args: any[]) => instance.destinationRoot(...args)
        };

        destinationPath = {
            ...destinationPath,
            value: (...args: any[]) => instance.destinationPath(...args)
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
}

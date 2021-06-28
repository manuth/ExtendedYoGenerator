import YeomanGenerator = require("yeoman-generator");
import { ComponentCollection } from "./Components/ComponentCollection";
import { FileMappingOptionCollection } from "./Components/FileMappingOptionCollection";
import { IComponentCollection } from "./Components/IComponentCollection";
import { IFileMapping } from "./Components/IFileMapping";
import { CompositeGeneratorConstructor } from "./CompositeGeneratorConstructor";
import { Generator } from "./Generator";
import { GeneratorConstructor } from "./GeneratorConstructor";
import { IBaseGenerator } from "./IBaseGenerator";

/**
 * Provides the functionality to create base-generators.
 */
export abstract class BaseGeneratorFactory
{
    /**
     * Initializes a new instance of the {@link BaseGeneratorFactory `BaseGeneratorFactory`} class.
     */
    private constructor()
    { }

    /**
     * Creates a new base-constructor.
     *
     * @template TBase
     * The type of the constructor of the base-generator.
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
    public static Create<TBase extends GeneratorConstructor>(base: TBase, namespaceOrPath?: string): CompositeGeneratorConstructor<TBase>
    {
        let resolvedKey = "resolved" as const;

        return (
            <TConstructor extends new (...args: any[]) => Generator>(baseClass: TConstructor): CompositeGeneratorConstructor<TConstructor> =>
            {
                return class BaseGenerator extends baseClass implements IBaseGenerator<InstanceType<TConstructor>>
                {
                    /**
                     * The base-generator.
                     */
                    private base: InstanceType<TConstructor>;

                    /**
                     * A component for resolving the components of the base.
                     */
                    private baseComponentResolver: () => ComponentCollection<any, any>;

                    /**
                     * A component for resolving the file-mappings of the base.
                     */
                    private baseFileMappingResolver: () => FileMappingOptionCollection;

                    /**
                     * Initializes a new instance of the {@link BaseGenerator `BaseGenerator`} class.
                     *
                     * @param params
                     * The arguments of the constructor.
                     */
                    public constructor(...params: any[])
                    {
                        super(...params);
                        let classProcessor: (base: TConstructor) => void = () => { };
                        let instanceOptions = { options: this.options };

                        if (namespaceOrPath)
                        {
                            if (resolvedKey in baseClass)
                            {
                                let resolvedPath: string = (baseClass as any)[resolvedKey];
                                classProcessor = (base) => (base as any)[resolvedKey] = resolvedPath;
                            }
                            else
                            {
                                classProcessor = (base) => delete (base as any)[resolvedKey];
                            }

                            try
                            {
                                (baseClass as any)[resolvedKey] = (this.env.get(namespaceOrPath) as any)?.[resolvedKey] ?? namespaceOrPath;
                            }
                            catch
                            {
                                (baseClass as any)[resolvedKey] = namespaceOrPath;
                            }
                        }

                        this.base = this.env.instantiate(baseClass, instanceOptions) as InstanceType<TConstructor>;
                        classProcessor(baseClass);

                        let settingsPropertyName = "Settings" as keyof Generator;
                        let fileMappingPropertyName = "ResolvedFileMappings" as keyof Generator;
                        let componentPropertyName = "ComponentCollection" as keyof Generator;
                        let destinationPathName = "destinationPath" as keyof Generator;
                        let destinationRootName = "destinationRoot" as keyof Generator;
                        let propertyDescriptors = BaseGeneratorFactory.GetAllProperties(base);
                        let settingsProperty = propertyDescriptors[settingsPropertyName];
                        let fileMappingProperty = propertyDescriptors[fileMappingPropertyName];
                        let componentProperty = propertyDescriptors[componentPropertyName];
                        let destinationPath = propertyDescriptors[destinationPathName];
                        let destinationRoot = propertyDescriptors[destinationRootName];
                        let self = this;
                        this.baseComponentResolver = componentProperty.get.bind(this.Base);
                        this.baseFileMappingResolver = fileMappingProperty.get.bind(this.Base);

                        settingsProperty = {
                            ...settingsProperty,
                            get()
                            {
                                return self.Settings;
                            }
                        };

                        fileMappingProperty = {
                            ...fileMappingProperty,
                            get()
                            {
                                return self.BaseFileMappings;
                            }
                        };

                        componentProperty = {
                            ...componentProperty,
                            get()
                            {
                                return self.BaseComponents;
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
                            this.Base,
                            {
                                [settingsPropertyName]: settingsProperty,
                                [fileMappingPropertyName]: fileMappingProperty,
                                [componentPropertyName]: componentProperty,
                                [destinationRootName]: destinationRoot,
                                [destinationPathName]: destinationPath
                            });
                    }

                    /**
                     * @inheritdoc
                     */
                    public get Base(): InstanceType<TConstructor>
                    {
                        return this.base;
                    }

                    /**
                     * @inheritdoc
                     */
                    public get BaseComponents(): ComponentCollection<any, any>
                    {
                        return this.baseComponentResolver();
                    }

                    /**
                     * @inheritdoc
                     */
                    public get BaseFileMappings(): FileMappingOptionCollection
                    {
                        return this.baseFileMappingResolver();
                    }

                    /**
                     * @inheritdoc
                     */
                    public override get Components(): IComponentCollection<any, any>
                    {
                        return this.Base.ComponentCollection;
                    }

                    /**
                     * @inheritdoc
                     */
                    public override get FileMappings(): Array<IFileMapping<any, any>>
                    {
                        return this.Base.ResolvedFileMappings;
                    }
                } as CompositeGeneratorConstructor<TConstructor>;
            })(base);
    }

    /**
     * Gets all properties of the specified generator-class.
     *
     * @template T
     * The type of the generator to get the properties for.
     *
     * @param ctor
     * The constructor whose properties to get.
     *
     * @returns
     * The properties of the specified class.
     */
    protected static GetAllProperties<T extends GeneratorConstructor>(ctor: T): { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & { [x: string]: PropertyDescriptor }
    {
        let result: { [P in keyof T]: TypedPropertyDescriptor<T[P]> } & { [x: string]: PropertyDescriptor } = {} as any;

        for (let current = ctor.prototype; current !== YeomanGenerator.prototype && current !== Object.prototype; current = Object.getPrototypeOf(current))
        {
            result = {
                ...Object.getOwnPropertyDescriptors(current),
                ...result
            };
        }

        return result;
    }
}

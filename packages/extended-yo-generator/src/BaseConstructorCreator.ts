import YeomanGenerator = require("yeoman-generator");
import { IComponent } from "./Components/IComponent";
import { IComponentCategory } from "./Components/IComponentCategory";
import { IComponentCollection } from "./Components/IComponentCollection";
import { IFileMapping } from "./Components/IFileMapping";
import { CompositeConstructor } from "./CompositeConstructor";
import { Generator } from "./Generator";
import { GeneratorConstructor } from "./GeneratorConstructor";
import { IBaseGenerator } from "./IBaseGenerator";

/**
 * Provides the functionality to create base-constructors.
 */
export abstract class BaseConstructorCreator
{
    /**
     * Initializes a new instance of the {@link BaseConstructorCreator `BaseConstructorCreator`} class.
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
    public static Create<TBase extends GeneratorConstructor>(base: TBase, namespaceOrPath?: string): CompositeConstructor<TBase>
    {
        let resolvedKey: keyof YeomanGenerator = "resolved";

        return (
            <TConstructor extends new (...args: any[]) => any>(baseClass: TConstructor): CompositeConstructor<TConstructor> =>
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
                    private baseComponentResolver: () => IComponentCollection<any, any>;

                    /**
                     * A component for resolving the file-mappings of the base.
                     */
                    private baseFileMappingResolver: () => Array<IFileMapping<any, any>>;

                    /**
                     * Initializes a new instance of the {@link BaseGenerator `BaseGenerator`} class.
                     *
                     * @param params
                     * The arguments of the constructor.
                     */
                    public constructor(...params: any[])
                    {
                        super(...params);
                        let [args, options] = params as [string | string[], YeomanGenerator.GeneratorOptions];
                        let classProcessor: (base: TConstructor) => void = () => { };
                        let instanceOptions = { arguments: args, options };

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
                                (baseClass as any)[resolvedKey] = this.env.get(namespaceOrPath)?.[resolvedKey] ?? namespaceOrPath;
                            }
                            catch
                            {
                                (baseClass as any)[resolvedKey] = namespaceOrPath;
                            }
                        }

                        this.base = this.env.instantiate(baseClass, instanceOptions);
                        classProcessor(baseClass);

                        let settingsPropertyName = "Settings" as keyof Generator;
                        let fileMappingPropertyName = "FileMappings" as keyof Generator;
                        let componentPropertyName = "Components" as keyof Generator;
                        let destinationPathName = "destinationPath" as keyof Generator;
                        let destinationRootName = "destinationRoot" as keyof Generator;
                        let propertyDescriptors = BaseConstructorCreator.GetAllProperties(base);
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
                    public get BaseComponents(): IComponentCollection<any, any>
                    {
                        return this.baseComponentResolver();
                    }

                    /**
                     * @inheritdoc
                     */
                    public get BaseFileMappings(): Array<IFileMapping<any, any>>
                    {
                        return this.baseFileMappingResolver();
                    }

                    /**
                     * @inheritdoc
                     */
                    public get Components(): IComponentCollection<any, any>
                    {
                        let result: IComponentCollection<any, any> = this.Base.ComponentCollection;

                        return {
                            ...result,
                            Question: result.Question,
                            Categories: [
                                ...(result.Categories ?? []).map(
                                    (category): IComponentCategory<any, any> =>
                                    {
                                        return {
                                            ...category,
                                            DisplayName: category.DisplayName,
                                            Components: [
                                                ...(category.Components ?? []).map(
                                                    (component): IComponent<any, any> =>
                                                    {
                                                        return {
                                                            ...component,
                                                            ID: component.ID,
                                                            DisplayName: component.DisplayName,
                                                            DefaultEnabled: component.DefaultEnabled,
                                                            Questions: [...(component.Questions ?? [])],
                                                            FileMappings: component.FileMappings
                                                        };
                                                    })
                                            ]
                                        };
                                    })
                            ]
                        };
                    }

                    /**
                     * @inheritdoc
                     */
                    public get FileMappings(): Array<IFileMapping<any, any>>
                    {
                        return this.Base.ResolvedFileMappings;
                    }
                } as CompositeConstructor<TConstructor>;
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

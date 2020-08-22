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
     * Initializes a new instance of the `BaseConstructor` class.
     */
    private constructor()
    { }

    /**
     * Creates a new base-constructor.
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @param namespaceOrPath
     * The namespace or path to the generator with the specified `base`-constructor.
     *
     * @returns
     * The generated constructor.
     */
    public static Create<T extends GeneratorConstructor>(base: T, namespaceOrPath?: string): CompositeConstructor<T>
    {
        let resolvedKey: keyof YeomanGenerator = "resolved";
        let baseClass: GeneratorConstructor = base as any;

        /**
         * Represents a base-generator iheriting the specified base.
         */
        class BaseGenerator extends baseClass implements IBaseGenerator<Generator<any, any>>
        {
            /**
             * The base-generator.
             */
            private base: Generator<any, any>;

            /**
             * A component for resolving the components of the base.
             */
            private baseComponentResolver: () => IComponentCollection<any, any>;

            /**
             * A component for resolving the file-mappings of the base.
             */
            private baseFileMappingResolver: () => Array<IFileMapping<any, any>>;

            /**
             * Initializes a new instance of the `BaseGenerator` class.
             *
             * @param params
             * The arguments of the constructor.
             */
            public constructor(...params: any[])
            {
                super(...params);
                let [args, options] = params as [string | string[], YeomanGenerator.GeneratorOptions];
                let classProcessor: (base: T) => void = () => { };
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

                    (baseClass as any)[resolvedKey] = (this.env.get(namespaceOrPath) as any)[resolvedKey];
                }

                this.base = this.env.instantiate(baseClass, instanceOptions) as Generator<any, any>;
                classProcessor(base);

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
            public get Base(): Generator<any, any>
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
        }

        return BaseGenerator as any;
    }

    /**
     * Gets all properties of the specified generator-class.
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

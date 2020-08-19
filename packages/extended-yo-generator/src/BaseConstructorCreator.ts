import YeomanGenerator = require("yeoman-generator");
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
        let instance: Generator<any, any>;
        let baseClass: GeneratorConstructor = base as any;

        /**
         * Represents a base-generator iheriting the specified base.
         */
        class BaseGenerator extends baseClass implements IBaseGenerator<Generator<any, any>>
        {
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
                let instanceOptions = { arguments: args, options };

                if (namespaceOrPath)
                {
                    instance = this.env.create(namespaceOrPath, instanceOptions) as any;
                }
                else
                {
                    instance = this.env.instantiate(base, instanceOptions) as any;
                }

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
                    instance,
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
                return instance as any;
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
                return instance.ComponentCollection;
            }

            /**
             * @inheritdoc
             */
            public get FileMappings(): Array<IFileMapping<any, any>>
            {
                return instance.FileMappingCollection;
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
    protected static GetAllProperties<T extends GeneratorConstructor>(ctor: T): {[P in keyof T]: TypedPropertyDescriptor<T[P]>} & { [x: string]: PropertyDescriptor }
    {
        let result: {[P in keyof T]: TypedPropertyDescriptor<T[P]>} & { [x: string]: PropertyDescriptor } = {} as any;

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

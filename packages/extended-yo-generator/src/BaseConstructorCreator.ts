import { GeneratorOptions } from "yeoman-generator";
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
    public static Create<T extends GeneratorConstructor>(base: T, namespaceOrPath: string): CompositeConstructor<T>
    {
        let instance: Generator<any, any>;
        let baseClass: GeneratorConstructor = base as any;

        /**
         * Represents a base-generator iheriting the specified base.
         */
        class BaseGenerator extends baseClass implements IBaseGenerator<Generator<any, any>>
        {
            /**
             * Initializes a new instance of the `BaseGenerator` class.
             *
             * @param params
             * The arguments of the constructor.
             */
            public constructor(...params: any[])
            {
                super(...params);
                let [args, options] = params as [string | string[], GeneratorOptions];

                instance = this.env.create(
                    namespaceOrPath,
                    {
                        arguments: args,
                        options
                    }) as any;

                let settingsPropertyName = "Settings" as keyof Generator;
                let fileMappingPropertyName = "FileMappings" as keyof Generator;
                let componentPropertyName = "Components" as keyof Generator;
                let settingsProperty = Object.getOwnPropertyDescriptor(base.prototype, settingsPropertyName);
                let fileMappingProperty = Object.getOwnPropertyDescriptor(base.prototype, fileMappingPropertyName);
                let componentProperty = Object.getOwnPropertyDescriptor(base.prototype, componentPropertyName);
                let settingsResolver = (): any => this.Settings;
                let fileMappingResolver = (): Array<IFileMapping<any, any>> => this.BaseFileMappings;
                let componentResolver = (): IComponentCollection<any, any> => this.BaseComponents;

                settingsProperty = {
                    ...settingsProperty,
                    get()
                    {
                        return settingsResolver();
                    }
                };

                fileMappingProperty = {
                    ...fileMappingProperty,
                    get()
                    {
                        return fileMappingResolver();
                    }
                };

                componentProperty = {
                    ...componentProperty,
                    get()
                    {
                        return componentResolver();
                    }
                };

                Object.defineProperties(
                    instance,
                    {
                        [settingsPropertyName]: settingsProperty,
                        [fileMappingPropertyName]: fileMappingProperty,
                        [componentPropertyName]: componentProperty
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
                return instance.ComponentCollection;
            }

            /**
             * @inheritdoc
             */
            public get BaseFileMappings(): Array<IFileMapping<any, any>>
            {
                return instance.FileMappings;
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
}

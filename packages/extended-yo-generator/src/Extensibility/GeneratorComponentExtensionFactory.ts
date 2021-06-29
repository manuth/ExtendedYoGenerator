import { GeneratorComponent } from "../Components/GeneratorComponent";
import { Constructor } from "../Constructor";
import { GeneratorComponentExtensionConstructor } from "./GeneratorComponentExtensionConstructor";
import { ObjectExtensionFactory } from "./ObjectExtensionFactory";

/**
 * Provides the functionality to create base-{@link GeneratorComponent `GeneratorComponent<TSettings, TOptions, TResolved>`}s.
 *
 * @template T
 * The type of the constructor of the base {@link GeneratorComponent `GeneratorComponent<TSettings, TOptions, TResolved>`}.
 */
export class GeneratorComponentExtensionFactory<T extends Constructor<GeneratorComponent<any, any, any>>> extends ObjectExtensionFactory<T>
{
    /**
     * The default instance of the {@link GeneratorComponentExtensionFactory `GeneratorComponentExtensionFactory<T>`} class.
     */
    private static defaultGeneratorComponentExtensionFactory: GeneratorComponentExtensionFactory<any> = null;

    /**
     * Initializes a new instance of the {@link GeneratorComponentExtensionFactory `GeneratorComponentExtensionFactory`} class.
     */
    protected constructor()
    {
        super();
    }

    /**
     * Gets the default instance of the {@link GeneratorComponentExtensionFactory `GeneratorComponentExtensionFactory<T>`} class.
     */
    protected static override get Default(): GeneratorComponentExtensionFactory<any>
    {
        if (this.defaultGeneratorComponentExtensionFactory === null)
        {
            this.defaultGeneratorComponentExtensionFactory = new GeneratorComponentExtensionFactory();
        }

        return this.defaultGeneratorComponentExtensionFactory;
    }

    /**
     * @inheritdoc
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
    public static override Create<TBase extends Constructor<GeneratorComponent<any, any, any>>>(base: TBase, namespaceOrPath?: string): GeneratorComponentExtensionConstructor<TBase>
    {
        return this.Default.Create(base);
    }

    /**
     * @inheritdoc
     *
     * @param base
     * The constructor the generated constructor should be based on.
     *
     * @returns
     * The generated constructor.
     */
    public override Create(base: T): GeneratorComponentExtensionConstructor<T>
    {
        return super.Create(base) as GeneratorComponentExtensionConstructor<T>;
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
    protected override InitializeBase(base: T, instance: InstanceType<GeneratorComponentExtensionConstructor<T>>, ...args: any[]): InstanceType<T>
    {
        let result = super.InitializeBase(base, instance, ...args);
        let generatorPropertyName = "Generator" as keyof GeneratorComponent<any, any, any>;
        let propertyDescriptors = this.GetAllProperties(base);
        let generatorProperty = propertyDescriptors[generatorPropertyName];

        generatorProperty = {
            ...generatorProperty,
            get()
            {
                return instance.BaseGenerator;
            }
        };

        Object.defineProperties(
            result,
            {
                [generatorPropertyName]: generatorProperty
            });

        return result;
    }
}

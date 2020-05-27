import { Generator, IComponentCollection, Question } from "..";
import { IGeneratorSettings } from "../IGeneratorSettings";
import { ComponentCollection } from "../Components/ComponentCollection";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";
import { ITestOptions } from "./ITestOptions";

/**
 * Represents a test-generator.
 */
export class TestGenerator extends Generator
{
    /**
     * The options of the generator.
     */
    private generatorOptions: ITestGeneratorOptions = {
        TemplateRoot: "test",
        Questions: [
            {
                name: "test",
                message: "test",
                default: "test"
            }
        ],
        Components: {
            Question: "test",
            Categories: [
                {
                    DisplayName: "test",
                    Components: [
                        {
                            ID: "test1",
                            DisplayName: "Test 1",
                            FileMappings: [],
                            DefaultEnabled: true,
                            Questions: [
                                {
                                    name: "additional1",
                                    default: "test"
                                }
                            ]
                        },
                        {
                            ID: "test2",
                            DisplayName: "Test 2",
                            FileMappings: [],
                            DefaultEnabled: false,
                            Questions: [
                                {
                                    name: "additional2",
                                    default: "test"
                                }
                            ]
                        }
                    ]
                }
            ]
        }
    };

    /**
     * Initializes a new instance of the `TestGenerator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: ITestOptions)
    {
        super(args, options);

        if (options.testGeneratorOptions)
        {
            this.generatorOptions = options.testGeneratorOptions;
        }
    }

    /**
     * Gets or sets the name of the root of the template-folder.
     */
    public get TemplateRoot()
    {
        return this.generatorOptions.TemplateRoot;
    }

    /**
     * @inheritdoc
     */
    public set TemplateRoot(value)
    {
        this.generatorOptions.TemplateRoot = value;
    }

    /**
     * Gets or sets the components provided by the generator.
     */
    public get Components(): IComponentCollection<IGeneratorSettings>
    {
        return this.generatorOptions.Components;
    }

    /**
     * @inheritdoc
     */
    public set Components(value)
    {
        this.generatorOptions.Components = value;
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    public get Questions(): Question[]
    {
        return this.generatorOptions.Questions;
    }

    /**
     * @inheritdoc
     */
    public set Questions(value)
    {
        this.generatorOptions.Questions = value;
    }

    /**
     * Gathers all information for executing the generator and saves them to the `Settings`.
     */
    public async prompting()
    {
        this.log("Hi");
        return super.prompting();
    }

    /**
     * Writes all files for the components.
     */
    public async writing()
    {
        super.writing();
    }

    /**
     * Finalizes the generation-process.
     */
    public async end()
    {
        this.log("The end");
    }
}

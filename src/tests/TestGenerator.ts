import { Generator, IComponentCollection, Question } from "..";
import { IGeneratorSettings } from "../IGeneratorSettings";
import { ComponentCollection } from "../Components/ComponentCollection";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions";

/**
 * Represents a test-generator.
 */
export class TestGenerator extends Generator
{
    /**
     * The name of the root of the template-folder.
     */
    private templateRoot = "test";

    /**
     * The questions to ask.
     */
    private questions: Question[] = [
        {
            name: "test",
            message: "test",
            default: "test"
        }
    ];

    /**
     * The components of the generator.
     */
    private components: IComponentCollection<IGeneratorSettings> = {
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
    public constructor(args: string | string[], options: ITestGeneratorOptions)
    {
        super(args, options);

        if (options.TemplateRoot)
        {
            this.TemplateRoot = options.TemplateRoot;
        }

        if (options.Components)
        {
            this.Components = options.Components;
        }

        if (options.Questions)
        {
            this.Questions = options.Questions;
        }
    }

    /**
     * Gets or sets the name of the root of the template-folder.
     */
    public get TemplateRoot()
    {
        return this.templateRoot;
    }

    /**
     * @inheritdoc
     */
    public set TemplateRoot(value)
    {
        this.templateRoot = value;
    }

    /**
     * Gets or sets the components provided by the generator.
     */
    public get Components(): IComponentCollection<IGeneratorSettings>
    {
        return this.components;
    }

    /**
     * @inheritdoc
     */
    public set Components(value)
    {
        this.components = value;
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    public get Questions(): Question[]
    {
        return this.questions;
    }

    /**
     * @inheritdoc
     */
    public set Questions(value)
    {
        this.questions = value;
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
    }

    /**
     * Finalizes the generation-process.
     */
    public async end()
    {
        this.log("The end");
    }
}

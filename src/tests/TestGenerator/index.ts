import { Generator, IComponentCollection, Question } from "../..";
import { IGeneratorSettings } from "../../IGeneratorSettings";
import { ComponentCollection } from "../../Components/ComponentCollection";

/**
 * Represents a test-generator.
 */
class TestGenerator extends Generator
{
    /**
     * Initializes a new instance of the `TestGenerator` class.
     *
     * @param args
     * A set of arguments for the generator.
     *
     * @param options
     * A set of options for the generator.
     */
    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    /**
     * Gets the name of the root of the template-folder.
     */
    protected get TemplateRoot()
    {
        return "test";
    }

    /**
     * Gets the components provided by the generator.
     */
    public get Components(): ComponentCollection<IGeneratorSettings>
    {
        return new ComponentCollection<IGeneratorSettings>(
            this,
            {
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
            });
    }

    /**
     * Gets the questions to ask before executing the generator.
     */
    public get Questions(): Question[]
    {
        return [
            {
                name: "test",
                message: "test",
                default: "test"
            }
        ];
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

export = TestGenerator;
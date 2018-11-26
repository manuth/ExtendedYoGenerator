import { Generator, IComponentProvider, Question } from "../..";
import { IGeneratorSettings } from "../../IGeneratorSettings";

/**
 * Represents a test-generator.
 */
class TestGenerator extends Generator
{

    public constructor(args: string | string[], options: {})
    {
        super(args, options);
    }

    protected get TemplateRoot()
    {
        return "test";
    }

    public get ProvidedComponents(): IComponentProvider<IGeneratorSettings>
    {
        return {
            Question: "test",
            Categories: [
                {
                    DisplayName: "test",
                    Components: [
                        {
                            ID: "test1",
                            DisplayName: "Test 1",
                            FileMappings: [],
                            Default: true,
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
                            Default: false,
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
    }

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

    public async prompting()
    {
        this.log("Hi");
        return super.prompting();
    }

    public async writing()
    {
    }

    public async end()
    {
        this.log("The end");
    }
}

export = TestGenerator;
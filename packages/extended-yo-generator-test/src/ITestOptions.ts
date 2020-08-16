import { Question, GeneratorOptions, IComponentCollection, IGeneratorSettings, IFileMapping } from "@manuth/extended-yo-generator";

/**
 * Provides options for the test-generator.
 */
export interface ITestOptions
{
    /**
     * The name of the root of the template-folder.
     */
    TemplateRoot?: string;

    /**
     * The questions to ask.
     */
    Questions?: Question[];

    /**
     * The components of the generator.
     */
    Components?: IComponentCollection<IGeneratorSettings, GeneratorOptions>;

    /**
     * The file-mappings of the generator.
     */
    FileMappings?: Array<IFileMapping<IGeneratorSettings, GeneratorOptions>>;
}

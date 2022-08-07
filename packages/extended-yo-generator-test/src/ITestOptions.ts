import { IComponentCollection, IFileMapping, IGeneratorSettings, Question } from "@manuth/extended-yo-generator";
import { ITestGeneratorOptions } from "./ITestGeneratorOptions.js";

/**
 * Provides options for the test-generator.
 */
export interface ITestOptions<TSettings extends IGeneratorSettings = IGeneratorSettings>
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
    Components?: IComponentCollection<TSettings, ITestGeneratorOptions<ITestOptions<TSettings>>>;

    /**
     * The file-mappings of the generator.
     */
    FileMappings?: Array<IFileMapping<TSettings, ITestGeneratorOptions<ITestOptions<TSettings>>>>;
}

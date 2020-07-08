import { Question } from "yeoman-generator";
import { IComponentCollection } from "../../Components/IComponentCollection";
import { IFileMapping } from "../../Components/IFileMapping";
import { IGeneratorSettings } from "../../IGeneratorSettings";

/**
 * Provides options for the test-generator.
 */
export interface ITestGeneratorOptions
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
    Components?: IComponentCollection<IGeneratorSettings>;

    /**
     * The file-mappings of the generator.
     */
    FileMappings?: Array<IFileMapping<IGeneratorSettings>>;
}

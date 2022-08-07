import Generator from "yeoman-generator";

/**
 * Represents a yeoman-generator.
 *
 * @template TSettings
 * The settings of the generator.
 *
 * @template TOptions
 * The options of the generator.
 */
export interface IGenerator<TSettings, TOptions extends Generator.GeneratorOptions> extends Generator<TOptions>
{
    /**
     * Gets the settings of the generator.
     */
    readonly Settings: TSettings;

    /**
     * Joins the arguments together and returns the resulting path relative to the module-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    modulePath(...path: string[]): string;

    /**
     * Joins the arguments together and returns the resulting path relative to the common template-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    commonTemplatePath(...path: string[]): string;

    /**
     * Joins the arguments together and returns the resulting path relative to the template-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    templatePath(...path: string[]): string;
}

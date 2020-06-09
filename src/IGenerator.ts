import YeomanGenerator = require("yeoman-generator");

/**
 * Represents a yeoman-generator.
 */
export interface IGenerator<TSettings> extends YeomanGenerator
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
     * Joins the arguments together and returns the resulting path relative to the template-directory.
     *
     * @param path
     * The path that is to be joined.
     */
    templatePath(...path: string[]): string;
}

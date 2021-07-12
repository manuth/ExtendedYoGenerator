import { join } from "path";
import { Package } from "@manuth/package-json-editor";

/**
 * Provides constants for testing.
 */
export abstract class TestConstants
{
    /**
     * The metadata of this package.
     */
    private static package: Package = null;

    /**
     * Initializes a new instance of the {@link TestConstants `TestConstants`} class.
     */
    private constructor()
    { }

    /**
     * Gets the metadata of this package.
     */
    public static get Package(): Package
    {
        if (this.package === null)
        {
            this.package = new Package(join(__dirname, "..", "..", Package.FileName));
        }

        return this.package;
    }

    /**
     * Gets the path to the test-directory.
     */
    public static get TestDirectory(): string
    {
        return join(__dirname, "..", "..", "test");
    }
}

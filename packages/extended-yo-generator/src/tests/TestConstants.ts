import { join } from "path";
import { fileURLToPath } from "url";
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
            this.package = new Package(join(TestConstants.DirName, "..", "..", Package.FileName));
        }

        return this.package;
    }

    /**
     * Gets the path to the test-directory.
     */
    public static get TestDirectory(): string
    {
        return join(TestConstants.DirName, "..", "..", "test");
    }

    /**
     * Gets the name of the directory containing the file of this class.
     */
    protected static get DirName(): string
    {
        return fileURLToPath(new URL(".", import.meta.url));
    }
}

import { IGenerator } from "../IGenerator";
import { FileMapping } from "./FileMapping";
import { IFileMapping } from "./IFileMapping";
import { PropertyResolverCollection } from "./PropertyResolverCollection";

/**
 * Represents a set of file-mappings.
 */
export class FileMappingCollection extends PropertyResolverCollection<IFileMapping<any, any>, FileMapping<any, any>>
{
    /**
     * Initializes a new instance of the {@link FileMappingCollection `FileMappingCollection`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<FileMapping<any, any>>)
    {
        super(generator, items);
    }

    /**
     * @inheritdoc
     *
     * @param options
     * The options of the file-mapping.
     *
     * @returns
     * A newly created {@link FileMapping `FileMapping<TSettings, TOptions>`}.
     */
    protected CreateItem(options: IFileMapping<any, any>): FileMapping<any, any>
    {
        return new FileMapping(this.Generator, options);
    }
}

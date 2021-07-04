import { FileMapping } from "../Components/FileManagement/FileMapping";
import { IFileMapping } from "../Components/FileManagement/IFileMapping";
import { IGenerator } from "../IGenerator";
import { PropertyResolverCollectionEditor } from "./PropertyResolverCollectionEditor";

/**
 * Represents a set of file-mappings.
 */
export class FileMappingCollectionEditor extends PropertyResolverCollectionEditor<IFileMapping<any, any>, FileMapping<any, any>>
{
    /**
     * Initializes a new instance of the {@link FileMappingCollectionEditor `FileMappingCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param items
     * The items to edit.
     */
    public constructor(generator: IGenerator<any, any>, items: Array<FileMapping<any, any>>);

    /**
     * Initializes a new instance of the {@link FileMappingCollectionEditor `FileMappingCollectionEditor`} class.
     *
     * @param generator
     * The generator of the collection.
     *
     * @param itemProvider
     * A function for providing the items.
     */
    public constructor(generator: IGenerator<any, any>, itemProvider: () => Array<FileMapping<any, any>>);

    /**
     * Initializes a new instance of the {@link FileMappingCollectionEditor `FileMappingCollectionEditor`} class.
     *
     * @param args
     * The arguments for initializing the new collection.
     */
    public constructor(...args: any[])
    {
        super(...(args as [any, any]));
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

import { FileMappingCollectionEditor } from "../Collections/FileMappingCollectionEditor";
import { ComponentCollection } from "../Components/ComponentCollection";

/**
 * Provides a context for a base-generator.
 */
export interface IBaseGeneratorContext
{
    /**
     * A component for resolving the components of the base.
     */
    ComponentResolver: () => ComponentCollection<any, any>;

    /**
     * A component for resolving the file-mappings of the base.
     */
    FileMappingResolver: () => FileMappingCollectionEditor;
}

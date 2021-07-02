// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectCollectionEditor } from "./ObjectCollectionEditor";

/**
 * Represents an action-type for the {@link ObjectCollectionEditor `ObjectCollectionEditor<T>`}.
 */
export enum CollectionActionType
{
    /**
     * Indicates a removal.
     */
    Removal = "removal",

    /**
     * Indicates a substitution.
     */
    Substitution = "substitution",

    /**
     * Indicates an addition.
     */
    Addition = "addition"
}

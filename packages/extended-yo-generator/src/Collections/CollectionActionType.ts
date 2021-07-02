// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectCollection } from "./ObjectCollection";

/**
 * Represents an action-type for the {@link ObjectCollection `ObjectCollection<T>`}.
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

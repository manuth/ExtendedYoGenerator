import { CollectionActionType } from "./CollectionActionType";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectCollection } from "./ObjectCollection";

/**
 * Represents an action for the {@link ObjectCollection `ObjectCollection<T>`}
 */
export interface ICollectionAction
{
    /**
     * The type of the action.
     */
    Type: CollectionActionType;
}

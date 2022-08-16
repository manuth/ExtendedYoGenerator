import { CollectionActionType } from "./CollectionActionType.js";
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { ObjectCollectionEditor } from "./ObjectCollectionEditor.js";

/**
 * Represents an action for the {@link ObjectCollectionEditor `ObjectCollectionEditor<T>`}
 */
export interface ICollectionAction
{
    /**
     * The type of the action.
     */
    Type: CollectionActionType;
}

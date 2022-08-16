import { CollectionActionType } from "./CollectionActionType.js";
import { ICollectionAction } from "./ICollectionAction.js";

/**
 * Represents an addition.
 */
export interface IAdditionAction<T> extends ICollectionAction
{
    /**
     * @inheritdoc
     */
    Type: CollectionActionType.Addition;

    /**
     * The items to add.
     */
    Items: T[];
}

import { CollectionActionType } from "./CollectionActionType";
import { ICollectionAction } from "./ICollectionAction";

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

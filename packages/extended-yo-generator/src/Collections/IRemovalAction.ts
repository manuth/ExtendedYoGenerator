import { CollectionActionType } from "./CollectionActionType.js";
import { IFilterAction } from "./IFilterAction.js";

/**
 * Represents a removal.
 */
export interface IRemovalAction<T> extends IFilterAction<T>
{
    /**
     * @inheritdoc
     */
    Type: CollectionActionType.Removal;
}

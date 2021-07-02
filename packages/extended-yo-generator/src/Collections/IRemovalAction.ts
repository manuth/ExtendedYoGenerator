import { CollectionActionType } from "./CollectionActionType";
import { IFilterAction } from "./IFilterAction";

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

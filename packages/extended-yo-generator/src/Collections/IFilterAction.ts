import { Predicate } from "../Predicate";
import { ICollectionAction } from "./ICollectionAction";

/**
 * Represents a generic action which requires a filter.
 */
export interface IFilterAction<T> extends ICollectionAction
{
    /**
     * The filter for finding the items to remove.
     */
    Filter: Predicate<T>;
}

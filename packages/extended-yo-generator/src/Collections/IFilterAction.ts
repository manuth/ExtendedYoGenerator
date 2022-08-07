import { Predicate } from "../Predicate.js";
import { ICollectionAction } from "./ICollectionAction.js";

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

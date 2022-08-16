import { Filter } from "../Filter.js";
import { CollectionActionType } from "./CollectionActionType.js";
import { IFilterAction } from "./IFilterAction.js";

/**
 * Represents a substitution.
 */
export interface ISubstitutionAction<T> extends IFilterAction<T>
{
    /**
     * @inheritdoc
     */
    Type: CollectionActionType.Substitution;

    /**
     * The replacement.
     */
    Replacement: Filter<T>;
}

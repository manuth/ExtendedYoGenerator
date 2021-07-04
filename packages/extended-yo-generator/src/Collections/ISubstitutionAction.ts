import { Filter } from "../Filter";
import { CollectionActionType } from "./CollectionActionType";
import { IFilterAction } from "./IFilterAction";

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

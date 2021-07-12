/**
 * Provides the functionality to filter and edit an item.
 *
 * @template TInput
 * The type of the item to edit.
 *
 * @template TOutput
 * The type of the result of the edit
 */
export type Filter<TInput, TOutput = TInput> = (item: TInput) => TOutput;

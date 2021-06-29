/**
 * Provides the functionality to filter an item.
 *
 * @template T
 * The type of the item to check.
 */
export type Predicate<T> = (item: T) => boolean;

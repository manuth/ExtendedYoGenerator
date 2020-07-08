/**
 * Represents a component for resolving a path.
 */
export type PathResolver =
    /**
     * Resolves a path.
     *
     * @param path
     * The path-parts to join.
     *
     * @returns
     * The resolved path.
     */
    (...path: string[]) => string;

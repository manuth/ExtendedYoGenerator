import { Generator } from "./Generator";

/**
 * Represents a component for constructing generators.
 */
export type GeneratorConstructor = new (...params: any[]) => Generator<any, any>;

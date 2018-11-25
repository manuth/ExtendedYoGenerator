import { Answers } from "inquirer";

/**
 * Represents a file-mapping.
 */
export interface IFileMapping<T extends Answers>
{
    /**
     * Gets or sets the path to the template of the component.
     */
    Source: string | ((answers: T) => string | Promise<string>);

    /**
     * Gets or sets the context to use for copying the file-entry.
     */
    Context?: ((answers: T, source: string, destination: string) => any | Promise<any>);

    /**
     * Gets or sets the destination to save the component to.
     */
    Destination: string | ((answers: T) => string | Promise<string>);

    /**
     * Gets or sets the method to execute for processing the file-mapping.
     */
    Process?(source: string, destination: string, context?: any, defaultProcessor?: (source: string, destination: string, context?: any) => void, settings?: T): void | Promise<void>;
}
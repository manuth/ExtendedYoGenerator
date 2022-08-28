import { GeneratorOptions, Question } from "yeoman-generator";
import { IGenerator } from "../IGenerator.js";
import { IGeneratorSettings } from "../IGeneratorSettings.js";
import { Component } from "./Component.js";
import { IFileMapping } from "./FileManagement/IFileMapping.js";
import { GeneratorComponent } from "./GeneratorComponent.js";
import { IComponent } from "./IComponent.js";

/**
 * Provides data for initializing a new {@link Component `Component<TSettings, TOptions>`}.
 *
 * @template TSettings
 * The type of the settings of the generator.
 *
 * @template TOptions
 * The type of the options of the generator.
 */
export abstract class ComponentOptions<TSettings extends IGeneratorSettings, TOptions extends GeneratorOptions> extends GeneratorComponent<TSettings, TOptions, Component<TSettings, TOptions>> implements IComponent<TSettings, TOptions>
{
    /**
     * Initializes a new instance of the {@link ComponentOptions `ComponentOptions<TSettings, TOptions>`} class.
     *
     * @param generator
     * The generator of the component.
     */
    public constructor(generator: IGenerator<TSettings, TOptions>)
    {
        super(generator);
    }

    /**
     * @inheritdoc
     */
    public abstract get ID(): string;

    /**
     * @inheritdoc
     */
    public abstract get DisplayName(): string;

    /**
     * @inheritdoc
     */
    public get DefaultEnabled(): boolean
    {
        return null;
    }

    /**
     * @inheritdoc
     */
    public get Questions(): Array<Question<TSettings>>
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public get FileMappings(): Array<IFileMapping<TSettings, TOptions>>
    {
        return [];
    }

    /**
     * @inheritdoc
     */
    public get Resolved(): Component<TSettings, TOptions>
    {
        return new Component(this.Generator, this);
    }
}

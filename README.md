# ExtendedYoGenerator
An extended version of the Yeoman-Generator

## Installing ExtendedYoGenerator
`ExtendedYoGenerator` can be installed using the `npm`-cli:
```bash
npm install --save @manuth/extended-yo-generator
```

## Using ExtendedYoGenerator
You can use the extended yo-generator by inheriting the `Generator`-class provided by the module.

All class members are documented using js-doc in order to provide the best possible user-experience.

### Example
First you might want to create an interface describing the settings of your generator where the prompting-answers are stored.

***./src/IMySettings.ts***
```ts
export interface IMySettings extends IGeneratorSettings
{
    /**
     * The name of the project to generate.
     */
    name: string;

    /**
     * The license-type of the project to generate.
     */
    licenseType: "apache" | "gpl";

    /**
     * The path to write the project to.
     */
    destination: string;
}
```

Now you're ready to create the actual generator-class:

***./src/index.ts***
```ts
import { Generator, IGeneratorSettings, Question } from "@manuth/extended-yo-generator";
import { IMySettings } from "./IMySettings";

export = class MyGenerator extends Generator<IMySettings>
{
    protected get TemplateRoot(): string
    {
        return "app";
    }

    protected get Questions(): Array<Question<IMySettings>>
    {
        return [
            {
                name: "name",
                message: "What's the name of your poject?",
                default: "example"
            }
        ];
    }

    public async prompting(): Promise<void>
    {
        this.log("Welcome to my generator!");
        return super.prompting();
    }

    public async writing(): Promise<void>
    {
        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            {
                Name: this.Settings.name
            });
        return super.writing();
    }

    public async install(): Promise<void>
    {
        await super.install();
        this.npmInstall();
    }

    public async end(): Promise<void>
    {
        await super.end();
        this.log("Finished!");
    }
}
```

## Features
  - [Separate Template-Folders](#separate-template-folders)
  - [Components](#components)
  - [Questions](#questions)
  - [Settings](#settings)
  - [ModulePath](#modulepath)
  - [Prompting](#prompting)
  - [Writing](#writing)
  - [Yo-Generator Methods](#yo-generator-methods)

### Separate Template-Folders
Generally all templates are loaded from `./templates`. The `TemplateRoot`-member of the `Generator`-class allows you to load template-files from separate sub-folders of `./templates`.

#### Example
```ts
export = class MyGenerator extends Generator
{
    protected get TemplateRoot(): string
    {
        return "app";
    }
}
```

This causes `this.templatePath(...path)` to create paths relative to `./templates/app` rather than `./templates`.

### Components
You can provide components the user can choose to install.  
Each component can provide any number of file-mappings and additional questions.

#### Example
```ts
export = class MyGenerator extends Generator<IMySettings>
{
    protected get Components(): IComponentCollection<IMySettings>
    {
        return {
            Question: "What should be included in your project?",
            Categories: [
                {
                    DisplayName: "General",
                    Components: [
                        {
                            ID: "Readme",
                            DisplayName: "README-File",
                            FileMappings: [
                                {
                                    Source: () => this.templatePath("README.md"),
                                    Context: (fileMapping, generator) =>
                                    {
                                        return {
                                            Name: generator.Settings.name
                                        };
                                    },
                                    Destination: "README.md"
                                }
                            ]
                        },
                        {
                            ID: "License",
                            DisplayName: "License-File",
                            Questions: [
                                {
                                    type: "list",
                                    name: "licenseType",
                                    message: "What kind of license do you want to use?",
                                    default: "gpl",
                                    choices: [
                                        {
                                            value: "gpl",
                                            name: "GNU GPL"
                                        },
                                        {
                                            value: "apache",
                                            name: "Apache-2.0"
                                        }
                                    ]
                                }
                            ],
                            FileMappings: [
                                {
                                    Source: (fileMapping, generator) =>
                                    {
                                        return this.templatePath(generator.Settings.licenseType === "gpl" ? "GPL.txt" : "Apache.txt");
                                    },
                                    Destination: "LICENSE"
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    }
}
```

The generator asks what components to install.  
If there are any questions declared for the component the generator will automatically ask them if the component has been checked.

The IDs of the components the user has chosen are then written to the `Generator.Settings[GeneratorSetting.Components]` member.

### Questions
Specify questions which are asked when invoking `Generator.prompting()`.  
All answers are stored in the `Generator.Settings`-property.

#### Example
```ts
export = class MyGenerator extends Generator<IMySettings>
{
    protected get Questions(): Array<Question<IMySettings>>
    {
        return [
            {
                name: "destination",
                message: "Where do you want to store the project?",
                default: "./"
            },
            {
                name: "name",
                message: "What's the name of your project?"
            }
        ];
    }
}
```

#### Manipulating Questions
You might want to ask questions after the user has chosen components.
You can reach this goal by manipulating the `QuestionCollection`-property like this:

```ts
export = class MyGenerator extends Generator<IMySettings>
{
    protected get QuestionCollection(): Array<Question<IMySettings>>
    {
        let result = super.QuestionCollection;
        result.push(
            {
                name: "destination",
                message: "Where do you want to store the project?",
                default: "./"
            });
    }
}
```

### Settings
The `Generator.Settings`-property contains all answers to the prompts.

### ModulePath
Using the `Generator.modulePath(...path)`-method you can create paths relative to the root of your generator-module.

This may be useful for instance if you want to copy your `tslint`-rules to the generated workspace:
```ts
export class = MyGenerator extends Generator
{
    public async writing(): Promise<void>
    {
        super.writing();
        this.fs.copy(this.modulePath("tslint.json"), this.destinationPath("tslint.json"));
    }
}
```

### Prompting
The `Generator.prompting()`-method asks all questions specified using `Generator.Questions` and `Generator.ProvidedComponents`.

#### Example
```ts
export = class MyGenerator extends Generator
{
    public async prompting(): Promise<void>
    {
        this.log("Welcome to my generator!");
        return super.prompting();
    }
}
```

### Writing
The `Generator.writing()`-method copies all `FileMapping`s of the components.

#### Example
```ts
export = class MyGenerator extends Generator
{
    public async writing(): Promise<void>
    {
        await super.writing();
        this.fs.copy(this.templatePath("package.json"), this.destinationPath("package.json"));
    }
}
```

### Yo-Generator Methods
Naturally the default yo-generator methods remain which are…
  * `prompting()`:  
    Asks all `Questions` and additionally all questions related to the `Components`
  * `writing()`:  
    Generates the project, automatically creating all specified file-mappings of the `Components`
  * `install()`:  
    This method can be used for installing the generated project
  * `end()`:  
    This method is invoked after the generator finished running

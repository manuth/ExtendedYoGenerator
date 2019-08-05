# ExtendedYoGenerator
An extended version of the Yeoman-Generator

## Installing ExtendedYoGenerator
`ExtendedYoGenerator` can be installed using the `npm`-cli:
```bash
npm install --save extended-yo-generator
```

## Using ExtendedYoGenerator
You can use the extended yo-generator by inheriting the `Generator`-class provided by the module.

All class members are documented using js-doc in order to provide the best possible user-experience.

### Example
***src/generators/index.ts***
```ts
import { Generator, IGeneratorSettings, Question } from "extended-yo-generator";

export = class MyGenerator extends Generator<IGeneratorSettings>
{
    protected get TemplateRoot()
    {
        return "app";
    }

    protected get Questions(): Array<Question<IGeneratorSettings>>
    {
        return [
            {
                name: "name",
                message: "What's the name of your poject?",
                default: "example"
            }
        ];
    }

    public async prompting()
    {
        this.log("Welcome to my generator!");
        return super.prompting();
    }

    public async writing()
    {
        this.fs.copyTpl(
            this.templatePath("README.md"),
            this.destinationPath("README.md"),
            {
                Name: this.Settings["name"]
            });
        return super.writing();
    }

    public async install()
    {
        await super.install();
        this.npmInstall();
    }

    public async end()
    {
        await super.end();
        this.log("Finished!");
    }
}
```

## Features
  - [Separate Template-Folders](#separate-template-folders)
  - [Questions](#questions)
  - [Components](#components)
  - [Settings](#settings)
  - [ModulePath](#modulepath)
  - [Prompting](#prompting)
  - [Writing](#writing)

### Separate Template-Folders
Generally all templates are loaded from `./templates`. The `TemplateRoot`-member of the `Generator`-class allows you to load template-files from a separate folder.

#### Example
```ts
    protected get TemplateRoot()
    {
        return "app";
    }
```

This causes `this.templatePath(...path)` to create paths relative to `./templates/app` rather than `./templates`.

### Questions
Specify questions which are asked when invoking `Generator.prompting()`.  
All answers are stored in the `Generator.Settings`-property.

#### Example
```ts
import { Question } from "extended-yo-generator";

export = class MyGenerator extends Generator<IGeneratorSettings>
{
    // [...]
    protected get Questions(): Question<T>[]
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

### Components
You can provide components the user can choose to install.  
Each component can provide any number of file-mappings and additional questions.

#### Example
```ts
import { Generator, IComponentProvider, IGeneratorSettings } from "extended-yo-generator";

export = class MyGenerator extends Generator<IGeneratorSettings>
{
    // [...]
    protected get ProvidedComponents(): IComponentProvider<IGeneratorSettings>
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
                                    Context: (settings) => {
                                        return {
                                            Name: settings["name"]
                                        };
                                    },
                                    Destination: "README.md"
                                }
                            ]
                        },
                        {
                            ID: "License",
                            DisplayName: "License-File",
                            FileMappings: [
                                {
                                    Source: (settings) =>
                                    {
                                        return this.templatePath(settings["licenseType"] === "gpl" ? "GPL.txt" : "Apache.txt");
                                    },
                                    Destination: "LICENSE"
                                }
                            ],
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

### Settings
The `Generator.Settings`-property contains all answers to the prompts.

### ModulePath
Using the `Generator.modulePath(...path)`-method you can create paths relative to the root of your generator-module.

This may be useful for instance if you want to copy your `tslint`-rules to the generated workspace:
```ts
this.fs.copy(this.modulePath("tslint.json"), this.destinationPath("tslint.json"));
```

### Prompting
The `Generator.prompting()`-method asks all questions specified using `Generator.Questions` and `Generator.ProvidedComponents`.

#### Example
```ts
export = class MyGenerator extends Generator<IGeneratorSettings>
{
    public async prompting()
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
export = class MyGenerator extends Generator<IGeneratorSettings>
{
    public async writing()
    {
        await super.writing();
        this.fs.copy(this.templatePath("package.json"),
        this.destinationPath("package.json"));
    }
}
```
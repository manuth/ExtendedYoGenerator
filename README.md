# ExtendedYoGenerator
An extended version of the Yeoman-Generator.

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

export = class MyGenerator<T extends IGeneratorSettings> extends Generator<T>
{
    protected get TemplateRoot()
    {
        return "app";
    }

    protected get Questions(): Question<T>[]
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
```

### Components
You can provide components the user can choose to install.  
Each component can provide any number of file-mappings and additional questions.

#### Example
```ts
import { Generator, IComponentProvider, IGeneratorSettings } from "extended-yo-generator";

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
```

The generator asks what components to install.  
If there are any questions declared for the component the generator will automatically ask them if the component has been checked.

Example:

![ComponentQuestions]

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
    public async prompting()
    {
        this.log("Welcome to my generator!");
        return super.prompting();
    }
```

### Writing
The `Generator.writing()`-method copies all `FileMapping`s of the components.

#### Example
```ts
    public async writing()
    {
        await super.writing();
        this.fs.copy(this.templatePath("package.json"),
        this.destinationPath("package.json"));
    }
```

<!-- Figures -->
[ComponentQuestions]: data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAecAAABYCAMAAAD4OM9yAAAACXBIWXMAAC4jAAAuIwF4pT92AAAAB3RJTUUH4gwFCggknDvmFQAAABl0RVh0Q29tbWVudABDcmVhdGVkIHdpdGggR0lNUFeBDhcAAAFiUExURQ2ZOg28ag28eRGJgBGJmxGbmxGbwhGorBGowhGozRKFLBKtSBK8ahK8eRV4WhV4gBWJgBWJrBWbmxWorBWowhWozRZoHha8eRdeHhdegBeJgBebwheorBeowheozRhFHhlAHhlAgBl4whmbrBmbwhmbzRseHhsegBuJrBuJzRweHhxAmxx4rBx4whyFah4eHh4eHx4eIh4eOh4eWR4eWh4efx4egB4fJR4iKB5Amx5FSB5Zmx5erB5/q1keHlkeWVkef1lZm1mbwVoeHlolK38eHn9Zm39/q3+bwX+rq3+rzIAeHoAoMZsfHpsrMZtZHptZWZubq5ubwZvBzKt/HqubWaubm6urq6urzKvBwavMq6vMzKwiHqwxK8GbWcGbf8Gbm8HBm8HBwcHBzMHMwcHMzMIlH8IxMcyrf8yrm8yrq8zBm8zBwczMq8zMwczMzM0oIs0rJc0xKM0xK80xMf///9Fb/VUAAAABYktHRHWoapj7AAALE0lEQVR42u2di3vjRhHACyL4zMNA03AukDTAJcUHRuXihLqRez3BHSCuT4dn4NrCBQyprQL9/z92dmd3Z1crS4p9ts+d+a5VpN0drfXT7EMa7bwQs3we5AW+BMyZZds437v9xa/4SaeXk1CJ08vrN8O6Sgo0kDTPZwsUPxnP3i2rWj592EzZ4Gjn7hba873b5s/xRF4ZD9vJWF2pEE2VtjDn86vFFAQ461qLP/ILPDbc68Rxr4V7Zwftdjuqx7nXef7b7Te+9gr+lYHBlnI+GT8zzqlBsTQxnMlNlHz5m/HZd3cN565gGtXStg2c793+ts/5X+NcGIho80SjJ5pUIRPSEObGeDBNFxCmk5u2/fTyo0urJfv35ez9fOpmwTSXcwbaRzmmwS0kOoyT8fWDq/xJUDX8n54dKvWE1HpkyiVf+uFx8vJ+0joWf7eAs9gIhv12uyvNe+fu4KgNmxi2cAskYhfSw6b/nNpzen1//AQ45xdwfX/zUNqCtQxpJk4nre1ZFoAda9qulmz2HqDys1y/Kf4bOXeSxJJNMc1w/uTj++MpUS0qglnw5tCq8Z7RtU7JPZpE/e6PXt2XgHuR4SwI9ncGRx1t3X3BuRfFcCS5dbgl9vzG1+1ALL1+608fP3iK1xZJ+JydJta22yLn+ZUkRAZnVksGt9D5lZtlBLrSmWvPcCeJbJhmOAuDTWd03JfNTHHJGVXr0aLhTCrfj4bf+s7ZvtjGZ/uHwPnsoBP3BNbhrjTy4S5yPvsemLyEvy2cv2oHHen0Vx/9+ZHhLO3M4yxsk7TbLmdllz5npQU5u1nSEGdx4F3453GmdZCc01nqcEbVurXQJUYO58FRd3BH4DxOIjUO62iGCQy+DOfhHrTUO9Lkt6V/tjKa/vEi+/1TY56Toj0rPJNye3ZgWC3Unt3hV+ZzPr38cDzRaeWcs6kpbu3Zzv4KtQaAHTmcFv+6vW6sISJn1WlrzrvHaui9NZx/+oVXLGcxqhkpk0BsqbBnNTIqmQXJtFIYVgty9rNABzvxx9tZLnYxDTZZHlAtKmGKm/5Zlb6wNbO7lLMYeL941+MMLTg2030YjqlRV791HOsue5s4Q9eoOcP1nmTXalRMRld0wKzSdAGZOPHabaUFObtZZCcwKcyrRvIEmDaSxX3OSokurqDqo5naYK0p557mDFA9zrIZjwxUOe4WCX210cNvfu65RDm/qphNF+frWdnzsLCIUdic1H4Ub49sLmdv6lbJ+fx34s6oKuI99phHUho7c37WklU/kPbsOXN6khqU2+W9LQy0t8mc+X3V50SYM3NmYc4szyXnBn4GlVnghRGOofDBdtzEaYEUt5lK9sp9Hm42wl+im0J4CA8jv36NIZ7KucQzNPczqHErmKw1OAeun3+meZyXcfnncA65KchnJxGM19XDk+GeuLaJ2tEuDDoNZ+K4p+mVz8wTxNuUc+UZmvsZLJVzPLd4JecVTOKLbgrwtFu+4EKO/W/cOZTPxQVk7cLgPgj3r3o156ZSeYbF/AzcLOYVpHkdDe+5dP6ADwI20dpfQLkGYHHnIeq1Lufo9Iurytf2T9AHm7opAGd4BI4sxW6/o99/oAtDmLNpTuV+8BkqctY5pXsD5hzc+f5BW5wF9nAT1T/DYn4GmMV1BjCgzOv/2PgEuA4GJqc6kX68TTmjFizn6vSKK6nvn4AHG7spAOfhXlezhLebO3fVe+uX0IWhzJ77hAK6MJTYs8yC7g0q5+Do1iEUQB1u8cozLOZnYN4405fEeHVG6m0TbbezmetgUERaOIhasJyr07N8ewfW80/Ag43dFMBMAIDsg7vorSA5n+1rFwZMo71n16WALgzzOCMk4+zQlYfVuzOveOUZFvMzwCxpiHNa5AwXlToY+JwnxYOoBcul1Zzr+yfgwcZuCuCkcGQcE+Tl73XQnrULg7b1PdnGhqwNXRjmccY3aZhTc4Z7qGOK1z3DYn4GlHNWzTmbug4GNew5JfYcx3U41/ZPoJybuCnABQesiiVeTcm539KvtqvbbXRhmG/PXewYzA2lFIhRoFe88gyL+Rk4nah2BsCrA/dHllPO4oh/3RxQmds/S2WoBcu5OsOca/sn4MHGbgruOEw5Gr0EnJN2tz5n40osp2Xh/lk10ZiTcJa9dVT7DOWc6/oZ6CyOM4BME21ziuVsgUns+yDILsGAypR3sCqulGktWK6okxQn1a/jn6APNnVTkBc8uYVzZHRagJGx6LS1C4M3f47MvLsd4ca4MAyOWtbuEmyi0YG4b8bb7Q5y1rN3XbzGGbb0uecN/BPonGzl0luFM9L2cW7qn6DvjuZuCkuRpL0Sn7Ot49zcP8F262vAzO+rWJgzC3NmYc7MmYU5szBnFubMwpxZmDMLc2ZhzizMmTmzMGcW5szCnFmYMwtzZmHOLMyZZRmcb7pqgCxXXJ6AZcM4a7f1hqsGAFn5HTOWC32jxLIezq9/Sjce54YS/IaqKD/769tkw7ISzq+9859f2I3D2TS8arUB9b0/DVlQXKUAzRjLqX03UkIc//yf/yAbllW124//+1uycexZgVJf+JuFBTBEgkTnrlJA1m6xnP2FDF7/7C9kw7K6/vmX/3ubbAqccTBmvvfH74olfHeVAtU/X7icvYUMiidjWRXnzz4lmwBnXI7FfO+vP4g1iwDIxOnDoD27Cxm89o4EjBuWDWq3qT070U3SfOKuUhDk7C9kwO32ejg/VgOwx8VxmOaVmf7Z5VxYpaC0f3ZOzOOwzZlX4XIBah0a/MJffe9vFqzI7bJe3jjMrDagGmw3UgLPqzboOQkLc2ZhzizMmYU5szBnFubMUptz07gJxvXA90EIrYKe5vnMzK3xJdYNfBdWusC6f+qavhIm4ujG2nOzuAmE87y176XQeKPkKUpj54MlcC55cFerJFn50VmSswZnWOu1S/KsIQbaDeMmlJpjAEYaCAl+M6NaI2fnbpWREupzHkBchVumRC9aQ0zDG8ZNAM6jfOpFLnCiGmC5IOfGvgtatdap6hkKkUDbpJOxSZOq3d+g9xydNFyDUwkbNwEjJdA4BmDeiVps9eWDYlSD2EalhbV9DyEW7QbYc424CeJSPLhSbiI2coEfKUHujdy4Gs7Ljfq+CyYMAj1DMESC2/dg5fVPCdmzX2sdUMOpBI2bgJESII4B2OZPDuUqzcpgdXCDQlAEyzmR0XFaa+LcMG7C6eUnV+hVVIhxYCjgOvXBdruh78JIL6tv1r6PS0IkmDbp/ljgxcrrtBBnV2dJJWjcBIyUoJZn3sEjSBUXTy4GRbCL8iY7P95rvbq/Ls7N4iaYtbgDa9/TbrmKc7XvglVmAzSYigZCJJjf8Ohq+ugpVn4e5zTE2a+EFzcBIiUozi21oH6E9oqcvagGNiA8cIYjw90NmD/XiJsgDvxadlgVnLPa9jzfd4Fyzma2FsUQCeY3fPDh+A9TrHwl58znHKoEGT3reBXJjhxSybAYlLMXFKFvR2Gqf07W1T83jJsgjt8fGx8wckfQSAkYj6Ccc33fBVRNYhyo1rkYIkEXePr3i/RvuvJ2xX7HVVnuuTqJFloJup4+RkrAcGVgyMO9yMQ4wEXvoxBmOR8bHEHf3tkIzjXiJkCW3Itc4EQ1MPEIKGf0Omjsu6BV2xgHpqZeiARzIrhXdeUNZ/ob9J6rk8R+IJWgnDE2go5K0BdN8w90jAMdxMKJanB2gIFn1Lwb0lYeKv75fu5ZGSLhGcrGPvraPs7VIRKY8xZwztb6gR5zZmHOLMyZhTmzLCb/B5EN6eI6xAUzAAAAAElFTkSuQmCC
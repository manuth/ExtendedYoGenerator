# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## ExtendedYoGenerator [Unreleased]

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v12.1.2...dev)

## ExtendedYoGenerator v12.1.2
### Updated
  - The `TestContext.ResetSettings` method to also reset the `destinationRoot` of the generator
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v12.1.1...v12.1.2)

## ExtendedYoGenerator v12.1.1
### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v12.0.2...v12.1.1)

## ExtendedYoGenerator v12.0.2
### Fixed
  - Error when using custom prompts in generators based on ESModules

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v12.0.1...v12.0.2)

## ExtendedYoGenerator v12.0.1
### Fixed
  - Errors when creating generators based on ESModules

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v12.0.0...v12.0.1)

## ExtendedYoGenerator v12.0.0
### Breaking
  - Converted the package to an ESModule

### Updated
  - All dependencies
  - `bumpVersion` scripts for updating cross-workspace dependencies properly

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.7...v12.0.0)

## ExtendedYoGenerator v11.0.7
### Fixed
  - Vulnerabilities in dependencies

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.6...v11.0.7)

## ExtendedYoGenerator v11.0.6
### Fixed
  - Vulnerabilities in dependencies
  - Broken vscode settings
  - Broken unit tests

### Updated
  - All dependencies
  - Workspace to work with `npm` instead of `lerna`
  - Type declarations thoroughly
  - Test timeouts
  - Linting environment

### Removed
  - Unnecessary scripts

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.5...v11.0.6)

## ExtendedYoGenerator v11.0.5
### Fixed
  - An error in the `BaseGeneratorFactory` which caused caused multiple instances of the same `BaseGeneratorFactory`-class to overwrite each other

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.4...v11.0.5)

## ExtendedYoGenerator v11.0.4
### Fixed
  - Broken `ObjectExtensionFactory` by fixing type-declarations

### Added
  - Tests for the `ObjectExtensionFactory` type-declaration

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.3...v11.0.4)

## ExtendedYoGenerator v11.0.3
### Fixed
  - Broken type-declarations

### Added
  - Tests for type-declarations

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.2...v11.0.3)

## ExtendedYoGenerator v11.0.2
### Fixed
  - Broken release-scripts
  - Drone-pipeline to prevent package-creation from being skipped

### Updated
  - All dependencies
  - Settings to disable timeouts for mocha unit-tests

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.1...v11.0.2)

## ExtendedYoGenerator v11.0.1
### Added
  - Support for passing custom arguments and options to `@manuth/extended-yo-generator-test`'s `TestContext.CreateGenerator`-method
  - Missing dependencies

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v11.0.0...v11.0.1)

## ExtendedYoGenerator v11.0.0
### Breaking
  - Rename the `FileMappingOptions.WriteDestination`-method to `WriteOutput`

### Updated
  - All dependencies
  - The `README`-file according to the new API

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v10.0.0...v11.0.0)

## ExtendedYoGenerator v10.0.0
### Breaking
  - Replaced `FileMappingTester.Content` with `FileMappingTester.ReadSource()`
  - Replaced `JSONFileMappingTester.Metadata` with `JSONFileMappingTester.ParseSource()`
  - Renamed `FileMappingTester.WriteDestination()` with `FileMappingTester.WriteOutput()`

### Added
  - Added method `FileMappingTester.ReadOutput()` for reading the output-file and `FileMappingTester.ReadFile()` for reading any file
  - Added method `JSONFileMappingTester.ParseOutput()` for parsing the output-file and `JSONFileMappingTester.Parse()` for parsing text

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v9.1.1...v10.0.0)

## ExtendedYoGenerator v9.1.1
### Added
  - Support for replacing objects of `PropertyResolver`s

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v9.1.0...v9.1.1)

## ExtendedYoGenerator v9.1.0
### Fixed
  - Broken code in the `PropertyResolver`-class
  - Drone-pipelines by preventing files from being removed

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v9.0.3...v9.1.0)

## ExtendedYoGenerator v9.0.3
### Fixed
  - `GeneratorConstructor` to use the actually passed arguments and options

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v9.0.2...v9.0.3)

## ExtendedYoGenerator v9.0.2
### Fixed
  - `ObjectExtensionFactory` for the use with generators which provide `customPriorities`
  - Broken unit-tests

### Added
  - Missing dependency

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v9.0.1...v9.0.2)

## ExtendedYoGenerator v9.0.1
### Fixed
  - `ObjectExtensionFactory` for the use with generic base-classes

### Added
  - Support for parallel step-execution in drone pipelines

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v9.0.0...v9.0.1)

## ExtendedYoGenerator v9.0.0
### Breaking
  - Renamed `CompositeGeneratorConstructor` to `GeneratorExtensionConstructor`
  - Renamed `IBaseGenerator` (interface) to `GeneratorExtension` (abstract class)

### Fixed
  - Vulnerabilities in dependencies
  - TypeScript-settings

### Updated
  - All dependencies
  - Settings for improving the debug-experience
  - Settings for opening the terminal inside the correct directory
  - `ComponentCollection.Categories`, `ComponentCategory.Components`, `Component.Questions` and `Component.FileMappings` to allow users to post-edit the collections

### Added
  - Support for the Test Explorer UI
  - Support for the `ts-nameof` plugin
  - Support for adding an ID to component-categories and file-mappings
  - Missing extensions
  - Support for instantiating generators using the `TestContext`

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v8.0.4...v9.0.0)

## ExtendedYoGenerator v8.0.4
### Fixed
  - Vulnerabilities in dependencies

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v8.0.3...v8.0.4)

## ExtendedYoGenerator v8.0.3
### Fixed
  - The module by adding a missing dependency

### Added
  - A missing dependency

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v8.0.2...v8.0.3)

## ExtendedYoGenerator v8.0.2
### Fixed
  - Issue caused by `yeoman-environment` and `yeoman-generator@5`  
    For more information, see [yeoman/environment#309](https://github.com/yeoman/environment/issues/309)

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v8.0.1...v8.0.2)

## ExtendedYoGenerator v8.0.1
### Updated
  - The `yeoman-generator` type-declarations
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v8.0.0...v8.0.1)

## ExtendedYoGenerator v8.0.0
### Breaking
  - Updated yeoman-dependencies which requires `yo@4.0.0^` to be installed in order to run generators using `ExtendedYoGenerator`

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.5.3...v8.0.0)

## ExtendedYoGenerator v7.5.3
### Fixed
  - Vulnerabilities in dependencies
  - Broken drone-pipelines

### Added
  - A workflow for merging Dependabot-PRs
  - A workflow for analyzing the code

### Updated
  - Drone-pipelines to use small-sized images
  - Dependencies of the package
  - The `yeoman-test`-dependency
  - Update tests as preparation for a yeoman-update

### Removed
  - Unnecessary dependencies
  - Dependabot-settings for redundant directories

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.5.1...v7.5.3)

## ExtendedYoGenerator v7.5.1
### Fixed
  - Vulnerabilities in dependencies

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.5.0...v7.5.1)

## ExtendedYoGenerator v7.5.0
  - Refactored typescript-settings
  - Reordered export-statements

### Added
  - Missing exports

### Fixed
  - Broken Dependabot-settings

### Updated
  - All packages

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.4.0...v7.5.0)

## ExtendedYoGenerator v7.4.0
### Fixed
  - Incorrect types for composed constructors

### Updated
  - All packages
  - The development-environment

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.3.3...v7.4.0)

## ExtendedYoGenerator v7.3.3
### Added
  - Export-statements for missing components
  - Support for specifying the constructor of any generator using the `GeneratorConstructor<T>` type

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.3.1...v7.3.3)

## ExtendedYoGenerator v7.3.2
### Added
  - Support for making `IComponent.FileMappings` resolvable

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.3.1...v7.3.2)

## ExtendedYoGenerator v7.3.1
### Updated
  - The `README` file for better understanding

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.3.0...v7.3.1)

## ExtendedYoGenerator v7.3.0
This release brings back support for resolvable properties, though all properties (except for `IFileMapping.Context`) must be synchronous.

### Added
  - Support for synchronous resolvable values in `IFileMapping`s

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.2.0...v7.3.0)

## ExtendedYoGenerator v7.2.0
In this release, handling file-mappings has been made easier by dropping support for resolvable properties which turned out to be quite useless for common use-cases.

### Removed
  - Support for resolvable values in file-mappings

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.1.0...v7.2.0)

## ExtendedYoGenerator v7.1.0
### Added
  - Support for promise-typed file-mappings

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.0.3...v7.1.0)

## ExtendedYoGenerator v7.0.3
### Fixed
  - A bug which prevented `FileMapping.Processor`s from working correctly

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.0.2...v7.0.3)

## ExtendedYoGenerator v7.0.2
### Fixed
  - Malformed `npm`-scripts

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.0.1...v7.0.2)

## ExtendedYoGenerator v7.0.1
### Fixed
  - A bug which prevented some paths from working with `Generator.ComposeWith`

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v7.0.0...v7.0.1)

## ExtendedYoGenerator v7.0.0
This release brings a handy new feature for making extending generators easier. Additionally a few classes have been added to the `extended-yo-generator-test` which allow you to test the integrity of file-mappings including file-mappings written in JSON and JavaScript.

### `extended-yo-generator`
#### Added
  - A `Generator.ComposeWith`-method for inheriting generators

### `extended-yo-generator-test`
#### Added
  - Classes for testing general file-mappings, file-mappings written in JavaScript and file-mappings written in JSON
  - An instance of `random-js`' `Random` class to the `TestContext` for generating random values

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v6.0.0...v7.0.0)


## ExtendedYoGenerator v6.0.0
### Breaking
  - Reverted the `destinationRoot` behavior

### Fixed
  - Nonfunctioning TypeScript intellisense

### Added
  - Support for setting the `moduleRoot` of `TestGenerator`s
  - Default `GeneratorOptions` for initializing generators
  - A method for resetting generator-settings in a `TestContext`
  - Public members to the `Generator` for improving the support for extending existing generators

### Updated
  - All packages

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v5.0.0...v6.0.0)

## ExtendedYoGenerator v5.0.0
### Breaking
  - `destinationRoot`s default behavior:
    - Invoking `Generator.destinationRoot` doesn't cause the current working directory to change anymore but. Pass `false` as the second argument to get the original behavior.

### Fixed
  - `yeoman-generator`s behavior which caused the current working-directory to change

### Added
  - Automated updates of the `.npmignore` file

### Updated
  - All dependencies
  - Unit-tests to look consistent

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.3.0...v5.0.0)

## ExtendedYoGenerator v4.3.0
### Added
  - Support for the `initializing()`-method
  - `TestGenerator` class for testing generator-components
  - A default `TestContext.Default` for said `TestGenerator`
  - Mocha-tests for the new classes

### Updated
  - All packages
  - Mocha-test layout

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.2.2...v4.3.0)

## ExtendedYoGenerator v4.2.2
### Fixed
  - Incorrect `thisArg` when resolving `FileMapping.Promise`

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.2.1...v4.2.2)

## ExtendedYoGenerator v4.2.1
### Fixed
  - Incorrect `thisArg` when resolving `ResolveFunction`s

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.2.0...v4.2.1)

## ExtendedYoGenerator v4.2.0
### Added
  - Essential components to the module-exports:
    - `Component` which provides the functionality to resolve `IComponent` objects
    - `ComponentCategory` which provides the functionality to resolve `IComponentCategory` objects
    - `ComponentCollection` which provides the functionality to resolve `IComponentCollection` objects
    - `FileMapping` which provides the functionality to resolve `IFileMapping` objects
    - `PathResolver` which is used in the `FileMapping` class for resolving partial paths
    - `IGenerator` which represents an object with the most popular public members of the `Generator` class

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.1.0...v4.2.0)

## ExtendedYoGenerator v4.1.0
### Added
  - A method `Generator.commonTemplatePath(...path)` for resolving paths relative to `./templates`

### Updated
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.0.1...v4.1.0)

## ExtendedYoGenerator v4.0.1
### Fixed
  - Task for bumping version-numbers

### Updated
  - The `homepage` links of the packages

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v4.0.0...v4.0.1)

## ExtendedYoGenerator v4.0.0
### Added
  - A module for testing `ExtendedYoGenerator`s
  - Tests for the `ExtendedYoGeneratorTest` package

### Fixed
  - Constructor of the `Generator` class to allow any type for the `option` argument

### Updated
  - All dependencies
  - The lint-scripts for improving the linting-experience

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v3.1.2...v4.0.0)

## ExtendedYoGenerator v3.1.2
### Added
  - Missing sections in the `README` file

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v3.1.1...v3.1.2)

## ExtendedYoGenerator v3.1.1
### Fixed
  - Incorrect member-visibility of `Generator.FileMappings`

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v3.1.0...v3.1.1)

## ExtendedYoGenerator v3.1.0
### Added
  - Add a property for declaring file-mappings

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v3.0.1...v3.1.0)

## ExtendedYoGenerator v3.0.1
### Updated
  - The `README` file to match the new package-name

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v3.0.0...v3.0.1)

## ExtendedYoGenerator v3.0.0
### Updated
  - Test-code for more comfortable type-checking
  - Directory structure of the unit-tests
  - The typescript-library

### Breaking
  - Renamed the module to `@manuth/extended-yo-generator`
  - Renamed the export-member `GeneratorSetting` to `GeneratorSettingKey`

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v2.0.0...v3.0.0)

## ExtendedYoGenerator v2.0.0
### Breaking
  - The `ProvidedComponents`-property has been replaced by `Components`

### Added
  - Continuous integration for automated publishing
  - Tests for all classes
  - A property called `QuestionCollection` for manipulating all questions

### Updated
  - The CHANGELOG-file to match with the proposed format
  - All dependencies
  - Object-naming for better understanding
  - The generator-code to only allow methods to be executed after initialization
  - Object-structure for more simple usage of lazy-loaded component-properties
  - Mocha-configuration for improving the testing-experience
  - Refactor classes for enhanced testing

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.13...v2.0.0)

## ExtendedYoGenerator v1.0.13
### Updated
  - Type-declarations for better auto-completion

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.12...v1.0.13)

## ExtendedYoGenerator v1.0.12
### Updated
  - Type-declarations for better auto-completion

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.11...v1.0.12)

## ExtendedYoGenerator v1.0.11
### Updated
  - The README-file for better understanding
  - All dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.10...v1.0.11)

## ExtendedYoGenerator v1.0.10
  - Update vulnerable packages

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.9...v1.0.10)

## ExtendedYoGenerator v1.0.9
### Added
  - Exports for important classes and type-declarations

### Security
  - Updated vulnerable dependencies

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.8...v1.0.9)

## ExtendedYoGenerator v1.0.8
### Added
  - Predefined `tslint` presets for better linting experience

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.7...v1.0.8)

## ExtendedYoGenerator v1.0.7
### Updated
  - The mocha-integration for better testing-experience
  - The user-interface

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.6...v1.0.7)

## ExtendedYoGenerator v1.0.6
### Updated
  - The package to exclude `.map`-files, which are meant for debugging purposes only
  - The description of the package

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.5...v1.0.6)

## ExtendedYoGenerator v1.0.5
### Fixed
  - The README-file by replacing the `data://`-picture by an actual file

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.4...v1.0.5)

## ExtendedYoGenerator v1.0.4
### Updated
  - Both the README and the CHANGELOG-file

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.3...v1.0.4)

## ExtendedYoGenerator v1.0.3
### Updated
  - The generator-code to process all component file-mappings sequentially
  - The UI for making component-questions more distinguishable

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.2...v1.0.3)

## ExtendedYoGenerator v1.0.2
### Updated
  - The type-definitions for improving user-experience

### Fixed
  - Errors when invoking `templatePath()` before the `Generator` is initialized

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.1...v1.0.2)

## ExtendedYoGenerator v1.0.1
### Fixed
  - Errors when invoking `modulePath()` before the `Generator` is initialized

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v1.0.0...v1.0.1)

## ExtendedYoGenerator v1.0.0
  - First release of the module

### Added
  - An object-oriented implementation of the yeoman-generator
  - A method for resolving paths relative to the generator-module
  - Unit-tests for ensuring the functionality

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/858f05445c3614ec09956c24f5ef4fd10edb990a...v1.0.0)

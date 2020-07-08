# Changelog
All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## ExtendedYoGenerator [Unreleased]
### Added
  - Add a property for declaring file-mappings

[Show differences](https://github.com/manuth/ExtendedYoGenerator/compare/v3.0.1...dev)

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
  - The generator-code to process all component filemappings sequentially
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

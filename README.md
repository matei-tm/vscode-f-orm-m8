# Flutter ORM M8 Generator

VS Code extension to generate database adapters based on [flutter-orm-m8](https://github.com/matei-tm/flutter-orm-m8) framework for Flutter application

## Introduction

This VS Code extension scaffolds a Flutter project, adding [flutter-orm-m8](https://github.com/matei-tm/flutter-orm-m8) dependencies and framework.
The current framework integrates [sqlite-m8-generator](https://github.com/matei-tm/flutter-sqlite-m8-generator) engine and is dedicated for SQLite data repository.
In the future, we plan to extend the generator engines to other data repository types.

## Features

- Check if the projects is a Flutter one, and add the required dependencies to pubspec.yaml
- Generates the [flutter-orm-m8](https://github.com/matei-tm/flutter-orm-m8) framework folder structure
- Entering the model name, the user have the possibility to generate templated starter models implementing:
  *  DbEntity
  *  DbAccountEntity
  *  DbAccountRelatedEntity
- Parse the existing and newly created models annotations and generates, according to [flutter-orm-m8](https://github.com/matei-tm/flutter-orm-m8) annotation system, the fixture and the database adapter

## Requirements

- The Flutter extension [dart-code.flutter](https://github.com/Dart-Code/Flutter) 
- The Dart extension [dart-code.dart-code](https://github.com/Dart-Code/Dart-Code)

## Installation

[Install from the Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=matei-tm.flutter-orm-m8) or by [searching within VS Code](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension).

## Documentation

Please see:

* [Flutter-ORM-M8 Generator documentation for using VS Code](https://matei-tm.github.io/vscode-flutter-orm-m8/).
* [flutter-orm-m8 documentation](https://github.com/matei-tm/flutter-orm-m8)
* [sqlite-m8-generator documentation](https://github.com/matei-tm/flutter-sqlite-m8-generator)

## Changelog

0.1.0

* initial version
* flutter-orm-m8 implementation
* flutter-sqlite-m8-generator implementation
* user input based, template generation for models implementing:
  *  DbEntity
  *  DbAccountEntity
  *  DbAccountRelatedEntity
* dart generation for SQLite fixture based on flutter-sqlite-m8-generator
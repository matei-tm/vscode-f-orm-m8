# Flutter ORM M8 Generator

VS Code extension to generate models and database adapter based on [f-orm-m8](https://github.com/matei-tm/f-orm-m8) framework for Flutter application

[![GitHub release](https://img.shields.io/github/release-pre/matei-tm/vscode-f-orm-m8.svg)](https://github.com/matei-tm/vscode-f-orm-m8/releases/)
[![vs marketplace version](https://img.shields.io/visual-studio-marketplace/v/matei-tm.f-orm-m8-generator.svg)](https://marketplace.visualstudio.com/items?itemName=matei-tm.f-orm-m8-generator)
[![license](https://img.shields.io/github/license/matei-tm/vscode-f-orm-m8.svg)](LICENSE)

![Showcase](https://github.com/matei-tm/vscode-f-orm-m8/blob/develop/docs/media/showcase.gif?raw=true)

- [Flutter ORM M8 Generator](#flutter-orm-m8-generator)
  - [Introduction](#introduction)
  - [Features](#features)
  - [Requirements](#requirements)
  - [Installation](#installation)
  - [Documentation](#documentation)
  - [Changelog](#changelog)
  - [Disclaimer](#disclaimer)

## Introduction

This VS Code extension scaffolds a Flutter project, adding [f-orm-m8](https://github.com/matei-tm/f-orm-m8) dependencies and framework.
The current framework integrates [f-orm-m8-sqlite](https://github.com/matei-tm/f-orm-m8-sqlite) generator engine and is dedicated for SQLite data repository.
In the future, we plan to extend the generator engines to other data repository types.

## Features

- Check if the project is a Flutter one, and add the required dependencies to pubspec.yaml
- Generates the [f-orm-m8](https://github.com/matei-tm/f-orm-m8) framework folder structure
- Entering the model name, the user have the possibility to generate templated starter models implementing:
  *  DbEntity
  *  DbAccountEntity
  *  DbAccountRelatedEntity
- Parse the existing and newly created models annotations and generates, according to [f-orm-m8](https://github.com/matei-tm/f-orm-m8) annotation system, the fixture and the database adapter

## Requirements

- The Flutter extension [dart-code.flutter](https://github.com/Dart-Code/Flutter) 
- The Dart extension [dart-code.dart-code](https://github.com/Dart-Code/Dart-Code)

## Installation

[Install from the Visual Studio Code Marketplace](https://marketplace.visualstudio.com/items?itemName=matei-tm.f-orm-m8) or by [searching within VS Code](https://code.visualstudio.com/docs/editor/extension-gallery#_search-for-an-extension).

## Documentation

The extension registers two commands (accessible from `Command Palette...`):

- `f-orm-m8: Generate Sqlite Fixture` - to interactively generate `f-orm-m8` compatible models and fixture
- `f-orm-m8: Regenerate` - to regenerate fixture after direct user changes

For more details, please see:

* [Flutter-ORM-M8 Generator documentation for using VS Code](https://matei-tm.github.io/vscode-f-orm-m8/).
* [f-orm-m8 documentation](https://github.com/matei-tm/f-orm-m8)
* [f-orm-m8-sqlite generator documentation](https://github.com/matei-tm/f-orm-m8-sqlite)
* [f-orm-m8-sqlite generator example](https://github.com/matei-tm/f-orm-m8-sqlite/tree/master/example)

## Changelog

Please see project's [changelog](https://github.com/matei-tm/vscode-f-orm-m8/blob/master/CHANGELOG.md) 

## Disclaimer

**Important:** 
This extension, being a code generator, will create files and folders on the hard drive. Use a suitable source control system (eg, git) to protect your code from transient changes. The generator creates or updates, in the current Flutter project, the following files/folders:

- pubspec.yaml
- lib/models/*.dart
- lib/main.adapter.g.m8.dart

Although I should not overwrite any file, other than those mentioned, during this process, I do not provide any warranty or take any responsibility for the loss of data.

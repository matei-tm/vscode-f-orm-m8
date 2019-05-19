# Change Log
All notable changes to the "f-orm-m8-generator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

### Changed

* Documentation update

## [0.1.2] - 2019-05-19

### Changed

* Package icon rebranding

## [0.1.1] - 2019-05-19

### Fix

* Showcase url

## [0.1.0] - 2019-05-19

### Added

* initial version
* f-orm-m8 implementation
* f-orm-m8-sqlite implementation
* user input based, template generation for models implementing:
  *  DbEntity
  *  DbAccountEntity
  *  DbAccountRelatedEntity
* dart generation for SQLite fixture based on f-orm-m8-sqlite
  * checking flutter project validity
  * required pubspec dependencies
  * required models folder
  * running build-runner tasks (clean & build)
* dart regeneration of models if user altered the files
  * running build-runner tasks (clean & build)
* vscode command "f-orm-m8: Generate Sqlite Fixture"
* vscode command "f-orm-m8: Regenerate"
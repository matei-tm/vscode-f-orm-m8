# Change Log
All notable changes to the "f-orm-m8-generator" extension will be documented in this file.

Check [Keep a Changelog](http://keepachangelog.com/) for recommendations on how to structure this file.

## [Unreleased]

## [0.2.1] - 2020-07-19

### Changed

* Update all the outdated packages
* Update vulnerable lodash package 4.17.15 to 4.17.19

## [0.2.0] - 2020-04-18

### Changed

* Updating the project structure to be inline with the latest template (yo code)
* Update all the outdated packages
* Changing test framework
* Switching from tslint to eslint

## [0.1.8] - 2019-06-05

### Changed

* Update on outdated packages
* Pin the Azure CI to node 10.x

## [0.1.7] - 2019-06-05

### Changed

* Documentation update

## [0.1.6] - 2019-05-26

### Fixed

* Format and linter warnings
* Removed old parser files

## [0.1.5] - 2019-05-24

### Fixed

* Documentation marketplace url

### Changed

* Package icon update

## [0.1.4] - 2019-05-20

### Changed

* Documentation update
  
## [0.1.3] - 2019-05-19

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
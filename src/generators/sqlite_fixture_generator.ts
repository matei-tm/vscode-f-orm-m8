import * as vscode from "vscode";
import { promisify } from 'util';
import * as fs from 'fs';
import getAbstractDatabaseHelper from '../templates/database/abstract_database_helper';
import { DependenciesSolver } from "../utils/dependencies_solver";
import { showError, showInfo, showCriticalError } from "../helper/messaging";

import getDbEntityAbstractContent from "../templates/database/db_entity";
import * as Path from 'path';
import getConcreteUserAccountContent from "../templates/models/concrete_user_account";
import getDatabaseAnnotationsHelper from "../templates/database/database_annotations";
import getConcreteAccountRelatedEntitySkeletonContent from "../templates/models/concrete_account_related_entity";
import { Utils } from "../utils/utils";
import { ModelsFolderParser } from "../parser/models_folder_parser";
import { FileManager } from "./file_manager";
import { FolderManager } from "./folder_manager";
import { DatabaseHelpersGenerator } from "./database_helpers_generator";
import getConcreteIndependentEntitySkeletonContent from "../templates/models/concrete_independent_entity";


const writeFile = promisify(fs.writeFile);

const newIndependentModelInputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: 'YourNewModelName',
    prompt: 'Input your INDEPENDENT model name in pascal case (Ex: YourNewModel).',
    ignoreFocusOut: true,
    validateInput: (value) => {
        if (!value.match("^[A-Z][A-z0-9]+$")) {
            return 'The model name is not validated as PascalCase. Fix the name if you need this model. If you want to exit press ESC. ';
        }
    }
};

const newAccountRelatedModelInputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: 'YourNewModelName',
    prompt: 'Input your ACCOUNT RELATED model name in pascal case (Ex: YourNewModel).',
    ignoreFocusOut: true,
    validateInput: (value) => {
        if (!value.match("^[A-Z][A-z0-9]+$")) {
            return 'The model name is not validated as PascalCase. Fix the name if you need this model. If you want to exit press ESC. ';
        }
    }
};

export class SqliteFixtureGenerator {

    private currentFolder: fs.PathLike | undefined;
    private extensionVersion: any;

    private packageName: string = "";
    private folderManager: FolderManager;

    constructor(extensionContext: vscode.ExtensionContext) {
        this.extensionVersion = this.getExtensionVersion(extensionContext);
        this.currentFolder = vscode.workspace.rootPath;

        this.folderManager = new FolderManager(this.currentFolder);
    }

    async generateSqliteFixture() {
        if (this.extensionVersion === undefined) {
            return;
        }

        if (!this.isFlutterProjectOnCurrentFolder()) {
            return;
        }

        this.packageName = await this.addOrUpdateDependencyOnSqflite();
        if (this.packageName === undefined || this.packageName === "") {
            showError(new Error("The package name is missing"), true);
            return;
        }

        await this.addAbstractDatabaseHelper();
        await this.addDatabaseAnnotationsMetadata();
        await this.addDbEntity();

        await this.addUserAccountModelFile();

        await this.processModelFiles();

        showInfo('Flutter: Generate Sqlite Fixture was successful!');
    }

    private getExtensionVersion(extensionContext: vscode.ExtensionContext): any {

        try {
            var extensionPath = Path.join(extensionContext.extensionPath, "package.json");
            var packageFile = JSON.parse(fs.readFileSync(extensionPath, 'utf8'));

            if (packageFile) {
                return packageFile.version;
            }
            else {
                showError(new Error("The version attribute is missing"), true);
            }
        }
        catch (error) {
            showCriticalError(error);
        }

        return undefined;
    }

    private isFlutterProjectOnCurrentFolder(): boolean {
        var currentWorkspace = vscode.workspace;

        if (currentWorkspace === undefined || currentWorkspace.name === undefined) {
            showError(new Error('A Flutter workspace is not opened in the current session.'), false);
            return false;
        }

        var currentFolder = currentWorkspace.rootPath;

        if (currentFolder === undefined) {
            showError(new Error('A Flutter folder is not opened in the current workspace.'), false);
            return false;
        }

        if (!fs.existsSync(currentFolder + "/pubspec.yaml")) {
            showError(new Error('The current folder is not a Flutter one, or an inner folder is opened. Open the Flutter project root folder.'), false);
            return false;
        }

        return true;
    }

    private async  addOrUpdateDependencyOnSqflite(): Promise<string> {
        return DependenciesSolver.solveDependencyOnSqflite(this.currentFolder);
    }

    private async  addAbstractDatabaseHelper() {
        const abstractDatabaseHelperContent = getAbstractDatabaseHelper(this.extensionVersion);

        var abstractDatabaseHelperFilePath = Path.join(this.folderManager.helpersDatabaseFolderPath, "abstract_database_helper.dart");

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }

    private async  addDatabaseAnnotationsMetadata() {
        const abstractDatabaseHelperContent = getDatabaseAnnotationsHelper(this.extensionVersion);

        var abstractDatabaseHelperFilePath = Path.join(this.folderManager.helpersDatabaseFolderPath, "database_annotations.dart");

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }

    private async  addDbEntity() {
        const abstractDatabaseHelperContent = getDbEntityAbstractContent(this.extensionVersion);

        var abstractDatabaseHelperFilePath = Path.join(this.folderManager.helpersDatabaseFolderPath, "db_entity.dart");

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }

    private async addUserAccountModelFile() {

        var dbUserAccountModelPath = Path.join(this.folderManager.modelsFolderPath, "user_account.dart");

        try {
            var concreteUserAccountContent = getConcreteUserAccountContent(this.extensionVersion, this.packageName);
            await writeFile(dbUserAccountModelPath, concreteUserAccountContent, 'utf8');

            console.log(`The file ${dbUserAccountModelPath} was created.`);
        } catch (error) {
            console.log(`Something went wrong. The content file for ${dbUserAccountModelPath} was not created.`);
            showCriticalError(error);
            return;
        }
    }

    private async processModelFiles() {
        var databaseHelpersGenerator = new DatabaseHelpersGenerator(this.folderManager.helpersDatabaseFolderPath, this.packageName, this.extensionVersion);

        var modelsFolderParser: ModelsFolderParser = new ModelsFolderParser(this.folderManager, databaseHelpersGenerator);
        var existingAccountRelatedModelsList = await modelsFolderParser.parseAccountRelatedFolderExistingContent();
        var existingIndependentModelsList = await modelsFolderParser.parseIndependentFolderExistingContent();

        var newIndependentModelsNameInPascalCaseList: string[] = await this.addNewModelFiles(databaseHelpersGenerator, false);
        var newAccountRelatedModelsNameInPascalCaseList: string[] = await this.addNewModelFiles(databaseHelpersGenerator, true);

        var allModelsList = newIndependentModelsNameInPascalCaseList.concat(existingIndependentModelsList, "UserAccount", newAccountRelatedModelsNameInPascalCaseList, existingAccountRelatedModelsList);

        databaseHelpersGenerator.addUserAccountDatabaseHelper();

        databaseHelpersGenerator.addDatabaseHelper(allModelsList);

    }

    private async addNewModelFiles(databaseHelpersGenerator: DatabaseHelpersGenerator, isAccountRelated: boolean): Promise<string[]> {
        var newModelsNameInPascalCaseList: string[] = [];

        while (true) {
            var dbModelNameInPascalCase: string | undefined;

            if (isAccountRelated === true) {
                dbModelNameInPascalCase = await vscode.window.showInputBox(newAccountRelatedModelInputBoxOptions);
            }
            else {
                dbModelNameInPascalCase = await vscode.window.showInputBox(newIndependentModelInputBoxOptions);
            }

            if (!dbModelNameInPascalCase) {
                break;
            }

            if (dbModelNameInPascalCase === undefined) {
                showInfo('Invalid model name');
                break;
            }

            newModelsNameInPascalCaseList.push(dbModelNameInPascalCase);

            var modelData: string;
            var dbModelPath;
            var modelFileName: string = Utils.getUnderscoreCase(dbModelNameInPascalCase);

            if (isAccountRelated === true) {
                databaseHelpersGenerator.addConcreteAccountRelatedEntityDatabaseHelper(dbModelNameInPascalCase);
                modelData = getConcreteAccountRelatedEntitySkeletonContent(this.extensionVersion, this.packageName, dbModelNameInPascalCase);
                dbModelPath = Path.join(this.folderManager.accountRelatedModelsFolderPath, modelFileName + ".dart");
            }
            else {
                databaseHelpersGenerator.addConcreteIndependentEntityDatabaseHelper(dbModelNameInPascalCase);
                modelData = getConcreteIndependentEntitySkeletonContent(this.extensionVersion, this.packageName, dbModelNameInPascalCase);
                dbModelPath = Path.join(this.folderManager.independentModelsFolderPath, modelFileName + ".dart");
            }

            try {
                await writeFile(dbModelPath, modelData, 'utf8');

                console.log(`The file ${dbModelPath} was created.`);
            } catch (error) {
                console.log(`Something went wrong. The content file ${dbModelPath} was not created.`);
                showCriticalError(error);
                break;
            }
        }

        return newModelsNameInPascalCaseList;
    }
}
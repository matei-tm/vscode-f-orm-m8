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
import getConcreteEntitySkeletonContent from "../templates/models/concrete_entity";
import { Utils } from "../utils/utils";
import { ModelsFolderParser } from "../parser/models_folder_parser";
import { FileManager } from "./file_manager";
import { FolderManager } from "./folder_manager";
import { DatabaseHelpersGenerator } from "./database_helpers_generator";


const writeFile = promisify(fs.writeFile);

const newModelInputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: 'YourNewModelName',
    prompt: 'Input your model name in pascal case (Ex: YourNewModel).',
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

    private helpersFolderPath: fs.PathLike;
    private helpersDatabaseFolderPath: string;
    private modelsFolderPath: string;

    private packageName: string = "";

    constructor(extensionContext: vscode.ExtensionContext) {
        this.extensionVersion = this.getExtensionVersion(extensionContext);
        this.currentFolder = vscode.workspace.rootPath;

        this.helpersFolderPath = this.currentFolder + "/lib/helpers";
        this.helpersDatabaseFolderPath = this.helpersFolderPath + "/database";
        this.modelsFolderPath = this.currentFolder + "/lib/models";
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

        await FolderManager.addWorkspaceFolder(this.helpersFolderPath);
        await FolderManager.addWorkspaceFolder(this.helpersDatabaseFolderPath);
        await FolderManager.addWorkspaceFolder(this.modelsFolderPath);

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

        var abstractDatabaseHelperFilePath = this.helpersDatabaseFolderPath + "/abstract_database_helper.dart";

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }

    private async  addDatabaseAnnotationsMetadata() {
        const abstractDatabaseHelperContent = getDatabaseAnnotationsHelper(this.extensionVersion);

        var abstractDatabaseHelperFilePath = this.helpersDatabaseFolderPath + "/database_annotations.dart";

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }

    private async  addDbEntity() {
        const abstractDatabaseHelperContent = getDbEntityAbstractContent(this.extensionVersion);

        var abstractDatabaseHelperFilePath = this.helpersDatabaseFolderPath + "/db_entity.dart";

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }

    private async addUserAccountModelFile() {

        var dbUserAccountModelPath = this.modelsFolderPath + "/user_account.dart";

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

        var modelsFolderParser: ModelsFolderParser = new ModelsFolderParser(this.modelsFolderPath);
        var existingModelsList = await modelsFolderParser.parseFolderExistingContent();

        var newModelsNameInPascalCaseList: string[] = await this.addNewModelFiles();

        var databaseHelpersGenerator = new DatabaseHelpersGenerator(this.helpersDatabaseFolderPath, this.packageName, this.extensionVersion);

        var allModelsList = newModelsNameInPascalCaseList.concat(existingModelsList);
        
        databaseHelpersGenerator.addUserAccountDatabaseHelper();
        databaseHelpersGenerator.addDatabaseHelper(allModelsList);

    }

    private async addNewModelFiles(): Promise<string[]> {
        var newModelsNameInPascalCaseList: string[] = [];

        while (true) {
            const dbModelNameInPascalCase = await vscode.window.showInputBox(newModelInputBoxOptions);
            if (!dbModelNameInPascalCase) {
                break;
            }

            if (dbModelNameInPascalCase === undefined) {
                showInfo('Invalid model name');
                break;
            }

            newModelsNameInPascalCaseList.push(dbModelNameInPascalCase);

            const modelData = getConcreteEntitySkeletonContent(this.extensionVersion, this.packageName, dbModelNameInPascalCase);

            var modelFileName: string = Utils.getUnderscoreCase(dbModelNameInPascalCase);
            var dbModelPath = this.modelsFolderPath + "/" + modelFileName + ".dart";

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
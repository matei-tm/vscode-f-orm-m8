import * as vscode from "vscode";
import { promisify } from 'util';
import * as fs from 'fs';
import getAbstractDatabaseHelper from '../templates/database/abstract_database_helper';
import { DependenciesSolver } from "../utils/dependencies_solver";
import { showError, showInfo, showCriticalError } from "../helper/messaging";
import getDatabaseHelper from "../templates/database/database_helper";
import getDbEntityAbstractContent from "../templates/database/db_entity";
import * as Path from 'path';
import getConcreteUserAccountContent from "../templates/models/concrete_user_account";
import getDatabaseAnnotationsHelper from "../templates/database/database_annotations";
import getConcreteEntitySkeletonContent from "../templates/models/concrete_entity";
import { Utils } from "../utils/utils";
import { ModelsFolderParser } from "../parser/modelsFolderParser";

const mkdir = promisify(fs.mkdir);
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

export enum InsertionMethod {
    ADD = "Added",
    REPLACE = "Replaced"
}

export default generateSqliteFixture;

export async function generateSqliteFixture(extensionContext: vscode.ExtensionContext) {
    var extensionVersion = getExtensionVersion(extensionContext);

    if (extensionVersion === undefined) {
        return;
    }

    if (!isFlutterProjectOnCurrentFolder()) {
        return;
    }

    var currentWorkspace = vscode.workspace;
    var currentFolder = currentWorkspace.rootPath;

    var packageName = await addOrUpdateDependencyOnSqflite(currentFolder);
    if (packageName === undefined || packageName === "") {
        showError(new Error("The package name is missing"), true);
        return;
    }

    var helpersFolderPath = currentFolder + "/lib/helpers";
    var helpersDatabaseFolderPath = helpersFolderPath + "/database";
    var modelsFolderPath = currentFolder + "/lib/models";

    await addWorkspaceFolder(helpersFolderPath);
    await addWorkspaceFolder(helpersDatabaseFolderPath);
    await addWorkspaceFolder(modelsFolderPath);

    await addAbstractDatabaseHelper(helpersDatabaseFolderPath, extensionVersion);
    await addDatabaseHelper(helpersDatabaseFolderPath, extensionVersion);
    await addDatabaseAnnotationsMetadata(helpersDatabaseFolderPath, extensionVersion);
    await addDbEntity(helpersDatabaseFolderPath, extensionVersion);

    await addUserAccountModelFile(modelsFolderPath, extensionVersion, packageName);
    await processModelFiles(modelsFolderPath, extensionVersion, packageName);

    showInfo('Flutter: Generate Sqlite Fixture was successful!');
}

function getExtensionVersion(extensionContext: vscode.ExtensionContext): any {

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

function isFlutterProjectOnCurrentFolder(): boolean {
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

async function addOrUpdateDependencyOnSqflite(currentFolder: any): Promise<string> {
    return DependenciesSolver.solveDependencyOnSqflite(currentFolder);
}

async function addAbstractDatabaseHelper(helpersDatabaseFolderPath: fs.PathLike, version: string) {
    const abstractDatabaseHelperContent = getAbstractDatabaseHelper(version);

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/abstract_database_helper.dart";

    await addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
}

async function addDatabaseHelper(helpersDatabaseFolderPath: fs.PathLike, version: string) {
    const abstractDatabaseHelperContent = getDatabaseHelper(version, "//importsMixinConcatenation", "//mixinHelpersConcatenation", "//createTablesConcatenation");

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/database_helper.dart";

    await addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
}

async function addDatabaseAnnotationsMetadata(helpersDatabaseFolderPath: fs.PathLike, version: string) {
    const abstractDatabaseHelperContent = getDatabaseAnnotationsHelper(version);

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/database_annotations.dart";

    await addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
}

async function addDbEntity(helpersDatabaseFolderPath: fs.PathLike, version: string) {
    const abstractDatabaseHelperContent = getDbEntityAbstractContent(version);

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/db_entity.dart";

    await addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
}

async function addFileWithContent(generatedFilePath: string, generatedFileContent: string) {
    try {
        await writeFile(generatedFilePath, generatedFileContent, 'utf8');
        console.log(`The file ${generatedFilePath} was created.`);
    }
    catch (error) {
        console.log(`Something went wrong. The content file ${generatedFilePath} was not created.`);
        showCriticalError(error);
    }
}

async function addUserAccountModelFile(modelsFolderPath: fs.PathLike, version: string, packageName: string) {

    var dbUserAccountModelPath = modelsFolderPath + "/user_account.dart";

    try {
        var concreteUserAccountContent = getConcreteUserAccountContent(version, packageName);
        await writeFile(dbUserAccountModelPath, concreteUserAccountContent, 'utf8');

        console.log(`The file ${dbUserAccountModelPath} was created.`);
    } catch (error) {
        console.log(`Something went wrong. The content file for ${dbUserAccountModelPath} was not created.`);
        showCriticalError(error);
        return;
    }
}

async function processModelFiles(modelsFolderPath: fs.PathLike, version: string, packageName: string) {

    var modelsFolderParser: ModelsFolderParser = new ModelsFolderParser(modelsFolderPath);
    await modelsFolderParser.parseFolderExistingContent();

    var newModelFiles: string[] = await addNewModelFiles(modelsFolderPath, version, packageName);
    await modelsFolderParser.parseFolderNewContent(newModelFiles);
}

async function addNewModelFiles(modelsFolderPath: fs.PathLike, version: string, packageName: string): Promise<string[]> {
    var newModelFiles: string[] = [];

    while (true) {
        const dbModelNameInPascalCase = await vscode.window.showInputBox(newModelInputBoxOptions);
        if (!dbModelNameInPascalCase) {
            break;
        }

        if (dbModelNameInPascalCase === undefined) {
            showInfo('Invalid model name');
            break;
        }

        const modelData = getConcreteEntitySkeletonContent(version, packageName, dbModelNameInPascalCase);

        var modelFileName: string = Utils.getUnderscoreCase(dbModelNameInPascalCase);
        newModelFiles.push(modelFileName);

        var dbModelPath = modelsFolderPath + "/" + modelFileName + ".dart";

        try {
            await writeFile(dbModelPath, modelData, 'utf8');

            console.log(`The file ${dbModelPath} was created.`);
        } catch (error) {
            console.log(`Something went wrong. The content file ${dbModelPath} was not created.`);
            showCriticalError(error);
            break;
        }
    }

    return newModelFiles;
}
async function addWorkspaceFolder(workspaceFolderPath: fs.PathLike) {

    try {
        if (fs.existsSync(workspaceFolderPath)) {
            console.log(`The folder ${workspaceFolderPath} exists.`);
            return;
        }

        await mkdir(workspaceFolderPath);
        console.log(`The folder ${workspaceFolderPath} was created.`);

    } catch (error) {
        console.log(`Something went wrong. The folder ${workspaceFolderPath} was not created.`);
        showCriticalError(error);
        return;
    }
}
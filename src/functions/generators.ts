import * as vscode from "vscode";
import { promisify } from 'util';
import * as fs from 'fs';
import getAbstractDatabaseHelper from '../templates/database/abstract_database_helper';
import { DependenciesSolver } from "../utils/dependencies_solver";
import { showError, showInfo, showCriticalError } from "../helper/messaging";
import getDatabaseHelper from "../templates/database/database_helper";
import getDbEntityAbstractContent from "../templates/database/db_entity";

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const inputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: 'SqliteExtension',
    prompt: 'Input your model name in camel case.'
};

export enum InsertionMethod {
    ADD = "Added",
    REPLACE = "Replaced"
}

export default generateSqliteFixture;

export async function generateSqliteFixture() {

    if (!isFlutterProjectOnCurrentFolder()) {
        return;
    }

    var currentWorkspace = vscode.workspace;
    var currentFolder = currentWorkspace.rootPath;

    await addOrUpdateDependencyOnSqflite(currentFolder);

    var helpersFolderPath = currentFolder + "/lib/helpers";
    var helpersDatabaseFolderPath = helpersFolderPath + "/database";
    var modelsFolderPath = currentFolder + "/lib/models";

    await addWorkspaceFolder(helpersFolderPath);
    await addWorkspaceFolder(helpersDatabaseFolderPath);
    await addWorkspaceFolder(modelsFolderPath);

    await addAbstractDatabaseHelper(helpersDatabaseFolderPath);
    await addDatabaseHelper(helpersDatabaseFolderPath);
    await addDbEntity(helpersDatabaseFolderPath);
    //await addModelFile(modelsFolderPath);

    showInfo('Flutter: Generate Sqlite Fixture was successful!');
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

async function addOrUpdateDependencyOnSqflite(currentFolder: any) {
    DependenciesSolver.solveDependencyOnSqflite(currentFolder);
}

async function addAbstractDatabaseHelper(helpersDatabaseFolderPath: fs.PathLike) {
    const abstractDatabaseHelperContent = getAbstractDatabaseHelper();

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/abstract_database_helper.dart";

    await addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
}

async function addDatabaseHelper(helpersDatabaseFolderPath: fs.PathLike) {
    const abstractDatabaseHelperContent = getDatabaseHelper("//importsMixinConcatenation", "//mixinHelpersConcatenation", "//createTablesConcatenation");

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/database_helper.dart";

    await addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
}

async function addDbEntity(helpersDatabaseFolderPath: fs.PathLike) {
    const abstractDatabaseHelperContent = getDbEntityAbstractContent();

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

async function addModelFile(modelsFolderPath: fs.PathLike) {
    const dbModelName = await vscode.window.showInputBox(inputBoxOptions);

    const modelData = "test";

    if (dbModelName === undefined) {
        showInfo('Invalid model name');
        return;
    }

    var dbModelPath = modelsFolderPath + "/" + dbModelName + ".dart";

    try {
        await writeFile(dbModelPath, modelData, 'utf8');

        console.log(`The file ${dbModelPath} was created.`);
    } catch (error) {
        console.log(`Something went wrong. The content file ${dbModelPath} was not created.`);
        showCriticalError(error);
        return;
    }
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
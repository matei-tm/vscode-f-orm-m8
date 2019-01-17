import * as vscode from "vscode";
import { promisify } from 'util';
import * as fs from 'fs';
import getAbstractDatabaseHelper from '../templates/database/abstract_database_helper';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

const inputBoxOptions: vscode.InputBoxOptions = {
    placeHolder: 'SqliteExtension',
    prompt: 'Input your model name in camel case.'
};

export default generateSqliteFixture;

export async function generateSqliteFixture() {
    var currentWorkspace = vscode.workspace;

    if (currentWorkspace === undefined) {
        vscode.window.showErrorMessage('A Flutter project is not opened in the current workspace.');
        return;
    }

    //TODO: test if flutter project folder is opened

    var currentFolder = currentWorkspace.rootPath;

    var helpersFolderPath = currentFolder + "/lib/helpers";
    var helpersDatabaseFolderPath = helpersFolderPath + "/database";
    var modelsFolderPath = currentFolder + "/lib/models";

    await addWorkspaceFolder(helpersFolderPath);
    await addWorkspaceFolder(helpersDatabaseFolderPath);
    await addWorkspaceFolder(modelsFolderPath);

    await DependenciesSolver.solveDependencyOnSqflite();

    await addDatabaseHelpers(helpersDatabaseFolderPath);
    await addModelFile(modelsFolderPath);

    vscode.window.showInformationMessage('Flutter: Generate Sqlite Fixture was successful!');
}

export function pubspecFileIsOpen() {
    return (
      vscode.window.activeTextEditor &&
      (vscode.window.activeTextEditor.document.fileName.endsWith(
        "pubspec.yaml"
      ) ||
        vscode.window.activeTextEditor.document.fileName.endsWith("pubspec.yml"))
    );
  }

async function addDatabaseHelpers(helpersDatabaseFolderPath: fs.PathLike) {
    const abstractDatabaseHelperContent = getAbstractDatabaseHelper();

    var abstractDatabaseHelperFilePath = helpersDatabaseFolderPath + "/abstract_database_helper.dart";

    try {
        await writeFile(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent, 'utf8');

        console.log(`The file ${abstractDatabaseHelperFilePath} was created.`);
    } catch (error) {
        vscode.window.showErrorMessage(`Something went wrong. The content file ${abstractDatabaseHelperFilePath} was not created.`);
        return;
    }

}

async function addModelFile(modelsFolderPath: fs.PathLike) {
    const dbModelName = await vscode.window.showInputBox(inputBoxOptions);

    const modelData = "test";

    if (dbModelName === undefined) {
        vscode.window.showErrorMessage('Invalid model name');
        return;
    }

    var dbModelPath = modelsFolderPath + "/" + dbModelName + ".dart";

    try {
        await writeFile(dbModelPath, modelData, 'utf8');

        console.log(`The file ${dbModelPath} was created.`);
    } catch (error) {
        vscode.window.showErrorMessage(`Something went wrong. The content file ${dbModelPath} was not created.`);
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
        vscode.window.showErrorMessage(`Something went wrong. The folder ${workspaceFolderPath} was not created.`);
        return;
    }
}
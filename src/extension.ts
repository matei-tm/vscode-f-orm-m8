// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { promisify } from 'util';
import * as fs from 'fs';

const mkdir = promisify(fs.mkdir);
const writeFile = promisify(fs.writeFile);

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "flutter-sqlite-generator" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	let disposable = vscode.commands.registerCommand('extension.flutterSqliteGenerateFixture', () => {
		// The code you place here will be executed every time your command is executed

		generateSqliteFixture();
		// Display a message box to the user
		vscode.window.showInformationMessage('Flutter: Generate Sqlite Fixture was successful!');
	});

	context.subscriptions.push(disposable);
}

// this method is called when your extension is deactivated
export function deactivate() { }

const inputBoxOptions: vscode.InputBoxOptions = {
	placeHolder: 'SqliteExtension',
	prompt: 'Input your model name in camel case.'
};

async function generateSqliteFixture() {
	const dbModelName = await vscode.window.showInputBox(inputBoxOptions);

	var currentWorkspace = vscode.workspace;

	if (currentWorkspace === undefined) {
		vscode.window.showErrorMessage('A Flutter project is not opened in the current workspace.');
		return;
	}

	//TODO: test if flutter project folder is opened

	var currentFolder = currentWorkspace.rootPath;

	var helpersDatabaseFolderPath = currentFolder + "/lib/helpers/database";

	await addWorkspaceFolder(helpersDatabaseFolderPath);
}

async function addWorkspaceFolder(workspaceFolderPath: fs.PathLike) {
	try {
		//TODO: test if folder exists

		await mkdir(workspaceFolderPath);
		console.log('The folder ${workspaceFolderPath} was not created.');
	} catch (error) {
		vscode.window.showErrorMessage('Something went wrong. The folder ${workspaceFolderPath} was not created.');
		return;
	}
}
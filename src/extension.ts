// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { OrmM8FixtureGenerator } from './functions';
import { DatabaseType } from './helper/database_type';
import { Utils } from './utils/utils';

// this method is called when your extension is activated
// your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {
  // Use the console to output diagnostic information (Utils.consoleLog) and errors (console.error)
  // This line of code will only be executed once when your extension is activated
  Utils.consoleLog('Congratulations, your extension "f-orm-m8-generator" is now active!');

  const generator = new OrmM8FixtureGenerator(context, DatabaseType.SQLITE);
  // The command has been defined in the package.json file
  // Now provide the implementation of the command with registerCommand
  // The commandId parameter must match the command field in package.json
  const disposableGenerate = vscode.commands.registerCommand('extension.fOrmM8SqliteGenerateFixture', async () => {
    await generator.generateOrmM8FixtureWithModels();
  });

  const disposableRegenerate = vscode.commands.registerCommand('extension.fOrmM8SqliteRegenerateFixture', async () => {
    await generator.regenerateOrmM8Fixture();
  });

  context.subscriptions.push(disposableGenerate, disposableRegenerate);
}

// this method is called when your extension is deactivated
export function deactivate() {
  Utils.consoleLog('The extension "f-orm-m8-generator" was deactivated!');
}

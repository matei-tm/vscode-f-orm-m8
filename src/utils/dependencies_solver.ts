import * as vscode from 'vscode';
import { InsertionMethod } from '../helper/insertion_method';
import { showCriticalError, showError, showInfo } from '../helper/messaging';
import { GenError } from '../model/gen_error';
import { Tuple } from './utils';

export class DependenciesSolver {
  public static currentPackageName: string;
  private referencedPackages: Tuple[];
  private referencedDevPackages: Tuple[];

  constructor(referencedPackages: Tuple[], referencedDevPackages: Tuple[]) {
    this.referencedPackages = referencedPackages;
    this.referencedDevPackages = referencedDevPackages;
  }

  public async solveDependencyOnPackages(currentFolder: any): Promise<boolean> {
    const result: boolean = true;

    await vscode.workspace
      .openTextDocument(currentFolder + '/pubspec.yaml')
      .then(doc => vscode.window.showTextDocument(doc));

    if (!vscode.window.activeTextEditor || !this.pubspecFileIsOpen()) {
      showError(new GenError('Pubspec file not opened.'));
      return false;
    }

    if (DependenciesSolver.currentPackageName === undefined || DependenciesSolver.currentPackageName === '') {
      DependenciesSolver.currentPackageName = await this.getPackageName(currentFolder);
    }

    const activeTextEditor = vscode.window.activeTextEditor;

    if (activeTextEditor === undefined) {
      throw new Error('ActiveTextEditor is undefined');
    }

    vscode.commands.executeCommand('editor.action.formatDocument');
    const pubspecString = activeTextEditor.document.getText();

    const originalLines = pubspecString.split('\n');
    let currentPubspec: string = pubspecString;

    currentPubspec = await this.upsertDependencies(currentPubspec, currentFolder, this.referencedPackages, false);
    currentPubspec = await this.upsertDependencies(currentPubspec, currentFolder, this.referencedDevPackages, true);

    vscode.window.activeTextEditor.edit(editBuilder => {
      editBuilder.replace(
        new vscode.Range(
          new vscode.Position(0, 0),
          new vscode.Position(originalLines.length - 1, originalLines[originalLines.length - 1].length),
        ),
        currentPubspec,
      );
    });

    await activeTextEditor.document.save();
    return result;
  }

  private async upsertDependencies(
    currentPubspec: string,
    currentFolder: any,
    referencedPackages: Tuple[],
    isDevSection: boolean,
  ) {
    for (const referencedPackage of referencedPackages) {
      currentPubspec = await this.solveDependencyOnPackage(
        currentFolder,
        referencedPackage,
        currentPubspec,
        isDevSection,
      );
    }
    return currentPubspec;
  }

  private async solveDependencyOnPackage(
    currentFolder: any,
    element: Tuple,
    currentPubspec: string,
    isDevDependency: boolean,
  ): Promise<string> {
    try {
      const addDependencyOutput = this.addDependencyByText(currentPubspec, element[0], element[1], isDevDependency);
      currentPubspec = addDependencyOutput.result;

      showInfo(`${addDependencyOutput.insertionMethod.toString()} ${element[0]}`);
    } catch (error) {
      showCriticalError(error);
    }

    return currentPubspec;
  }

  private pubspecFileIsOpen(): any {
    return (
      vscode.window.activeTextEditor &&
      (vscode.window.activeTextEditor.document.fileName.endsWith('pubspec.yaml') ||
        vscode.window.activeTextEditor.document.fileName.endsWith('pubspec.yml'))
    );
  }

  private async getPackageName(currentFolder: string): Promise<string> {
    await vscode.workspace
      .openTextDocument(currentFolder + '/pubspec.yaml')
      .then(doc => vscode.window.showTextDocument(doc));

    if (!vscode.window.activeTextEditor || !this.pubspecFileIsOpen()) {
      showError(new GenError('Pubspec file not opened.'));
      return '';
    }

    vscode.commands.executeCommand('editor.action.formatDocument');

    const pubspecString = vscode.window.activeTextEditor.document.getText();

    const lines = pubspecString.split('\n');

    const packageNameLineIndex = lines.findIndex(line => line.trim().substr(0, 5) === 'name:');

    if (packageNameLineIndex === -1) {
      return '';
    }

    if (packageNameLineIndex !== -1) {
      const originalLine = lines[packageNameLineIndex];

      const sanitizedLine: string = originalLine.trim();
      const colonIndex: number = sanitizedLine.indexOf(':');
      const potentialMatch = sanitizedLine.substring(colonIndex + 1);

      return potentialMatch.trim();
    }

    return '';
  }

  private addDependencyByText(
    pubspecString: string,
    packageName: string,
    packageVersion: string,
    isDevDependency: boolean,
  ): { insertionMethod: InsertionMethod; result: string } {
    let pubspecSectionString: string;

    if (isDevDependency) {
      pubspecSectionString = `dev_dependencies:`;
    } else {
      pubspecSectionString = `dependencies:`;
    }

    const packagteDependencyString = `${packageName}: ^${packageVersion}`;

    let insertionMethod = InsertionMethod.ADD;

    const lines = pubspecString.split('\n');

    let dependencyLineIndex = lines.findIndex(line => line.trim() === pubspecSectionString);

    if (dependencyLineIndex === -1) {
      lines.push(pubspecSectionString);
      dependencyLineIndex = lines.length - 1;
    }

    if (dependencyLineIndex === lines.length - 1) {
      lines.push('');
    }

    const existingPackageLineIndex = lines.findIndex(line => {
      if (!line.includes(':')) {
        return false;
      }

      const sanitizedLine: string = line.trim();
      const colonIndex: number = sanitizedLine.indexOf(':');
      const potentialMatch = sanitizedLine.substring(0, colonIndex);

      return potentialMatch.trim() === packageName;
    });
    if (existingPackageLineIndex !== -1) {
      const originalLine = lines[existingPackageLineIndex];

      lines[existingPackageLineIndex] = '  ' + packagteDependencyString;

      if (originalLine.includes('\r')) {
        lines[existingPackageLineIndex] += '\r';
      }
      if (originalLine.includes('\n')) {
        lines[existingPackageLineIndex] += '\n';
      }

      insertionMethod = InsertionMethod.REPLACE;
    } else {
      for (let i = dependencyLineIndex + 1; i < lines.length; i++) {
        if (!lines[i].startsWith(' ') && !lines[i].trim().startsWith('#')) {
          lines[i] = '  ' + packagteDependencyString + '\r\n' + lines[i];
          break;
        }
        if (i === lines.length - 1) {
          if (!lines[i].includes('\r')) {
            lines[i] = lines[i] + '\r';
          }
          lines.push('  ' + packagteDependencyString);
          break;
        }
      }
    }

    pubspecString = lines
      .join('\n')
      .split('\n')

      .join('\n')
      .trim();

    return { insertionMethod, result: pubspecString };
  }
}

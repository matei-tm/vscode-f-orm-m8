import * as fs from 'fs';
import * as Path from 'path';
import * as vscode from 'vscode';
import { DatabaseType } from '../helper/database_type';
import { FlutterHooks } from '../helper/flutter_hooks';
import { showCriticalError, showError, showInfo } from '../helper/messaging';
import { DependenciesSolver } from '../utils/dependencies_solver';
import { Tuple } from '../utils/utils';
import { ModelFilesBuilder } from './model_files_builder';

export class OrmM8FixtureGenerator {
  private currentFolder: string | undefined;
  private extensionVersion: any;

  private flutterProjectPackageName: string = '';
  private databaseType: DatabaseType;

  constructor(extensionContext: vscode.ExtensionContext, databaseType: DatabaseType) {
    this.extensionVersion = this.getExtensionVersion(extensionContext);
    this.currentFolder = vscode.workspace.rootPath;
    this.databaseType = databaseType;
  }

  public async regenerateOrmM8Fixture() {
    await this.generateOrmM8Fixture(false);
  }

  public async generateOrmM8FixtureWithModels() {
    await this.generateOrmM8Fixture(true);
  }

  private async generateOrmM8Fixture(withNewModels: boolean) {
    if (this.extensionVersion === undefined) {
      return;
    }

    if (!this.isFlutterProjectOnCurrentFolder()) {
      return;
    }

    this.flutterProjectPackageName = await this.addOrUpdateDependencyOnExternalPackages(this.databaseType);

    if (this.flutterProjectPackageName === undefined || this.flutterProjectPackageName === '') {
      showError(new Error('Adding dependency to pubspec failed'), true);
      return false;
    }

    FlutterHooks.getDartPackages();

    if (withNewModels) {
      const modelFilesBuilder: ModelFilesBuilder = new ModelFilesBuilder(
        this.currentFolder,
        this.extensionVersion,
        this.databaseType,
      );
      await modelFilesBuilder.processModelFiles();
    }

    await this.StartExternalGeneratorClean();
    await this.StartExternalGeneratorBuild();
  }

  private async StartExternalGeneratorClean() {
    if (vscode.workspace.workspaceFolders) {
      const folder = vscode.workspace.workspaceFolders[0];
      showInfo(`Starting clean. Waiting for result...`);
      await vscode.tasks.executeTask(FlutterHooks.createPubBuildRunnerCleanTask(folder));
    }
  }

  private async StartExternalGeneratorBuild() {
    if (vscode.workspace.workspaceFolders) {
      const folder = vscode.workspace.workspaceFolders[0];
      showInfo(`Starting builder. Waiting for result...`);
      vscode.tasks.onDidEndTaskProcess(event => this.showInfoByTask(event.execution.task.name));
      await vscode.tasks.executeTask(FlutterHooks.createPubBuildRunnerBuildTask(folder));
    }
  }

  private showInfoByTask(taskName: string): any {
    let infoMessage = `Task "${taskName}" was completed`;

    if (taskName === 'build_runner build') {
      infoMessage = 'All tasks completed';
    }

    return showInfo(infoMessage);
  }

  private getExtensionVersion(extensionContext: vscode.ExtensionContext): any {
    try {
      const extensionPath = Path.join(extensionContext.extensionPath, 'package.json');
      const packageFile = JSON.parse(fs.readFileSync(extensionPath, 'utf8'));

      if (packageFile) {
        return packageFile.version;
      } else {
        showError(new Error('The version attribute is missing'), true);
      }
    } catch (error) {
      showCriticalError(error);
    }

    return undefined;
  }

  private isFlutterProjectOnCurrentFolder(): boolean {
    const currentWorkspace = vscode.workspace;

    if (currentWorkspace === undefined || currentWorkspace.name === undefined) {
      showError(new Error('A Flutter workspace is not opened in the current session.'), false);
      return false;
    }

    const currentFolder = currentWorkspace.rootPath;

    if (currentFolder === undefined) {
      showError(new Error('A Flutter folder is not opened in the current workspace.'), false);
      return false;
    }

    if (!fs.existsSync(currentFolder + '/pubspec.yaml')) {
      showError(
        new Error(
          'The current folder is not a Flutter one, or an inner folder is opened. Open the Flutter project root folder.',
        ),
        false,
      );
      return false;
    }

    return true;
  }

  private async addOrUpdateDependencyOnExternalPackages(databaseType: DatabaseType): Promise<string> {
    let databaseDriverPackage: Tuple;
    let fOrmM8Package: Tuple;
    let myReferencedPackages: Tuple[];

    if (databaseType === DatabaseType.SQLITE) {
      databaseDriverPackage = ['sqflite', '1.1.0'];
      fOrmM8Package = ['f_orm_m8', '0.8.0'];
      myReferencedPackages = [databaseDriverPackage, fOrmM8Package];
    } else {
      throw new Error('Not implemented database type');
    }

    const flutterOrmM8GeneratorPackage: Tuple = ['f_orm_m8_sqlite', '0.7.0'];
    const buildRunner: Tuple = ['build_runner', '1.0.0'];
    const myReferencedDevPackages: Tuple[] = [buildRunner, flutterOrmM8GeneratorPackage];

    const dependenciesSolver: DependenciesSolver = new DependenciesSolver(myReferencedPackages, myReferencedDevPackages);

    await dependenciesSolver.solveDependencyOnPackages(this.currentFolder);
    return DependenciesSolver.currentPackageName;
  }
}

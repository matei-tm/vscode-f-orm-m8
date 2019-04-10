import * as vscode from "vscode";
import * as fs from 'fs';
import { DependenciesSolver } from "../utils/dependencies_solver";
import { showError, showInfo, showCriticalError } from "../helper/messaging";
import { FlutterHooks } from "../helper/flutter_hooks";
import * as Path from 'path';
import { Tuple } from "../utils/utils";
import { DatabaseType } from "../helper/database_type";
import { ModelFilesBuilder } from "./model_files_builder";


export class OrmM8FixtureGenerator {

    private currentFolder: string | undefined;
    private extensionVersion: any;

    private flutterProjectPackageName: string = "";
    private databaseType: DatabaseType;

    constructor(extensionContext: vscode.ExtensionContext, databaseType: DatabaseType) {
        this.extensionVersion = this.getExtensionVersion(extensionContext);
        this.currentFolder = vscode.workspace.rootPath;
        this.databaseType = databaseType;
    }

    async generateOrmM8Fixture() {
        if (this.extensionVersion === undefined) {
            return;
        }

        if (!this.isFlutterProjectOnCurrentFolder()) {
            return;
        }

        this.flutterProjectPackageName = await this.addOrUpdateDependencyOnExternalPackages(this.databaseType);

        if (this.flutterProjectPackageName === undefined || this.flutterProjectPackageName === "") {
            showError(new Error("Adding dependency to pubspec failed"), true);
            return false;
        }

        FlutterHooks.getDartPackages();

        let modelFilesBuilder: ModelFilesBuilder = new ModelFilesBuilder(this.currentFolder, this.extensionVersion, this.databaseType);
        await modelFilesBuilder.processModelFiles();

        showInfo(`Generation of ${this.databaseType} fixture was successful!`);
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

    private async  addOrUpdateDependencyOnExternalPackages(databaseType: DatabaseType): Promise<string> {
        let databaseDriverPackage: Tuple;
        let flutterOrmM8Package: Tuple;
        let myReferencedPackages: Array<Tuple>;

        if (databaseType === DatabaseType.SQLITE) {
            databaseDriverPackage = ["sqflite", "1.1.0"];
            flutterOrmM8Package = ["flutter_orm_m8", "0.4.0"];
            myReferencedPackages = [databaseDriverPackage, flutterOrmM8Package];
        }
        else { throw new Error("Not implemented database type"); }

        let flutterOrmM8GeneratorPackage: Tuple = ["flutter_sqlite_m8_generator", "0.2.0"];
        let buildRunner: Tuple = ["build_runner", "1.0.0"];
        let myReferencedDevPackages: Array<Tuple> = [buildRunner, flutterOrmM8GeneratorPackage];

        let dependenciesSolver: DependenciesSolver = new DependenciesSolver(myReferencedPackages, myReferencedDevPackages);

        await dependenciesSolver.solveDependencyOnPackages(this.currentFolder);
        return DependenciesSolver.currentPackageName;
    }
}
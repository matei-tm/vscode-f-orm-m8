import * as vscode from "vscode";
import { promisify } from 'util';
import * as fs from 'fs';
import { DependenciesSolver } from "../utils/dependencies_solver";
import { showError, showInfo, showCriticalError } from "../helper/messaging";
import {FlutterHooks} from "../helper/flutter_hooks";
import * as Path from 'path';
import getConcreteUserAccountContent from "../templates/models/concrete_user_account";
import getConcreteAccountRelatedEntitySkeletonContent from "../templates/models/concrete_account_related_entity";
import { Utils, Tuple } from "../utils/utils";
import { ModelsFolderParser } from "../parser/models_folder_parser";
import { FolderManager } from "./folder_manager";
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

    private flutterProjectPackageName: string = "";
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

        this.flutterProjectPackageName = await this.addOrUpdateDependencyOnExternalPackages();
        if (this.flutterProjectPackageName === undefined || this.flutterProjectPackageName === "") {
            showError(new Error("Adding dependency to pubspec failed"), true);
            return false;
        }

        FlutterHooks.getDartPackages();

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

    private async  addOrUpdateDependencyOnExternalPackages(): Promise<string> {
        let sqflitePackage: Tuple = ["sqflite", "1.1.0"];
        let flutterOrmM8Package: Tuple = ["flutter_orm_m8", "0.4.0"];
        var myReferencedPackages: Array<Tuple> = [sqflitePackage, flutterOrmM8Package];

        let flutterSqliteM8GeneratorPackage: Tuple = ["flutter_sqlite_m8_generator", "0.2.0"];
        let buildRunner: Tuple = ["build_runner", "1.0.0"];
        var myReferencedDevPackages: Array<Tuple> = [buildRunner, flutterSqliteM8GeneratorPackage];

        var dependenciesSolver: DependenciesSolver = new DependenciesSolver(myReferencedPackages, myReferencedDevPackages);

        await dependenciesSolver.solveDependencyOnPackages(this.currentFolder);
        return DependenciesSolver.currentPackageName;
    }


    private async addUserAccountModelFile() {

        var dbUserAccountModelPath = Path.join(this.folderManager.modelsFolderPath, "user_account.dart");

        try {
            var concreteUserAccountContent = getConcreteUserAccountContent(this.extensionVersion, this.flutterProjectPackageName);
            await writeFile(dbUserAccountModelPath, concreteUserAccountContent, 'utf8');

            console.log(`The file ${dbUserAccountModelPath} was created.`);
        } catch (error) {
            console.log(`Something went wrong. The content file for ${dbUserAccountModelPath} was not created.`);
            showCriticalError(error);
            return;
        }
    }

    private async processModelFiles() {

        let modelsFolderParser: ModelsFolderParser = new ModelsFolderParser(this.folderManager);
        let existingAccountRelatedModelsList = await modelsFolderParser.parseAccountRelatedFolderExistingContent();
        let existingIndependentModelsList = await modelsFolderParser.parseIndependentFolderExistingContent();

        let newIndependentModelsNameInPascalCaseList: string[] = await this.addNewModelFiles(false);
        let newAccountRelatedModelsNameInPascalCaseList: string[] = await this.addNewModelFiles(true);
        let allModelsList = newIndependentModelsNameInPascalCaseList.concat(existingIndependentModelsList, newAccountRelatedModelsNameInPascalCaseList, existingAccountRelatedModelsList);

        if (existingAccountRelatedModelsList.length > 0 || newAccountRelatedModelsNameInPascalCaseList.length > 0) {
            await this.addUserAccountModelFile();
            allModelsList.push("UserAccount");
        }

        console.log(allModelsList.toString());

        if (vscode.workspace.workspaceFolders) {
            let folder = vscode.workspace.workspaceFolders[0];
            await vscode.tasks.executeTask(FlutterHooks.createPubBuildRunnerTask(folder));
        }
    }

    private async addNewModelFiles(isAccountRelated: boolean): Promise<string[]> {
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
                modelData = getConcreteAccountRelatedEntitySkeletonContent(this.extensionVersion, this.flutterProjectPackageName, dbModelNameInPascalCase);
                dbModelPath = Path.join(this.folderManager.accountRelatedModelsFolderPath, modelFileName + ".dart");
            }
            else {
                modelData = getConcreteIndependentEntitySkeletonContent(this.extensionVersion, this.flutterProjectPackageName, dbModelNameInPascalCase);
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
import * as vscode from "vscode";
import { promisify } from 'util';
import * as fs from 'fs';
import { showError, showInfo, showCriticalError } from "../helper/messaging";
import { FlutterHooks } from "../helper/flutter_hooks";
import * as Path from 'path';
import getConcreteUserAccountContent from "../templates/models/concrete_user_account";
import getConcreteAccountRelatedEntitySkeletonContent from "../templates/models/concrete_account_related_entity";
import { Utils } from "../utils/utils";
import { ModelsFolderParser } from "../parser/models_folder_parser";
import { FolderManager } from "./folder_manager";
import getConcreteIndependentEntitySkeletonContent from "../templates/models/concrete_independent_entity";
import { DatabaseType } from "../helper/database_type";

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

export class ModelFilesBuilder {
    private currentFolder: string | undefined;
    private extensionVersion: any;

    private folderManager: FolderManager;
    private databaseType: DatabaseType;

    constructor(currentFolder: string | undefined, extensionVersion: any, databaseType: DatabaseType) {
        this.extensionVersion = extensionVersion;
        this.currentFolder = currentFolder;
        this.databaseType = databaseType;

        this.folderManager = new FolderManager(currentFolder);
    }

    public async processModelFiles() {

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

    private async addUserAccountModelFile() {

        var dbUserAccountModelPath = Path.join(this.folderManager.modelsFolderPath, "user_account.dart");

        try {
            var concreteUserAccountContent = getConcreteUserAccountContent(this.extensionVersion, this.databaseType);
            await writeFile(dbUserAccountModelPath, concreteUserAccountContent, 'utf8');

            console.log(`The file ${dbUserAccountModelPath} was created.`);
        } catch (error) {
            console.log(`Something went wrong. The content file for ${dbUserAccountModelPath} was not created.`);
            showCriticalError(error);
            return;
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
                modelData = getConcreteAccountRelatedEntitySkeletonContent(this.extensionVersion, this.databaseType, dbModelNameInPascalCase);
                dbModelPath = Path.join(this.folderManager.accountRelatedModelsFolderPath, modelFileName + ".dart");
            }
            else {
                modelData = getConcreteIndependentEntitySkeletonContent(this.extensionVersion, this.databaseType, dbModelNameInPascalCase);
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
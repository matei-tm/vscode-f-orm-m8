import * as fs from 'fs';
import * as Path from 'path';
import { promisify } from 'util';
import * as vscode from 'vscode';
import { DatabaseType } from '../helper/database_type';
import { showCriticalError, showInfo, showWarning } from '../helper/messaging';
import { ModelsFolderParser } from '../parser/models_folder_parser';
import getConcreteAccountRelatedEntitySkeletonContent from '../templates/models/concrete_account_related_entity';
import getConcreteIndependentEntitySkeletonContent from '../templates/models/concrete_independent_entity';
import getConcreteUserAccountContent from '../templates/models/concrete_user_account';
import { Utils } from '../utils/utils';
import { FolderManager } from './folder_manager';

const writeFile = promisify(fs.writeFile);

const newIndependentModelInputBoxOptions: vscode.InputBoxOptions = {
  ignoreFocusOut: true,
  placeHolder: 'YourNewModelName',
  prompt: 'DbEntity: Input your INDEPENDENT model name in pascal case (Ex: YourNewModel).',

  validateInput: value => {
    if (!value.match('^[A-Z][A-z0-9]+$')) {
      return 'The model name is not validated as PascalCase. Fix the name if you need this model. If you want to exit press ESC. ';
    }
  },
};

const newAccountRelatedModelInputBoxOptions: vscode.InputBoxOptions = {
  ignoreFocusOut: true,
  placeHolder: 'YourNewModelName',
  prompt: 'DbAccountRelatedEntity: Input your ACCOUNT RELATED model name in pascal case (Ex: YourNewModel).',

  validateInput: value => {
    if (!value.match('^[A-Z][A-z0-9]+$')) {
      return 'The model name is not validated as PascalCase. Fix the name if you need this model. If you want to exit press ESC. ';
    }
  },
};

export class ModelFilesBuilder {

  public existingAccountRelatedModelsList: string[] = [];
  public existingIndependentModelsList: string[] = [];
  private extensionVersion: any;

  private folderManager: FolderManager;
  private databaseType: DatabaseType;

  constructor(currentFolder: string | undefined, extensionVersion: any, databaseType: DatabaseType) {
    this.extensionVersion = extensionVersion;
    this.databaseType = databaseType;

    this.folderManager = new FolderManager(currentFolder);
  }

  public async processModelFiles() {
    const modelsFolderParser: ModelsFolderParser = new ModelsFolderParser(this.folderManager);

    this.existingAccountRelatedModelsList = await modelsFolderParser.parseAccountRelatedFolderExistingContent();
    this.existingIndependentModelsList = await modelsFolderParser.parseIndependentFolderExistingContent();

    const newIndependentModelsNameInPascalCaseList: string[] = await this.addNewModelFiles(false);
    const newAccountRelatedModelsNameInPascalCaseList: string[] = await this.addNewModelFiles(true);

    const allModelsList = newIndependentModelsNameInPascalCaseList.concat(
      this.existingIndependentModelsList,
      newAccountRelatedModelsNameInPascalCaseList,
      this.existingAccountRelatedModelsList,
    );

    if (
      !this.folderManager.userAccountExists() &&
      (this.existingAccountRelatedModelsList.length > 0 || newAccountRelatedModelsNameInPascalCaseList.length > 0)
    ) {
      await this.addUserAccountModelFile();
      allModelsList.push('UserAccount');
    }

    Utils.consoleLog(allModelsList.toString());

    if (newIndependentModelsNameInPascalCaseList.length > 0 || newAccountRelatedModelsNameInPascalCaseList.length > 0) {
      showInfo(`New user models for ${this.databaseType} have been added`);
    }
  }

  private async addUserAccountModelFile() {
    const dbUserAccountModelPath = Path.join(this.folderManager.modelsFolderPath, 'user_account.dart');

    try {
      const concreteUserAccountContent = getConcreteUserAccountContent(this.extensionVersion, this.databaseType);
      await writeFile(dbUserAccountModelPath, concreteUserAccountContent, 'utf8');

      Utils.consoleLog(`The file ${dbUserAccountModelPath} was created.`);
    } catch (error) {
      Utils.consoleLog(`Something went wrong. The content file for ${dbUserAccountModelPath} was not created.`);
      showCriticalError(error);
      return;
    }
  }

  private async addNewModelFiles(isAccountRelated: boolean): Promise<string[]> {
    const newModelsNameInPascalCaseList: string[] = [];

    while (true) {
      let dbModelNameInPascalCase: string | undefined;

      if (isAccountRelated === true) {
        dbModelNameInPascalCase = await vscode.window.showInputBox(newAccountRelatedModelInputBoxOptions);
      } else {
        dbModelNameInPascalCase = await vscode.window.showInputBox(newIndependentModelInputBoxOptions);
      }

      if (!dbModelNameInPascalCase) {
        break;
      }

      if (dbModelNameInPascalCase === undefined) {
        showWarning('Invalid model name');
        break;
      }

      if (this.existingAccountRelatedModelsList.indexOf(dbModelNameInPascalCase) > -1) {
        this.showWarningOnExistingFile(dbModelNameInPascalCase, true);
        break;
      }

      if (this.existingIndependentModelsList.indexOf(dbModelNameInPascalCase) > -1) {
        this.showWarningOnExistingFile(dbModelNameInPascalCase, false);
        break;
      }

      newModelsNameInPascalCaseList.push(dbModelNameInPascalCase);

      let modelData: string;
      let dbModelPath;
      const modelFileName: string = Utils.getUnderscoreCase(dbModelNameInPascalCase);

      if (isAccountRelated === true) {
        modelData = getConcreteAccountRelatedEntitySkeletonContent(
          this.extensionVersion,
          this.databaseType,
          dbModelNameInPascalCase,
        );
        dbModelPath = Path.join(this.folderManager.accountRelatedModelsFolderPath, modelFileName + '.dart');
      } else {
        modelData = getConcreteIndependentEntitySkeletonContent(
          this.extensionVersion,
          this.databaseType,
          dbModelNameInPascalCase,
        );
        dbModelPath = Path.join(this.folderManager.independentModelsFolderPath, modelFileName + '.dart');
      }

      try {
        await writeFile(dbModelPath, modelData, 'utf8');

        Utils.consoleLog(`The file ${dbModelPath} was created.`);
      } catch (error) {
        Utils.consoleLog(`Something went wrong. The content file ${dbModelPath} was not created.`);
        showCriticalError(error);
        break;
      }
    }

    return newModelsNameInPascalCaseList;
  }

  private showWarningOnExistingFile(dbModelNameInPascalCase: string, isAccountRelated: boolean) {
    showWarning(
      `${dbModelNameInPascalCase} model already exists in lib/models/${
      isAccountRelated ? 'accountrelated' : 'independent'
      } folder. Overwriting is disallowed.`,
    );
  }
}

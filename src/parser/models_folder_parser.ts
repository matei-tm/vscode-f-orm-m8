import * as fs from 'fs';
import { FolderManager } from '../generators/folder_manager';
import { Utils } from '../utils/utils';
import { ModelParser } from './model_parser';


export class ModelsFolderParser {
  private folderManager: FolderManager;
  private existingAccountRelatedEntitiesList: string[] = [];
  private existingIndependentEntitiesList: string[] = [];

  constructor(folderManager: FolderManager) {
    this.folderManager = folderManager;
  }

  public async parseAccountRelatedFolderExistingContent(): Promise<string[]> {
    Utils.consoleLog('Start parsing existing account related models:');
    fs.readdir(this.folderManager.accountRelatedModelsFolderPath, (err, files) => {
      files.map(async file => {
        await this.processAccountRelatedModelFile(file);
      });
    });

    return this.existingAccountRelatedEntitiesList;
  }

  public async parseIndependentFolderExistingContent(): Promise<string[]> {
    Utils.consoleLog('Start parsing existing independent models:');
    fs.readdir(this.folderManager.independentModelsFolderPath, (err, files) => {
      files.map(async file => {
        await this.processIndependentModelFile(file);
      });
    });

    return this.existingIndependentEntitiesList;
  }

  private async processAccountRelatedModelFile(file: string) {
    const modelParser: ModelParser = new ModelParser(this.folderManager.accountRelatedModelsFolderPath, file);
    const modelName: string = await modelParser.getModelName();
    Utils.consoleLog(file);

    this.existingAccountRelatedEntitiesList.push(modelName);
  }

  private async processIndependentModelFile(file: string) {
    const modelParser: ModelParser = new ModelParser(this.folderManager.independentModelsFolderPath, file);
    const modelName: string = await modelParser.getModelName();
    Utils.consoleLog(file);

    this.existingIndependentEntitiesList.push(modelName);
  }
}

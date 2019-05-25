import * as fs from 'fs';
import { ModelParser } from './model_parser';
import { FolderManager } from '../generators/folder_manager';

export class ModelsFolderParser {
  private folderManager: FolderManager;
  private existingAccountRelatedEntitiesList: string[] = [];
  private existingIndependentEntitiesList: string[] = [];

  constructor(folderManager: FolderManager) {
    this.folderManager = folderManager;
  }

  async parseAccountRelatedFolderExistingContent(): Promise<string[]> {
    console.log('Start parsing existing account related models:');
    fs.readdir(this.folderManager.accountRelatedModelsFolderPath, (err, files) => {
      files.map(async file => {
        await this.processAccountRelatedModelFile(file);
      });
    });

    return this.existingAccountRelatedEntitiesList;
  }

  private async processAccountRelatedModelFile(file: string) {
    var modelParser: ModelParser = new ModelParser(this.folderManager.accountRelatedModelsFolderPath, file);
    var modelName: string = await modelParser.getModelName();
    console.log(file);

    this.existingAccountRelatedEntitiesList.push(modelName);
  }

  async parseIndependentFolderExistingContent(): Promise<string[]> {
    console.log('Start parsing existing independent models:');
    fs.readdir(this.folderManager.independentModelsFolderPath, (err, files) => {
      files.map(async file => {
        await this.processIndependentModelFile(file);
      });
    });

    return this.existingIndependentEntitiesList;
  }

  private async processIndependentModelFile(file: string) {
    var modelParser: ModelParser = new ModelParser(this.folderManager.independentModelsFolderPath, file);
    var modelName: string = await modelParser.getModelName();
    console.log(file);

    this.existingIndependentEntitiesList.push(modelName);
  }
}

import * as fs from 'fs';
import * as path from 'path';
import { Utils } from '../utils/utils';

export class ModelParser {
  private modelsFolderPath: fs.PathLike;
  private modelFileName: string;
  private modelFullPath: fs.PathLike;

  constructor(modelsFolderPath: fs.PathLike, modelFileName: string) {
    this.modelsFolderPath = modelsFolderPath;
    this.modelFileName = modelFileName;
    this.modelFullPath = path.join(modelsFolderPath.toString(), modelFileName);
  }

  public async initialize() {
    Utils.consoleLog(`Start parsing existing model: ${this.modelsFolderPath}`);
    await fs.readFile(this.modelFullPath, (err, file) => Utils.consoleLog(`Error on ${file}: ${err.message}`));
  }

  public async getModelName(): Promise<string> {
    if (this.modelFileName === null) {
      await this.initialize();
    }

    const modelFileNameWithoutExtension = this.modelFileName.replace('.dart', '');
    return Utils.getEntityNameInPascalCase(modelFileNameWithoutExtension);
  }
}

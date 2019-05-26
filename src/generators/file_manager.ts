import * as fs from 'fs';
import { promisify } from 'util';
import { showCriticalError } from '../helper/messaging';
import { Utils } from '../utils/utils';

const writeFile = promisify(fs.writeFile);

export class FileManager {
  public static async addFileWithContent(generatedFilePath: string, generatedFileContent: string) {
    try {
      await writeFile(generatedFilePath, generatedFileContent, 'utf8');
      Utils.consoleLog(`The file ${generatedFilePath} was created.`);
    } catch (error) {
      Utils.consoleLog(`Something went wrong. The content file ${generatedFilePath} was not created.`);
      showCriticalError(error);
    }
  }
}

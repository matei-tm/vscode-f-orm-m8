import * as fs from 'fs';
import { promisify } from 'util';
import { showCriticalError } from '../helper/messaging';

const writeFile = promisify(fs.writeFile);

export class FileManager {
  public static async addFileWithContent(generatedFilePath: string, generatedFileContent: string) {
    try {
      await writeFile(generatedFilePath, generatedFileContent, 'utf8');
      console.log(`The file ${generatedFilePath} was created.`);
    } catch (error) {
      console.log(`Something went wrong. The content file ${generatedFilePath} was not created.`);
      showCriticalError(error);
    }
  }
}

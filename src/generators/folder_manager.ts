import * as fs from 'fs';
import { promisify } from 'util';
import { showCriticalError } from '../helper/messaging';
const mkdir = promisify(fs.mkdir);
import * as Path from 'path';

export class FolderManager {
  public currentFolder: string;
  public fragmentsFolderPath: string;
  public fragmentRowsFolderPath: string;
  public modelsFolderPath: string;
  public independentModelsFolderPath: string;
  public accountRelatedModelsFolderPath: string;

  constructor(currentFolder: string | undefined) {
    this.currentFolder = currentFolder || '';
    this.fragmentsFolderPath = Path.join(this.currentFolder, 'lib', 'fragments');
    this.fragmentRowsFolderPath = Path.join(this.fragmentsFolderPath, 'rows');
    this.modelsFolderPath = Path.join(this.currentFolder, 'lib', 'models');
    this.independentModelsFolderPath = Path.join(this.currentFolder, 'lib', 'models', 'independent');
    this.accountRelatedModelsFolderPath = Path.join(this.currentFolder, 'lib', 'models', 'accountrelated');

    this.init();
  }

  public async init() {
    await this.addWorkspaceFolder(this.modelsFolderPath);
    await this.addWorkspaceFolder(this.independentModelsFolderPath);
    await this.addWorkspaceFolder(this.accountRelatedModelsFolderPath);
  }

  public async addWorkspaceFolder(workspaceFolderPath: fs.PathLike) {
    try {
      if (fs.existsSync(workspaceFolderPath)) {
        console.log(`The folder ${workspaceFolderPath} exists.`);
        return;
      }

      await mkdir(workspaceFolderPath);
      console.log(`The folder ${workspaceFolderPath} was created.`);
    } catch (error) {
      console.log(`Something went wrong. The folder ${workspaceFolderPath} was not created.`);
      showCriticalError(error);
      return;
    }
  }

  public userAccountExists(): boolean {
    if (fs.existsSync(Path.join(this.modelsFolderPath, 'user_account.dart'))) {
      return true;
    }

    return false;
  }
}

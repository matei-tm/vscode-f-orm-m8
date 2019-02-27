import { promisify } from "util";
import * as fs from 'fs';
import { showCriticalError } from "../helper/messaging";
const mkdir = promisify(fs.mkdir);

export class FolderManager {
    static async addWorkspaceFolder(workspaceFolderPath: fs.PathLike) {

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
}
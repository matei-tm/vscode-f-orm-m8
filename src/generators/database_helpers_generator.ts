import * as fs from 'fs';
//import * as path from 'path';
import getDatabaseHelper from "../templates/database/database_helper";
export class DatabaseHelpersGenerator {
    private helpersDatabaseFolderPath: fs.PathLike;    
    private extensionVersion: string;

    constructor(helpersDatabaseFolderPath: fs.PathLike, extensionVersion: string) {
        this.helpersDatabaseFolderPath = helpersDatabaseFolderPath; 
        this.extensionVersion = extensionVersion;       
    }

    async  addDatabaseHelper(modelsList: string[]) {
        const abstractDatabaseHelperContent = getDatabaseHelper(
            this.extensionVersion,
            "//importsMixinConcatenation",
            "//mixinHelpersConcatenation",
            "//createTablesConcatenation",
            "//deleteEntitiesDataConcatenation");

        var abstractDatabaseHelperFilePath = this.helpersDatabaseFolderPath + "/database_helper.dart";

        await this.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }
}
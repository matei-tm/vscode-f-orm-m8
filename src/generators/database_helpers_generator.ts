import * as fs from 'fs';
//import * as path from 'path';
import getDatabaseHelper from "../templates/database/database_helper";
import { FileManager } from './file_manager';
import { Utils } from '../utils/utils';
import getUserAccountDatabaseHelper from '../templates/database/user_account_database_helper';
import getConcreteEntityDatabaseHelper from '../templates/database/concrete_entity_database_helper';
export class DatabaseHelpersGenerator {
    private helpersDatabaseFolderPath: fs.PathLike;
    private extensionVersion: string;
    private packageName: string;

    constructor(helpersDatabaseFolderPath: fs.PathLike, packageName: string, extensionVersion: string) {
        this.helpersDatabaseFolderPath = helpersDatabaseFolderPath;
        this.packageName = packageName;
        this.extensionVersion = extensionVersion;
    }

    async addUserAccountDatabaseHelper() {

    }

    async addConcreteEntityDatabaseHelper(modelNameInPascalCase: string){
        var modelNameInUnderscoreCase = Utils.getUnderscoreCase(modelNameInPascalCase);
        var concreteEntityDatabaseHelperFilePath = this.helpersDatabaseFolderPath + `/${modelNameInUnderscoreCase}_database_helper.dart`;
        var concreteEntityDatabaseHelperContent = getConcreteEntityDatabaseHelper(this.extensionVersion, this.packageName, modelNameInPascalCase, "");
        await FileManager.addFileWithContent(concreteEntityDatabaseHelperFilePath, concreteEntityDatabaseHelperContent);
    }

    async  addDatabaseHelper(modelsList: string[]) {
        var importsMixinConcatenation = modelsList.map((modelName) => `import 'package:${this.packageName}/helpers/database/` + Utils.getUnderscoreCase(modelName) + "_database_helper.dart';").join("\n");
        var mixinHelpersConcatenation = " with " + modelsList.map((modelName) => modelName + "DatabaseHelper").join(", ");

        var createTablesConcatenation = modelsList.map((modelName) => "    await create" + modelName + "Table(db);").join("\n");
        var deleteEntitiesDataConcatenation = modelsList.map((modelName) => "    await delete" + Utils.getEntityNamePluralsInPascalCase(modelName) + "All();").join("\n");

        const abstractDatabaseHelperContent = getDatabaseHelper(
            this.extensionVersion,
            importsMixinConcatenation,
            mixinHelpersConcatenation,
            createTablesConcatenation,
            deleteEntitiesDataConcatenation
        );

        var abstractDatabaseHelperFilePath = this.helpersDatabaseFolderPath + "/database_helper.dart";

        await FileManager.addFileWithContent(abstractDatabaseHelperFilePath, abstractDatabaseHelperContent);
    }
}
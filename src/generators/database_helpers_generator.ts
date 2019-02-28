import * as fs from 'fs';
//import * as path from 'path';
import getDatabaseHelper from "../templates/database/database_helper";
import { FileManager } from './file_manager';
import { Utils } from '../utils/utils';
import getUserAccountDatabaseHelper from '../templates/database/user_account_database_helper';
import getConcreteAccountRelatedEntityDatabaseHelper from '../templates/database/concrete_account_related_entity_database_helper';
import getConcreteIndependentEntityDatabaseHelper from '../templates/database/concrete_independent_entity_database_helper';

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
        var userAccountDatabaseHelperFilePath = this.helpersDatabaseFolderPath + "/user_account_database_helper.dart";
        var userAccountDatabaseHelperContent = getUserAccountDatabaseHelper(this.extensionVersion, this.packageName);
        await FileManager.addFileWithContent(userAccountDatabaseHelperFilePath, userAccountDatabaseHelperContent);
    }

    async addConcreteAccountRelatedEntityDatabaseHelper(modelNameInPascalCase: string) {
        var modelNameInUnderscoreCase = Utils.getUnderscoreCase(modelNameInPascalCase);
        var concreteEntityDatabaseHelperFilePath = this.helpersDatabaseFolderPath + `/${modelNameInUnderscoreCase}_database_helper.dart`;
        var concreteEntityDatabaseHelperContent = getConcreteAccountRelatedEntityDatabaseHelper(this.extensionVersion, this.packageName, modelNameInPascalCase, "");
        await FileManager.addFileWithContent(concreteEntityDatabaseHelperFilePath, concreteEntityDatabaseHelperContent);
    }

    async addConcreteIndependentEntityDatabaseHelper(modelNameInPascalCase: string) {
        var modelNameInUnderscoreCase = Utils.getUnderscoreCase(modelNameInPascalCase);
        var concreteEntityDatabaseHelperFilePath = this.helpersDatabaseFolderPath + `/${modelNameInUnderscoreCase}_database_helper.dart`;
        var concreteEntityDatabaseHelperContent = getConcreteIndependentEntityDatabaseHelper(this.extensionVersion, this.packageName, modelNameInPascalCase, "");
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
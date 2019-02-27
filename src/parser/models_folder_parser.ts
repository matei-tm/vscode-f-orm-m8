import * as fs from 'fs';
import { ModelParser } from './model_parser';
import { DatabaseHelpersGenerator } from '../generators/database_helpers_generator';

export class ModelsFolderParser {

    private modelsFolderPath: fs.PathLike;
    private existingEntitiesList: string[] = [];
    private databaseHelperGenerator: DatabaseHelpersGenerator;

    constructor(modelsFolderPath: fs.PathLike, databaseHelpersGenerator: DatabaseHelpersGenerator) {
        this.modelsFolderPath = modelsFolderPath;
        this.databaseHelperGenerator = databaseHelpersGenerator;
    }

    async parseFolderExistingContent(): Promise<string[]> {
        console.log("Start parsing existing models:");
        fs.readdir(this.modelsFolderPath, (err, files) => {
            files.map(async (file) => {
                await this.processModelFile(file);
            });
        });

        return this.existingEntitiesList;
    }

    private async processModelFile(file: string) {
        var modelParser: ModelParser = new ModelParser(this.modelsFolderPath, file);
        var modelName: string = await modelParser.getModelName();
        console.log(file);

        //todo deep analisys of decorators
        if (modelName !== "UserAccount") {
            this.databaseHelperGenerator.addConcreteEntityDatabaseHelper(modelName);
        }
        this.existingEntitiesList.push(modelName);
    }

    patchDatabaseHelperWithMixins() {

    }
}
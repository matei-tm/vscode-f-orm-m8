import * as fs from 'fs';
import { ModelParser } from './model_parser';

export class ModelsFolderParser {

    private modelsFolderPath: fs.PathLike;
    private existingEntitiesList: string[] = [];
    //private newEntitiesList: string[] = [];

    constructor(modelsFolderPath: fs.PathLike) {
        this.modelsFolderPath = modelsFolderPath;
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

    async parseFolderNewContent(newModelFiles: string[]) {
        console.log("Start parsing new models:");
        newModelFiles.forEach(async (file) => {
            await this.processModelFile(file);
        });
    }

    private async processModelFile(file: string) {
        var modelParser: ModelParser = new ModelParser(this.modelsFolderPath, file);
        var modelName: string = await modelParser.getModelName();
        console.log(file);
        this.existingEntitiesList.push(modelName);
    }

    patchDatabaseHelperWithMixins() {

    }
}
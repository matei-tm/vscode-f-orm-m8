import * as fs from 'fs';

export class ModelsFolderParser {

    modelsFolderPath: fs.PathLike;

    constructor(modelsFolderPath: fs.PathLike) {
        this.modelsFolderPath = modelsFolderPath;
    }

    async parseFolderExistingContent() {
        console.log("Start parsing existing models:");
        fs.readdir(this.modelsFolderPath, (err, files) => { files.forEach((file) => console.log(file)); });
    }

    async parseFolderNewContent(newModelFiles: string[]) {
        console.log("Start parsing new models:");
        newModelFiles.forEach((file) => console.log(file));
    }
}
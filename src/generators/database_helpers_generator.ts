import * as fs from 'fs';
import * as path from 'path';

export class DatabaseHelpersGenerator {
    private helpersFolderPath: fs.PathLike;    

    constructor(helpersFolderPath: fs.PathLike) {
        this.helpersFolderPath = helpersFolderPath;        
    }
}
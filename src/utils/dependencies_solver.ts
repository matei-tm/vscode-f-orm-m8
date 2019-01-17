class DependenciesSolver{
    static async addDependency(packageName: string){
      throw new Error("Method not implemented.");
    }

    static async addDependencyOnSqflite(){
        this.addDependency('sqflite: "^0.13.0"');
    }
}
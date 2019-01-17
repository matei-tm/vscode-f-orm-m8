class DependenciesSolver {
    static async solveDependency(packageName: string) {
        throw new Error("Method not implemented.");
    }

    static async solveDependencyOnSqflite() {
        await this.solveDependency('sqflite: "^0.13.0"');
    }
}
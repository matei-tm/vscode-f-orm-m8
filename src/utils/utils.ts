const pluralize = require("pluralize");

export class Utils {
  static getEntityNamePluralsInPascalCase(entityNameInPascalCase: string): string {
    var expandWithSpaces = entityNameInPascalCase.replace(/([a-z])([A-Z])/g, '$1 $2');
    var wordsArray = expandWithSpaces.split(' ');

    wordsArray[wordsArray.length - 1] = pluralize(wordsArray[wordsArray.length - 1]);

    var entityNamePlural = wordsArray.join('');

    return entityNamePlural;
  }

  static getEntityNameInCamelCase(entityNameInPascalCase: string): string {
    return entityNameInPascalCase.substr(0, 1).toUpperCase() + entityNameInPascalCase.substr(1);
  }

  static getUnderscoreCase(entityNameInPascalCase: string): string {
    return entityNameInPascalCase.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }

  static getUnderscoreCasePlural(entityNameInPascalCase: string): string {
    var entityNamePluralsInPascalCase = Utils.getEntityNamePluralsInPascalCase(entityNameInPascalCase);
    return entityNamePluralsInPascalCase.replace(/([a-z])([A-Z])/g, '$1_$2').toLowerCase();
  }
}
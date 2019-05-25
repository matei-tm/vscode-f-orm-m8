const pluralize = require('pluralize');

export type Tuple = [string, string];
export class Utils {
  static getEntityNamePluralsInPascalCase(entityNameInPascalCase: string): string {
    var expandLowerUpperWithSpaces = entityNameInPascalCase.replace(/([a-z])([A-Z])/g, '$1 $2');
    var expandDigitUpperWithSpaces = expandLowerUpperWithSpaces.replace(/([0-9])([A-Z])/g, '$1 $2');

    var wordsArray = expandDigitUpperWithSpaces.split(' ');

    wordsArray[wordsArray.length - 1] = pluralize(wordsArray[wordsArray.length - 1]);

    var entityNamePlural = wordsArray.join('');

    return entityNamePlural;
  }

  static getEntityNameInCamelCase(entityNameInPascalCase: string): string {
    return entityNameInPascalCase.substr(0, 1).toLowerCase() + entityNameInPascalCase.substr(1);
  }

  static getUnderscoreCase(entityNameInPascalCase: string): string {
    var expandLowerUpperWithSpaces = entityNameInPascalCase.replace(/([a-z])([A-Z])/g, '$1_$2');
    var expandDigitUpperWithSpaces = expandLowerUpperWithSpaces.replace(/([0-9])([A-Z])/g, '$1_$2');

    return expandDigitUpperWithSpaces.toLowerCase();
  }

  static getEntityNameInPascalCase(entityNameInUnderscoreCase: string) {
    var entityNameInPascalCase = entityNameInUnderscoreCase
      .split('_')
      .map(slice => slice.substr(0, 1).toUpperCase() + slice.substr(1))
      .join('');

    return entityNameInPascalCase;
  }

  static getUnderscoreCasePlural(entityNameInPascalCase: string): string {
    var entityNamePluralsInPascalCase = Utils.getEntityNamePluralsInPascalCase(entityNameInPascalCase);

    var expandLowerUpperWithSpaces = entityNamePluralsInPascalCase.replace(/([a-z])([A-Z])/g, '$1_$2');
    var expandDigitUpperWithSpaces = expandLowerUpperWithSpaces.replace(/([0-9])([A-Z])/g, '$1_$2');

    return expandDigitUpperWithSpaces.toLowerCase();
  }
}

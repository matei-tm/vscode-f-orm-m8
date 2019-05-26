export type Tuple = [string, string];
export class Utils {
  public static getEntityNamePluralsInPascalCase(entityNameInPascalCase: string): string {
    const expandLowerUpperWithSpaces = entityNameInPascalCase.replace(/([a-z])([A-Z])/g, '$1 $2');
    const expandDigitUpperWithSpaces = expandLowerUpperWithSpaces.replace(/([0-9])([A-Z])/g, '$1 $2');

    const wordsArray = expandDigitUpperWithSpaces.split(' ');

    wordsArray[wordsArray.length - 1] = require('pluralize')(wordsArray[wordsArray.length - 1]);

    const entityNamePlural = wordsArray.join('');

    return entityNamePlural;
  }

  public static getEntityNameInCamelCase(entityNameInPascalCase: string): string {
    return entityNameInPascalCase.substr(0, 1).toLowerCase() + entityNameInPascalCase.substr(1);
  }

  public static getUnderscoreCase(entityNameInPascalCase: string): string {
    const expandLowerUpperWithSpaces = entityNameInPascalCase.replace(/([a-z])([A-Z])/g, '$1_$2');
    const expandDigitUpperWithSpaces = expandLowerUpperWithSpaces.replace(/([0-9])([A-Z])/g, '$1_$2');

    return expandDigitUpperWithSpaces.toLowerCase();
  }

  public static getEntityNameInPascalCase(entityNameInUnderscoreCase: string) {
    const entityNameInPascalCase = entityNameInUnderscoreCase
      .split('_')
      .map(slice => slice.substr(0, 1).toUpperCase() + slice.substr(1))
      .join('');

    return entityNameInPascalCase;
  }

  public static getUnderscoreCasePlural(entityNameInPascalCase: string): string {
    const entityNamePluralsInPascalCase = Utils.getEntityNamePluralsInPascalCase(entityNameInPascalCase);

    const expandLowerUpperWithSpaces = entityNamePluralsInPascalCase.replace(/([a-z])([A-Z])/g, '$1_$2');
    const expandDigitUpperWithSpaces = expandLowerUpperWithSpaces.replace(/([0-9])([A-Z])/g, '$1_$2');

    return expandDigitUpperWithSpaces.toLowerCase();
  }

  public static consoleLog(message: string) {
    console.log(message);
  }
}

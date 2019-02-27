import { Utils } from "../../utils/utils";
import getHeadingWarning from "../heading_warning";

/**
 * Generates the content for the /helpers/database/database_helper.dart file
 * Returns a string with the content
 *
 * @param version: string,
 * @param packageName: string, 
 * @param entityNameInPascalCase: string, 
 * @param tableColumnsDefinitionConcatenation: string
*/

export default function getConcreteEntityDatabaseHelper(
  version: string,
  packageName: string,
  entityNameInPascalCase: string,
  tableColumnsDefinitionConcatenation: string
): string {

  var entityNameInUnderscoreCase = Utils.getUnderscoreCase(entityNameInPascalCase);
  var entityNameInCamelCase = Utils.getEntityNameInCamelCase(entityNameInPascalCase);
  var entityNamePluralsInPascalCase = Utils.getEntityNamePluralsInPascalCase(entityNameInPascalCase);

  var headingWarning = getHeadingWarning(version);
  
  return `${headingWarning}
import 'package:sqflite/sqflite.dart';
import 'package:${packageName}/helpers/database/abstract_database_helper.dart';
import 'package:${packageName}/models/${entityNameInUnderscoreCase}.dart';

mixin ${entityNameInPascalCase}DatabaseHelper implements AbstractDatabaseHelper {
  Future<Database> db;
  final String columnId = 'id';

  final String _${entityNameInCamelCase}Table = '${entityNameInCamelCase}';

  Future create${entityNameInPascalCase}Table(Database db) async {
    await db.execute(
        'CREATE TABLE $_${entityNameInCamelCase}Table ($columnId INTEGER PRIMARY KEY, account_id INTEGER, record_date INTEGER, is_deleted INTEGER ${tableColumnsDefinitionConcatenation})');
    // TODO: FOREIGN KEY (account_id) REFERENCES userAccount (id)
  }

  Future<int> save${entityNameInPascalCase}(${entityNameInPascalCase} ${entityNameInCamelCase}) async {
    var dbClient = await db;
    var result = await dbClient.insert(_${entityNameInCamelCase}Table, ${entityNameInCamelCase}.toMap());
    return result;
  }

  Future<List> get${entityNamePluralsInPascalCase}All() async {
    var dbClient = await db;
    var result =
        await dbClient.query(_${entityNameInCamelCase}Table, columns: ${entityNameInPascalCase}.columns, where: 'is_deleted != 1');

    return result.toList();
  }

  Future<List> get${entityNamePluralsInPascalCase}ByAccountId(int accountId) async {
    var dbClient = await db;
    var result = await dbClient.query(_${entityNameInCamelCase}Table,
        columns: ${entityNameInPascalCase}.columns,
        where: 'account_id = ? AND is_deleted != 1',
        whereArgs: [accountId]);

    return result.toList();
  }

  Future<int> get${entityNamePluralsInPascalCase}Count() async {
    var dbClient = await db;
    return Sqflite.firstIntValue(
        await dbClient.rawQuery('SELECT COUNT(*) FROM $_${entityNameInCamelCase}Table  WHERE is_deleted != 1'));
  }

  Future<${entityNameInPascalCase}> get${entityNameInPascalCase}(int id) async {
    var dbClient = await db;
    List<Map> result = await dbClient.query(_${entityNameInCamelCase}Table,
        columns: ${entityNameInPascalCase}.columns, where: '$columnId = ?  AND is_deleted != 1', whereArgs: [id]);

    if (result.length > 0) {
      return ${entityNameInPascalCase}.fromMap(result.first);
    }

    return null;
  }

  Future<int> delete${entityNameInPascalCase}(int id) async {
    var dbClient = await db;
    return await dbClient
        .delete(_${entityNameInCamelCase}Table, where: '$columnId = ?', whereArgs: [id]);
  }

  Future<bool> delete${entityNamePluralsInPascalCase}All() async {
    var dbClient = await db;
    await dbClient.delete(_${entityNameInCamelCase}Table);
    return true;
  }

  Future<int> update${entityNameInPascalCase}(${entityNameInPascalCase} ${entityNameInCamelCase}) async {
    var dbClient = await db;
    return await dbClient.update(_${entityNameInCamelCase}Table, ${entityNameInCamelCase}.toMap(),
        where: "$columnId = ?", whereArgs: [${entityNameInCamelCase}.id]);
  }

  Future<int> softdelete${entityNameInPascalCase}(int id) async {
    var dbClient = await db;

    var map = Map<String, dynamic>();
    map['is_deleted'] = 1;

    return await dbClient
        .update(_${entityNameInCamelCase}Table, map, where: "$columnId = ?", whereArgs: [id]);
  }
}

`;
}


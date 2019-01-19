import getHeadingWarning from "../heading_warning";

/**
 * Generates the content for the /helpers/database/database_helper.dart file
 * Returns a string with the content
 * 
 * @param importsMixinConcatenation is the concatenation of imports "import 'package:${project_package}/helpers/database/${entity_name}_database_helper.dart';"
 * @param mixinHelpersConcatenation is the concatenation of mixin classes "${EntityName}DatabaseHelper"
 * @param createTablesConcatenation is the concatenation of "await create${EntityName}Table(db);"
*/
export default function getDatabaseHelper(
  version: string,
  importsMixinConcatenation: string,
  mixinHelpersConcatenation: string,
  createTablesConcatenation: string): string {

  var headingWarning = getHeadingWarning(version);

  return `${headingWarning}
import 'dart:async';

import 'package:sqflite/sqflite.dart';
import 'package:path/path.dart';
${importsMixinConcatenation}

class DatabaseHelper ${mixinHelpersConcatenation} 
{
  static final DatabaseHelper _instance = new DatabaseHelper.internal();

  factory DatabaseHelper() => _instance;
  DatabaseHelper.internal();

  static Database _db;

  Future<Database> get db async {
    if (_db != null) {
      return _db;
    }
    _db = await initDb();

    return _db;
  }

  initDb() async {
    String databasesPath = await getDatabasesPath();
    String path = join(databasesPath, 'emer_store_10.db');

    var db = await openDatabase(path, version: 2, onCreate: _onCreate);
    return db;
  }

  void _onCreate(Database db, int newVersion) async {
    ${createTablesConcatenation}
  }

  Future close() async {
    var dbClient = await db;
    return dbClient.close();
  }
}
`;
}
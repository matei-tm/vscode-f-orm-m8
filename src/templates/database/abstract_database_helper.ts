import getHeadingWarning from "../heading_warning";

/**
 * Generates the content for the /helpers/database/abstract_database_helper.dart file
 * Returns a string with the content
*/

export default function getAbstractDatabaseHelper(version: string): string {
  var headingWarning = getHeadingWarning(version);
  
  return `${headingWarning}
import 'package:sqflite/sqflite.dart';

abstract class AbstractDatabaseHelper {
  Future<Database> db;
  final String columnId = 'id';
}
`;
}
import { Utils } from "../../utils/utils";

/**
 * Generates the content for the /helpers/database/abstract_database_helper.dart file
 * Returns a string with the content
*/

export default function getAbstractDatabaseHelper(): string {
  var headingWarning = Utils.getHeadingWarning();
  
  return `
${headingWarning}
import 'package:sqflite/sqflite.dart';

abstract class AbstractDatabaseHelper {
  Future<Database> db;
  final String columnId = 'id';
}
`;
}
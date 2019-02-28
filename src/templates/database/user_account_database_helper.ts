import getHeadingWarning from "../heading_warning";

/**
 * Generates the content for the /helpers/database/user_account_database_helper.dart file
 * Returns a string with the content
 * 

*/
export default function getUserAccountDatabaseHelper(
  version: string,
  packageName: string): string {

  var headingWarning = getHeadingWarning(version);


  return `${headingWarning}

import 'package:sqflite/sqflite.dart';
import 'package:${packageName}/helpers/database/abstract_database_helper.dart';
import 'package:${packageName}/models/user_account.dart';

mixin UserAccountDatabaseHelper implements AbstractDatabaseHelper {
  Future<Database> db;
  final String columnId = 'id';

  final List<String> userAccountColumns = [
    "id",
    "account_name",
    "account_email",
    "account_abbr"
  ];

  String _userAccountTable = 'userAccount';

  Future createUserAccountTable(Database db) async {
    await db.execute(
        'CREATE TABLE $_userAccountTable ($columnId INTEGER PRIMARY KEY, account_name TEXT, account_email TEXT, account_abbr TEXT, is_deleted INTEGER)');
  }

  Future<int> saveUserAccount(UserAccount userAccount) async {
    var dbClient = await db;
    var result = await dbClient.insert(_userAccountTable, userAccount.toMap());
    return result;
  }

  Future<List> getUserAccountsAll() async {
    var dbClient = await db;
    var result =
        await dbClient.query(_userAccountTable, columns: userAccountColumns, where: 'is_deleted != 1');

    return result.toList();
  }

  Future<List> getUserAccountsAllOther(int id) async {
    var dbClient = await db;
    var result = await dbClient.query(_userAccountTable,
        columns: userAccountColumns, where: '$columnId != ? AND is_deleted != 1', whereArgs: [id]);

    return result.toList();
  }

  Future<int> getUserAccountsCount() async {
    var dbClient = await db;
    return Sqflite.firstIntValue(
        await dbClient.rawQuery('SELECT COUNT(*) FROM $_userAccountTable WHERE is_deleted != 1'));
  }

  Future<UserAccount> getUserAccount(int id) async {
    var dbClient = await db;
    List<Map> result = await dbClient.query(_userAccountTable,
        columns: userAccountColumns, where: '$columnId = ? AND is_deleted != 1', whereArgs: [id]);

    if (result.length > 0) {
      return UserAccount.fromMap(result.first);
    }

    return null;
  }

  Future<UserAccount> getUserAccountByEmail(String email) async {
    var dbClient = await db;
    List<Map> result = await dbClient.query(_userAccountTable,
        columns: userAccountColumns,
        where: 'account_email = ?  AND is_deleted != 1',
        whereArgs: [email]);

    if (result.length > 0) {
      return UserAccount.fromMap(result.first);
    }

    return null;
  }

  Future<int> deleteUserAccount(int id) async {
    var dbClient = await db;
    return await dbClient
        .delete(_userAccountTable, where: '$columnId = ?', whereArgs: [id]);
  }

  Future<bool> deleteUserAccountsAll() async {
    var dbClient = await db;
    await dbClient.delete(_userAccountTable);
    return true;
  }

  Future<int> updateUserAccount(UserAccount userAccount) async {
    var dbClient = await db;
    return await dbClient.update(_userAccountTable, userAccount.toMap(),
        where: "$columnId = ?", whereArgs: [userAccount.id]);
  }

  Future<int> softdeleteAccount(int id) async {
    var dbClient = await db;

    var map = Map<String, dynamic>();
    map['is_deleted'] = 1;

    return await dbClient.update(_userAccountTable, map,
        where: "$columnId = ?", whereArgs: [id]);
  }
}
`;
}
/**
 * Generates the content for the /models/db_entity.dart file
 * Returns a string with the content
*/
export default function getConcreteEntitySkeletonContent(
  packageName: string,
  entityNameInPascalCase: string,
): string {
  return `

import 'package:${packageName}/models/db_entity.dart';

class ${entityNameInPascalCase} implements DbEntity {
  int _id;
  int _accountId;
  String _entryName;
  int _recordDate;

  static final columns = ["id", "account_id", "entry_name", "record_date"];

  ${entityNameInPascalCase}(this._entryName, this._recordDate, this._accountId);

  ${entityNameInPascalCase}.empty() {
    _entryName = "";
  }

  void setId(int newId) {
    _id = newId;
  }

  ${entityNameInPascalCase}.map(dynamic obj) {
    this._id = obj['id'];
    this._accountId = obj['account_id'];
    this._entryName = obj['entry_name'];
    this._recordDate = obj['record_date'];
  }

  ${entityNameInPascalCase}.fromMap(Map<String, dynamic> map) {
    this._id = map['id'];
    this._accountId = map['account_id'];
    this._entryName = map['entry_name'];
    this._recordDate = map['record_date'];
  }

  int get id => _id;
  int get accountId => _accountId;
  String get entryName => _entryName;
  int get recordDate => _recordDate;

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    if (_id != null) {
      map['id'] = _id;
    }
    map['account_id'] = _accountId;
    map['entry_name'] = _entryName;
    map['record_date'] = _recordDate;

    return map;
  }
}
`;
}
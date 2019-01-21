import getHeadingWarning from "../heading_warning";

interface IPropertyType {
  columnName: string;
  columnType: string;
}

/**
 * Generates the content for the /models/db_entity.dart file
 * Returns a string with the content
*/
export default function getConcreteEntitySkeletonContent(
  version: string,
  packageName: string,
  entityNameInPascalCase: string,
  propertiesList: { [id: string]: IPropertyType } = {}
): string {
  var headingWarning = getHeadingWarning(version);

  return `${headingWarning}

import 'package:${packageName}/database/db_entity.dart';

class ${entityNameInPascalCase} implements DbEntity {
  int _id;
  int _accountId;
  int _recordDate;
  int _isDeleted;

  String _entryName;

  static final columns = ["id", "account_id", "record_date", "is_deleted", "entry_name"];

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
    this._recordDate = obj['record_date'];
    this._isDeleted = obj['is_deleted'];

    this._entryName = obj['entry_name'];
  }

  ${entityNameInPascalCase}.fromMap(Map<String, dynamic> map) {
    this._id = map['id'];
    this._accountId = map['account_id'];
    this._recordDate = map['record_date'];
    this._isDeleted = map['isDeleted'];

    this._entryName = map['entry_name'];
  }

  int get id => _id;
  int get accountId => _accountId;
  int get recordDate => _recordDate;
  int get isDeleted => _isDeleted;

  String get entryName => _entryName;

  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    if (_id != null) {
      map['id'] = _id;
    }
    map['account_id'] = _accountId;
    map['record_date'] = _recordDate;
    map['is_deleted'] = _isDeleted;

    map['entry_name'] = _entryName;
    return map;
  }
}
`;
}
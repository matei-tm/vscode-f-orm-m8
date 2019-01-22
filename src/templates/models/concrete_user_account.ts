import getHeadingWarning from "../heading_warning";

export default function getConcreteUserAccountContent(
  version: string,
  packageName: string, ): string {
  var headingWarning = getHeadingWarning(version);

  return `${headingWarning}
  import 'package:${packageName}/helpers/database/db_entity.dart';

class UserAccount implements DbAccountEntity {
  int _id;
  String _accountName;
  String _accountEmail;
  String _accountAbbr;

  static final List<String> columns = [
    "id",
    "account_name",
    "account_email",
    "account_abbr"
  ];

  UserAccount(this._accountName, this._accountEmail, this._accountAbbr);

  @override
  UserAccount.empty() {
    _accountName = "";
    _accountEmail = "";
    _accountAbbr = "";
  }

  @override
  UserAccount.map(dynamic obj) {
    this._id = obj['id'];
    this._accountName = obj['account_name'];
    this._accountEmail = obj['account_email'];
    this._accountAbbr = obj['account_abbr'];
  }

  @override
  UserAccount.fromMap(Map<String, dynamic> map) {
    this._id = map['id'];
    this._accountName = map['account_name'];
    this._accountEmail = map['account_email'];
    this._accountAbbr = map['account_abbr'];
  }

  @override
  int get id => _id;

  String get accountName => _accountName;
  String get accountEmail => _accountEmail;
  String get accountAbbr => _accountAbbr;

  @override
  Map<String, dynamic> toMap() {
    var map = new Map<String, dynamic>();
    if (_id != null) {
      map['id'] = _id;
    }
    map['account_name'] = _accountName;
    map['account_email'] = _accountEmail;
    map['account_abbr'] = _accountAbbr;

    return map;
  }
}
`;
}
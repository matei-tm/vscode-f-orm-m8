import getHeadingWarning from "../heading_warning";

export default function getConcreteUserAccountContent(
  version: string,
  databaseType: string, ): string {
  var headingWarning = getHeadingWarning(version, databaseType);

  return `${headingWarning}

import 'package:flutter_orm_m8/flutter_orm_m8.dart';

@DataTable("user_accounts")
class UserAccount implements DbAccountEntity {
  @DataColumn(
      "id",
      ColumnMetadata.PrimaryKey |
          ColumnMetadata.Unique |
          ColumnMetadata.AutoIncrement)
  @override
  int id;

  @DataColumn("user_name", ColumnMetadata.NotNull)
  @override
  String userName;

  @DataColumn("account_email", ColumnMetadata.NotNull)
  @override
  String email;

  @DataColumn("account_abbr", ColumnMetadata.NotNull)
  @override
  String abbreviation;  
}
`;
}
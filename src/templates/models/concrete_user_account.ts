import getHeadingWarning from '../heading_warning';
import { DatabaseType } from '../../helper/database_type';

export default function getConcreteUserAccountContent(version: string, databaseType: DatabaseType): string {
  var headingWarning = getHeadingWarning(version, databaseType);

  return `${headingWarning}

import 'package:f_orm_m8/f_orm_m8.dart';

@DataTable("user_accounts")
class UserAccount implements DbAccountEntity {
  @DataColumn(
      "id",
      metadataLevel: ColumnMetadata.primaryKey |
          ColumnMetadata.autoIncrement)
  @override
  int id;

  @DataColumn("user_name", metadataLevel: ColumnMetadata.notNull)
  @override
  String userName;

  @DataColumn("account_email", metadataLevel: ColumnMetadata.notNull)
  @override
  String email;

  @DataColumn("account_abbr", metadataLevel: ColumnMetadata.notNull)
  @override
  String abbreviation;

  @DataColumn("is_current")
  bool isCurrent;
}
`;
}

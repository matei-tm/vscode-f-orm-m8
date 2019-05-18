import getHeadingWarning from "../heading_warning";
import { Utils } from "../../utils/utils";
import { IPropertyType } from "../../helper/property_type";
import { DatabaseType } from "../../helper/database_type";


/**
 * Generates the content for the /models/db_entity.dart file
 * Returns a string with the content
*/
export default function getConcreteAccountRelatedEntitySkeletonContent(
  version: string,
  databaseType: DatabaseType,
  entityNameInPascalCase: string,
  propertiesList: { [id: string]: IPropertyType } = {}
): string {
  var headingWarning = getHeadingWarning(version, databaseType);
  var entityNameInUnderscoreCase = Utils.getUnderscoreCasePlural(entityNameInPascalCase);

  return `${headingWarning}

import 'package:f_orm_m8/f_orm_m8.dart';

@DataTable("${entityNameInUnderscoreCase}")
class ${entityNameInPascalCase} implements DbAccountRelatedEntity {
  @DataColumn(
    "id",
    ColumnMetadata.PrimaryKey |
        ColumnMetadata.Unique |
        ColumnMetadata.AutoIncrement)
  @override
  int id;

  @DataColumn("account_id")
  @override
  int accountId;

  String todoField; 
}
`;
}
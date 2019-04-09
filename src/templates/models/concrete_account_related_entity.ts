import getHeadingWarning from "../heading_warning";
import { Utils } from "../../utils/utils";

interface IPropertyType {
  columnName: string;
  columnType: string;
}

/**
 * Generates the content for the /models/db_entity.dart file
 * Returns a string with the content
*/
export default function getConcreteAccountRelatedEntitySkeletonContent(
  version: string,
  packageName: string,
  entityNameInPascalCase: string,
  propertiesList: { [id: string]: IPropertyType } = {}
): string {
  var headingWarning = getHeadingWarning(version);
  var entityNameInUnderscoreCase = Utils.getUnderscoreCasePlural(entityNameInPascalCase);

  return `${headingWarning}

import 'package:flutter_orm_m8/flutter_orm_m8.dart';

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
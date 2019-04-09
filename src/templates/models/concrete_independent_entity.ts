import getHeadingWarning from "../heading_warning";
import { Utils } from "../../utils/utils";

interface IPropertyType {
  columnName: string;
  columnType: string;
}

/**
 * Generates the content for the /models/your_model.dart file
 * Returns a string with the content
*/
export default function getConcreteIndependentEntitySkeletonContent(
  version: string,
  databaseType: string,
  entityNameInPascalCase: string,
  propertiesList: { [id: string]: IPropertyType } = {}
): string {
  var headingWarning = getHeadingWarning(version, databaseType);
  var entityNameInUnderscoreCase = Utils.getUnderscoreCasePlural(entityNameInPascalCase);

  return `${headingWarning}

import 'package:flutter_orm_m8/flutter_orm_m8.dart';

@DataTable("${entityNameInUnderscoreCase}")
class ${entityNameInPascalCase} implements DbEntity {
  @DataColumn(
    "id",
    ColumnMetadata.PrimaryKey |
        ColumnMetadata.Unique |
        ColumnMetadata.AutoIncrement)
  @override
  int id;

  @DataColumn("description")
  String description;
}
`;
}
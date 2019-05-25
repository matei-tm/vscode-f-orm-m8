import getHeadingWarning from '../heading_warning';
import { Utils } from '../../utils/utils';
import { DatabaseType } from '../../helper/database_type';
import { IPropertyType } from '../../helper/property_type';
import getSupportedTypesAsIgnored from './supported_types';

/**
 * Generates the content for the /models/your_model.dart file
 * Returns a string with the content
 */
export default function getConcreteIndependentEntitySkeletonContent(
  version: string,
  databaseType: DatabaseType,
  entityNameInPascalCase: string,
  propertiesList: { [id: string]: IPropertyType } = {},
): string {
  var headingWarning = getHeadingWarning(version, databaseType);
  var entityNameInUnderscoreCase = Utils.getUnderscoreCasePlural(entityNameInPascalCase);

  return `${headingWarning}

import 'package:f_orm_m8/f_orm_m8.dart';

@DataTable("${entityNameInUnderscoreCase}")
class ${entityNameInPascalCase} implements DbEntity {
  @DataColumn(
    "id",
    metadataLevel: ColumnMetadata.primaryKey |
        ColumnMetadata.autoIncrement)
  @override
  int id;

  @DataColumn("description", metadataLevel: ColumnMetadata.unique)
  String description;

${getSupportedTypesAsIgnored()}
}
`;
}

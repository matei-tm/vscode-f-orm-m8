import getHeadingWarning from "../heading_warning";

/**
 * Generates the content for the /models/db_entity.dart file
 * Returns a string with the content
*/
export default function getDbEntityAbastrctContent(version: string): string {
  var headingWarning = getHeadingWarning(version);
  
  return `${headingWarning}

  abstract class DbEntity {
    int get id;
  
    DbEntity.empty();
    DbEntity.map(dynamic obj);
    DbEntity.fromMap(Map<String, dynamic> map);
  
    Map<String, dynamic> toMap();
  }
  
  abstract class DbAccountEntity implements DbEntity {
    String get accountName;
    String get accountEmail;
    String get accountAbbr;
  }

  abstract class DbAccountRelatedEntity implements DbEntity {
    int get accountId;
  }
  
`;
}
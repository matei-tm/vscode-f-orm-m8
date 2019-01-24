import getHeadingWarning from "../heading_warning";

/**
 * Generates the content for the /helpers/database/annotations.dart file
 * Returns a string with the content
*/

export default function getDatabaseAnnotationsHelper(version: string): string {
  var headingWarning = getHeadingWarning(version);
  
  return `${headingWarning}
  class DataTable {
    final String name;
  
    const DataTable([this.name]);
  }
  
  const DataTable table = const DataTable();
  
  class DataColumn {
    final String name;
  
    const DataColumn([this.name]);
  }
  
  const DataColumn column = const DataColumn();
  
  class PrimaryKey {
    final String name;
  
    const PrimaryKey([this.name]);
  }
  
  const PrimaryKey primaryKey = const PrimaryKey();
  
  class AutoIncrement {
    const AutoIncrement();
  }
  
  const AutoIncrement autoIncrement = const AutoIncrement();
`;
}
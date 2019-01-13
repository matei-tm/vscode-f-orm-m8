/**
 * Generates the content for the /models/db_entity.dart file
 * Returns a string with the content
*/
export default function getDbEntityAbastrctContent(): string {
  return `
abstract class DbEntity {
  int _id;
  int get id => _id;
  
  DbEntity.empty();
  DbEntity.map(dynamic obj);
  DbEntity.fromMap(Map<String, dynamic> map);

  Map<String, dynamic> toMap();
}
`;
}
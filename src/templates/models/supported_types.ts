/**
 * Returns a string with the supported types annotated as ignored
*/
export default function getSupportedTypesAsIgnored(): string {
    const feelFreeComment: string = '/* The next field is annotated as `ignore`. Feel free to adjust or delete it according to your requirements. */'

    return `
  ${feelFreeComment}
  @DataColumn("my_future_bigint_column", metadataLevel: ColumnMetadata.ignore)
  BigInt bigintFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_bool_column", metadataLevel: ColumnMetadata.ignore)
  bool boolFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_datetime_column", metadataLevel: ColumnMetadata.ignore)
  DateTime datetimeFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_double_column", metadataLevel: ColumnMetadata.ignore)
  double doubleFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_duration_column", metadataLevel: ColumnMetadata.ignore)
  Duration durationFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_int_column", metadataLevel: ColumnMetadata.ignore)
  int intFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_num_column", metadataLevel: ColumnMetadata.ignore)
  num numFutureField;

  ${feelFreeComment}
  @DataColumn("my_future_string_column", metadataLevel: ColumnMetadata.ignore)
  String stringFutureField;
`;
}
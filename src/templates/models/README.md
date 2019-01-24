Use the following example to annotate model classes

```dart  
@DataTable("profile_contacts")
class ProfileContact {
  @DataColumn("profile_contact_first_name")
  @primaryKey
  @autoIncrement
  String firstName;
}

@table
class UserAccount {
  @column
  String name;
}
```
import * as SQLite from 'expo-sqlite'

const dbUser = SQLite.openDatabase("financadbuser.db")

dbUser.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
  console.log('Foreign keys turned on')
);

export default dbUser
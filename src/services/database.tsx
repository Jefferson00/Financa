import * as SQLite from 'expo-sqlite'

const db = SQLite.openDatabase("financadb8.db")

db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
  console.log('Foreign keys turned on')
);

export default db
import * as SQLite from 'expo-sqlite'

/*import {useUserDB} from '../contexts/auth'

export function Database(){
  const {user} = useUserDB()

  return user
}*/

  const test = 'teste'
  //const db = SQLite.openDatabase(`financadb`+test+`.db`)
  const db = SQLite.openDatabase("financadb2.db")



db.exec([{ sql: 'PRAGMA foreign_keys = ON;', args: [] }], false, () =>
  console.log('Foreign keys turned on')
);

export default db

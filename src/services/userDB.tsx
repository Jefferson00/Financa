import dbUser from './authDatabase'

dbUser.transaction((tx) => {
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    //tx.executeSql("DROP TABLE user;");
    //tx.executeSql("DROP TABLE entries;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS user (id INTEGER PRIMARY KEY AUTOINCREMENT, name TEXT, email TEXT NOT NULL UNIQUE,password TEXT,image TEXT);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        dbUser.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO user (name,email,password,image) values (?,?,?,?);",
          [obj.name,obj.email,obj.password,obj.image],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
        );
      });
    });
  };

  const findUser = (email:string) => {
    return new Promise((resolve, reject) => {
      dbUser.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM user WHERE email=?;",
          [email],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + email); // nenhum registro encontrado
          })
      })
    })
  }

  const findAll = () => {
    return new Promise((resolve, reject) => {
      dbUser.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM user ;",
          [],
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" ); // nenhum registro encontrado
          })
      })
    })
  }

  export default{
      create,
      findUser,
      findAll
  }
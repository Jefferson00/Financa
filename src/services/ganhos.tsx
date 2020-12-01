import db from './database'

db.transaction((tx) => {
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    tx.executeSql("DROP TABLE earnings;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS earnings (id INTEGER PRIMARY KEY AUTOINCREMENT, titulo TEXT, dia INT, dtInicio INT, dtFim INT, mensal BOOLEAN, recebido BOOLEAN);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO earnings (titulo,dia,dtInicio,dtFim,mensal,recebido) values (?,?,?,?,?,?);",
          [obj.titulo,obj.dia,obj.dtInicio,obj.dtFim,obj.mensal,obj.recebido],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
        );
      });
    });
  };

  const all = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM earnings;",
          [],
          //-----------------------
          (_, { rows }) => resolve(rows),
        )
      })
    })
  }

  const findByDate = (dt:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM earnings WHERE dtInicio<=? and dtFim>=?;",
          [dt,dt],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + dt); // nenhum registro encontrado
          })
      })
    })
  }

  export default{
    create,
    all,
    findByDate,
}
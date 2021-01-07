import db from './database'

db.transaction((tx) => {
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    //tx.executeSql("DROP TABLE recebidos;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS recebidos (id INTEGER PRIMARY KEY AUTOINCREMENT, month INT, year INT, recebido BOOLEAN, ganhos_id INT NOT NULL, FOREIGN KEY (ganhos_id) REFERENCES earnings (id) ON DELETE CASCADE);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO recebidos (month,year,recebido, ganhos_id) values (?,?,?,?);",
          [obj.month,obj.year,obj.recebido,obj.ganhos_id],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
        );
      });
    });
  };

  const findByDate = (month:number, year:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM recebidos WHERE month=? and year=?;",
          [month,year],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + month); // nenhum registro encontrado
          })
      })
    })
  }


  export default{
    create,
    findByDate,
}
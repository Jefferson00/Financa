import db from './database'

db.transaction((tx) => {
     //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
     tx.executeSql("DROP TABLE valuesTable;");
     //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS valuesTable (id INTEGER PRIMARY KEY AUTOINCREMENT, descricao TEXT, valor REAL, dtInicio INT, dtFim INT, ganhos_id INT NOT NULL, FOREIGN KEY (ganhos_id) REFERENCES earnings (id));"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO valuesTable (descricao,valor,dtInicio, dtFim, ganhos_id) values (?,?,?,?,?);",
          [obj.descricao,obj.valor,obj.dtInicio,obj.dtFim,obj.ganhos_id],
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
          "SELECT * FROM valuesTable;",
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
          "SELECT * FROM valuesTable INNER JOIN earnings ON valuesTable.ganhos_id = earnings.id WHERE dtInicio<=? and dtFim>=?;",
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
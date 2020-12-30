import db from './database'

db.transaction((tx) => {
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    tx.executeSql("DROP TABLE remaining;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS remaining (id INTEGER PRIMARY KEY AUTOINCREMENT, month INT, year INT, value REAL);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO remaining (month,year,value) values (?,?,?);",
          [obj.month,obj.year,obj.value],
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
          "SELECT * FROM remaining;",
          [],
          //-----------------------
          (_, { rows }) => resolve(rows),
        )
      })
    })
  }

  const findByDate = (month:number, year:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM remaining WHERE month=? and year=?;",
          [month,year],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + month + year); // nenhum registro encontrado
          })
      })
    })
  }

  const findById = (id:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM remaining WHERE id=?;",
          [id],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + id); // nenhum registro encontrado
          })
      })
    })
  }

  const update = (id: number, obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "UPDATE remaining SET month=?,year=?,value=? Where id=?;",
          [obj.month,obj.year,obj.value, id],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
        );
      });
    });
  };

  const remove = (id:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          `DELETE FROM remaining WHERE id=?;`,
          [id]
        )
      })
    })
  }

  export default{
    create,
    all,
    findByDate,
    remove,
    findById,
    update,
}
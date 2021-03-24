import db from './database'

db.transaction((tx) => {
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    //tx.executeSql("DROP TABLE earnings;");
    tx.executeSql("DROP TABLE latest;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS latest (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, day INT, month INT, type TEXT, category TEXT, amount REAL, entrie_id INT);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO latest (title,day,month,type,category,amount, entrie_id) values (?,?,?,?,?,?,?);",
          [obj.title,obj.day,obj.month,obj.type,obj.category,obj.amount,obj.entrie_id],
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
          "SELECT * FROM latest;",
          [],
          //-----------------------
          (_, { rows }) => resolve(rows),
        )
      })
    })
  }

  const findById = (id:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM latest WHERE id=?;",
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
          "UPDATE latest SET title=?,day=?,month=?,type=?,category=?,amount=?,entrie_id=? Where id=?;",
          [obj.title,obj.day,obj.month,obj.type,obj.category,obj.amount,obj.entrie_id, id],
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
          "DELETE FROM latest WHERE id=?;",
          [id],
          //-----------------------
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          }
        );
      });
    });
  };

  export default{
    create,
    all,
    remove,
    findById,
    update,
}
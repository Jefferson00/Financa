import db from './database'

db.transaction((tx) => {
     //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
     //tx.executeSql("DROP TABLE tableValues;");
     //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS tableValues (id INTEGER PRIMARY KEY AUTOINCREMENT, description TEXT, amount REAL, dtStart INT, dtEnd INT, entries_id INT NOT NULL, FOREIGN KEY (entries_id) REFERENCES entries (id) ON DELETE CASCADE);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO tableValues (description,amount,dtStart, dtEnd, entries_id) values (?,?,?,?,?);",
          [obj.description,obj.amount,obj.dtStart,obj.dtEnd,obj.entries_id],
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
          "SELECT * FROM tableValues;",
          [],
          //-----------------------
          (_, { rows }) => resolve(rows),
        )
      })
    })
  }

  const update = (id:number, obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "UPDATE tableValues SET description=?,amount=?,dtStart=?, dtEnd=?, entries_id=?  Where id=?;",
          [obj.description,obj.amount,obj.dtStart,obj.dtEnd,obj.entries_id, id],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
        );
      });
    });
  };

  const findByDate = (dt:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT tableValues.*, entries.day, entries.type, entries.received FROM tableValues INNER JOIN entries ON tableValues.entries_id = entries.id WHERE tableValues.dtStart<=? and tableValues.dtEnd>=?;",
          [dt,dt],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + dt); // nenhum registro encontrado
          })
      })
    })
  }

  const allOrderByDate = () => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM tableValues ORDER BY dtStart;",
          [],
          //-----------------------
          (_, { rows }) => resolve(rows),
        )
      })
    })
  }

  const remove = (id:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "DELETE FROM tableValues WHERE id=?;",
          [id],
          //-----------------------
          (_, { rowsAffected }) => {
            resolve(rowsAffected);
          }
        )
      })
    })
  }

  
  export default{
    create,
    all,
    findByDate,
    remove,
    update,
    allOrderByDate,
}
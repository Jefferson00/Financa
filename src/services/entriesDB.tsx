import db from './database'

db.transaction((tx) => {
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
    //tx.executeSql("DROP TABLE earnings;");
    //tx.executeSql("DROP TABLE entries;");
    //<<<<<<<<<<<<<<<<<<<<<<<< USE ISSO APENAS DURANTE OS TESTES!!! >>>>>>>>>>>>>>>>>>>>>>>
  
    tx.executeSql(
      "CREATE TABLE IF NOT EXISTS entries (id INTEGER PRIMARY KEY AUTOINCREMENT, title TEXT, day INT, dtStart INT, dtEnd INT, monthly BOOLEAN, received BOOLEAN, type TEXT, category TEXT);"
    );
  });

  const create = (obj:any) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "INSERT INTO entries (title,day,dtStart,dtEnd,monthly,received,type,category) values (?,?,?,?,?,?,?,?);",
          [obj.title,obj.day,obj.dtStart,obj.dtEnd,obj.monthly,obj.received,obj.type,obj.category],
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
          "SELECT * FROM entries;",
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
          "SELECT * FROM entries WHERE dtStart<=? and dtEnd>=?;",
          [dt,dt],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + dt); // nenhum registro encontrado
          })
      })
    })
  }

  const findByDateOrderByDay = (dt:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM entries WHERE dtStart<=? and dtEnd>=? ORDER BY day;",
          [dt,dt],
          //-----------------------
          (_, { rows }) => {
            if (rows.length > 0) resolve(rows);
            else reject("Obj not found: id=" + dt); // nenhum registro encontrado
          })
      })
    })
  }

  const findById = (id:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "SELECT * FROM entries WHERE id=?;",
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
          "UPDATE entries SET title=?,day=?,dtStart=?,dtEnd=?,monthly=?,received=?,type=?,category=? Where id=?;",
          [obj.title,obj.day,obj.dtStart,obj.dtEnd,obj.monthly,obj.received,obj.type,obj.category, id],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(obj)); // insert falhou
          },
        );
      });
    });
  };

  const updateReceived = (received: boolean) => {
    return new Promise((resolve, reject) => {
        db.transaction((tx) => {
        tx.executeSql(
          "UPDATE entries SET received=?;",
          [received],
          //-----------------------
          (_, { rowsAffected, insertId }) => {
            if (rowsAffected > 0) resolve(insertId);
            else reject("Error inserting obj: " + JSON.stringify(received)); // insert falhou
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
          `DELETE FROM entries WHERE id=?;`,
          [id]
        )
      })
    })
  }

  const remove2 = (id:number) => {
    return new Promise((resolve, reject) => {
      db.transaction((tx) => {
        //comando SQL modificável
        tx.executeSql(
          "DELETE FROM entries WHERE id=?;",
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
    findByDate,
    remove,
    remove2,
    findById,
    update,
    findByDateOrderByDay,
    updateReceived,
}
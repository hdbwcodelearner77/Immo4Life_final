import sqlite3 from "sqlite3";

sqlite3.verbose();

//Datenbank gibt keine Promises zurück weshalb der Code viele Callbacks verwendet.

export const db = new sqlite3.Database("./data/immo.db", async (err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Database connected");
    db.all("SELECT name FROM sqlite_master WHERE type='table'", (err, rows) => {
      if (rows.length === 0) {
        console.log("No Tables found: Creating Tables");
        db.run(
          "CREATE TABLE listing (id INTEGER PRIMARY KEY AUTOINCREMENT," +
            "'createdOn' TEXT NOT NULL," +
            "'createdBy' TEXT NOT NULL," +
            "'softwareVersion' TEXT," +
            "'customer' TEXT NOT NULL);"
        );
        db.run(
          "CREATE TABLE estate (id INTEGER NOT NULL," +
            "'type' TEXT NOT NULL," +
            "'address' TEXT NOT NULL," +
            "'postal' INTEGER NOT NULL," +
            "'city' TEXT NOT NULL," +
            "'size' FLOAT NOT NULL," +
            "'comment' TEXT NOT NULL," +
            "'shortHand' TEXT NOT NULL," +
            "'image' TEXT," +
            "'customerCount' INTEGER," +
            "FOREIGN KEY ('id') REFERENCES listing(id));"
        );
      }
    });
  }
});

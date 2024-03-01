const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const dbConnection = () => {
  return new Promise((resolve, reject) => {
    db.connect((error) => {
      if (error) {
        console.error("MySQL connection error:", error);
        reject(error);
      } else {
        console.log("MySQL connected");
        resolve();
      }
    });
  });
};

module.exports = { dbConnection, db };

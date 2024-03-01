const mysql = require("mysql");

const db = mysql.createConnection({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
});

const dbConnection = () => {
  db.connect((error) => {
    if (error) {
      console.error("MySQL connection error:", error);
    } else {
      console.log("MySQL connected");
    }
  });
};

module.exports = { dbConnection,db};

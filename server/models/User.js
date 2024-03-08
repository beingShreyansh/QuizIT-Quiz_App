const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");

const pool = mysql.createPool({
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
  database: process.env.DATABASE,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
});

class User {
  constructor({ name, email, password, role = "user" }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // Default role is 'user'
    this.pool = pool;
  }

  save() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const query =
          "INSERT INTO user (id, name, email, password, role) VALUES (?, ?, ?, ?, ?)";

        connection.query(
          query,
          [uuidv4(), this.name, this.email, this.password, this.role],
          (error, results) => {
            connection.release();

            if (error) {
              reject(error);
            } else {
              this.id = results.insertId;
              resolve(this.id);
            }
          }
        );
      });
    });
  }

  static findOneByEmail(email) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const query = "SELECT * FROM user WHERE email = ? LIMIT 1";

        connection.query(query, [email], (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results.length > 0 ? results[0] : null);
          }
        });
      });
    });
  }
}

module.exports = User;

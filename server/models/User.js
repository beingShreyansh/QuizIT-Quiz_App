const mysql = require("mysql2");
const { v4: uuidv4 } = require("uuid");
const { getObjectUrl } = require("../awsConfig");

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
  constructor({
    name,
    email,
    password,
    role = "user",  
    imageId = 'profile-default',
  }) {
    this.name = name;
    this.email = email;
    this.password = password;
    this.role = role; // Default role is 'user'
    this.imageId = imageId;
    this.pool = pool;
  }

  save() {
    return new Promise(async (resolve, reject) => {
      try {
        const hashedPassword = await bcrypt.hash(this.password, 10);
        this.password = hashedPassword;

        this.pool.getConnection((err, connection) => {
          if (err) {
            reject(err);
            return;
          }

        const query =
          "INSERT INTO user (id, name, email, password, role, imageId) VALUES (?, ?, ?, ?, ?,?)";

        connection.query(
          query,
          [uuidv4(), this.name, this.email, this.password, this.role, this.imageId],
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
      } catch (error) {
        reject(error);
      }
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

  static findById(userId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const query = "SELECT * FROM user WHERE id = ? LIMIT 1";

        connection.query(query, [userId], (error, results) => {
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

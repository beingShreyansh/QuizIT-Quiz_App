const mysql = require("mysql2");
const bcrypt = require("bcrypt");
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
  constructor({
    name,
    email,
    password,
    role = "user",
    imageId = "profile-default",
  }) {
    this.name = name;
    this.email = email;
    this.role = role; // Default role is 'user'
    this.imageId = imageId;
    this.pool = pool;
    if (password) {
      this.password = bcrypt.hashSync(password, 10); // Hash the password
    }
  }

  save() {
    return new Promise((resolve, reject) => {
      this.pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const id = uuidv4(); // Generate UUID for the user
        const query =
          "INSERT INTO user (id, name, email, password, role, imageId) VALUES (?, ?, ?, ?, ?, ?)";

        connection.query(
          query,
          [id, this.name, this.email, this.password, this.role, this.imageId],
          (error, results) => {
            connection.release();

            if (error) {
              reject(error);
            } else {
              resolve(id); // Resolve with the generated user ID
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

  static findOneById(userId) {
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

  static updatePassword(userId, newPassword) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password

      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const query = "UPDATE user SET password = ? WHERE id = ?";

        connection.query(query, [hashedPassword, userId], (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    });
  }

  static updatePasswordByEmail(email, newPassword) {
    return new Promise((resolve, reject) => {
      const hashedPassword = bcrypt.hashSync(newPassword, 10); // Hash the new password

      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const query = "UPDATE user SET password = ? WHERE email = ?";

        connection.query(query, [hashedPassword, email], (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    });
  }

  static uploadImageId(userId, imageId) {
    return new Promise((resolve, reject) => {
      pool.getConnection((err, connection) => {
        if (err) {
          reject(err);
          return;
        }

        const query = "UPDATE user SET imageId = ? WHERE id = ?";

        connection.query(query, [imageId, userId], (error, results) => {
          connection.release();

          if (error) {
            reject(error);
          } else {
            resolve(results);
          }
        });
      });
    });
  }
}

module.exports = User;

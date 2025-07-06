import mysql, { ResultSetHeader, RowDataPacket } from "mysql2/promise";

export interface IDatabase {
  getUser: (username: string) => Promise<mysql.RowDataPacket>;
  createUser: (username: string, password: string) => Promise<number>;
}

export const createDatabase = async (
  host: string,
  port: number,
  user: string,
  password: string,
  database: string
): Promise<IDatabase> => {
  const connection = mysql.createPool({
    host: host,
    port: port,
    user: user,
    password: password,
    database: database,
  });

  async function getUser(username: string): Promise<mysql.RowDataPacket> {
    const [results] = await connection.query<RowDataPacket[]>(
      `SELECT * 
        FROM users 
        WHERE username = ?`,
      [username]
    );

    return results[0];
  }

  async function createUser(
    username: string,
    password: string
  ): Promise<number> {
    const [results] = await connection.query<ResultSetHeader[]>(
      `INSERT INTO users (username, password) 
        VALUES (?, ?)`,
      [username, password]
    );

    return results[0].insertId;
  }

  return { getUser, createUser };
};

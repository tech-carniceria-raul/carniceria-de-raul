import mysql, { Connection, QueryError } from 'mysql2';
import dotenv from 'dotenv';
import { explicitLog } from '@/functions/index.js';
dotenv.config();

export const databaseCredentials = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASSWORD,
};

export const databaseConnect = (endpoint?: string): Connection => {
  if (process.env.LOG_DETAILS === 'verbose') {
    explicitLog(endpoint ? `Connected to ${endpoint}` : 'Connected');
  }
  return mysql.createConnection({
    database: process.env.DATABASE_NAME,
    ...databaseCredentials,
  });
};

export const databaseDisconnect = (connection: Connection, endpoint?: string) =>
  connection.end((error: QueryError | null) => {
    if (error) {
      databaseError(error);
    }
    if (process.env.LOG_DETAILS === 'verbose') {
      explicitLog(endpoint ? `Disconnected from ${endpoint}` : 'Disconnected');
    }
  });

export const databaseError = (error: QueryError, endpoint?: string) =>
  console.error(endpoint ? `${error.message} at ${endpoint}` : error.message);

export const handleDisconnect = () => {
  const connection = databaseConnect();

  connection.connect((err) => {
    if (err) {
      console.error('Error when reconnecting to db');
      setTimeout(handleDisconnect, 2000);
    }
  });

  connection.on('error', function (err) {
    console.log('db error', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      // Connection to the MySQL server is usually
      handleDisconnect(); // lost due to either server restart, or a
    } else {
      // connnection idle timeout (the wait_timeout
      throw err; // server variable configures this)
    }
  });
};

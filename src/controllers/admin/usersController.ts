import { generateSaltHashedPassword } from '@/controllers/auth/authController.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { User } from '@/types/types.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import { toastDispatch } from '@/components/toast/index.js';
import i18next from '@/lib/i18n/config.js';
export const userCreate = (res: Response, user: Partial<User>) => {
  const connection = databaseConnect();
  const { salt, hashPwd } = generateSaltHashedPassword('admin');
  const queryParams = [
    user.email,
    hashPwd,
    salt,
    user.authorities,
    user.name,
    user.surname,
  ];
  const createUserQuery =
    'INSERT INTO users (email, password, salt, authorities, name, surname) VALUES (?, ?, ?, ?, ?, ?);';

  connection.query(createUserQuery, queryParams, (error: QueryError | null) => {
    if (error) {
      databaseError(error);
    } else {
      res.redirect(302, '/admin/users');
    }

    databaseDisconnect(connection);
  });
};

export const userUpdate = (res: Response, user: Partial<User>, id: string) => {
  const connection = databaseConnect();
  const queryParams = [
    user.email,
    user.authorities,
    user.name,
    user.surname,
    id,
  ];
  const updateUserQuery =
    'UPDATE users SET email = ?, authorities = ?, name = ?, surname = ? WHERE userId = ?;';
  connection.query(updateUserQuery, queryParams, (error: QueryError | null) => {
    if (error) databaseError(error);
    else {
      res.sendStatus(200);
    }

    databaseDisconnect(connection);
  });
};

export const getUserToUpdate = (req: Request, res: Response, id: string) => {
  const getUserQuery =
    'SELECT userId, email, name, surname, authorities FROM users WHERE userId= ?;';

  const connection = databaseConnect();

  connection.query(
    getUserQuery,
    [id],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) {
        databaseError(error);
      } else {
        res.render('userUpdate.ejs', {
          user: result[0] as Partial<User>,
          isLogged: req.session.isLogged,
          account: req.session.user,
          cart: req.session.cart,
          t: i18next.t,
        });
      }

      databaseDisconnect(connection);
    }
  );
};

export const getUserList = (req: Request, res: Response) => {
  const connection = databaseConnect();
  connection.query(
    'SELECT name, surname, email, userId, authorities FROM users;',
    (error: QueryError, results: Partial<User>[]) => {
      if (error) {
        res.sendStatus(404);
        databaseError(error);
      }

      res.render('users.ejs', {
        users: results,
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        cart: req.session.cart,
        t: i18next.t,
      });

      databaseDisconnect(connection);
    }
  );
};

export const userDelete = (res: Response, userId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users WHERE userId = ?;`;
  connection.query(deleteQuery, [userId], (error: QueryError | null) => {
    if (error) databaseError(error);

    res.status(200).send('OK');

    databaseDisconnect(connection);
  });
};

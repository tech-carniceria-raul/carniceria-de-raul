import { databaseConnect } from "../../../database";
import { User } from "@/features/types";
import { Response } from "express";
import { QueryError } from "mysql2";

export const userCreate = (res: Response, user: Partial<User>) => {
  const connection = databaseConnect();
  const queryParams = [
    user.email,
    "admin",
    user.authorities,
    user.name,
    user.surname,
  ];
  const createUserQuery =
    "INSERT INTO users (email, password, authorities, name, surname) VALUES (?, ?, ?, ?, ?);";

  connection.query(createUserQuery, queryParams, (error: QueryError | null) => {
    if (error) {
      throw new Error(error.message);
    } else {
      res.redirect(302, "/admin/users");
    }
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
    "UPDATE users SET email = ?, authorities = ?, name = ?, surname = ? WHERE user_id = ?;";
  connection.query(updateUserQuery, queryParams, (error: QueryError | null) => {
    if (error) throw new Error(error.message);
    else {
      res.redirect("/admin/users");
    }
  });
};

export const getUserToUpdate = (res: Response, id: string) => {
  const getUserQuery =
    "SELECT user_id, email, name, surname, authorities FROM users WHERE user_id= ?;";

  const connection = databaseConnect();

  // type todo
  connection.query(
    getUserQuery,
    [id],
    (error: QueryError | null, result: any) => {
      if (error) {
        throw new Error(error.message);
      } else {
        res.render("userUpdate.ejs", { user: result[0] as Partial<User> });
      }
    }
  );
};

export const getUserList = (res: Response) => {
  const connection = databaseConnect();
  connection.query(
    "SELECT name, surname, email, user_id, authorities FROM users;",
    (error: QueryError, results: Partial<User>[]) => {
      if (error) {
        res.send("404");
        throw new Error(error.message);
      }
      res.render("users.ejs", { users: results });
    }
  );
};

export const userDelete = (res: Response, userId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM users WHERE user_id = ?;`;
  connection.query(deleteQuery, [userId], (error: QueryError | null) => {
    if (error) throw new Error(error.message);

    res.status(200).send("OK");
  });
};
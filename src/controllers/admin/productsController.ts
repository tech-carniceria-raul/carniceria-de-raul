import { toastDispatch } from '@/components/toast/index.js';
import {
  databaseConnect,
  databaseDisconnect,
  databaseError,
} from '@/database/index.js';
import { Request, Response } from 'express';
import { QueryError, RowDataPacket } from 'mysql2';
import i18next from '@/lib/i18n/config.js';

export const productCreate = (res: Response, product: Partial<Product>) => {
  const connection = databaseConnect();
  const queryParams = [
    product.name,
    product.price,
    product.unit,
    product.stock,
    product.sale,
    product.best,
    String(product.salePrice) === '' ? null : product.salePrice,
    product.image ?? null,
    product.description,
    product.category ?? 'Ternera',
  ];
  console.log(queryParams);

  const createProductQuery =
    'INSERT INTO products (name, price, unit, stock, sale, best, salePrice, image, description, category) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?);';

  connection.query(
    createProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) {
        databaseError(error);
      } else {
        res.sendStatus(200);
      }
      databaseDisconnect(connection);
    }
  );
};

export const productUpdate = (res: Response, product: Product, id: string) => {
  const connection = databaseConnect();
  const queryParams = [
    product.name,
    product.price,
    product.stock,
    product.sale,
    product.best,
    String(product.salePrice) === '' ? null : product.salePrice,
    product.image ?? '',
    product.description,
    product.category ?? 'Ternera',
    id,
  ];

  console.log(queryParams);
  const updateProductQuery =
    'UPDATE products SET name = ?, price = ?, stock = ?, sale = ?, best= ?, salePrice = ?, image = ?, description = ?, category= ? WHERE productId = ?;';
  connection.query(
    updateProductQuery,
    queryParams,
    (error: QueryError | null) => {
      if (error) databaseError(error);
      else {
        res.sendStatus(200);
      }

      databaseDisconnect(connection);
    }
  );
};

export const getProductToUpdate = (
  req: Request,
  res: Response,
  productId: string
) => {
  const connection = databaseConnect();
  const getProductQuery = 'SELECT * FROM products WHERE productId = ?;';

  connection.query(
    getProductQuery,
    [productId],
    (error: QueryError | null, result: RowDataPacket[]) => {
      if (error) databaseError(error);

      const product = result[0] as Product;

      res.render('productUpdate.ejs', {
        product: product,
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
        t: i18next.t,
      });

      databaseDisconnect(connection);
    }
  );
};

export const productDelete = (res: Response, productId: string) => {
  const connection = databaseConnect();
  const deleteQuery = `DELETE FROM products WHERE productId = ?;`;
  connection.query(deleteQuery, [productId], (error: QueryError | null) => {
    if (error) databaseError(error);

    res.status(200).send('OK');

    databaseDisconnect(connection);
  });
};

export const getProductList = (
  req: Request,
  res: Response
  // category?: string
) => {
  const connection = databaseConnect();
  const getProductsQuery = 'SELECT * FROM products';

  connection.query(
    getProductsQuery,
    (error: QueryError | null, results: RowDataPacket[]) => {
      if (error) databaseError(error);

      res.render('products.ejs', {
        products: results as Product[],
        isLogged: req.session.isLogged,
        account: req.session.user,
        toast: toastDispatch(req),
        t: i18next.t,
        cart: req.session.cart,
      });

      databaseDisconnect(connection);
    }
  );
};

export const addCategory = () => {};

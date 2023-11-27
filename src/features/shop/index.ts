import { Router, Response, Request } from "express";
import { databaseConnect } from "../../database";
import { QueryError } from "mysql2";
import { Category, Product } from "../types";
const router = Router();

const getCategoryNameFromUrl = (url: string): string => {
  if (url.length < 1) return "";

  return url[0].toUpperCase() + url.slice(1);
};

router.get("/:category/filters", (req: Request, res: Response) => {
  const currentCategory =
    req.params.category[0].toUpperCase() + req.params.category.slice(1);
  const isOnlyOffers = req.url.includes("offertasa=on");
  const isSortedByPrice = req.url.includes("price=on");
  const isSortedByName = req.url.includes("name=on");
  const connection = databaseConnect();
  const getCategoriesQuery = `SELECT * FROM categories;`;
  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) throw new Error(error.message);
      const getProductsFromCategoryQuery = `SELECT products.* FROM products
      JOIN product_categories ON products.product_id = product_categories.product_id
      JOIN categories ON product_categories.category_id = categories.category_id
      WHERE categories.name = "${currentCategory}"
      ${isOnlyOffers ? "AND products.sale = 1" : ""}
      ${isSortedByPrice && !isSortedByName ? "ORDER BY products.price ASC" : ""}
      ${
        isSortedByName && !isSortedByPrice ? "ORDER BY products.name ASC" : ""
      };`;

      connection.query(
        getProductsFromCategoryQuery,
        (error: QueryError, productResults: Partial<Product>[]) => {
          if (error) throw new Error(error.message);
          res.render("shop.ejs", {
            categories: categoryResults,
            products: productResults,
            currentCategory: currentCategory,
          });
        }
      );
    }
  );
});

router.use("/", (req: Request, res: Response) => {
  const currentCategory = getCategoryNameFromUrl(req.url.split("/")[1]);

  const connection = databaseConnect();
  const getCategoriesQuery = `SELECT * FROM categories;`;
  connection.query(
    getCategoriesQuery,
    (error: QueryError, categoryResults: Category[]) => {
      if (error) throw new Error(error.message);
      if (currentCategory) {
        const getProductsFromCategoryQuery = `SELECT products.* FROM products
      JOIN product_categories ON products.product_id = product_categories.product_id
      JOIN categories ON product_categories.category_id = categories.category_id
      WHERE categories.name = "${currentCategory}";`;

        connection.query(
          getProductsFromCategoryQuery,
          (error: QueryError, productResults: Partial<Product>[]) => {
            if (error) throw new Error(error.message);
            res.render("shop.ejs", {
              categories: categoryResults,
              products: productResults,
              currentCategory: currentCategory,
            });
          }
        );
      } else
        res.render("shop.ejs", {
          categories: categoryResults,
          products: undefined,
          currentCategory: "",
        });

      connection.end();
    }
  );
});

export default router;

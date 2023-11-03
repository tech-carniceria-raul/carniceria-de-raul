import { Router, urlencoded, Request, Response } from "express";
import products from "./products";
import users from "./users";
const router = Router();

router.use(urlencoded({ extended: true }));

router.use("/users", users);
router.use("/products", products);
router.use("/", (req: Request, res: Response) => {
  res.redirect("/admin/users");
});

export default router;
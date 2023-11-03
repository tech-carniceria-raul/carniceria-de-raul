import { Router, urlencoded, Request, Response } from "express";

import signup from "./signup";
import login from "./login";
import reset from "./reset";
const router = Router();

router.use(urlencoded({ extended: true }));
router.use("/reset", reset);
router.use("/login", login);
router.use("/signup", signup);

router.use("/", (req: Request, res: Response) => {
  res.redirect("/auth/login");
});

export default router;
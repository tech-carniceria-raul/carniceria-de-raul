import { Router, urlencoded, Request, Response } from 'express';
import {
  checkEmailTaken,
  isStrongPassword,
  registerIfPossible,
} from '@/controllers/auth/signupController.js';
import i18next from '@/lib/i18n/config.js';

const router = Router();

router.use(urlencoded({ extended: true }));

router.post('/checkEmail', (req, res) => {
  checkEmailTaken(res, req.body.email);
});

router.post('/checkPassword', (req, res) => {
  const { isStrong, problems } = isStrongPassword(req.body.password);

  res.status(200).send(isStrong ? 'OK' : problems);
});

router.post('/', (req: Request, res: Response) => {
  registerIfPossible(req, res, req.body);
});

router.use('/', (req: Request, res: Response) => {
  res.render('signup.ejs', {
    error: {},
    isLogged: req.session.isLogged,
    account: req.session.user,
    cart: req.session.isLogged ? req.session.cart : req.cookies.cart,
    t: i18next.t,
  });
});

export default router;

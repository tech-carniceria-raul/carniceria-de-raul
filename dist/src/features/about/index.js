import { Router } from 'express';
const router = Router();
router.use('/', (req, res) => {
    res.render('about.ejs', {
        isLogged: req.session.isLogged,
        account: req.session.user,
        cart: req.session.cart,
    });
});
export default router;

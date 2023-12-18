import { Router } from 'express';
import cart from './cart/index.js';
import infos from './infos/index.js';
import payment from './payment/index.js';
import { loggedOnlyRoute } from '../../middlewares/logged.js';
const router = Router();
router.use('/cart', loggedOnlyRoute, cart);
router.use('/infos', loggedOnlyRoute, infos);
router.use('/payment', loggedOnlyRoute, payment);
router.use('/', loggedOnlyRoute, (req, res) => {
    res.redirect('/order/cart');
});
export default router;

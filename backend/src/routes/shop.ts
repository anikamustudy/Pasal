import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import { createOrUpdateShop, getShop, getShopById } from '../controllers/shopController';

const router = Router();

// All routes require authentication
router.use(authenticateToken);

router.post('/', createOrUpdateShop);
router.get('/', getShop);
router.get('/:shopId', getShopById);

export default router;

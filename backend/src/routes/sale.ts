import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createSale,
  getSales,
  getSaleById,
  updateSalePayment,
} from '../controllers/saleController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/sales', createSale);
router.get('/:shopId/sales', getSales);
router.get('/sales/:saleId', getSaleById);
router.patch('/sales/:saleId/payment', updateSalePayment);

export default router;

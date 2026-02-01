import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  addStockTransaction,
  getStockTransactions,
  getProductStockHistory,
} from '../controllers/stockController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/stock', addStockTransaction);
router.get('/:shopId/stock', getStockTransactions);
router.get('/stock/product/:productId', getProductStockHistory);

export default router;

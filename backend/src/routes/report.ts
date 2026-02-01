import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  getSalesReport,
  getProfitLossReport,
  getStockReport,
  getUdharReport,
  getDashboardStats,
} from '../controllers/reportController';

const router = Router();

router.use(authenticateToken);

router.get('/:shopId/reports/sales', getSalesReport);
router.get('/:shopId/reports/profit-loss', getProfitLossReport);
router.get('/:shopId/reports/stock', getStockReport);
router.get('/:shopId/reports/udhar', getUdharReport);
router.get('/:shopId/reports/dashboard', getDashboardStats);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createUdharTransaction,
  getUdharTransactions,
  getCustomerUdharSummary,
} from '../controllers/udharController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/udhar', createUdharTransaction);
router.get('/:shopId/udhar', getUdharTransactions);
router.get('/udhar/customer/:customerId', getCustomerUdharSummary);

export default router;

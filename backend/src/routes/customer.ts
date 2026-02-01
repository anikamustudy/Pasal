import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createCustomer,
  getCustomers,
  getCustomerById,
  updateCustomer,
  deleteCustomer,
} from '../controllers/customerController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/customers', createCustomer);
router.get('/:shopId/customers', getCustomers);
router.get('/customers/:customerId', getCustomerById);
router.put('/customers/:customerId', updateCustomer);
router.delete('/customers/:customerId', deleteCustomer);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createSupplier,
  getSuppliers,
  getSupplierById,
  updateSupplier,
  deleteSupplier,
} from '../controllers/supplierController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/suppliers', createSupplier);
router.get('/:shopId/suppliers', getSuppliers);
router.get('/suppliers/:supplierId', getSupplierById);
router.put('/suppliers/:supplierId', updateSupplier);
router.delete('/suppliers/:supplierId', deleteSupplier);

export default router;

import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getLowStockProducts,
} from '../controllers/productController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/products', createProduct);
router.get('/:shopId/products', getProducts);
router.get('/:shopId/products/low-stock', getLowStockProducts);
router.get('/products/:productId', getProductById);
router.put('/products/:productId', updateProduct);
router.delete('/products/:productId', deleteProduct);

export default router;

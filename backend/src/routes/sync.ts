import { Router } from 'express';
import { authenticateToken } from '../middleware/auth';
import {
  syncToCloud,
  syncFromCloud,
  getLastSyncTimestamp,
} from '../controllers/syncController';

const router = Router();

router.use(authenticateToken);

router.post('/:shopId/sync/upload', syncToCloud);
router.get('/:shopId/sync/download', syncFromCloud);
router.get('/:shopId/sync/timestamp', getLastSyncTimestamp);

export default router;

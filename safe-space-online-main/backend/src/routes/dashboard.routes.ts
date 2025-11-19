import { Router } from 'express';
import { getDashboard } from '../controllers/dashboard.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes (require authentication)
router.use(protect);

router.get('/', getDashboard);

export default router;

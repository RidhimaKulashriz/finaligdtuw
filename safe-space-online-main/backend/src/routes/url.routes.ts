import { Router } from 'express';
import { body } from 'express-validator';
import { scanUrl, getUrlScanHistory, getUrlScanById } from '../controllers/url.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes (require authentication)
router.use(protect);

router.post(
  '/scan',
  [
    body('url', 'Valid URL is required').isURL(),
  ],
  scanUrl
);

router.get('/history', getUrlScanHistory);
router.get('/:id', getUrlScanById);

export default router;

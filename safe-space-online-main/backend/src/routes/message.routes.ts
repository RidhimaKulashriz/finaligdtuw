import { Router } from 'express';
import { body } from 'express-validator';
import { scanMessage, getMessageHistory } from '../controllers/message.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Protected routes (require authentication)
router.use(protect);

router.post(
  '/scan',
  [
    body('message', 'Message is required').not().isEmpty(),
  ],
  scanMessage
);

router.get('/history', getMessageHistory);

export default router;

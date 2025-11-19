import { Router } from 'express';
import { body } from 'express-validator';
import {
  createPost,
  getPosts,
  getPost,
  updatePost,
  deletePost,
} from '../controllers/community.controller';
import { protect } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getPosts);
router.get('/posts/:id', getPost);

// Protected routes (require authentication)
router.use(protect);

router.post(
  '/posts',
  [
    body('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 1000 })
      .withMessage('Content must be less than 1000 characters'),
  ],
  createPost
);

router.put(
  '/posts/:id',
  [
    body('content', 'Content is required')
      .not()
      .isEmpty()
      .isLength({ max: 1000 })
      .withMessage('Content must be less than 1000 characters'),
  ],
  updatePost
);

router.delete('/posts/:id', deletePost);

export default router;

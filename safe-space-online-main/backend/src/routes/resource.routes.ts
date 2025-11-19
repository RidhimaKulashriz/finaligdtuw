import { Router } from 'express';
import { body } from 'express-validator';
import {
  getResources,
  getResource,
  createResource,
  updateResource,
  deleteResource,
} from '../controllers/resource.controller';
import { protect, admin } from '../middlewares/auth.middleware';

const router = Router();

// Public routes
router.get('/', getResources);
router.get('/:id', getResource);

// Protected routes (require authentication and admin role)
router.use(protect);
router.use(admin);

router.post(
  '/',
  [
    body('title', 'Title is required').not().isEmpty(),
    body('description', 'Description is required').not().isEmpty(),
    body('url', 'URL is required').isURL(),
    body('category', 'Category is required').not().isEmpty(),
  ],
  createResource
);

router.put(
  '/:id',
  [
    body('title', 'Title is required').optional().not().isEmpty(),
    body('description', 'Description is required').optional().not().isEmpty(),
    body('url', 'URL is required').optional().isURL(),
    body('category', 'Category is required').optional().not().isEmpty(),
  ],
  updateResource
);

router.delete('/:id', deleteResource);

export default router;

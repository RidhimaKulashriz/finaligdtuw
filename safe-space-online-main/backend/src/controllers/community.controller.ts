import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose, { Types } from 'mongoose';
import CommunityPost from '../models/communityPost.model';
import { ICommunityPost } from '../types/community.types';

// Extend the Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username: string;
      role?: string;
    };
  }
}

// @desc    Create a new community post
// @route   POST /api/v1/community/posts
// @access  Private
export const createPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, content, category } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock post data
      console.warn('MongoDB not available - returning mock community post in development');
      const mockPost = {
        _id: `mock_post_${Date.now()}`,
        userId: {
          _id: userId,
          username: req.user?.username || 'mock_user',
        },
        title,
        content,
        category: category || 'general',
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return res.status(201).json({
        success: true,
        data: mockPost,
      });
    }

    const postData = {
      userId: new Types.ObjectId(userId),
      title,
      content,
      category: category || 'general',
    };

    const post = await CommunityPost.create(postData);

    // Populate user details
    const populatedPost = await CommunityPost.findById(post._id)
      .populate('userId', 'username')
      .exec();

    return res.status(201).json({
      success: true,
      data: populatedPost,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get all community posts with pagination
// @route   GET /api/v1/community/posts
// @access  Public
export const getPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const category = req.query.category as string;
    const skip = (page - 1) * limit;

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock posts
      console.warn('MongoDB not available - returning mock community posts in development');
      const mockPosts = [];
      for (let i = 0; i < limit; i++) {
        mockPosts.push({
          _id: `mock_post_${Date.now()}_${i}`,
          userId: {
            _id: 'mock_user_id',
            username: ['alex_teen', 'sarah_parent', 'mike_educator'][i % 3],
          },
          title: `Sample Post Title ${i + 1}`,
          content: `This is a sample community post content for demonstration purposes. Post number ${
            i + 1
          }.`,
          category: category || ['general', 'support', 'tips', 'stories'][i % 4],
          likes: [],
          comments: [],
          createdAt: new Date(Date.now() - i * 3600000),
          updatedAt: new Date(Date.now() - i * 3600000),
        });
      }

      return res.status(200).json({
        success: true,
        data: mockPosts,
        page,
        pages: 1,
        total: mockPosts.length,
      });
    }

    // Build filter
    const filter: Record<string, unknown> = {};
    if (category && category !== 'all') {
      filter.category = category;
    }

    const posts = await CommunityPost.find(filter)
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await CommunityPost.countDocuments(filter);
    const pages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: posts,
      page,
      pages,
      total,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get single community post
// @route   GET /api/v1/community/posts/:id
// @access  Public
export const getPost = async (req: Request, res: Response): Promise<Response> => {
  try {
    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock post
      console.warn('MongoDB not available - returning mock community post in development');
      const mockPost = {
        _id: req.params.id || 'mock_post_id',
        userId: {
          _id: 'mock_user_id',
          username: 'mock_user',
        },
        title: 'Sample Post Title',
        content: 'This is a sample community post content for demonstration purposes.',
        category: 'general',
        likes: [],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        data: mockPost,
      });
    }

    const post = await CommunityPost.findById(req.params.id).populate('userId', 'username').exec();

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: post,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Update a community post
// @route   PUT /api/v1/community/posts/:id
// @access  Private
export const updatePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const userId = req.user?.id;
    const { title, content, category } = req.body;

    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock updated post
      console.warn('MongoDB not available - returning mock updated post in development');
      const mockUpdatedPost = {
        _id: req.params.id,
        userId: {
          _id: userId,
          username: req.user?.username || 'mock_user',
        },
        title: title || 'Updated Post Title',
        content: content || 'Updated post content.',
        category: category || 'general',
        likes: [],
        comments: [],
        createdAt: new Date(Date.now() - 86400000),
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        data: mockUpdatedPost,
      });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Make sure user owns the post or is an admin
    if (post.userId.toString() !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this post',
      });
    }

    const updateData: Partial<ICommunityPost> = {
      updatedAt: new Date(),
    };

    if (title) updateData.title = title;
    if (content) updateData.content = content;
    if (category) updateData.category = category;

    const updatedPost = await CommunityPost.findByIdAndUpdate(req.params.id, updateData, {
      new: true,
      runValidators: true,
    })
      .populate('userId', 'username')
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedPost,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Delete a post
// @route   DELETE /api/v1/community/posts/:id
// @access  Private
export const deletePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock deletion response
      console.warn('MongoDB not available - returning mock deletion response in development');
      return res.status(200).json({
        success: true,
        message: 'Post deleted successfully (mock)',
      });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    // Make sure user owns the post or is an admin
    if (post.userId.toString() !== userId && req.user?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this post',
      });
    }

    await CommunityPost.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      message: 'Post deleted successfully',
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Like/unlike a post
// @route   POST /api/v1/community/posts/:id/like
// @access  Private
export const toggleLikePost = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ message: 'User not authenticated' });
    }

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock like response
      console.warn('MongoDB not available - returning mock like response in development');
      const mockPost = {
        _id: req.params.id,
        userId: {
          _id: 'mock_user_id',
          username: 'mock_user',
        },
        title: 'Sample Post Title',
        content: 'This is a sample community post content.',
        category: 'general',
        likes: [new Types.ObjectId(userId)],
        comments: [],
        createdAt: new Date(),
        updatedAt: new Date(),
      };

      return res.status(200).json({
        success: true,
        data: mockPost,
        message: 'Post liked successfully (mock)',
      });
    }

    const post = await CommunityPost.findById(req.params.id);

    if (!post) {
      return res.status(404).json({
        success: false,
        message: 'Post not found',
      });
    }

    const userObjectId = new Types.ObjectId(userId);
    const likeIndex = post.likes.findIndex((like: Types.ObjectId) => like.equals(userObjectId));

    if (likeIndex > -1) {
      // Unlike the post
      post.likes.splice(likeIndex, 1);
    } else {
      // Like the post
      post.likes.push(userObjectId);
    }

    await post.save();

    const updatedPost = await CommunityPost.findById(req.params.id)
      .populate('userId', 'username')
      .exec();

    return res.status(200).json({
      success: true,
      data: updatedPost,
      message: likeIndex > -1 ? 'Post unliked successfully' : 'Post liked successfully',
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get user's posts
// @route   GET /api/v1/community/posts/user/:userId
// @access  Public
export const getUserPosts = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { userId } = req.params;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock user posts
      console.warn('MongoDB not available - returning mock user posts in development');
      const mockUserPosts = [];
      for (let i = 0; i < limit; i++) {
        mockUserPosts.push({
          _id: `mock_post_${Date.now()}_${i}`,
          userId: {
            _id: userId,
            username: 'mock_user',
          },
          title: `User Post Title ${i + 1}`,
          content: `This is a sample user post content for demonstration purposes. Post number ${
            i + 1
          }.`,
          category: ['general', 'support', 'tips', 'stories'][i % 4],
          likes: [],
          comments: [],
          createdAt: new Date(Date.now() - i * 3600000),
          updatedAt: new Date(Date.now() - i * 3600000),
        });
      }

      return res.status(200).json({
        success: true,
        data: mockUserPosts,
        page,
        pages: 1,
        total: mockUserPosts.length,
      });
    }

    const posts = await CommunityPost.find({ userId })
      .populate('userId', 'username')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    const total = await CommunityPost.countDocuments({ userId });
    const pages = Math.ceil(total / limit);

    return res.status(200).json({
      success: true,
      data: posts,
      page,
      pages,
      total,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get community categories
// @route   GET /api/v1/community/categories
// @access  Public
export const getCategories = async (_req: Request, res: Response): Promise<Response> => {
  try {
    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock categories
      console.warn('MongoDB not available - returning mock categories in development');
      const mockCategories = ['general', 'support', 'tips', 'stories', 'resources', 'questions'];

      return res.status(200).json({
        success: true,
        data: mockCategories,
      });
    }

    const categories = await CommunityPost.distinct('category');

    return res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    return res.status(500).json({ message: errorMessage });
  }
};

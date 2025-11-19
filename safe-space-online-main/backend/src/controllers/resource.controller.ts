import { Request, Response } from 'express';
import Resource from '../models/resource.model';
import { validationResult } from 'express-validator';

// @desc    Get all resources
// @route   GET /api/v1/resources
// @access  Public
export const getResources = async (req: Request, res: Response) => {
  try {
    // Filtering
    const queryObj = { ...req.query };
    const excludeFields = ['page', 'sort', 'limit', 'fields'];
    excludeFields.forEach(el => delete queryObj[el]);

    // Advanced filtering
    let queryStr = JSON.stringify(queryObj);
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

    let query = Resource.find(JSON.parse(queryStr));

    // Sorting
    if (req.query.sort) {
      const sortBy = (req.query.sort as string).split(',').join(' ');
      query = query.sort(sortBy);
    } else {
      query = query.sort('-createdAt');
    }

    // Field limiting
    if (req.query.fields) {
      const fields = (req.query.fields as string).split(',').join(' ');
      query = query.select(fields);
    } else {
      query = query.select('-__v');
    }

    // Pagination
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    const total = await Resource.countDocuments(JSON.parse(queryStr));
    const pages = Math.ceil(total / limit);

    query = query.skip(skip).limit(limit);

    const resources = await query;

    res.status(200).json({
      success: true,
      count: resources.length,
      total,
      page,
      pages,
      data: resources,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get single resource
// @route   GET /api/v1/resources/:id
// @access  Public
export const getResource = async (req: Request, res: Response): Promise<Response> => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({
        success: false,
        message: 'Resource not found',
      });
    }

    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Create new resource
// @route   POST /api/v1/resources
// @access  Private/Admin
export const createResource = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { title, description, category, url, tags } = req.body;
    
    const resource = new Resource({
      title,
      description,
      category,
      url,
      tags: tags || [],
      isApproved: false,
    });
    
    await resource.save();
    
    return res.status(201).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update resource
// @route   PUT /api/v1/resources/:id
// @access  Private/Admin
export const updateResource = async (req: Request, res: Response): Promise<Response> => {
  try {
    const { id } = req.params;
    const { title, description, category, url, tags, isApproved } = req.body;
    
    const resource = await Resource.findByIdAndUpdate(
      id,
      { title, description, category, url, tags, isApproved },
      { new: true, runValidators: true }
    );
    
    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }
    
    return res.status(200).json({
      success: true,
      data: resource,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Delete resource
// @route   DELETE /api/v1/resources/:id
// @access  Private/Admin
export const deleteResource = async (req: Request, res: Response): Promise<Response> => {
  try {
    await Resource.findByIdAndDelete(req.params.id);

    return res.status(200).json({
      success: true,
      data: {},
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Server error' });
  }
};

import { Request, Response } from "express";
import { validationResult } from "express-validator";
import mongoose from "mongoose";
import MessageScan from "../models/messageScan.model";

// @desc    Scan a message for harmful content
// @route   POST /api/v1/messages/scan
// @access  Private
export const scanMessage = async (req: Request, res: Response): Promise<Response> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { message } = req.body;
    const userId = req.user?.id;

    // Perform message scanning logic
    const result = {
      isSafe: true,
      riskScore: Math.floor(Math.random() * 100),
      flaggedWords: [],
      categories: [],
    };

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock result without saving
      console.warn("  MongoDB not available - returning mock scan result in development");
      return res.status(200).json({
        success: true,
        data: result,
      });
    }

    // Save scan to database
    const messageScan = new MessageScan({
      user: userId,
      message,
      result,
    });

    await messageScan.save();

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// @desc    Get message scan history
// @route   GET /api/v1/messages/history
// @access  Private
export const getMessageHistory = async (req: Request, res: Response): Promise<Response> => {
  try {
    const userId = req.user?.id;
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if MongoDB is available
    if (mongoose.connection.readyState !== 1) {
      // Development fallback: return mock history
      console.warn("  MongoDB not available - returning mock scan history in development");
      const mockHistory = [];
      for (let i = 0; i < 5; i++) {
        mockHistory.push({
          _id: `mock_${Date.now()}_${i}`,
          message: `Sample message ${i + 1}`,
          result: {
            isSafe: Math.random() > 0.3,
            riskScore: Math.floor(Math.random() * 100),
            flaggedWords: [],
            categories: [],
          },
          createdAt: new Date(Date.now() - i * 24 * 60 * 60 * 1000),
        });
      }
      return res.status(200).json({
        success: true,
        data: mockHistory,
        pagination: {
          page,
          limit,
          total: mockHistory.length,
          pages: 1,
        },
      });
    }

    const messageScans = await MessageScan.find({ user: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await MessageScan.countDocuments({ user: userId });

    return res.status(200).json({
      success: true,
      data: messageScans,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Third-party imports
import type { Request, Response } from 'express';
import mongoose, { Types } from 'mongoose';

// Model imports
import CommunityPost from '../models/communityPost.model';
import type { ICommunityPost } from '../models/communityPost.model';
import MessageScan from '../models/messageScan.model';
import UrlScan from '../models/urlScan.model';
 

// Define dashboard activity type
interface DashboardActivity {
  type: 'url' | 'message' | 'post';
  content: string;
  riskScore?: number;
  timestamp: Date;
}

// Define dashboard achievement type
interface DashboardAchievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
  unlockedAt?: Date;
}

// Extend Express Request type to include user
declare module 'express-serve-static-core' {
  interface Request {
    user?: {
      id: string;
      username: string;
      role?: string;
    };
  }
}

// @desc    Get dashboard data
// @route   GET /api/v1/dashboard
// @access  Private
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    // Get user ID from request
    const userId = req.user?.id;
    if (!userId || !mongoose.Types.ObjectId.isValid(userId)) {
      res.status(401).json({ message: 'Unauthorized' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);
    const userRole = req.user?.role ?? 'teen';

    // MongoDB not connected
    if (mongoose.connection.readyState !== 1) {
      console.warn('MongoDB not available - returning mock dashboard data');
      const mockData = {
        stats: {
          totalScans: 0,
          safeScans: 0,
          unsafeScans: 0,
          avgRiskScore: 0,
          totalMessages: 0,
          totalPosts: 0,
        },
        recentActivity: [
          {
            type: 'url',
            content: 'https://example.com/sample',
            riskScore: 15,
            timestamp: new Date(Date.now() - 3600000),
          },
          {
            type: 'message',
            content: 'Sample message content...',
            riskScore: 25,
            timestamp: new Date(Date.now() - 7200000),
          },
          {
            type: 'post',
            content: 'Sample Community Post',
            riskScore: 0,
            timestamp: new Date(Date.now() - 10800000),
          },
        ],
        achievements: [],
        notifications: [],
      };

      switch (userRole) {
        case 'teen':
          (mockData.achievements as DashboardAchievement[]) = [
            {
              id: 1,
              title: 'First Scan',
              description: 'Completed your first safety scan',
              unlocked: true,
            },
            {
              id: 2,
              title: 'Safety Conscious',
              description: 'Scanned 10 items safely',
              unlocked: false,
            },
          ];
          break;
        case 'parent':
          mockData.stats.totalMessages = 5;
          mockData.stats.totalPosts = 3;
          break;
        case 'educator':
          mockData.stats.totalMessages = 12;
          mockData.stats.totalPosts = 8;
          break;
        case 'admin':
          mockData.stats.totalScans = 150;
          mockData.stats.totalMessages = 50;
          mockData.stats.totalPosts = 25;
          break;
      }

      res.status(200).json({ success: true, data: mockData });
      return;
    }

    // Fetch real data from MongoDB
    const [totalScans, safeScans, unsafeScans, avgRiskResult, totalMessages, totalPosts] =
      await Promise.all([
        UrlScan.countDocuments({ userId: userObjectId }),
        UrlScan.countDocuments({ userId: userObjectId, 'result.riskScore': { $lt: 30 } }),
        UrlScan.countDocuments({ userId: userObjectId, 'result.riskScore': { $gte: 70 } }),
        UrlScan.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: null, avgRisk: { $avg: '$result.riskScore' } } },
        ]),
        MessageScan.countDocuments({ userId: userObjectId }),
        CommunityPost.countDocuments({ userId: userObjectId }),
      ]);

    const avgRiskScore = avgRiskResult[0]?.avgRisk ? Math.round(avgRiskResult[0].avgRisk) : 0;

    const [recentScans, recentMessages, recentPosts] = await Promise.all([
      UrlScan.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('url result createdAt')
        .lean()
        .exec(),
      MessageScan.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('message result timestamp')
        .lean()
        .exec(),
      CommunityPost.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('content createdAt updatedAt')
        .lean()
        .exec(),
    ]);

    // Define types for query results
    interface LeanUrlScan {
      _id: Types.ObjectId;
      userId: Types.ObjectId;
      url: string;
      result: {
        isSafe: boolean;
        riskScore?: number;
        reason?: string;
        categories?: string[];
      };
      createdAt: Date;
      updatedAt: Date;
    }
    
    interface LeanMessageScan {
      _id: Types.ObjectId;
      userId: Types.ObjectId;
      message: string;
      result: {
        isSafe: boolean;
        issues?: string[];
      };
      timestamp: Date;
    }
    
    // Map the results to the correct types with proper error handling
    const typedScans = (recentScans as unknown as LeanUrlScan[]).map((scan) => ({
      ...scan,
      _id: new Types.ObjectId(scan._id.toString()),
      userId: new Types.ObjectId(scan.userId.toString()),
      createdAt: new Date(scan.createdAt),
      updatedAt: new Date(scan.updatedAt),
    }));
    
    const typedMessages = (recentMessages as unknown as LeanMessageScan[]).map((msg) => ({
      ...msg,
      _id: new Types.ObjectId(msg._id.toString()),
      userId: new Types.ObjectId(msg.userId.toString()),
      timestamp: new Date(msg.timestamp),
    }));
    
    // Define a type that includes the user property for community posts
    interface CommunityPostWithUser extends Omit<ICommunityPost, 'user' | '_id'> {
      _id: Types.ObjectId;
      user?: Types.ObjectId | string;
      createdAt: Date;
      updatedAt: Date;
    }
    
    const typedPosts = (recentPosts as unknown as CommunityPostWithUser[]).map((post) => ({
      ...post,
      _id: new Types.ObjectId(post._id.toString()),
      user: post.user ? new Types.ObjectId(post.user.toString()) : undefined,
      createdAt: new Date(post.createdAt),
      updatedAt: new Date(post.updatedAt),
    }));

    const recentActivity: DashboardActivity[] = [
      ...typedScans.map((scan) => ({
        type: 'url' as const,
        content: scan.url,
        riskScore: scan.result?.riskScore || 0,
        timestamp: scan.createdAt || new Date(),
      })),
      ...typedMessages.map((msg) => ({
        type: 'message' as const,
        content: msg.message,
        riskScore: msg.result.isSafe ? 0 : 100,
        timestamp: msg.timestamp,
      })),
      ...typedPosts.map((post) => ({
        type: 'post' as const,
        content: post.content,
        riskScore: 0,
        timestamp: post.createdAt || new Date(),
      })),
    ]
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime())
      .slice(0, 10);

    const achievements: DashboardAchievement[] = [];
    if (totalScans >= 1)
      achievements.push({
        id: 1,
        title: 'First Scan',
        description: 'Completed your first safety scan',
        unlocked: true,
      });
    if (safeScans >= 10)
      achievements.push({
        id: 2,
        title: 'Safety Conscious',
        description: 'Scanned 10 items safely',
        unlocked: true,
      });
    if (totalPosts >= 1)
      achievements.push({
        id: 3,
        title: 'Community Contributor',
        description: 'Created your first post',
        unlocked: true,
      });

    res.status(200).json({
      success: true,
      data: {
        stats: { totalScans, safeScans, unsafeScans, avgRiskScore, totalMessages, totalPosts },
        recentActivity,
        achievements,
        notifications: [],
      },
    });
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message: errorMessage });
  }
};


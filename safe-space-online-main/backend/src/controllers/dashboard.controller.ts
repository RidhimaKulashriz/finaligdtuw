import { Request, Response } from 'express';
import mongoose from 'mongoose';

import CommunityPost from '../models/communityPost.model';
import MessageScan from '../models/messageScan.model';
import UrlScan from '../models/urlScan.model';

interface DashboardAchievement {
  id: number;
  title: string;
  description: string;
  unlocked: boolean;
}

interface DashboardActivity {
  type: 'url' | 'message' | 'post';
  content: string;
  riskScore: number;
  timestamp: Date;
}

interface UrlScanResult {
  url: string;
  result: {
    isSafe: boolean;
    reason?: string;
    riskScore?: number;
    categories?: string[];
  };
  createdAt: Date;
}

interface MessageScanResult {
  message: string;
  result: {
    isSafe: boolean;
    issues?: string[];
  };
  timestamp: Date;
}

interface CommunityPostResult {
  content: string;
  createdAt: Date;
}

// @desc    Get dashboard data
// @route   GET /api/v1/dashboard
// @access  Private
export const getDashboard = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;
    const userRole = req.user?.role || 'teen';

    if (!userId) {
      res.status(401).json({ message: 'Not authorized: User ID not found in request' });
      return;
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

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
        UrlScan.countDocuments({ userId: userObjectId, riskScore: { $lt: 30 } }),
        UrlScan.countDocuments({ userId: userObjectId, riskScore: { $gte: 70 } }),
        UrlScan.aggregate([
          { $match: { userId: userObjectId } },
          { $group: { _id: null, avgRisk: { $avg: '$riskScore' } } },
        ]),
        MessageScan.countDocuments({ userId: userObjectId }),
        CommunityPost.countDocuments({ userId: userObjectId }),
      ]);

    const avgRiskScore = avgRiskResult[0]?.avgRisk ? Math.round(avgRiskResult[0].avgRisk) : 0;

    const [recentScans, recentMessages, recentPosts] = await Promise.all([
      UrlScan.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('url result createdAt'),
      MessageScan.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('message result timestamp'),
      CommunityPost.find({ userId: userObjectId })
        .sort({ createdAt: -1 })
        .limit(5)
        .select('content createdAt'),
    ]);

    const recentActivity: DashboardActivity[] = [
      ...recentScans.map((scan: UrlScanResult) => ({
        type: 'url' as const,
        content: scan.url,
        riskScore: scan.result?.riskScore || 0,
        timestamp: scan.createdAt,
      })),
      ...recentMessages.map((msg: MessageScanResult) => ({
        type: 'message' as const,
        content: msg.message ? msg.message.substring(0, 100) + '...' : '',
        riskScore: msg.result?.isSafe ? 0 : 50,
        timestamp: msg.timestamp,
      })),
      ...recentPosts.map((post: CommunityPostResult) => ({
        type: 'post' as const,
        content: post.content,
        riskScore: 0,
        timestamp: post.createdAt,
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

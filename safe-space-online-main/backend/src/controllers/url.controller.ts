import { Request, Response } from 'express';
import { validationResult } from 'express-validator';
import mongoose from 'mongoose';
import UrlScan from '../models/urlScan.model';

// @desc    Scan a URL for safety
// @route   POST /api/v1/urls/scan
// @access  Private
export const scanUrl = async (req: Request, res: Response): Promise<void> => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      res.status(400).json({ errors: errors.array() });
      return;
    }

    const { url } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Enhanced URL safety analysis
    const urlLower = url.toLowerCase();
    let riskScore = 0;
    const categories: string[] = [];
    let isSafe = true;
    let reason = '';

    // Check for suspicious patterns
    const suspiciousPatterns = {
      phishing: ['phishing', 'scam', 'fraud', 'fake', 'spoof', 'verify-account', 'secure-login'],
      malware: ['malware', 'virus', 'trojan', 'spyware', 'adware', 'ransomware'],
      adult: ['porn', 'adult', 'xxx', 'nsfw', 'explicit'],
      gambling: ['gambling', 'casino', 'bet', 'poker', 'lottery'],
      suspicious_domains: ['.tk', '.ml', '.ga', '.cf', 'bit.ly', 'tinyurl.com', 'short.link'],
    };

    // Analyze URL patterns
    Object.entries(suspiciousPatterns).forEach(([category, patterns]) => {
      const foundPatterns = patterns.filter((pattern) => urlLower.includes(pattern));
      if (foundPatterns.length > 0) {
        categories.push(category);
        riskScore += category === 'phishing' || category === 'malware' ? 40 : 20;
      }
    });

    // Check URL structure
    if (url.includes('@') || url.match(/[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}/)) {
      categories.push('suspicious_structure');
      riskScore += 30;
    }

    // Check for HTTPS
    if (!url.startsWith('https://')) {
      categories.push('insecure_protocol');
      riskScore += 15;
    }

    // Determine safety based on risk score
    isSafe = riskScore < 30;
    if (!isSafe) {
      reason = riskScore >= 60 ? 'High risk URL detected' : 'Medium risk URL detected';
    }

    const result = {
      isSafe,
      riskScore: Math.min(riskScore, 100),
      categories,
      reason: !isSafe ? reason : undefined,
      analysis: {
        urlLength: url.length,
        hasHttps: url.startsWith('https://'),
        scanTimestamp: new Date().toISOString(),
      },
    };

    // Save scan to database
    if (mongoose.connection.readyState === 1) {
      await UrlScan.create({
        userId,
        url,
        result,
      });
    } else {
      // Mock save - just log for development
      console.log('Mock URL scan saved:', { userId, url, result });
    }

    res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get URL scan history
// @route   GET /api/v1/urls/history
// @access  Private
export const getUrlScanHistory = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // TODO: Use regex for URL validation if needed
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;
    const skip = (page - 1) * limit;

    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      const [scans, total] = await Promise.all([
        UrlScan.find({ userId }).sort({ createdAt: -1 }).skip(skip).limit(limit),
        UrlScan.countDocuments({ userId }),
      ]);

      res.status(200).json({
        success: true,
        count: scans.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: scans,
      });
    } else {
      // Mock data for development
      const mockScans = [
        {
          _id: 'mock_url_scan_1',
          userId,
          url: 'https://example.com',
          result: {
            isSafe: true,
            riskScore: 10,
            categories: [],
            analysis: {
              urlLength: 19,
              hasHttps: true,
              scanTimestamp: new Date().toISOString(),
            },
          },
          createdAt: new Date(),
        },
        {
          _id: 'mock_url_scan_2',
          userId,
          url: 'http://suspicious-site.tk',
          result: {
            isSafe: false,
            riskScore: 65,
            categories: ['suspicious_domains', 'insecure_protocol'],
            reason: 'High risk URL detected',
            analysis: {
              urlLength: 25,
              hasHttps: false,
              scanTimestamp: new Date().toISOString(),
            },
          },
          createdAt: new Date(Date.now() - 86400000),
        },
      ];

      const paginatedScans = mockScans.slice(skip, skip + limit);
      const total = mockScans.length;

      res.status(200).json({
        success: true,
        count: paginatedScans.length,
        total,
        page,
        pages: Math.ceil(total / limit),
        data: paginatedScans,
      });
    }
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message: errorMessage });
  }
};

// @desc    Get URL scan by ID
// @route   GET /api/v1/urls/:id
// @access  Private
export const getUrlScanById = async (req: Request, res: Response): Promise<void> => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      res.status(401).json({ message: 'User not authenticated' });
      return;
    }

    // Check if MongoDB is available
    if (mongoose.connection.readyState === 1) {
      const scan = await UrlScan.findOne({
        _id: req.params.id,
        userId,
      });

      if (!scan) {
        res.status(404).json({
          success: false,
          message: 'Scan not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        data: scan,
      });
    } else {
      // Mock data for development
      const mockScan = {
        _id: req.params.id || 'mock_url_scan_1',
        userId,
        url: 'https://example.com',
        result: {
          isSafe: true,
          riskScore: 10,
          categories: [],
          analysis: {
            urlLength: 19,
            hasHttps: true,
            scanTimestamp: new Date().toISOString(),
          },
        },
        createdAt: new Date(),
      };

      res.status(200).json({
        success: true,
        data: mockScan,
      });
    }
  } catch (error: unknown) {
    console.error(error);
    const errorMessage = error instanceof Error ? error.message : 'Server error';
    res.status(500).json({ message: errorMessage });
  }
};

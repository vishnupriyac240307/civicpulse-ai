const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { generateInsights } = require('../services/insightsService');

/**
 * GET /api/dashboard/stats
 * Aggregate dashboard statistics, metrics, and chart distribution data
 */
router.get('/stats', async (req, res) => {
  try {
    const totalIssues = await Issue.countDocuments();
    const resolvedIssues = await Issue.countDocuments({ status: 'RESOLVED' });
    const inProgressIssues = await Issue.countDocuments({ status: 'IN_PROGRESS' });
    const pendingIssues = await Issue.countDocuments({ status: 'PENDING' });
    const acknowledgedIssues = await Issue.countDocuments({ status: 'ACKNOWLEDGED' });
    const rejectedIssues = await Issue.countDocuments({ status: 'REJECTED' });

    const highPriorityCount = await Issue.countDocuments({ priorityLevel: { $in: ['HIGH', 'CRITICAL'] } });
    
    const resolutionRate = totalIssues > 0 ? Math.round((resolvedIssues / totalIssues) * 100) : 0;

    // 1. Issues by Category
    const categoryAgg = await Issue.aggregate([
      { $group: { _id: '$category', count: { $sum: 1 } } },
      { $sort: { count: -1 } }
    ]);
    const categoryDistribution = categoryAgg.map(item => ({
      category: item._id,
      count: item.count
    }));

    // 2. Status Distribution
    const statusDistribution = [
      { status: 'Pending', count: pendingIssues, fill: '#f59e0b' },
      { status: 'Acknowledged', count: acknowledgedIssues, fill: '#3b82f6' },
      { status: 'In Progress', count: inProgressIssues, fill: '#8b5cf6' },
      { status: 'Resolved', count: resolvedIssues, fill: '#10b981' },
      { status: 'Rejected', count: rejectedIssues, fill: '#ef4444' }
    ];

    // 3. Severity Distribution
    const severityAgg = await Issue.aggregate([
      { $group: { _id: '$severity', count: { $sum: 1 } } }
    ]);
    const severityMap = { LOW: 0, MEDIUM: 0, HIGH: 0, CRITICAL: 0 };
    severityAgg.forEach(item => {
      if (item._id && severityMap[item._id] !== undefined) {
        severityMap[item._id] = item.count;
      }
    });
    const severityDistribution = [
      { severity: 'Low', count: severityMap.LOW, color: '#10b981' },
      { severity: 'Medium', count: severityMap.MEDIUM, color: '#f59e0b' },
      { severity: 'High', count: severityMap.HIGH, color: '#f97316' },
      { severity: 'Critical', count: severityMap.CRITICAL, color: '#ef4444' }
    ];

    // 4. Issues Over Time (last 7 days grouping)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const timeAgg = await Issue.aggregate([
      { $match: { createdAt: { $gte: sevenDaysAgo } } },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$createdAt' } },
          count: { $sum: 1 },
          resolved: {
            $sum: { $cond: [{ $eq: ['$status', 'RESOLVED'] }, 1, 0] }
          }
        }
      },
      { $sort: { _id: 1 } }
    ]);

    const overTimeData = timeAgg.map(item => ({
      date: item._id,
      reported: item.count,
      resolved: item.resolved
    }));

    // 5. Geographic Hotspots
    const hotspotsAgg = await Issue.aggregate([
      { $group: {
          _id: '$location',
          count: { $sum: 1 },
          avgLatitude: { $avg: '$latitude' },
          avgLongitude: { $avg: '$longitude' },
          criticalCount: {
            $sum: { $cond: [{ $in: ['$priorityLevel', ['HIGH', 'CRITICAL']] }, 1, 0] }
          }
        }
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);

    const hotspots = hotspotsAgg.map(h => ({
      location: h._id,
      count: h.count,
      criticalCount: h.criticalCount,
      latitude: h.avgLatitude,
      longitude: h.avgLongitude
    }));

    return res.json({
      success: true,
      stats: {
        totalIssues,
        resolvedIssues,
        inProgressIssues,
        pendingIssues,
        acknowledgedIssues,
        highPriorityCount,
        resolutionRate,
        averageResolutionTime: '2.4 days',
        reportsThisWeek: totalIssues,
        categoryDistribution,
        statusDistribution,
        severityDistribution,
        overTimeData,
        hotspots
      }
    });

  } catch (err) {
    console.error('Error compiling dashboard stats:', err);
    return res.status(500).json({ error: 'Failed to compile stats.', details: err.message });
  }
});

/**
 * GET /api/dashboard/insights
 * AI/Data insights for community trend monitoring
 */
router.get('/insights', async (req, res) => {
  try {
    const insights = await generateInsights();
    return res.json({ success: true, insights });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to generate insights.', details: err.message });
  }
});

module.exports = router;

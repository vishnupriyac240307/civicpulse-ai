const express = require('express');
const router = express.Router();
const { analyzeIssue } = require('../services/aiService');
const { calculatePriority } = require('../services/priorityService');
const { checkDuplicateIssue } = require('../services/duplicateService');

/**
 * POST /api/analyze
 * Analyzes problem description, detects category, computes priority, checks duplicates
 */
router.post('/', async (req, res) => {
  try {
    const { description, category, location, latitude, longitude, landmark, image } = req.body;

    if (!description || description.trim().length < 5) {
      return res.status(400).json({
        error: 'Problem description must be at least 5 characters long.'
      });
    }

    // 1. Run AI / Rule Analysis
    const aiResult = await analyzeIssue({
      description,
      category,
      location,
      landmark,
      image
    });

    // 2. Check Duplicates in DB
    const duplicateCheck = await checkDuplicateIssue({
      category: aiResult.category,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      description,
      location
    });

    // 3. Compute Priority Score & Rationale
    const priorityResult = calculatePriority({
      severity: aiResult.severity,
      category: aiResult.category,
      description,
      location,
      similarReportsCount: duplicateCheck.similarReportsCount
    });

    return res.json({
      success: true,
      analysis: {
        category: aiResult.category,
        subcategory: aiResult.subcategory,
        severity: aiResult.severity,
        confidence: aiResult.confidence,
        publicImpact: aiResult.publicImpact,
        recommendedDepartment: aiResult.recommendedDepartment,
        suggestedAction: aiResult.suggestedAction,
        summary: aiResult.summary,
        priorityScore: priorityResult.priorityScore,
        priorityLevel: priorityResult.priorityLevel,
        priorityReasoning: priorityResult.priorityReasoning,
        duplicateRisk: duplicateCheck.duplicateRisk,
        duplicateCheck,
        isAiFallback: aiResult.isAiFallback,
        notice: aiResult.notice
      }
    });

  } catch (err) {
    console.error('API /api/analyze error:', err);
    return res.status(500).json({
      error: 'Failed to complete analysis.',
      details: err.message
    });
  }
});

module.exports = router;

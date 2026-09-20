const express = require('express');
const router = express.Router();
const Issue = require('../models/Issue');
const { checkDuplicateIssue } = require('../services/duplicateService');
const { calculatePriority } = require('../services/priorityService');

/**
 * Generate formatted Issue ID like CP-2026-00124
 */
function generateIssueId() {
  const year = new Date().getFullYear();
  const randomDigits = Math.floor(10000 + Math.random() * 90000);
  return `CP-${year}-${randomDigits}`;
}

/**
 * POST /api/issues/check-duplicate
 */
router.post('/check-duplicate', async (req, res) => {
  try {
    const { category, latitude, longitude, description, location } = req.body;
    const result = await checkDuplicateIssue({ category, latitude, longitude, description, location });
    return res.json({ success: true, ...result });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
});

/**
 * POST /api/issues
 * Create/Submit new civic report
 */
router.post('/', async (req, res) => {
  try {
    const {
      description,
      category,
      subcategory,
      severity,
      confidence,
      priorityScore,
      priorityLevel,
      priorityReasoning,
      publicImpact,
      recommendedDepartment,
      suggestedAction,
      summary,
      location,
      latitude,
      longitude,
      landmark,
      dateObserved,
      image,
      duplicateRisk,
      duplicateOf,
      reporterName,
      reporterContact,
      isAiFallback
    } = req.body;

    if (!description || !category || !location) {
      return res.status(400).json({ error: 'Description, category, and location are required.' });
    }

    const issueId = generateIssueId();

    // Re-verify priority score on backend for security
    const priorityCalc = calculatePriority({
      severity: severity || 'MEDIUM',
      category: category || 'Other',
      description,
      location
    });

    const newIssue = new Issue({
      issueId,
      description,
      category: category || 'Other',
      subcategory: subcategory || 'General',
      severity: severity || 'MEDIUM',
      confidence: confidence || 85,
      priorityScore: priorityScore !== undefined ? priorityScore : priorityCalc.priorityScore,
      priorityLevel: priorityLevel || priorityCalc.priorityLevel,
      priorityReasoning: priorityReasoning || priorityCalc.priorityReasoning,
      publicImpact: publicImpact || 'Public impact under review.',
      recommendedDepartment: recommendedDepartment || 'Public Works Department',
      suggestedAction: suggestedAction || 'Inspect and address site condition.',
      summary: summary || description.substring(0, 100),
      location,
      latitude: latitude ? parseFloat(latitude) : null,
      longitude: longitude ? parseFloat(longitude) : null,
      landmark: landmark || '',
      dateObserved: dateObserved ? new Date(dateObserved) : new Date(),
      image: image || '',
      status: 'PENDING',
      duplicateRisk: duplicateRisk || 'NONE',
      duplicateOf: duplicateOf || null,
      reporterName: reporterName || 'Anonymous Citizen',
      reporterContact: reporterContact || '',
      isAiFallback: !!isAiFallback
    });

    await newIssue.save();

    return res.status(201).json({
      success: true,
      message: 'Civic issue report created successfully.',
      issue: newIssue
    });

  } catch (err) {
    console.error('Error creating issue:', err);
    return res.status(500).json({ error: 'Failed to create issue.', details: err.message });
  }
});

/**
 * GET /api/issues
 * Search, filter, and list issues
 */
router.get('/', async (req, res) => {
  try {
    const { search, category, status, severity, department, sortBy = 'newest', page = 1, limit = 50 } = req.query;

    const filter = {};

    if (category && category !== 'All') {
      filter.category = category;
    }
    if (status && status !== 'All') {
      filter.status = status;
    }
    if (severity && severity !== 'All') {
      filter.severity = severity;
    }
    if (department && department !== 'All') {
      filter.recommendedDepartment = department;
    }

    if (search && search.trim() !== '') {
      const regex = new RegExp(search.trim(), 'i');
      filter.$or = [
        { issueId: regex },
        { description: regex },
        { location: regex },
        { subcategory: regex },
        { recommendedDepartment: regex }
      ];
    }

    let sortOptions = { createdAt: -1 };
    if (sortBy === 'priority') {
      sortOptions = { priorityScore: -1, createdAt: -1 };
    } else if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'severity') {
      sortOptions = { priorityScore: -1 };
    }

    const total = await Issue.countDocuments(filter);
    const issues = await Issue.find(filter)
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    return res.json({
      success: true,
      total,
      page: parseInt(page),
      totalPages: Math.ceil(total / parseInt(limit)),
      issues
    });

  } catch (err) {
    console.error('Error fetching issues:', err);
    return res.status(500).json({ error: 'Failed to fetch issues.', details: err.message });
  }
});

/**
 * GET /api/issues/:id
 * Lookup issue by issueId (e.g. CP-2026-00124) or MongoDB _id
 */
router.get('/:id', async (req, res) => {
  try {
    const id = req.params.id;
    let issue = await Issue.findOne({ issueId: id });
    
    if (!issue && id.match(/^[0-9a-fA-F]{24}$/)) {
      issue = await Issue.findById(id);
    }

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found with ID: ' + id });
    }

    return res.json({ success: true, issue });

  } catch (err) {
    return res.status(500).json({ error: 'Error retrieving issue.', details: err.message });
  }
});

/**
 * PATCH /api/issues/:id/status
 * Update issue status & department assignment (Admin)
 */
router.patch('/:id/status', async (req, res) => {
  try {
    const { status, recommendedDepartment } = req.body;
    const validStatuses = ['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'];

    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: 'Invalid status value.' });
    }

    const updateFields = {};
    if (status) updateFields.status = status;
    if (recommendedDepartment) updateFields.recommendedDepartment = recommendedDepartment;

    let issue = await Issue.findOneAndUpdate(
      { issueId: req.params.id },
      { $set: updateFields },
      { new: true }
    );

    if (!issue && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      issue = await Issue.findByIdAndUpdate(
        req.params.id,
        { $set: updateFields },
        { new: true }
      );
    }

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found.' });
    }

    return res.json({
      success: true,
      message: `Issue status updated to ${issue.status}`,
      issue
    });

  } catch (err) {
    return res.status(500).json({ error: 'Failed to update status.', details: err.message });
  }
});

/**
 * DELETE /api/issues/:id
 * Delete issue (Admin)
 */
router.delete('/:id', async (req, res) => {
  try {
    let issue = await Issue.findOneAndDelete({ issueId: req.params.id });
    if (!issue && req.params.id.match(/^[0-9a-fA-F]{24}$/)) {
      issue = await Issue.findByIdAndDelete(req.params.id);
    }

    if (!issue) {
      return res.status(404).json({ error: 'Issue not found.' });
    }

    return res.json({ success: true, message: 'Issue deleted successfully.' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete issue.', details: err.message });
  }
});

module.exports = router;

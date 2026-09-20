const Issue = require('../models/Issue');

/**
 * Calculates distance between two lat/long points in meters using Haversine formula
 */
function getDistanceMeters(lat1, lon1, lat2, lon2) {
  if (!lat1 || !lon1 || !lat2 || !lon2) return null;
  const R = 6371e3; // Earth radius in meters
  const φ1 = lat1 * Math.PI / 180;
  const φ2 = lat2 * Math.PI / 180;
  const Δφ = (lat2 - lat1) * Math.PI / 180;
  const Δλ = (lon2 - lon1) * Math.PI / 180;

  const a = Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) *
            Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  return Math.round(R * c);
}

/**
 * Checks for duplicate issues in MongoDB
 */
async function checkDuplicateIssue({ category, latitude, longitude, description = '', location = '' }) {
  try {
    // 1. Query issues in the same category or open status
    const candidateIssues = await Issue.find({
      status: { $in: ['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS'] },
      $or: [
        { category: category },
        { category: 'Other' }
      ]
    }).limit(50);

    const descTokens = description.toLowerCase().split(/\W+/).filter(w => w.length > 3);
    const locationLower = location.toLowerCase();

    const matches = [];

    for (const issue of candidateIssues) {
      let isMatch = false;
      let reason = '';
      let distanceMeters = null;

      // Distance check
      if (latitude && longitude && issue.latitude && issue.longitude) {
        distanceMeters = getDistanceMeters(latitude, longitude, issue.latitude, issue.longitude);
        if (distanceMeters !== null && distanceMeters <= 500) {
          isMatch = true;
          reason = `Located within ${distanceMeters}m radius`;
        }
      }

      // Keyword & location string matching fallback
      if (!isMatch) {
        const issueDescTokens = issue.description.toLowerCase().split(/\W+/).filter(w => w.length > 3);
        const sharedTokens = descTokens.filter(t => issueDescTokens.includes(t));
        
        const issueLocLower = (issue.location || '').toLowerCase();
        const sameArea = locationLower && issueLocLower && 
          (locationLower.includes(issueLocLower) || issueLocLower.includes(locationLower));

        if (sharedTokens.length >= 2 && (issue.category === category || sameArea)) {
          isMatch = true;
          reason = `Similar description keywords ("${sharedTokens.slice(0, 3).join(', ')}") in ${issue.location}`;
        }
      }

      if (isMatch) {
        matches.push({
          issueId: issue.issueId,
          category: issue.category,
          subcategory: issue.subcategory,
          description: issue.description,
          location: issue.location,
          status: issue.status,
          severity: issue.severity,
          createdAt: issue.createdAt,
          distanceMeters,
          matchReason: reason
        });
      }
    }

    let duplicateRisk = 'NONE';
    if (matches.length >= 3) duplicateRisk = 'HIGH';
    else if (matches.length >= 1) duplicateRisk = 'MEDIUM';

    return {
      hasDuplicates: matches.length > 0,
      duplicateRisk,
      similarReportsCount: matches.length,
      matchedIssues: matches.slice(0, 5),
      message: matches.length > 0 
        ? `${matches.length} similar report(s) found near this location.` 
        : 'No duplicate reports detected.'
    };
  } catch (err) {
    console.error('Error checking duplicate issues:', err);
    return {
      hasDuplicates: false,
      duplicateRisk: 'NONE',
      similarReportsCount: 0,
      matchedIssues: [],
      message: 'Duplicate check skipped due to error.'
    };
  }
}

module.exports = { checkDuplicateIssue, getDistanceMeters };

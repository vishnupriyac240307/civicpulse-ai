/**
 * Priority Scoring Engine for CivicPulse AI
 * Returns a transparent 0-100 priority score, level, and human-readable explanation.
 */
function calculatePriority({ severity, category, description = '', location = '', similarReportsCount = 0 }) {
  let score = 50; // default baseline

  // 1. Severity Base Score
  const severityMap = {
    LOW: 30,
    MEDIUM: 55,
    HIGH: 80,
    CRITICAL: 95
  };
  score = severityMap[severity?.toUpperCase()] || 50;

  // 2. Category Vulnerability Modifier
  const categoryBonus = {
    'Public Safety': 12,
    'Road Damage': 8,
    'Water & Drainage': 8,
    'Streetlight': 5,
    'Public Infrastructure': 5,
    'Waste Management': 3,
    'Parks & Public Spaces': 2,
    'Other': 0
  };
  score += (categoryBonus[category] || 0);

  // 3. High-Traffic / Sensitive Zone Keyword Analysis
  const descLower = (description + ' ' + location).toLowerCase();
  const highRiskKeywords = [
    'school', 'hospital', 'bus stop', 'highway', 'main road', 'junction',
    'children', 'elderly', 'accident', 'danger', 'two-wheeler', 'bike',
    'flooding', 'overflowing', 'dark', 'night', 'exposed wire', 'electric'
  ];

  let matchedKeywordsCount = 0;
  highRiskKeywords.forEach(kw => {
    if (descLower.includes(kw)) matchedKeywordsCount++;
  });
  
  if (matchedKeywordsCount > 0) {
    score += Math.min(matchedKeywordsCount * 4, 15);
  }

  // 4. Duplicate Density Boost
  if (similarReportsCount > 0) {
    score += Math.min(similarReportsCount * 5, 15);
  }

  // Cap score between 10 and 100
  score = Math.min(Math.max(Math.round(score), 10), 100);

  // Determine Level
  let priorityLevel = 'LOW';
  if (score >= 85) priorityLevel = 'CRITICAL';
  else if (score >= 70) priorityLevel = 'HIGH';
  else if (score >= 45) priorityLevel = 'MEDIUM';

  // Construct Rationale
  let reasoning = [];
  if (severity === 'CRITICAL' || severity === 'HIGH') {
    reasoning.push(`High severity rating (${severity}) assigned by impact classifier`);
  }
  if (matchedKeywordsCount > 0) {
    reasoning.push(`Presents risk in high-traffic or sensitive public zones`);
  }
  if (similarReportsCount > 0) {
    reasoning.push(`${similarReportsCount} similar duplicate reports indicate widespread community affect`);
  }
  if (reasoning.length === 0) {
    reasoning.push(`Standard priority level based on ${category} issue parameters`);
  }

  return {
    priorityScore: score,
    priorityLevel,
    priorityReasoning: reasoning.join('. ') + '.'
  };
}

module.exports = { calculatePriority };

const { GoogleGenerativeAI } = require('@google/generative-ai');

/**
 * Deterministic Rule-Based Fallback Classifier
 */
function ruleBasedAnalyze(description = '', userCategory = 'Auto Detect') {
  const desc = description.toLowerCase();

  let category = 'Other';
  let subcategory = 'General Issue';
  let severity = 'MEDIUM';
  let confidence = 82;
  let recommendedDepartment = 'Public Works Department';
  let suggestedAction = 'Dispatch field officer to inspect site.';
  let publicImpact = 'General inconvenience to local residents.';

  // 1. Category Classification
  if (desc.includes('pothole') || desc.includes('road') || desc.includes('asphalt') || desc.includes('crack') || desc.includes('tar') || desc.includes('speed breaker') || desc.includes('cave-in')) {
    category = 'Road Damage';
    subcategory = desc.includes('pothole') ? 'Pothole' : desc.includes('speed breaker') ? 'Speed Breaker' : 'Road Degradation';
    recommendedDepartment = 'Roads & Infrastructure Department';
    suggestedAction = 'Inspect road surface, patch potholes, and resurface damaged section.';
    publicImpact = 'Hazard to two-wheeler riders, vehicle tire damage, and potential traffic slowdowns.';
  } else if (desc.includes('garbage') || desc.includes('trash') || desc.includes('waste') || desc.includes('bin') || desc.includes('dump') || desc.includes('litter') || desc.includes('smell') || desc.includes('stench')) {
    category = 'Waste Management';
    subcategory = desc.includes('bin') ? 'Overflowing Bin' : desc.includes('smell') ? 'Unsanitary Dump' : 'Garbage Accumulation';
    recommendedDepartment = 'Solid Waste Management Division';
    suggestedAction = 'Send garbage collection vehicle, clear accumulated waste, and sanitize site.';
    publicImpact = 'Health hazard, foul odor, disease vector breeding ground for neighborhood.';
  } else if (desc.includes('light') || desc.includes('lamp') || desc.includes('dark') || desc.includes('street light') || desc.includes('pole') || desc.includes('bulb')) {
    category = 'Streetlight';
    subcategory = desc.includes('wire') ? 'Exposed Wiring' : 'Broken Streetlight';
    recommendedDepartment = 'Electrical & Street Lighting Department';
    suggestedAction = 'Inspect electrical fixture, replace dead LED module or wiring, and restore lighting.';
    publicImpact = 'Reduced nocturnal visibility, heightened risk of accidents and public safety concerns.';
  } else if (desc.includes('water') || desc.includes('drain') || desc.includes('leak') || desc.includes('flood') || desc.includes('sewage') || desc.includes('pipe') || desc.includes('gutter') || desc.includes('clog')) {
    category = 'Water & Drainage';
    subcategory = desc.includes('sewage') ? 'Sewage Overflow' : desc.includes('leak') ? 'Pipe Burst' : 'Blocked Drain';
    recommendedDepartment = 'Water Supply & Sewerage Board';
    suggestedAction = 'Deploy jetting machine to unclog drainage pipe and repair leaking main pipeline.';
    publicImpact = 'Waterlogging, damage to adjacent property, potential contamination and travel obstruction.';
  } else if (desc.includes('danger') || desc.includes('hazard') || desc.includes('crime') || desc.includes('unsafe') || desc.includes('stray') || desc.includes('tree fall') || desc.includes('hanging')) {
    category = 'Public Safety';
    subcategory = desc.includes('stray') ? 'Stray Animals' : desc.includes('tree') ? 'Fallen Tree Branch' : 'Hazardous Situation';
    recommendedDepartment = 'Public Safety & Emergency Services';
    suggestedAction = 'Coordinate emergency response unit to secure zone and eliminate public hazard.';
    publicImpact = 'Direct risk of injury to pedestrians and commuters.';
  } else if (desc.includes('park') || desc.includes('bench') || desc.includes('playground') || desc.includes('garden') || desc.includes('swing')) {
    category = 'Parks & Public Spaces';
    subcategory = 'Park Maintenance';
    recommendedDepartment = 'Horticulture & Parks Department';
    suggestedAction = 'Repair damaged park equipment and trim overgrown vegetation.';
    publicImpact = 'Restricted recreational access for families and children.';
  } else if (desc.includes('bridge') || desc.includes('footpath') || desc.includes('sidewalk') || desc.includes('bus stop') || desc.includes('railing') || desc.includes('divider')) {
    category = 'Public Infrastructure';
    subcategory = desc.includes('footpath') ? 'Damaged Footpath' : 'Infrastructure Repair';
    recommendedDepartment = 'Civil Engineering Infrastructure Division';
    suggestedAction = 'Inspect structural integrity and repair damaged pedestrian infrastructure.';
    publicImpact = 'Pedestrian obstruction and safety hazard.';
  }

  // Override category if citizen manually selected one (other than Auto Detect)
  if (userCategory && userCategory !== 'Auto Detect') {
    category = userCategory;
  }

  // 2. Severity Classification
  if (desc.includes('critical') || desc.includes('exposed wire') || desc.includes('severe accident') || desc.includes('cave-in') || desc.includes('collapsed') || desc.includes('sewage flood')) {
    severity = 'CRITICAL';
    confidence = 94;
  } else if (desc.includes('danger') || desc.includes('accident') || desc.includes('huge') || desc.includes('large') || desc.includes('heavy') || desc.includes('two-wheeler') || desc.includes('school') || desc.includes('hospital')) {
    severity = 'HIGH';
    confidence = 88;
  } else if (desc.includes('small') || desc.includes('minor') || desc.includes('flickering') || desc.includes('slight')) {
    severity = 'LOW';
    confidence = 80;
  } else {
    severity = 'MEDIUM';
    confidence = 84;
  }

  const summary = description.length > 120 
    ? description.substring(0, 117) + '...'
    : description;

  return {
    category,
    subcategory,
    severity,
    confidence,
    publicImpact,
    recommendedDepartment,
    suggestedAction,
    summary,
    duplicateRisk: 'NONE',
    isAiFallback: true,
    notice: 'AI service temporarily unavailable. Basic rule-based analysis was used.'
  };
}

/**
 * Main AI Analysis Service using Gemini API with automatic fallback
 */
async function analyzeIssue({ description, category = 'Auto Detect', location = '', landmark = '', image = '' }) {
  const apiKey = process.env.GEMINI_API_KEY || process.env.AI_API_KEY;

  if (!apiKey || apiKey === 'your_gemini_api_key_here') {
    console.log('[AI Service] No Gemini API key provided. Using rule-based fallback.');
    return ruleBasedAnalyze(description, category);
  }

  try {
    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });

    const systemPrompt = `You are CivicPulse AI, an expert municipal AI triage system. Analyze citizen civic issue complaints and extract structured civic intelligence.
Respond ONLY with valid JSON adhering strictly to this format:
{
  "category": "Road Damage" | "Waste Management" | "Streetlight" | "Water & Drainage" | "Public Safety" | "Public Infrastructure" | "Parks & Public Spaces" | "Other",
  "subcategory": "specific short label like Pothole, Overflowing Bin, Pipe Burst",
  "severity": "LOW" | "MEDIUM" | "HIGH" | "CRITICAL",
  "confidence": 85 to 98 (number),
  "publicImpact": "Concise 1-2 sentence description of public risk and affected groups",
  "recommendedDepartment": "Name of municipal department responsible",
  "suggestedAction": "Clear actionable instruction for repair crews",
  "summary": "1 sentence executive summary of the report",
  "duplicateRisk": "NONE" | "LOW" | "MEDIUM" | "HIGH"
}
Rules:
- If user selected a specific non-'Auto Detect' category (${category}), keep that category unless strongly contradictory.
- Severity CRITICAL is reserved for live electrical wires, active major flooding, structural collapse, or immediate life safety hazards.
- Return raw JSON only, without markdown backticks or commentary.`;

    const userPrompt = `Citizen Complaint: "${description}"
Location Context: "${location}"
Landmark: "${landmark}"`;

    let result;
    if (image && image.startsWith('data:image')) {
      const base64Data = image.split(',')[1];
      const mimeType = image.split(';')[0].split(':')[1] || 'image/jpeg';
      const imagePart = {
        inlineData: {
          data: base64Data,
          mimeType
        }
      };
      result = await model.generateContent([systemPrompt, userPrompt, imagePart]);
    } else {
      result = await model.generateContent([systemPrompt, userPrompt]);
    }

    const responseText = result.response.text().trim();
    // Clean potential markdown backticks
    const cleanedJson = responseText.replace(/```json/g, '').replace(/```/g, '').trim();
    const parsed = JSON.parse(cleanedJson);

    return {
      category: parsed.category || 'Other',
      subcategory: parsed.subcategory || 'General Issue',
      severity: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'].includes(parsed.severity) ? parsed.severity : 'MEDIUM',
      confidence: typeof parsed.confidence === 'number' ? parsed.confidence : 90,
      publicImpact: parsed.publicImpact || 'Public impact under review.',
      recommendedDepartment: parsed.recommendedDepartment || 'Public Works Department',
      suggestedAction: parsed.suggestedAction || 'Inspect and address site condition.',
      summary: parsed.summary || description.substring(0, 100),
      duplicateRisk: parsed.duplicateRisk || 'NONE',
      isAiFallback: false,
      notice: null
    };

  } catch (err) {
    console.error('[AI Service] Gemini API call failed:', err.message);
    console.log('[AI Service] Falling back to deterministic rule engine...');
    return ruleBasedAnalyze(description, category);
  }
}

module.exports = { analyzeIssue, ruleBasedAnalyze };

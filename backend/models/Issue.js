const mongoose = require('mongoose');

const IssueSchema = new mongoose.Schema({
  issueId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  description: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true,
    enum: [
      'Road Damage',
      'Waste Management',
      'Streetlight',
      'Water & Drainage',
      'Public Safety',
      'Public Infrastructure',
      'Parks & Public Spaces',
      'Other'
    ],
    index: true
  },
  subcategory: {
    type: String,
    default: 'General'
  },
  severity: {
    type: String,
    required: true,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM',
    index: true
  },
  confidence: {
    type: Number,
    default: 85
  },
  priorityScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100,
    index: true
  },
  priorityLevel: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
    default: 'MEDIUM'
  },
  priorityReasoning: {
    type: String,
    default: ''
  },
  publicImpact: {
    type: String,
    default: 'Impact on local community and commuters.'
  },
  recommendedDepartment: {
    type: String,
    default: 'Public Works Department'
  },
  suggestedAction: {
    type: String,
    default: 'Inspect and repair issue location.'
  },
  summary: {
    type: String,
    default: ''
  },
  location: {
    type: String,
    required: true
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  landmark: {
    type: String,
    default: ''
  },
  dateObserved: {
    type: Date,
    default: Date.now
  },
  image: {
    type: String,
    default: ''
  },
  status: {
    type: String,
    enum: ['PENDING', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED', 'REJECTED'],
    default: 'PENDING',
    index: true
  },
  isAiFallback: {
    type: Boolean,
    default: false
  },
  duplicateRisk: {
    type: String,
    enum: ['NONE', 'LOW', 'MEDIUM', 'HIGH'],
    default: 'NONE'
  },
  duplicateOf: {
    type: String,
    default: null
  },
  similarReportsCount: {
    type: Number,
    default: 0
  },
  reporterName: {
    type: String,
    default: 'Anonymous Citizen'
  },
  reporterContact: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

IssueSchema.index({ createdAt: -1 });

module.exports = mongoose.model('Issue', IssueSchema);

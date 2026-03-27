const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  employerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User', // Reference to the user who is an employer
    required: true,
    index: true
  },
  jobTitle: {
    type: String,
    required: [true, 'Job title is required'],
    trim: true,
    maxlength: [100, 'Job title cannot exceed 100 characters']
  },
  company: {
    type: String,
    required: [true, 'Company name is required'],
    trim: true
  },
  specialization: {
    type: String,
    required: [true, 'Specialization is required'],
    enum: [
      'Software Engineering',
      'Web Development',
      'Mobile Development',
      'Data Science',
      'Machine Learning',
      'DevOps',
      'Cloud Computing',
      'Cybersecurity',
      'UI/UX Design',
      'Product Management',
      'Quality Assurance',
      'IT Support',
      'Network Administration',
      'Database Administration',
      'Other'
    ]
  },
  requirements: {
    type: String,
    required: [true, 'Job requirements are required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Job description is required'],
    trim: true
  },
  location: {
    city: {
      type: String,
      required: true,
      trim: true,
      index: true
    },
    address: {
      type: String,
      trim: true
    },
    isRemote: {
      type: Boolean,
      default: false
    }
  },
  applicationDeadline: {
    type: Date,
    required: [true, 'Application deadline is required'],
    validate: {
      validator: function(value) {
        return value > new Date();
      },
      message: 'Deadline must be in the future'
    },
    index: true
  },
  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time', 'Contract', 'Internship'],
    default: 'Internship'
  },
  skills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    enum: ['Entry', 'Junior', 'Mid-Level', 'Senior'],
    default: 'Entry'
  },
  positionsAvailable: {
    type: Number,
    default: 1,
    min: 1
  },
  status: {
    type: String,
    enum: ['active', 'filled', 'expired', 'draft'],
    default: 'active',
    index: true
  },
  views: {
    type: Number,
    default: 0
  },
  applicationsCount: {
    type: Number,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field on save
jobSchema.pre('save', function() {
  this.updatedAt = Date.now();
});

// Text index for search functionality
jobSchema.index({ 
  jobTitle: 'text', 
  company: 'text', 
  specialization: 'text', 
  'location.city': 'text',
  requirements: 'text',
  skills: 'text'
});

// Compound index for efficient filtering
jobSchema.index({ specialization: 1, 'location.city': 1, status: 1 });

// Method to check if job is expired
jobSchema.methods.isExpired = function() {
  return this.applicationDeadline < new Date();
};

// Static method to update expired jobs
jobSchema.statics.updateExpiredJobs = async function() {
  const now = new Date();
  return await this.updateMany(
    { 
      applicationDeadline: { $lt: now },
      status: 'active'
    },
    { status: 'expired' }
  );
};

module.exports = mongoose.model('Job', jobSchema);
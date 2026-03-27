const mongoose = require('mongoose');
const Job = require('../models/job');
const StudentJob = require('../models/studentJob');

// Create a new job posting
exports.createJob = async (req, res) => {
  try {
    const jobData = {
      ...req.body,
      employerId: req.user.userId // Assuming req.user contains userId from auth middleware
    };

    const job = new Job(jobData);
    await job.save();

    res.status(201).json({
      success: true,
      message: 'Job posted successfully',
      data: job
    });
  } catch (error) {
    console.error('Error creating job:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to create job posting',
      error: error.message
    });
  }
};

// Get all jobs for the current employer (Manage My Posts)
exports.getEmployerJobs = async (req, res) => {
  try {
    const { status, page = 1, limit = 10 } = req.query;
    const employerId = new mongoose.Types.ObjectId(req.user.userId);

    const query = { employerId };
    
    if (status && status !== 'all') {
      query.status = status;
    }

    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit);

    const total = await Job.countDocuments(query);

    res.status(200).json({
      success: true,
      data: jobs,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching employer jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get single job by ID (with access control)
exports.getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if employer owns this job
    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this job posting.'
      });
    }

    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    console.error('Error fetching job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
};

// Update job details
exports.updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if employer owns this job
    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this job posting.'
      });
    }

    // Prevent updating if job is filled
    if (job.status === 'filled') {
      return res.status(400).json({
        success: false,
        message: 'Cannot update a filled position'
      });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Job updated successfully',
      data: updatedJob
    });
  } catch (error) {
    console.error('Error updating job:', error);
    
    if (error.name === 'ValidationError') {
      return res.status(400).json({
        success: false,
        message: 'Validation error',
        errors: Object.values(error.errors).map(e => e.message)
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Failed to update job',
      error: error.message
    });
  }
};

// Delete/Remove job
exports.deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);
    
    if (!job) {
      return res.status(404).json({
        success: false,
        message: 'Job not found'
      });
    }

    // Check if employer owns this job
    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this job posting.'
      });
    }

    await Job.findByIdAndDelete(req.params.id);

    res.status(200).json({
      success: true,
      message: 'Job deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete job',
      error: error.message
    });
  }
};

// Get all active jobs for students (with search and filter)
exports.getActiveJobs = async (req, res) => {
  try {
    const { search, specialization, city, page = 1, limit = 10 } = req.query;
    
    // Build query for active jobs only
    let query = { status: 'active' };
    
    // Add search functionality
    if (search && search.trim()) {
      query.$text = { $search: search };
    }
    
    // Filter by specialization
    if (specialization) {
      query.specialization = specialization;
    }
    
    // Filter by city
    if (city) {
      query['location.city'] = { $regex: city, $options: 'i' };
    }
    
    // Ensure deadline is not expired
    query.applicationDeadline = { $gt: new Date() };
    
    const jobs = await Job.find(query)
      .sort({ createdAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v'); // Exclude version field
    
    const total = await Job.countDocuments(query);
    
    // Get unique specializations and cities for filter options
    const specializations = await Job.distinct('specialization', { status: 'active' });
    const cities = await Job.distinct('location.city', { status: 'active' });
    
    res.status(200).json({
      success: true,
      data: jobs,
      filters: {
        specializations,
        cities
      },
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching active jobs:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
};

// Get single active job by ID for students (public)
exports.getPublicJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id).select('-__v');

    if (!job || job.status !== 'active' || job.isExpired()) {
      return res.status(404).json({
        success: false,
        message: 'Job not found',
      });
    }

    res.status(200).json({
      success: true,
      data: job,
    });
  } catch (error) {
    console.error('Error fetching public job:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message,
    });
  }
};

// Get applications for a specific job (employer view)
exports.getJobApplications = async (req, res) => {
  try {
    const employerId = req.user.userId;
    const jobId = req.params.id;

    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ success: false, message: 'Job not found' });
    }

    if (job.employerId.toString() !== employerId) {
      return res.status(403).json({
        success: false,
        message: 'Access denied. You do not own this job posting.',
      });
    }

    const applications = await StudentJob.find({ jobId, hasApplied: true })
      .sort({ appliedAt: -1 })
      .populate('studentId', 'name email studentProfile');

    const host = `${req.protocol}://${req.get('host')}`;

    const result = applications.map((a) => ({
      id: a._id,
      studentName: a.studentId?.name,
      studentEmail: a.studentId?.email,
      appliedAt: a.appliedAt,
      status: a.status,
      coverLetter: a.coverLetter,
      resumeUrl: a.resumePath ? `${host}/${a.resumePath.replace(/\\/g, '/')}` : null,
    }));

    return res.status(200).json({
      success: true,
      data: result,
    });
  } catch (error) {
    console.error('Error fetching job applications:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to fetch job applications',
      error: error.message,
    });
  }
};

// Get job statistics for employer dashboard
exports.getJobStatistics = async (req, res) => {
  try {
    const employerId = new mongoose.Types.ObjectId(req.user.userId);

    const stats = await Job.aggregate([
      { $match: { employerId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalViews: { $sum: '$views' },
          totalApplications: { $sum: '$applicationsCount' }
        }
      }
    ]);
    
    const totalJobs = await Job.countDocuments({ employerId });
    
    res.status(200).json({
      success: true,
      data: {
        totalJobs,
        statistics: stats,
        activeJobs: stats.find(s => s._id === 'active')?.count || 0,
        filledJobs: stats.find(s => s._id === 'filled')?.count || 0,
        expiredJobs: stats.find(s => s._id === 'expired')?.count || 0
      }
    });
  } catch (error) {
    console.error('Error fetching job statistics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch statistics',
      error: error.message
    });
  }
};
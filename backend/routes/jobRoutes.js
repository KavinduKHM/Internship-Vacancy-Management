const express = require('express');
const router = express.Router();
const jobController = require('../controllers/jobController');
const { authenticateUser } = require('../middleware/auth');
const { checkEmployerRole } = require('../middleware/employerAuth');
const { 
  validateJobCreation, 
  validateJobUpdate, 
  validateSearchFilters 
} = require('../utils/validators');

// Public routes (for students)
router.get('/active', validateSearchFilters, jobController.getActiveJobs);

// Employer routes (require authentication and employer role)
router.use(authenticateUser, checkEmployerRole); // Apply auth + employer role check to all routes below

router.post('/', validateJobCreation, jobController.createJob);
router.get('/my-posts', jobController.getEmployerJobs);
router.get('/statistics', jobController.getJobStatistics);
router.get('/:id', jobController.getJobById);
router.put('/:id', validateJobUpdate, jobController.updateJob);
router.delete('/:id', jobController.deleteJob);

module.exports = router;
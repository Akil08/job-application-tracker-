import express from 'express';
import { createJob, getJobs, updateJob, deleteJob, getStats } from '../controllers/jobController.js';
import { authenticateToken } from '../middleware/authMiddleware.js';

const router = express.Router();

router.use(authenticateToken);

router.post('/', createJob);
router.get('/', getJobs);
router.put('/:id', updateJob);
router.delete('/:id', deleteJob);
router.get('/stats', getStats);

export default router;

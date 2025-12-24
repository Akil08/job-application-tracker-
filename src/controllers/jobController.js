import { query } from '../db/index.js';

export const createJob = async (req, res) => {
  const { company_name, job_title, job_type, application_source, location, status, notes } = req.body;
  const userId = req.user.id;

  try {
    const result = await query(
      `INSERT INTO jobs (user_id, company_name, job_title, job_type, application_source, location, status, notes)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *`,
      [userId, company_name, job_title, job_type, application_source, location, status || 'Applied', notes]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getJobs = async (req, res) => {
  const userId = req.user.id;
  const { status, sort } = req.query;

  let queryString = 'SELECT * FROM jobs WHERE user_id = $1';
  const queryParams = [userId];

  if (status) {
    queryString += ' AND status = $2';
    queryParams.push(status);
  }

  // Default sort by applied_date desc
  queryString += ' ORDER BY applied_date DESC';

  try {
    const result = await query(queryString, queryParams);
    res.json(result.rows);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const updateJob = async (req, res) => {
  const { id } = req.params;
  const { company_name, job_title, job_type, application_source, location, status, notes, applied_date } = req.body;
  const userId = req.user.id;

  try {
    // Ensure job belongs to user
    const checkJob = await query('SELECT * FROM jobs WHERE id = $1 AND user_id = $2', [id, userId]);
    if (checkJob.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }

    const result = await query(
      `UPDATE jobs 
       SET company_name = $1, job_title = $2, job_type = $3, application_source = $4, location = $5, status = $6, notes = $7, applied_date = $8, updated_at = CURRENT_TIMESTAMP
       WHERE id = $9 AND user_id = $10 RETURNING *`,
      [company_name, job_title, job_type, application_source, location, status, notes, applied_date, id, userId]
    );

    res.json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const deleteJob = async (req, res) => {
  const { id } = req.params;
  const userId = req.user.id;

  try {
    const result = await query('DELETE FROM jobs WHERE id = $1 AND user_id = $2 RETURNING *', [id, userId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Job not found' });
    }
    res.json({ message: 'Job deleted successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

export const getStats = async (req, res) => {
  const userId = req.user.id;

  try {
    const totalResult = await query('SELECT COUNT(*) FROM jobs WHERE user_id = $1', [userId]);
    const statusResult = await query('SELECT status, COUNT(*) FROM jobs WHERE user_id = $1 GROUP BY status', [userId]);

    res.json({
      total: totalResult.rows[0].count,
      byStatus: statusResult.rows
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Server error' });
  }
};

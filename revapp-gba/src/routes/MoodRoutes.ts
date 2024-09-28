import express from 'express';
import { Mood } from '../../models';

const router = express.Router();

// POST: Create a new mood entry
router.post('/', async (req, res) => {
  try {
    const newMood = await Mood.create(req.body);
    res.status(201).json(newMood);
  } catch (error) {
    res.status(400).json({ message: 'Error creating mood entry', error });
  }
});

// GET: Retrieve all mood entries
router.get('/', async (req, res) => {
  try {
    const moods = await Mood.findAll({ order: [['createdAt', 'DESC']] });
    res.status(200).json(moods);
  } catch (error) {
    res.status(400).json({ message: 'Error fetching mood entries', error });
  }
});

export default router;
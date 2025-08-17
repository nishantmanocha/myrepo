const express = require('express');
const router = express.Router();
const ProgressionController = require('./controllers/progressionController');
const { authenticateToken } = require('./middleware/auth');

// Get user's progression data
router.get('/progression', authenticateToken, async (req, res) => {
  try {
    const result = await ProgressionController.getUserProgression(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete a course and award XP
router.post('/course/complete', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.body;
    if (!courseId) {
      return res.status(400).json({ success: false, message: 'Course ID is required' });
    }
    
    const result = await ProgressionController.completeCourse(req.user.id, courseId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete a quiz and award XP
router.post('/quiz/complete', authenticateToken, async (req, res) => {
  try {
    const { quizId, score } = req.body;
    if (!quizId || score === undefined) {
      return res.status(400).json({ success: false, message: 'Quiz ID and score are required' });
    }
    
    const result = await ProgressionController.completeQuiz(req.user.id, quizId, score);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Complete a scenario and award XP
router.post('/scenario/complete', authenticateToken, async (req, res) => {
  try {
    const { scenarioId } = req.body;
    if (!scenarioId) {
      return res.status(400).json({ success: false, message: 'Scenario ID is required' });
    }
    
    const result = await ProgressionController.completeScenario(req.user.id, scenarioId);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Use a tool and award XP
router.post('/tool/use', authenticateToken, async (req, res) => {
  try {
    const { toolName } = req.body;
    if (!toolName) {
      return res.status(400).json({ success: false, message: 'Tool name is required' });
    }
    
    const result = await ProgressionController.useTool(req.user.id, toolName);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Update daily streak
router.post('/streak/update', authenticateToken, async (req, res) => {
  try {
    const result = await ProgressionController.updateDailyStreak(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's badges
router.get('/badges', authenticateToken, async (req, res) => {
  try {
    const result = await ProgressionController.getUserBadges(req.user.id);
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get all available badges
router.get('/badges/all', async (req, res) => {
  try {
    const result = await ProgressionController.getAllBadges();
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get leaderboard
router.get('/leaderboard', async (req, res) => {
  try {
    const { limit = 10 } = req.query;
    const result = await ProgressionController.getLeaderboard(parseInt(limit));
    res.json(result);
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

// Get user's stats summary
router.get('/stats', authenticateToken, async (req, res) => {
  try {
    const progression = await ProgressionController.getUserProgression(req.user.id);
    if (!progression.success) {
      return res.status(500).json(progression);
    }

    const stats = {
      xp: progression.progression.xp,
      level: progression.progression.level,
      streak: progression.progression.streak,
      stats: progression.progression.stats,
      xpForNextLevel: progression.progression.xpForNextLevel,
      progressToNextLevel: progression.progression.progressToNextLevel,
      totalCompleted: {
        courses: progression.progression.stats.coursesCompleted,
        lessons: progression.progression.stats.lessonsCompleted,
        quizzes: progression.progression.stats.quizzesCompleted,
        scenarios: progression.progression.stats.scenariosCompleted,
        tools: progression.progression.stats.toolsUsed
      }
    };

    res.json({ success: true, stats });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
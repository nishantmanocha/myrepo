const mongoose = require('mongoose');

const progressionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true, // one progression doc per user
  },

  // Core gamification stats
  xp: { type: Number, default: 0 }, // total XP earned
  level: { type: Number, default: 1 }, // gamified levels
  streak: { type: Number, default: 0 }, // daily streak count
  lastLogin: { type: Date, default: Date.now },

  // Stats for badges & analytics
  stats: {
    coursesCompleted: { type: Number, default: 0 },
    lessonsCompleted: { type: Number, default: 0 },
    quizzesCompleted: { type: Number, default: 0 },
    scenariosCompleted: { type: Number, default: 0 },
    toolsUsed: { type: Number, default: 0 }, // simulators & calculators
    perfectQuizScores: { type: Number, default: 0 }, // for Quiz Master badge
  },

  // Completed course/quiz/lesson IDs for progress tracking
  completed: {
    courses: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Course' }],
    lessons: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Lesson' }],
    quizzes: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Quiz' }],
    scenarios: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Scenario' }],
    tools: [{ type: String }], // tool identifiers
  },

  // Activity log for analytics
  activityLog: [
    {
      action: { type: String }, // e.g., "completed_lesson", "completed_quiz"
      targetId: { type: String }, // lessonId, quizId, etc.
      xpGained: { type: Number, default: 0 },
      date: { type: Date, default: Date.now },
    },
  ],

  // Badge tracking
  earnedBadges: [{ type: String }], // badge names/IDs
  lastBadgeEarned: { type: Date },

}, { timestamps: true });

// Calculate level based on XP
progressionSchema.methods.calculateLevel = function() {
  // Every 500 XP = Level Up
  return Math.floor(this.xp / 500) + 1;
};

// Calculate XP needed for next level
progressionSchema.methods.xpForNextLevel = function() {
  const currentLevel = this.level;
  return currentLevel * 500;
};

// Calculate progress percentage to next level
progressionSchema.methods.progressToNextLevel = function() {
  const currentLevelXP = (this.level - 1) * 500;
  const currentLevelProgress = this.xp - currentLevelXP;
  const xpNeededForLevel = 500;
  return Math.min((currentLevelProgress / xpNeededForLevel) * 100, 100);
};

// Add XP and check for level up
progressionSchema.methods.addXP = function(amount, action, targetId) {
  const oldLevel = this.level;
  this.xp += amount;
  this.level = this.calculateLevel();
  
  // Log activity
  this.activityLog.push({
    action,
    targetId,
    xpGained: amount,
    date: new Date(),
  });

  // Check if level up occurred
  const leveledUp = this.level > oldLevel;
  
  return {
    leveledUp,
    oldLevel,
    newLevel: this.level,
    totalXP: this.xp,
    xpForNextLevel: this.xpForNextLevel(),
    progressToNextLevel: this.progressToNextLevel(),
  };
};

// Update daily streak
progressionSchema.methods.updateStreak = function() {
  const today = new Date().setHours(0, 0, 0, 0);
  const lastLogin = new Date(this.lastLogin).setHours(0, 0, 0, 0);
  
  if (lastLogin === today) {
    return { streak: this.streak, message: "✅ Already counted today" };
  }
  
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  if (lastLogin === yesterday.setHours(0, 0, 0, 0)) {
    this.streak += 1; // continue streak
  } else {
    this.streak = 1; // reset streak
  }
  
  this.lastLogin = new Date();
  return { streak: this.streak, message: "🔥 Streak updated!" };
};

module.exports = mongoose.model('Progression', progressionSchema);
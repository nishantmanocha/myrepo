const mongoose = require('mongoose');

const badgeSchema = new mongoose.Schema({
  name: { 
    type: String, 
    required: true,
    unique: true 
  }, // "Quiz Master", "Fraud Detective", etc.
  
  description: { 
    type: String, 
    required: true 
  },
  
  icon: { 
    type: String, 
    required: true 
  }, // URL or asset name
  
  color: { 
    type: String, 
    default: "#4ecdc4" 
  }, // badge color
  
  xpReward: { 
    type: Number, 
    default: 0 
  }, // bonus XP when unlocked
  
  condition: {
    type: String,
    enum: [
      "complete_first_course",
      "complete_5_courses", 
      "complete_10_courses",
      "complete_first_quiz",
      "complete_5_quizzes",
      "complete_10_quizzes",
      "complete_first_scenario",
      "complete_3_scenarios",
      "complete_5_scenarios",
      "use_5_tools",
      "daily_streak_7",
      "daily_streak_30",
      "reach_level_5",
      "reach_level_10",
      "perfect_quiz_score",
      "perfect_5_quizzes"
    ],
    required: true,
  },
  
  // Requirements for earning the badge
  requirements: {
    count: { type: Number, default: 1 }, // how many times to complete action
    type: { type: String }, // "course", "quiz", "scenario", "tool", "streak", "level"
    minScore: { type: Number }, // minimum score for quiz badges
  },
  
  // Badge rarity
  rarity: {
    type: String,
    enum: ["common", "rare", "epic", "legendary"],
    default: "common"
  },
  
  // Category for grouping
  category: {
    type: String,
    enum: ["learning", "achievement", "streak", "mastery", "exploration"],
    default: "learning"
  },
  
  isActive: {
    type: Boolean,
    default: true
  },

}, { timestamps: true });

// Static method to get badges by category
badgeSchema.statics.getByCategory = function(category) {
  return this.find({ category, isActive: true }).sort({ rarity: 1 });
};

// Static method to get badges by condition
badgeSchema.statics.getByCondition = function(condition) {
  return this.findOne({ condition, isActive: true });
};

// Static method to get all active badges
badgeSchema.statics.getAllActive = function() {
  return this.find({ isActive: true }).sort({ category: 1, rarity: 1 });
};

module.exports = mongoose.model('Badge', badgeSchema);
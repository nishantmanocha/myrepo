const mongoose = require('mongoose');
const Badge = require('../models/Badge');

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/fineduguard', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const badges = [
  {
    name: "First Steps",
    description: "Complete your first course",
    icon: "🎓",
    color: "#4ecdc4",
    condition: "complete_first_course",
    rarity: "common",
    category: "learning",
    requirements: { count: 1, type: "course" }
  },
  {
    name: "Course Explorer",
    description: "Complete 5 courses",
    icon: "📚",
    color: "#45b7d1",
    condition: "complete_5_courses",
    rarity: "rare",
    category: "learning",
    requirements: { count: 5, type: "course" }
  },
  {
    name: "Course Master",
    description: "Complete 10 courses",
    icon: "🏆",
    color: "#ffd93d",
    condition: "complete_10_courses",
    rarity: "epic",
    category: "learning",
    requirements: { count: 10, type: "course" }
  },
  {
    name: "Quiz Beginner",
    description: "Complete your first quiz",
    icon: "❓",
    color: "#96ceb4",
    condition: "complete_first_quiz",
    rarity: "common",
    category: "learning",
    requirements: { count: 1, type: "quiz" }
  },
  {
    name: "Quiz Enthusiast",
    description: "Complete 5 quizzes",
    icon: "🎯",
    color: "#ff6b6b",
    condition: "complete_5_quizzes",
    rarity: "rare",
    category: "learning",
    requirements: { count: 5, type: "quiz" }
  },
  {
    name: "Quiz Master",
    description: "Complete 10 quizzes",
    icon: "🎖️",
    color: "#5f27cd",
    condition: "complete_10_quizzes",
    rarity: "epic",
    category: "learning",
    requirements: { count: 10, type: "quiz" }
  },
  {
    name: "Perfect Score",
    description: "Get a perfect score on a quiz",
    icon: "⭐",
    color: "#ffd93d",
    condition: "perfect_quiz_score",
    rarity: "rare",
    category: "mastery",
    requirements: { count: 1, type: "quiz", minScore: 100 }
  },
  {
    name: "Quiz Champion",
    description: "Get perfect scores on 5 quizzes",
    icon: "👑",
    color: "#ff9ff3",
    condition: "perfect_5_quizzes",
    rarity: "legendary",
    category: "mastery",
    requirements: { count: 5, type: "quiz", minScore: 100 }
  },
  {
    name: "Scenario Explorer",
    description: "Complete your first fraud scenario",
    icon: "🔍",
    color: "#54a0ff",
    condition: "complete_first_scenario",
    rarity: "common",
    category: "learning",
    requirements: { count: 1, type: "scenario" }
  },
  {
    name: "Fraud Detective",
    description: "Complete 3 fraud scenarios",
    icon: "🕵️",
    color: "#ff6b6b",
    condition: "complete_3_scenarios",
    rarity: "rare",
    category: "learning",
    requirements: { count: 3, type: "scenario" }
  },
  {
    name: "Fraud Fighter",
    description: "Complete 5 fraud scenarios",
    icon: "🛡️",
    color: "#4ecdc4",
    condition: "complete_5_scenarios",
    rarity: "epic",
    category: "learning",
    requirements: { count: 5, type: "scenario" }
  },
  {
    name: "Tool Explorer",
    description: "Use 5 different tools",
    icon: "⚙️",
    color: "#45b7d1",
    condition: "use_5_tools",
    rarity: "rare",
    category: "exploration",
    requirements: { count: 5, type: "tool" }
  },
  {
    name: "Week Warrior",
    description: "Maintain a 7-day login streak",
    icon: "🔥",
    color: "#ff6b6b",
    condition: "daily_streak_7",
    rarity: "rare",
    category: "streak",
    requirements: { count: 7, type: "streak" }
  },
  {
    name: "Monthly Master",
    description: "Maintain a 30-day login streak",
    icon: "💎",
    color: "#5f27cd",
    condition: "daily_streak_30",
    rarity: "legendary",
    category: "streak",
    requirements: { count: 30, type: "streak" }
  },
  {
    name: "Level 5 Achiever",
    description: "Reach level 5",
    icon: "🌟",
    color: "#ffd93d",
    condition: "reach_level_5",
    rarity: "rare",
    category: "achievement",
    requirements: { count: 5, type: "level" }
  },
  {
    name: "Financial Guru",
    description: "Reach level 10",
    icon: "👑",
    color: "#ff9ff3",
    condition: "reach_level_10",
    rarity: "legendary",
    category: "achievement",
    requirements: { count: 10, type: "level" }
  }
];

async function seedBadges() {
  try {
    console.log('🌱 Starting badge seeding...');
    
    // Clear existing badges
    await Badge.deleteMany({});
    console.log('🗑️ Cleared existing badges');
    
    // Insert new badges
    const insertedBadges = await Badge.insertMany(badges);
    console.log(`✅ Successfully seeded ${insertedBadges.length} badges`);
    
    // Display seeded badges
    insertedBadges.forEach(badge => {
      console.log(`  - ${badge.name} (${badge.rarity})`);
    });
    
    console.log('🎉 Badge seeding completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Error seeding badges:', error);
    process.exit(1);
  }
}

// Run the seeding function
seedBadges();
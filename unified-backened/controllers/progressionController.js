const Progression = require('../models/Progression');
const Badge = require('../models/Badge');
const UserBadge = require('../models/UserBadge');
const mongoose = require('mongoose');

class ProgressionController {
  
  // Get user's progression data
  static async getUserProgression(userId) {
    try {
      let progression = await Progression.findOne({ userId });
      
      if (!progression) {
        // Create new progression for new user
        progression = await Progression.create({ userId });
      }
      
      // Populate completed items
      await progression.populate([
        { path: 'completed.courses', select: 'title icon color' },
        { path: 'completed.lessons', select: 'title' },
        { path: 'completed.quizzes', select: 'title' },
        { path: 'completed.scenarios', select: 'title' }
      ]);
      
      return {
        success: true,
        progression: {
          xp: progression.xp,
          level: progression.level,
          streak: progression.streak,
          stats: progression.stats,
          completed: progression.completed,
          xpForNextLevel: progression.xpForNextLevel(),
          progressToNextLevel: progression.progressToNextLevel(),
          lastLogin: progression.lastLogin
        }
      };
    } catch (error) {
      console.error('Error getting user progression:', error);
      return { success: false, error: error.message };
    }
  }

  // Award XP for completing a course
  static async completeCourse(userId, courseId) {
    try {
      let progression = await Progression.findOne({ userId });
      if (!progression) {
        progression = await Progression.create({ userId });
      }

      // Check if already completed
      if (progression.completed.courses.includes(courseId)) {
        return { success: false, message: "Course already completed!" };
      }

      // Award XP (50 XP for course completion)
      const xpResult = progression.addXP(50, 'completed_course', courseId);
      
      // Update stats
      progression.stats.coursesCompleted += 1;
      progression.completed.courses.push(courseId);
      
      await progression.save();

      // Check for badges
      const badgeResult = await this.checkAndAwardBadges(userId, progression);

      return {
        success: true,
        message: "🎉 Course completed!",
        xpResult,
        badgeResult,
        stats: progression.stats,
        xp: progression.xp,
        level: progression.level
      };
    } catch (error) {
      console.error('Error completing course:', error);
      return { success: false, error: error.message };
    }
  }

  // Award XP for completing a quiz
  static async completeQuiz(userId, quizId, score) {
    try {
      let progression = await Progression.findOne({ userId });
      if (!progression) {
        progression = await Progression.create({ userId });
      }

      // Check if already completed
      if (progression.completed.quizzes.includes(quizId)) {
        return { success: false, message: "Quiz already completed!" };
      }

      // Award XP (30 XP for quiz completion, bonus for perfect score)
      let xpAmount = 30;
      if (score === 100) {
        xpAmount += 20; // Bonus XP for perfect score
        progression.stats.perfectQuizScores += 1;
      }

      const xpResult = progression.addXP(xpAmount, 'completed_quiz', quizId);
      
      // Update stats
      progression.stats.quizzesCompleted += 1;
      progression.completed.quizzes.push(quizId);
      
      await progression.save();

      // Check for badges
      const badgeResult = await this.checkAndAwardBadges(userId, progression);

      return {
        success: true,
        message: "🎉 Quiz completed!",
        xpResult,
        badgeResult,
        stats: progression.stats,
        xp: progression.xp,
        level: progression.level
      };
    } catch (error) {
      console.error('Error completing quiz:', error);
      return { success: false, error: error.message };
    }
  }

  // Award XP for completing a scenario
  static async completeScenario(userId, scenarioId) {
    try {
      let progression = await Progression.findOne({ userId });
      if (!progression) {
        progression = await Progression.create({ userId });
      }

      // Check if already completed
      if (progression.completed.scenarios.includes(scenarioId)) {
        return { success: false, message: "Scenario already completed!" };
      }

      // Award XP (40 XP for scenario completion)
      const xpResult = progression.addXP(40, 'completed_scenario', scenarioId);
      
      // Update stats
      progression.stats.scenariosCompleted += 1;
      progression.completed.scenarios.push(scenarioId);
      
      await progression.save();

      // Check for badges
      const badgeResult = await this.checkAndAwardBadges(userId, progression);

      return {
        success: true,
        message: "🎉 Scenario completed!",
        xpResult,
        badgeResult,
        stats: progression.stats,
        xp: progression.xp,
        level: progression.level
      };
    } catch (error) {
      console.error('Error completing scenario:', error);
      return { success: false, error: error.message };
    }
  }

  // Award XP for using a tool
  static async useTool(userId, toolName) {
    try {
      let progression = await Progression.findOne({ userId });
      if (!progression) {
        progression = await Progression.create({ userId });
      }

      // Check if tool already used today
      const today = new Date().setHours(0, 0, 0, 0);
      const lastToolUse = progression.activityLog
        .filter(log => log.action === 'used_tool' && log.targetId === toolName)
        .sort((a, b) => new Date(b.date) - new Date(a.date))[0];

      if (lastToolUse && new Date(lastToolUse.date).setHours(0, 0, 0, 0) === today) {
        return { success: false, message: "Tool already used today!" };
      }

      // Award XP (15 XP for tool usage)
      const xpResult = progression.addXP(15, 'used_tool', toolName);
      
      // Update stats
      if (!progression.completed.tools.includes(toolName)) {
        progression.stats.toolsUsed += 1;
        progression.completed.tools.push(toolName);
      }
      
      await progression.save();

      // Check for badges
      const badgeResult = await this.checkAndAwardBadges(userId, progression);

      return {
        success: true,
        message: "🛠️ Tool used!",
        xpResult,
        badgeResult,
        stats: progression.stats,
        xp: progression.xp,
        level: progression.level
      };
    } catch (error) {
      console.error('Error using tool:', error);
      return { success: false, error: error.message };
    }
  }

  // Update daily streak
  static async updateDailyStreak(userId) {
    try {
      let progression = await Progression.findOne({ userId });
      if (!progression) {
        progression = await Progression.create({ userId });
      }

      const streakResult = progression.updateStreak();
      
      // Award XP for daily login (10 XP)
      const xpResult = progression.addXP(10, 'daily_login', 'streak');
      
      await progression.save();

      // Check for streak badges
      const badgeResult = await this.checkAndAwardBadges(userId, progression);

      return {
        success: true,
        message: streakResult.message,
        streak: streakResult.streak,
        xpResult,
        badgeResult,
        xp: progression.xp,
        level: progression.level
      };
    } catch (error) {
      console.error('Error updating daily streak:', error);
      return { success: false, error: error.message };
    }
  }

  // Check and award badges based on current progression
  static async checkAndAwardBadges(userId, progression) {
    try {
      const newBadges = [];
      
      // Get all available badges
      const allBadges = await Badge.getAllActive();
      
      for (const badge of allBadges) {
        // Check if user already has this badge
        const hasBadge = await UserBadge.hasBadge(userId, badge._id);
        if (hasBadge) continue;

        let shouldAward = false;

        // Check badge conditions
        switch (badge.condition) {
          case 'complete_first_course':
            shouldAward = progression.stats.coursesCompleted >= 1;
            break;
          case 'complete_5_courses':
            shouldAward = progression.stats.coursesCompleted >= 5;
            break;
          case 'complete_10_courses':
            shouldAward = progression.stats.coursesCompleted >= 10;
            break;
          case 'complete_first_quiz':
            shouldAward = progression.stats.quizzesCompleted >= 1;
            break;
          case 'complete_5_quizzes':
            shouldAward = progression.stats.quizzesCompleted >= 5;
            break;
          case 'complete_10_quizzes':
            shouldAward = progression.stats.quizzesCompleted >= 10;
            break;
          case 'complete_first_scenario':
            shouldAward = progression.stats.scenariosCompleted >= 1;
            break;
          case 'complete_3_scenarios':
            shouldAward = progression.stats.scenariosCompleted >= 3;
            break;
          case 'complete_5_scenarios':
            shouldAward = progression.stats.scenariosCompleted >= 5;
            break;
          case 'use_5_tools':
            shouldAward = progression.stats.toolsUsed >= 5;
            break;
          case 'daily_streak_7':
            shouldAward = progression.streak >= 7;
            break;
          case 'daily_streak_30':
            shouldAward = progression.streak >= 30;
            break;
          case 'reach_level_5':
            shouldAward = progression.level >= 5;
            break;
          case 'reach_level_10':
            shouldAward = progression.level >= 10;
            break;
          case 'perfect_quiz_score':
            shouldAward = progression.stats.perfectQuizScores >= 1;
            break;
          case 'perfect_5_quizzes':
            shouldAward = progression.stats.perfectQuizScores >= 5;
            break;
        }

        if (shouldAward) {
          // Award the badge
          await UserBadge.create({
            userId,
            badgeId: badge._id
          });

          // Add badge to progression
          progression.earnedBadges.push(badge.name);
          progression.lastBadgeEarned = new Date();

          // Award bonus XP if badge has XP reward
          if (badge.xpReward > 0) {
            progression.addXP(badge.xpReward, 'badge_unlocked', badge.name);
          }

          newBadges.push({
            name: badge.name,
            description: badge.description,
            icon: badge.icon,
            color: badge.color,
            xpReward: badge.xpReward
          });
        }
      }

      if (newBadges.length > 0) {
        await progression.save();
      }

      return {
        newBadges,
        totalBadges: progression.earnedBadges.length
      };
    } catch (error) {
      console.error('Error checking badges:', error);
      return { newBadges: [], totalBadges: 0 };
    }
  }

  // Get user's badges
  static async getUserBadges(userId) {
    try {
      const userBadges = await UserBadge.getUserBadges(userId);
      
      return {
        success: true,
        badges: userBadges.map(ub => ({
          name: ub.badge.name,
          description: ub.badge.description,
          icon: ub.badge.icon,
          color: ub.badge.color,
          rarity: ub.badge.rarity,
          category: ub.badge.category,
          earnedAt: ub.earnedAt,
          isFavorite: ub.isFavorite
        }))
      };
    } catch (error) {
      console.error('Error getting user badges:', error);
      return { success: false, error: error.message };
    }
  }

  // Get all available badges
  static async getAllBadges() {
    try {
      const badges = await Badge.getAllActive();
      
      return {
        success: true,
        badges: badges.map(badge => ({
          id: badge._id,
          name: badge.name,
          description: badge.description,
          icon: badge.icon,
          color: badge.color,
          rarity: badge.rarity,
          category: badge.category,
          condition: badge.condition,
          requirements: badge.requirements
        }))
      };
    } catch (error) {
      console.error('Error getting all badges:', error);
      return { success: false, error: error.message };
    }
  }

  // Get leaderboard (top users by XP)
  static async getLeaderboard(limit = 10) {
    try {
      const leaderboard = await Progression.find()
        .populate('userId', 'firstName lastName avatar')
        .sort({ xp: -1 })
        .limit(limit);

      return {
        success: true,
        leaderboard: leaderboard.map((entry, index) => ({
          rank: index + 1,
          userId: entry.userId._id,
          firstName: entry.userId.firstName,
          lastName: entry.userId.lastName,
          avatar: entry.userId.avatar,
          xp: entry.xp,
          level: entry.level,
          streak: entry.streak
        }))
      };
    } catch (error) {
      console.error('Error getting leaderboard:', error);
      return { success: false, error: error.message };
    }
  }
}

module.exports = ProgressionController;
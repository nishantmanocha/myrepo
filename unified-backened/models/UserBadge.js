const mongoose = require('mongoose');

const userBadgeSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  badgeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Badge',
    required: true,
  },
  
  // When the badge was earned
  earnedAt: { 
    type: Date, 
    default: Date.now 
  },
  
  // Additional metadata
  metadata: {
    score: { type: Number }, // score when badge was earned
    completionTime: { type: Number }, // time taken to complete
    difficulty: { type: String }, // difficulty level when earned
  },
  
  // Badge display preferences
  isFavorite: { 
    type: Boolean, 
    default: false 
  },
  
  // Badge sharing
  sharedAt: { 
    type: Date 
  },
  
}, { timestamps: true });

// Compound index to ensure a user can only earn a badge once
userBadgeSchema.index({ userId: 1, badgeId: 1 }, { unique: true });

// Virtual for badge details
userBadgeSchema.virtual('badge', {
  ref: 'Badge',
  localField: 'badgeId',
  foreignField: '_id',
  justOne: true
});

// Ensure virtuals are included when converting to JSON
userBadgeSchema.set('toJSON', { virtuals: true });
userBadgeSchema.set('toObject', { virtuals: true });

// Static method to get user's badges
userBadgeSchema.statics.getUserBadges = function(userId) {
  return this.find({ userId })
    .populate('badgeId')
    .sort({ earnedAt: -1 });
};

// Static method to check if user has a specific badge
userBadgeSchema.statics.hasBadge = function(userId, badgeId) {
  return this.exists({ userId, badgeId });
};

// Static method to get user's badge count
userBadgeSchema.statics.getBadgeCount = function(userId) {
  return this.countDocuments({ userId });
};

module.exports = mongoose.model('UserBadge', userBadgeSchema);
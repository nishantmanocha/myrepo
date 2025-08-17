# 🎮 FinEduGuard Gamification System

A comprehensive gamification system for FinEduGuard that rewards users with XP, levels, badges, and streaks for completing educational activities.

## ✨ Features

- **Experience Points (XP)**: Earn XP for completing courses, quizzes, scenarios, and using tools
- **Level System**: Level up every 500 XP with visual progress indicators
- **Badge Collection**: Unlock badges for achieving milestones
- **Daily Streaks**: Maintain login streaks for bonus rewards
- **Real-time Updates**: Instant feedback when earning XP or unlocking badges
- **Celebration Animations**: Confetti, party poppers, and screen vibrations for achievements

## 🏗️ Architecture

### Backend Models

1. **Progression Model** (`models/Progression.js`)
   - Tracks user XP, level, streak, and completion stats
   - Methods for calculating levels and progress
   - Activity logging for analytics

2. **Badge Model** (`models/Badge.js`)
   - Defines available badges and their requirements
   - Supports different rarity levels and categories
   - Configurable XP rewards

3. **UserBadge Model** (`models/UserBadge.js`)
   - Tracks which badges each user has earned
   - Includes metadata like earning date and preferences

### Backend Controllers

- **ProgressionController** (`controllers/progressionController.js`)
  - Handles all gamification logic
  - XP awards, level calculations, badge checking
  - Streak management and activity tracking

### API Endpoints

```
GET    /api/gamification/progression    - Get user's progression data
POST   /api/gamification/course/complete - Complete a course (+50 XP)
POST   /api/gamification/quiz/complete   - Complete a quiz (+30 XP, +20 bonus for perfect score)
POST   /api/gamification/scenario/complete - Complete a scenario (+40 XP)
POST   /api/gamification/tool/use        - Use a tool (+15 XP)
POST   /api/gamification/streak/update   - Update daily streak (+10 XP)
GET    /api/gamification/badges          - Get user's earned badges
GET    /api/gamification/badges/all      - Get all available badges
GET    /api/gamification/leaderboard     - Get top users by XP
GET    /api/gamification/stats           - Get user's stats summary
```

## 🚀 Setup Instructions

### 1. Backend Setup

1. **Install Dependencies**
   ```bash
   cd unified-backened
   npm install
   ```

2. **Create Models**
   - Copy the model files to your `models/` directory
   - Ensure MongoDB connection is configured

3. **Seed Badges**
   ```bash
   node scripts/seedBadges.js
   ```

4. **Add Routes to Main App**
   ```javascript
   // In your main app file (e.g., index.js)
   const gamificationRoutes = require('./gamificationRoutes');
   app.use('/api/gamification', gamificationRoutes);
   ```

### 2. Frontend Setup

1. **Install Dependencies**
   ```bash
   npm install react-native-animatable
   ```

2. **Copy Components**
   - `components/BadgeUnlockModal.tsx`
   - `hooks/useGamification.ts`

3. **Update Profile Screen**
   - Import and use the `useGamification` hook
   - Add the `BadgeUnlockModal` component

## 🎯 XP System

### XP Rewards

| Action | XP | Notes |
|--------|----|-------|
| Course Completion | +50 | One-time per course |
| Quiz Completion | +30 | +20 bonus for perfect score |
| Scenario Completion | +40 | One-time per scenario |
| Tool Usage | +15 | Once per day per tool |
| Daily Login | +10 | Maintains streak |

### Level Progression

- **Level 1**: 0-499 XP
- **Level 2**: 500-999 XP
- **Level 3**: 1000-1499 XP
- **Level 4**: 1500-1999 XP
- **Level 5**: 2000-2499 XP
- And so on...

## 🏅 Badge System

### Available Badges

#### Learning Badges
- **First Steps** 🎓 - Complete first course
- **Course Explorer** 📚 - Complete 5 courses
- **Course Master** 🏆 - Complete 10 courses
- **Quiz Beginner** ❓ - Complete first quiz
- **Quiz Enthusiast** 🎯 - Complete 5 quizzes
- **Quiz Master** 🎖️ - Complete 10 quizzes

#### Mastery Badges
- **Perfect Score** ⭐ - Get 100% on a quiz
- **Quiz Champion** 👑 - Get perfect scores on 5 quizzes

#### Exploration Badges
- **Scenario Explorer** 🔍 - Complete first fraud scenario
- **Fraud Detective** 🕵️ - Complete 3 scenarios
- **Fraud Fighter** 🛡️ - Complete 5 scenarios
- **Tool Explorer** ⚙️ - Use 5 different tools

#### Streak Badges
- **Week Warrior** 🔥 - 7-day login streak
- **Monthly Master** 💎 - 30-day login streak

#### Achievement Badges
- **Level 5 Achiever** 🌟 - Reach level 5
- **Financial Guru** 👑 - Reach level 10

## 🔧 Usage Examples

### Frontend Integration

```typescript
import { useGamification } from '../hooks/useGamification';

const MyComponent = () => {
  const {
    progression,
    badges,
    completeCourse,
    completeQuiz,
    completeScenario,
    useTool,
    updateDailyStreak,
  } = useGamification();

  // Complete a course
  const handleCourseComplete = async (courseId: string) => {
    try {
      const result = await completeCourse(courseId);
      console.log('Course completed!', result);
    } catch (error) {
      console.error('Error completing course:', error);
    }
  };

  // Complete a quiz
  const handleQuizComplete = async (quizId: string, score: number) => {
    try {
      const result = await completeQuiz(quizId, score);
      console.log('Quiz completed!', result);
    } catch (error) {
      console.error('Error completing quiz:', error);
    }
  };

  return (
    <View>
      <Text>Level: {progression?.level || 1}</Text>
      <Text>XP: {progression?.xp || 0}</Text>
      <Text>Streak: {progression?.streak || 0}</Text>
    </View>
  );
};
```

### Backend Integration

```javascript
// In your existing routes, call the gamification controller
const ProgressionController = require('./controllers/progressionController');

app.post('/api/courses/:id/complete', authenticateToken, async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.user.id;

    // Your existing course completion logic
    // ... save course progress, etc.

    // Award XP and check for badges
    const gamificationResult = await ProgressionController.completeCourse(userId, courseId);
    
    res.json({
      success: true,
      courseCompleted: true,
      gamification: gamificationResult
    });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
});
```

## 🎨 Customization

### Adding New Badges

1. **Update Badge Model**
   ```javascript
   // Add new condition to enum
   condition: {
     type: String,
     enum: [
       // ... existing conditions
       "new_achievement_condition"
     ]
   }
   ```

2. **Update ProgressionController**
   ```javascript
   // In checkAndAwardBadges method
   case 'new_achievement_condition':
     shouldAward = /* your condition logic */;
     break;
   ```

3. **Seed New Badge**
   ```javascript
   // In seedBadges.js
   {
     name: "New Badge",
     description: "Description here",
     icon: "🎉",
     color: "#ff6b6b",
     condition: "new_achievement_condition",
     rarity: "rare",
     category: "achievement"
   }
   ```

### Modifying XP Rewards

Edit the XP amounts in `ProgressionController.js`:

```javascript
// Award XP (50 XP for course completion)
const xpResult = progression.addXP(50, 'completed_course', courseId);

// Award XP (30 XP for quiz completion, bonus for perfect score)
let xpAmount = 30;
if (score === 100) {
  xpAmount += 20; // Bonus XP for perfect score
}
```

### Changing Level Requirements

Modify the level calculation in `Progression.js`:

```javascript
// Calculate level based on XP
progressionSchema.methods.calculateLevel = function() {
  // Change from 500 to your desired XP per level
  return Math.floor(this.xp / 500) + 1;
};
```

## 🧪 Testing

### Test Badge Unlocking

1. **Complete a course** to unlock "First Steps" badge
2. **Complete 5 courses** to unlock "Course Explorer" badge
3. **Get perfect quiz score** to unlock "Perfect Score" badge
4. **Maintain 7-day streak** to unlock "Week Warrior" badge

### Test XP System

1. **Complete activities** and verify XP increases
2. **Check level progression** every 500 XP
3. **Verify streak counting** with daily logins

## 🚨 Troubleshooting

### Common Issues

1. **Badges not unlocking**
   - Check badge conditions in `ProgressionController.js`
   - Verify user progress in database
   - Check console for errors

2. **XP not updating**
   - Verify API endpoints are working
   - Check authentication middleware
   - Ensure progression document exists for user

3. **Frontend not updating**
   - Check API responses
   - Verify hook dependencies
   - Check for React state issues

### Debug Mode

Enable debug logging in `ProgressionController.js`:

```javascript
console.log('Debug: Checking badge conditions for user:', userId);
console.log('Debug: Current progression:', progression);
console.log('Debug: Badge check result:', shouldAward);
```

## 📱 Frontend Components

### BadgeUnlockModal

A celebration modal that appears when badges are unlocked:
- Confetti animation
- Screen vibration
- Party popper effects
- Badge display with rotation
- XP reward information

### useGamification Hook

Custom hook for managing gamification state:
- Automatic progression fetching
- Badge management
- XP tracking
- Error handling
- Real-time updates

## 🔮 Future Enhancements

- **Leaderboards**: Global and friend-based rankings
- **Seasonal Events**: Time-limited challenges and rewards
- **Social Features**: Share achievements, challenge friends
- **Advanced Analytics**: Detailed progress tracking and insights
- **Custom Badges**: User-created or personalized badges
- **Achievement Points**: Separate scoring system for achievements

## 📄 License

This gamification system is part of the FinEduGuard project and follows the same licensing terms.

## 🤝 Contributing

To contribute to the gamification system:

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests if applicable
5. Submit a pull request

## 📞 Support

For questions or issues with the gamification system:

1. Check this README for common solutions
2. Review the code comments for implementation details
3. Open an issue in the repository
4. Contact the development team

---

**Happy Gaming! 🎮✨**
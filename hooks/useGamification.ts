import { useState, useEffect, useCallback } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../contexts/AuthContext';

interface ProgressionStats {
  xp: number;
  level: number;
  streak: number;
  stats: {
    coursesCompleted: number;
    lessonsCompleted: number;
    quizzesCompleted: number;
    scenariosCompleted: number;
    toolsUsed: number;
    perfectQuizScores: number;
  };
  xpForNextLevel: number;
  progressToNextLevel: number;
  lastLogin: Date;
}

interface Badge {
  name: string;
  description: string;
  icon: string;
  color: string;
  rarity: string;
  category: string;
  earnedAt: Date;
  isFavorite: boolean;
}

interface GamificationState {
  progression: ProgressionStats | null;
  badges: Badge[];
  isLoading: boolean;
  error: string | null;
  newBadge: Badge | null;
  showBadgeModal: boolean;
}

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000';

export const useGamification = () => {
  const { user } = useAuth();
  const [state, setState] = useState<GamificationState>({
    progression: null,
    badges: [],
    isLoading: false,
    error: null,
    newBadge: null,
    showBadgeModal: false,
  });

  // Get auth token from storage
  const getAuthToken = async () => {
    try {
      return await AsyncStorage.getItem('authToken');
    } catch (error) {
      console.error('Error getting auth token:', error);
      return null;
    }
  };

  // Fetch user progression
  const fetchProgression = useCallback(async () => {
    if (!user) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));
      
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/progression`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch progression');

      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          progression: data.progression,
          isLoading: false,
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch progression');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
        isLoading: false,
      }));
    }
  }, [user]);

  // Fetch user badges
  const fetchBadges = useCallback(async () => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/badges`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to fetch badges');

      const data = await response.json();
      
      if (data.success) {
        setState(prev => ({
          ...prev,
          badges: data.badges,
        }));
      } else {
        throw new Error(data.message || 'Failed to fetch badges');
      }
    } catch (error) {
      console.error('Error fetching badges:', error);
    }
  }, [user]);

  // Complete a course
  const completeCourse = useCallback(async (courseId: string) => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/course/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ courseId }),
      });

      if (!response.ok) throw new Error('Failed to complete course');

      const data = await response.json();
      
      if (data.success) {
        // Update progression
        await fetchProgression();
        
        // Check for new badges
        if (data.badgeResult?.newBadges?.length > 0) {
          const newBadge = data.badgeResult.newBadges[0];
          setState(prev => ({
            ...prev,
            newBadge,
            showBadgeModal: true,
          }));
          
          // Refresh badges
          await fetchBadges();
        }
        
        return data;
      } else {
        throw new Error(data.message || 'Failed to complete course');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      throw error;
    }
  }, [user, fetchProgression, fetchBadges]);

  // Complete a quiz
  const completeQuiz = useCallback(async (quizId: string, score: number) => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/quiz/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ quizId, score }),
      });

      if (!response.ok) throw new Error('Failed to complete quiz');

      const data = await response.json();
      
      if (data.success) {
        // Update progression
        await fetchProgression();
        
        // Check for new badges
        if (data.badgeResult?.newBadges?.length > 0) {
          const newBadge = data.badgeResult.newBadges[0];
          setState(prev => ({
            ...prev,
            newBadge,
            showBadgeModal: true,
          }));
          
          // Refresh badges
          await fetchBadges();
        }
        
        return data;
      } else {
        throw new Error(data.message || 'Failed to complete quiz');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      throw error;
    }
  }, [user, fetchProgression, fetchBadges]);

  // Complete a scenario
  const completeScenario = useCallback(async (scenarioId: string) => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/scenario/complete`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ scenarioId }),
      });

      if (!response.ok) throw new Error('Failed to complete scenario');

      const data = await response.json();
      
      if (data.success) {
        // Update progression
        await fetchProgression();
        
        // Check for new badges
        if (data.badgeResult?.newBadges?.length > 0) {
          const newBadge = data.badgeResult.newBadges[0];
          setState(prev => ({
            ...prev,
            newBadge,
            showBadgeModal: true,
          }));
          
          // Refresh badges
          await fetchBadges();
        }
        
        return data;
      } else {
        throw new Error(data.message || 'Failed to complete scenario');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      throw error;
    }
  }, [user, fetchProgression, fetchBadges]);

  // Use a tool
  const useTool = useCallback(async (toolName: string) => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/tool/use`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolName }),
      });

      if (!response.ok) throw new Error('Failed to use tool');

      const data = await response.json();
      
      if (data.success) {
        // Update progression
        await fetchProgression();
        
        // Check for new badges
        if (data.badgeResult?.newBadges?.length > 0) {
          const newBadge = data.badgeResult.newBadges[0];
          setState(prev => ({
            ...prev,
            newBadge,
            showBadgeModal: true,
          }));
          
          // Refresh badges
          await fetchBadges();
        }
        
        return data;
      } else {
        throw new Error(data.message || 'Failed to use tool');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      throw error;
    }
  }, [user, fetchProgression, fetchBadges]);

  // Update daily streak
  const updateDailyStreak = useCallback(async () => {
    if (!user) return;

    try {
      const token = await getAuthToken();
      if (!token) throw new Error('No auth token');

      const response = await fetch(`${API_BASE_URL}/api/gamification/streak/update`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) throw new Error('Failed to update streak');

      const data = await response.json();
      
      if (data.success) {
        // Update progression
        await fetchProgression();
        
        // Check for new badges
        if (data.badgeResult?.newBadges?.length > 0) {
          const newBadge = data.badgeResult.newBadges[0];
          setState(prev => ({
            ...prev,
            newBadge,
            showBadgeModal: true,
          }));
          
          // Refresh badges
          await fetchBadges();
        }
        
        return data;
      } else {
        throw new Error(data.message || 'Failed to update streak');
      }
    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Unknown error',
      }));
      throw error;
    }
  }, [user, fetchProgression, fetchBadges]);

  // Close badge modal
  const closeBadgeModal = useCallback(() => {
    setState(prev => ({
      ...prev,
      showBadgeModal: false,
      newBadge: null,
    }));
  }, []);

  // Clear error
  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Load initial data
  useEffect(() => {
    if (user) {
      fetchProgression();
      fetchBadges();
    }
  }, [user, fetchProgression, fetchBadges]);

  return {
    ...state,
    fetchProgression,
    fetchBadges,
    completeCourse,
    completeQuiz,
    completeScenario,
    useTool,
    updateDailyStreak,
    closeBadgeModal,
    clearError,
  };
};
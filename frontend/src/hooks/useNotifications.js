import { useState, useEffect, useCallback } from 'react';

export const useNotifications = () => {
  const [permission, setPermission] = useState(Notification.permission);
  const [isSupported] = useState('Notification' in window);

  useEffect(() => {
    if (isSupported) {
      setPermission(Notification.permission);
    }
  }, [isSupported]);

  const requestPermission = useCallback(async () => {
    if (!isSupported) {
      console.warn('Notifications are not supported in this browser');
      return false;
    }

    if (permission === 'granted') {
      return true;
    }

    try {
      const result = await Notification.requestPermission();
      setPermission(result);
      return result === 'granted';
    } catch (error) {
      console.error('Error requesting notification permission:', error);
      return false;
    }
  }, [isSupported, permission]);

  const showNotification = useCallback((title, options = {}) => {
    if (!isSupported || permission !== 'granted') {
      console.warn('Cannot show notification: permission not granted');
      return null;
    }

    const defaultOptions = {
      icon: '/logo192.png',
      badge: '/logo192.png',
      tag: 'nutritrack-notification',
      requireInteraction: false,
      silent: false,
      ...options
    };

    try {
      const notification = new Notification(title, defaultOptions);
      
      // Auto-close after 5 seconds
      setTimeout(() => {
        notification.close();
      }, 5000);

      return notification;
    } catch (error) {
      console.error('Error showing notification:', error);
      return null;
    }
  }, [isSupported, permission]);

  const showMealReminder = useCallback((mealType) => {
    const messages = {
      breakfast: {
        title: '🌅 Time for Breakfast!',
        body: 'Don\'t forget to log your morning meal and start your day right!',
        icon: '🌅'
      },
      lunch: {
        title: '☀️ Lunch Time!',
        body: 'Take a break and log your lunch to stay on track with your nutrition goals.',
        icon: '☀️'
      },
      dinner: {
        title: '🌙 Dinner Time!',
        body: 'End your day by logging your dinner and completing your nutrition tracking.',
        icon: '🌙'
      },
      snack: {
        title: '🍎 Snack Time!',
        body: 'Remember to log any snacks to maintain accurate nutrition tracking.',
        icon: '🍎'
      }
    };

    const message = messages[mealType] || messages.snack;
    return showNotification(message.title, {
      body: message.body,
      icon: message.icon
    });
  }, [showNotification]);

  const showGoalAchievement = useCallback((goalType, achieved) => {
    const messages = {
      calories: {
        title: achieved ? '🎉 Calorie Goal Achieved!' : '⚠️ Calorie Goal Alert',
        body: achieved 
          ? 'Congratulations! You\'ve reached your daily calorie goal.'
          : 'You\'re close to your daily calorie limit. Keep it up!'
      },
      protein: {
        title: achieved ? '💪 Protein Goal Achieved!' : '🥩 Protein Goal Alert',
        body: achieved
          ? 'Great job! You\'ve hit your daily protein target.'
          : 'You\'re approaching your protein goal. Almost there!'
      }
    };

    const message = messages[goalType] || messages.calories;
    return showNotification(message.title, {
      body: message.body,
      icon: achieved ? '🎉' : '⚠️'
    });
  }, [showNotification]);

  const showStreakReminder = useCallback((streak) => {
    return showNotification('🔥 Streak Reminder!', {
      body: `You have a ${streak} day streak! Don't break it - log a meal today!`,
      icon: '🔥',
      requireInteraction: true
    });
  }, [showNotification]);

  const showWeeklyReport = useCallback((stats) => {
    return showNotification('📊 Weekly Report Ready!', {
      body: `Check out your nutrition progress for this week. You logged ${stats.mealCount} meals!`,
      icon: '📊'
    });
  }, [showNotification]);

  return {
    isSupported,
    permission,
    requestPermission,
    showNotification,
    showMealReminder,
    showGoalAchievement,
    showStreakReminder,
    showWeeklyReport
  };
};

export default useNotifications;

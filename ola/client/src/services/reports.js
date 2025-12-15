import api from './api';

/**
 * Get user statistics including goals, habits, and completion rates
 */
export async function getStatistics() {
  const response = await api.get('/reports/my-statistics');
  return response.data;
}

/**
 * Get goal completion rate for the authenticated user
 */
export async function getCompletionRate() {
  const response = await api.get('/reports/completion-rate');
  return response.data;
}

/**
 * Get habit progress history for a specific habit
 * @param {number} habitId - The ID of the habit
 */
export async function getHabitProgress(habitId) {
  const response = await api.get(`/reports/habit-progress/${habitId}`);
  return response.data;
}

/**
 * Get emotion trends over the specified number of days
 * @param {number} days - Number of days to retrieve (default: 30)
 */
export async function getEmotionTrends(days = 30) {
  const response = await api.get(`/reports/emotion-trends?days=${days}`);
  return response.data;
}

import { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import Card from '../../components/Card';
import Loader from '../../components/Loader';
import PageHeader from '../../components/PageHeader';
import { getStatistics, getCompletionRate, getHabitProgress, getEmotionTrends } from '../../services/reports';
import api from '../../services/api';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function ReportsDashboard() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [statistics, setStatistics] = useState(null);
  const [completionRate, setCompletionRate] = useState(null);
  const [habitProgress, setHabitProgress] = useState(null);
  const [emotionTrends, setEmotionTrends] = useState(null);
  const [habits, setHabits] = useState([]);
  const [selectedHabitId, setSelectedHabitId] = useState(null);

  useEffect(() => {
    loadDashboardData();
  }, []);

  useEffect(() => {
    if (selectedHabitId) {
      loadHabitProgress(selectedHabitId);
    }
  }, [selectedHabitId]);

  async function loadDashboardData() {
    try {
      setLoading(true);
      setError('');

      // Fetch all data in parallel
      const [statsData, rateData, emotionsData, habitsData] = await Promise.all([
        getStatistics(),
        getCompletionRate(),
        getEmotionTrends(30),
        api.get('/habits').then(res => res.data)
      ]);

      setStatistics(statsData);
      setCompletionRate(rateData.completionRate);
      setEmotionTrends(emotionsData);
      setHabits(habitsData);

      // Load progress for first habit if available
      if (habitsData && habitsData.length > 0) {
        setSelectedHabitId(habitsData[0].id);
        const progressData = await getHabitProgress(habitsData[0].id);
        setHabitProgress(progressData);
      }
    } catch (err) {
      console.error('Failed to load dashboard data:', err);
      setError(err?.response?.data?.error || 'Failed to load dashboard data. Please try again.');
    } finally {
      setLoading(false);
    }
  }

  async function loadHabitProgress(habitId) {
    try {
      const progressData = await getHabitProgress(habitId);
      setHabitProgress(progressData);
    } catch (err) {
      console.error('Failed to load habit progress:', err);
    }
  }

  // Prepare habit progress chart data
  const habitProgressChartData = habitProgress && habitProgress.length > 0 ? {
    labels: habitProgress.map(p => new Date(p.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Progress Value',
        data: habitProgress.map(p => p.value),
        borderColor: 'rgb(99, 102, 241)',
        backgroundColor: 'rgba(99, 102, 241, 0.1)',
        tension: 0.3,
        fill: true,
      }
    ]
  } : null;

  // Prepare emotion trends chart data
  const emotionTrendsChartData = emotionTrends && emotionTrends.length > 0 ? {
    labels: emotionTrends.map(e => new Date(e.date).toLocaleDateString()),
    datasets: [
      {
        label: 'Anxiety',
        data: emotionTrends.map(e => e.avgAnxiety || 0),
        borderColor: 'rgb(239, 68, 68)',
        backgroundColor: 'rgba(239, 68, 68, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Calmness',
        data: emotionTrends.map(e => e.avgCalmness || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Joy',
        data: emotionTrends.map(e => e.avgJoy || 0),
        borderColor: 'rgb(250, 204, 21)',
        backgroundColor: 'rgba(250, 204, 21, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Anger',
        data: emotionTrends.map(e => e.avgAnger || 0),
        borderColor: 'rgb(220, 38, 38)',
        backgroundColor: 'rgba(220, 38, 38, 0.1)',
        tension: 0.3,
      },
      {
        label: 'Boredom',
        data: emotionTrends.map(e => e.avgBoredom || 0),
        borderColor: 'rgb(156, 163, 175)',
        backgroundColor: 'rgba(156, 163, 175, 0.1)',
        tension: 0.3,
      }
    ]
  } : null;

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        max: 5,
      }
    }
  };

  const habitProgressOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
    },
    scales: {
      y: {
        beginAtZero: true,
      }
    }
  };

  if (loading) {
    return (
      <div className="container">
        <PageHeader title="Reports Dashboard" />
        <Loader />
      </div>
    );
  }

  if (error) {
    return (
      <div className="container">
        <PageHeader title="Reports Dashboard" />
        <Card>
          <div className="text-red-600">{error}</div>
          <button onClick={loadDashboardData} className="btn mt-4">Retry</button>
        </Card>
      </div>
    );
  }

  return (
    <div className="container">
      <PageHeader title="Reports Dashboard" subtitle="View your progress and insights" />

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <Card className="bg-gradient-to-br from-blue-50 to-blue-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Habits</p>
              <p className="text-3xl font-bold text-blue-600">{statistics?.totalHabits || 0}</p>
            </div>
            <div className="w-12 h-12 bg-blue-200 rounded-full flex items-center justify-center text-blue-600 font-bold">H</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-green-50 to-green-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Total Goals</p>
              <p className="text-3xl font-bold text-green-600">{statistics?.totalGoals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-green-200 rounded-full flex items-center justify-center text-green-600 font-bold">G</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-purple-50 to-purple-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completed Goals</p>
              <p className="text-3xl font-bold text-purple-600">{statistics?.completedGoals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-purple-200 rounded-full flex items-center justify-center text-purple-600 font-bold">&#10003;</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Completion Rate</p>
              <p className="text-3xl font-bold text-yellow-600">
                {completionRate !== null ? `${completionRate.toFixed(1)}%` : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 bg-yellow-200 rounded-full flex items-center justify-center text-yellow-600 font-bold">%</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-indigo-50 to-indigo-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">In Progress</p>
              <p className="text-3xl font-bold text-indigo-600">{statistics?.inProgressGoals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-indigo-200 rounded-full flex items-center justify-center text-indigo-600 font-bold">&#8594;</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-pink-50 to-pink-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Not Started</p>
              <p className="text-3xl font-bold text-pink-600">{statistics?.notStartedGoals || 0}</p>
            </div>
            <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center text-pink-600 font-bold">&#9679;</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-teal-50 to-teal-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Emotion Entries</p>
              <p className="text-3xl font-bold text-teal-600">{statistics?.totalEmotionEntries || 0}</p>
            </div>
            <div className="w-12 h-12 bg-teal-200 rounded-full flex items-center justify-center text-teal-600 font-bold">E</div>
          </div>
        </Card>

        <Card className="bg-gradient-to-br from-orange-50 to-orange-100">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-600 mb-1">Avg Progress</p>
              <p className="text-3xl font-bold text-orange-600">
                {statistics?.avgProgress !== null && statistics?.avgProgress !== undefined
                  ? `${statistics.avgProgress.toFixed(1)}%`
                  : 'N/A'}
              </p>
            </div>
            <div className="w-12 h-12 bg-orange-200 rounded-full flex items-center justify-center text-orange-600 font-bold">&#9733;</div>
          </div>
        </Card>
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Habit Progress Chart */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Habit Progress History</h2>
            {habits.length > 0 && (
              <select
                value={selectedHabitId || ''}
                onChange={(e) => setSelectedHabitId(Number(e.target.value))}
                className="input w-full max-w-xs"
              >
                {habits.map(habit => (
                  <option key={habit.id} value={habit.id}>
                    {habit.name}
                  </option>
                ))}
              </select>
            )}
            <p className="text-sm text-gray-600 mt-2">
              Track your daily progress for the selected habit over time
            </p>
          </div>
          <div style={{ height: '300px' }}>
            {habitProgressChartData ? (
              <Line data={habitProgressChartData} options={habitProgressOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No habit progress data available. Start tracking your habits!
              </div>
            )}
          </div>
        </Card>

        {/* Emotion Trends Chart */}
        <Card>
          <div className="mb-4">
            <h2 className="text-xl font-bold mb-2">Emotion Trends (Last 30 Days)</h2>
            <p className="text-sm text-gray-600">
              Monitor your emotional well-being across different dimensions
            </p>
          </div>
          <div style={{ height: '300px' }}>
            {emotionTrendsChartData ? (
              <Line data={emotionTrendsChartData} options={chartOptions} />
            ) : (
              <div className="flex items-center justify-center h-full text-gray-500">
                No emotion data available. Start journaling your emotions!
              </div>
            )}
          </div>
        </Card>
      </div>

      {/* Additional Insights */}
      <Card className="mt-6">
        <h2 className="text-xl font-bold mb-4">Quick Insights</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-blue-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Success Rate</p>
            <p className="text-2xl font-bold text-blue-600">
              {statistics?.totalGoals > 0
                ? `${((statistics.completedGoals / statistics.totalGoals) * 100).toFixed(1)}%`
                : 'N/A'}
            </p>
            <p className="text-xs text-gray-500 mt-1">Goals completed successfully</p>
          </div>
          <div className="p-4 bg-green-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Active Items</p>
            <p className="text-2xl font-bold text-green-600">
              {(statistics?.inProgressGoals || 0) + (statistics?.totalHabits || 0)}
            </p>
            <p className="text-xs text-gray-500 mt-1">Total active goals and habits</p>
          </div>
          <div className="p-4 bg-purple-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-1">Journal Entries</p>
            <p className="text-2xl font-bold text-purple-600">
              {statistics?.totalEmotionEntries || 0}
            </p>
            <p className="text-xs text-gray-500 mt-1">Emotional reflections recorded</p>
          </div>
        </div>
      </Card>
    </div>
  );
}

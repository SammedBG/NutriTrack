import React, { useEffect, useState, useContext, useCallback } from "react";
import api from "../api/api";
import MealCard from "../components/MealCard";
import { AuthContext } from "../context/AuthContext";
import { Bar, Doughnut } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale, ArcElement, Tooltip, Legend);

export default function Dashboard() {
  const { user } = useContext(AuthContext);
  const [meals, setMeals] = useState([]);
  const [stats, setStats] = useState({});
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('week');

  const fetchDashboardData = useCallback(async () => {
    try {
      setLoading(true);
      const [mealsRes, statsRes] = await Promise.all([
        api.get("/meals?limit=5"),
        api.get(`/meals/stats?period=${selectedPeriod}`)
      ]);
      
      setMeals(mealsRes.data.meals || mealsRes.data);
      setStats(statsRes.data);
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedPeriod]);

  useEffect(() => {
    fetchDashboardData();
    // Set up real-time updates every 30 seconds
    const interval = setInterval(fetchDashboardData, 30000);
    return () => clearInterval(interval);
  }, [selectedPeriod, fetchDashboardData]);

  const getProgressPercentage = (current, goal) => {
    if (!goal || goal === 0) return 0;
    return Math.min((current / goal) * 100, 100);
  };

  const getProgressColor = (percentage) => {
    if (percentage >= 90) return "#10b981";
    if (percentage >= 70) return "#f59e0b";
    return "#ef4444";
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const chartData = {
    labels: Object.keys(stats.summary || {}).map(formatDate),
    datasets: [{
      label: "Calories",
      data: Object.values(stats.summary || {}),
      backgroundColor: "rgba(102, 126, 234, 0.8)",
      borderColor: "rgba(102, 126, 234, 1)",
      borderWidth: 2,
      borderRadius: 8,
      borderSkipped: false,
    }]
  };

  const macroData = {
    labels: ['Protein', 'Carbs', 'Fat'],
    datasets: [{
      data: [
        stats.stats?.totalProtein || 0,
        stats.stats?.totalCarbs || 0,
        stats.stats?.totalFat || 0
      ],
      backgroundColor: [
        '#667eea',
        '#764ba2',
        '#f093fb'
      ],
      borderWidth: 0,
    }]
  };

  if (loading) {
    return (
      <div className="container">
        <div className="flex-center" style={{ minHeight: '400px' }}>
          <div className="spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="container">
      {/* Header */}
      <div className="card mb-3">
        <div className="flex-between">
          <div>
            <h1 style={{ margin: 0, fontSize: '2rem', fontWeight: '700' }}>
              Welcome back, {user?.name}! 👋
            </h1>
            <p className="text-muted" style={{ margin: '8px 0 0 0' }}>
              Track your nutrition journey with AI-powered meal analysis
            </p>
          </div>
          <div className="text-center">
            <div className="badge badge-primary" style={{ fontSize: '14px', padding: '8px 16px' }}>
              {stats.stats?.streak || 0} day streak 🔥
            </div>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-4 mb-4">
        <div className="card text-center">
          <h3 style={{ margin: 0, color: '#667eea' }}>{stats.stats?.totalCalories || 0}</h3>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Calories</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#e5e7eb', 
            borderRadius: '2px',
            marginTop: '8px'
          }}>
            <div style={{
              width: `${getProgressPercentage(stats.stats?.totalCalories, user?.goals?.calories)}%`,
              height: '100%',
              background: getProgressColor(getProgressPercentage(stats.stats?.totalCalories, user?.goals?.calories)),
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
        
        <div className="card text-center">
          <h3 style={{ margin: 0, color: '#10b981' }}>{Math.round(stats.stats?.totalProtein || 0)}g</h3>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Protein</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#e5e7eb', 
            borderRadius: '2px',
            marginTop: '8px'
          }}>
            <div style={{
              width: `${getProgressPercentage(stats.stats?.totalProtein, user?.goals?.protein)}%`,
              height: '100%',
              background: getProgressColor(getProgressPercentage(stats.stats?.totalProtein, user?.goals?.protein)),
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
        
        <div className="card text-center">
          <h3 style={{ margin: 0, color: '#f59e0b' }}>{Math.round(stats.stats?.totalCarbs || 0)}g</h3>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Carbs</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#e5e7eb', 
            borderRadius: '2px',
            marginTop: '8px'
          }}>
            <div style={{
              width: `${getProgressPercentage(stats.stats?.totalCarbs, user?.goals?.carbs)}%`,
              height: '100%',
              background: getProgressColor(getProgressPercentage(stats.stats?.totalCarbs, user?.goals?.carbs)),
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
        
        <div className="card text-center">
          <h3 style={{ margin: 0, color: '#ef4444' }}>{Math.round(stats.stats?.totalFat || 0)}g</h3>
          <p style={{ margin: '4px 0 0 0', color: '#6b7280' }}>Fat</p>
          <div style={{ 
            width: '100%', 
            height: '4px', 
            background: '#e5e7eb', 
            borderRadius: '2px',
            marginTop: '8px'
          }}>
            <div style={{
              width: `${getProgressPercentage(stats.stats?.totalFat, user?.goals?.fat)}%`,
              height: '100%',
              background: getProgressColor(getProgressPercentage(stats.stats?.totalFat, user?.goals?.fat)),
              borderRadius: '2px',
              transition: 'width 0.3s ease'
            }}></div>
          </div>
        </div>
      </div>

      {/* Charts Section */}
      <div className="grid grid-2 mb-4">
        <div className="card">
          <div className="flex-between mb-3">
            <h3 style={{ margin: 0 }}>Calorie Trends</h3>
            <select 
              value={selectedPeriod} 
              onChange={(e) => setSelectedPeriod(e.target.value)}
              style={{ width: 'auto', padding: '8px 12px' }}
            >
              <option value="day">Today</option>
              <option value="week">This Week</option>
              <option value="month">This Month</option>
            </select>
          </div>
          <div style={{ height: '300px' }}>
            <Bar
              data={chartData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false
                  }
                },
                scales: {
                  y: {
                    beginAtZero: true,
                    grid: {
                      color: 'rgba(0,0,0,0.1)'
                    }
                  },
                  x: {
                    grid: {
                      display: false
                    }
                  }
                }
              }}
            />
          </div>
        </div>

        <div className="card">
          <h3 style={{ margin: '0 0 24px 0' }}>Macro Distribution</h3>
          <div style={{ height: '300px' }}>
            <Doughnut
              data={macroData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      padding: 20,
                      usePointStyle: true
                    }
                  }
                }
              }}
          />
        </div>
        </div>
      </div>

      {/* Recent Meals */}
      <div className="card">
        <div className="flex-between mb-3">
          <h3 style={{ margin: 0 }}>Recent Meals</h3>
          <a href="/upload" className="badge badge-primary">
            + Add Meal
          </a>
        </div>
        
        {meals.length === 0 ? (
          <div className="text-center p-4">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
            <h4 style={{ margin: '0 0 8px 0' }}>No meals logged yet</h4>
            <p className="text-muted">Start your nutrition journey by adding your first meal!</p>
            <a href="/upload" className="badge badge-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>
              Upload Meal Photo
            </a>
          </div>
        ) : (
          <div className="grid grid-2">
            {meals.map(meal => (
              <MealCard key={meal._id} meal={meal} />
            ))}
          </div>
        )}
        </div>
    </div>
  );
}

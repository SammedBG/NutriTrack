import React, { useEffect, useState } from "react";
import api from "../api/api";
import MealCard from "../components/MealCard";

export default function History() {
  const [meals, setMeals] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    mealType: "",
    startDate: "",
    endDate: ""
  });
  const [pagination, setPagination] = useState({
    current: 1,
    total: 0,
    pages: 0
  });

  const fetchMeals = async (page = 1) => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: page.toString(),
        limit: "10"
      });

      if (filters.mealType) params.append("mealType", filters.mealType);
      if (filters.startDate) params.append("startDate", filters.startDate);
      if (filters.endDate) params.append("endDate", filters.endDate);

      const res = await api.get(`/meals?${params}`);
      
      if (res.data.meals) {
        setMeals(res.data.meals);
        setPagination(res.data.pagination);
      } else {
        setMeals(res.data);
        setPagination({ current: 1, total: res.data.length, pages: 1 });
      }
    } catch (error) {
      console.error("Error fetching meals:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMeals();
  }, [filters]);

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({ ...prev, [key]: value }));
  };

  const clearFilters = () => {
    setFilters({ mealType: "", startDate: "", endDate: "" });
  };

  const handlePageChange = (page) => {
    fetchMeals(page);
  };

  const getMealTypeStats = () => {
    const stats = meals.reduce((acc, meal) => {
      const type = meal.mealType || "meal";
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});
    return stats;
  };

  const mealTypeStats = getMealTypeStats();

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
      <div className="card mb-4">
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>📋 Meal History</h1>
        <p className="text-muted" style={{ margin: '0 0 24px 0' }}>
          View and manage all your logged meals
        </p>

        {/* Filters */}
        <div className="card mb-4" style={{ background: '#f8fafc' }}>
          <h3 style={{ margin: '0 0 16px 0' }}>🔍 Filters</h3>
          
          <div className="grid grid-3 mb-3">
            <select
              value={filters.mealType}
              onChange={(e) => handleFilterChange("mealType", e.target.value)}
            >
              <option value="">All Meal Types</option>
              <option value="breakfast">🌅 Breakfast</option>
              <option value="lunch">☀️ Lunch</option>
              <option value="dinner">🌙 Dinner</option>
              <option value="snack">🍎 Snack</option>
            </select>
            
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange("startDate", e.target.value)}
              placeholder="Start Date"
            />
            
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange("endDate", e.target.value)}
              placeholder="End Date"
            />
          </div>
          
          <div className="flex" style={{ gap: '12px' }}>
            <button
              onClick={clearFilters}
              style={{
                background: 'transparent',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                padding: '8px 16px',
                borderRadius: '8px',
                cursor: 'pointer'
              }}
            >
              Clear Filters
            </button>
            
            <div className="text-muted" style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '8px' 
            }}>
              <span>Total: {pagination.total} meals</span>
            </div>
          </div>
        </div>

        {/* Meal Type Stats */}
        {Object.keys(mealTypeStats).length > 0 && (
          <div className="card mb-4">
            <h3 style={{ margin: '0 0 16px 0' }}>📊 Meal Type Breakdown</h3>
            <div className="grid grid-4">
              {Object.entries(mealTypeStats).map(([type, count]) => (
                <div key={type} className="text-center">
                  <div style={{ fontSize: '24px', fontWeight: '700', color: '#667eea' }}>
                    {count}
                  </div>
                  <div style={{ fontSize: '14px', color: '#6b7280', textTransform: 'capitalize' }}>
                    {type}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Meals List */}
        {meals.length === 0 ? (
          <div className="text-center p-4">
            <div style={{ fontSize: '48px', marginBottom: '16px' }}>🍽️</div>
            <h4 style={{ margin: '0 0 8px 0' }}>No meals found</h4>
            <p className="text-muted">
              {Object.values(filters).some(f => f) 
                ? "Try adjusting your filters or add some meals!" 
                : "Start your nutrition journey by adding your first meal!"
              }
            </p>
            <a href="/upload" className="badge badge-primary" style={{ padding: '12px 24px', fontSize: '16px' }}>
              Add Meal
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-2">
              {meals.map(meal => (
                <MealCard 
                  key={meal._id} 
                  meal={meal} 
                  onUpdate={() => fetchMeals(pagination.current)}
                  onDelete={() => fetchMeals(pagination.current)}
                />
              ))}
            </div>

            {/* Pagination */}
            {pagination.pages > 1 && (
              <div className="flex-center mt-4">
                <div className="flex" style={{ gap: '8px' }}>
                  <button
                    onClick={() => handlePageChange(pagination.current - 1)}
                    disabled={pagination.current === 1}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      background: pagination.current === 1 ? '#f3f4f6' : 'white',
                      color: pagination.current === 1 ? '#9ca3af' : '#374151',
                      cursor: pagination.current === 1 ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Previous
                  </button>
                  
                  {Array.from({ length: pagination.pages }, (_, i) => i + 1).map(page => (
                    <button
                      key={page}
                      onClick={() => handlePageChange(page)}
                      style={{
                        padding: '8px 16px',
                        borderRadius: '8px',
                        border: '1px solid #d1d5db',
                        background: page === pagination.current ? '#667eea' : 'white',
                        color: page === pagination.current ? 'white' : '#374151',
                        cursor: 'pointer'
                      }}
                    >
                      {page}
                    </button>
                  ))}
                  
                  <button
                    onClick={() => handlePageChange(pagination.current + 1)}
                    disabled={pagination.current === pagination.pages}
                    style={{
                      padding: '8px 16px',
                      borderRadius: '8px',
                      border: '1px solid #d1d5db',
                      background: pagination.current === pagination.pages ? '#f3f4f6' : 'white',
                      color: pagination.current === pagination.pages ? '#9ca3af' : '#374151',
                      cursor: pagination.current === pagination.pages ? 'not-allowed' : 'pointer'
                    }}
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}

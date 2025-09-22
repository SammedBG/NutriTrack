import React, { useState } from "react";
import api from "../api/api";

export default function MealCard({ meal, onUpdate, onDelete }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({
    name: meal.name || "",
    calories: meal.calories || 0,
    protein: meal.protein || 0,
    carbs: meal.carbs || 0,
    fat: meal.fat || 0,
    mealType: meal.mealType || "meal"
  });
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    try {
      setLoading(true);
      await api.put(`/meals/${meal._id}`, editData);
      setIsEditing(false);
      if (onUpdate) onUpdate();
    } catch (error) {
      console.error("Error updating meal:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (window.confirm("Are you sure you want to delete this meal?")) {
      try {
        setLoading(true);
        await api.delete(`/meals/${meal._id}`);
        if (onDelete) onDelete();
      } catch (error) {
        console.error("Error deleting meal:", error);
      } finally {
        setLoading(false);
      }
    }
  };

  const formatTime = (dateString) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getMealTypeIcon = (type) => {
    const icons = {
      breakfast: '🌅',
      lunch: '☀️',
      dinner: '🌙',
      snack: '🍎',
      meal: '🍽️'
    };
    return icons[type] || '🍽️';
  };

  const getConfidenceColor = (confidence) => {
    if (confidence >= 0.8) return '#10b981';
    if (confidence >= 0.6) return '#f59e0b';
    return '#ef4444';
  };

  if (isEditing) {
    return (
      <div className="card">
        <div className="flex-between mb-3">
          <h4 style={{ margin: 0 }}>Edit Meal</h4>
          <button 
            onClick={() => setIsEditing(false)}
            style={{ background: 'transparent', color: '#6b7280', padding: '4px 8px' }}
          >
            ✕
          </button>
        </div>
        
        <div className="grid grid-2 mb-3">
          <input
            type="text"
            placeholder="Meal name"
            value={editData.name}
            onChange={(e) => setEditData({...editData, name: e.target.value})}
          />
          <select
            value={editData.mealType}
            onChange={(e) => setEditData({...editData, mealType: e.target.value})}
          >
            <option value="breakfast">Breakfast</option>
            <option value="lunch">Lunch</option>
            <option value="dinner">Dinner</option>
            <option value="snack">Snack</option>
          </select>
        </div>
        
        <div className="grid grid-4 mb-3">
          <input
            type="number"
            placeholder="Calories"
            value={editData.calories}
            onChange={(e) => setEditData({...editData, calories: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Protein (g)"
            value={editData.protein}
            onChange={(e) => setEditData({...editData, protein: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Carbs (g)"
            value={editData.carbs}
            onChange={(e) => setEditData({...editData, carbs: parseFloat(e.target.value) || 0})}
          />
          <input
            type="number"
            placeholder="Fat (g)"
            value={editData.fat}
            onChange={(e) => setEditData({...editData, fat: parseFloat(e.target.value) || 0})}
          />
        </div>
        
        <div className="flex" style={{ gap: '12px' }}>
          <button onClick={handleSave} disabled={loading} style={{ flex: 1 }}>
            {loading ? 'Saving...' : 'Save Changes'}
          </button>
          <button 
            onClick={handleDelete} 
            disabled={loading}
            style={{ 
              background: '#ef4444', 
              flex: 1,
              opacity: loading ? 0.6 : 1
            }}
          >
            Delete
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ position: 'relative' }}>
      <div className="flex" style={{ gap: '16px' }}>
        {meal.photoUrl && (
          <div style={{ position: 'relative' }}>
            <img 
              src={meal.photoUrl} 
              alt={meal.name} 
              style={{
                width: '80px',
                height: '80px',
                objectFit: 'cover',
                borderRadius: '12px',
                border: '2px solid #e5e7eb'
              }} 
            />
            {meal.confidence && (
              <div 
                className="badge"
                style={{
                  position: 'absolute',
                  top: '-8px',
                  right: '-8px',
                  background: getConfidenceColor(meal.confidence),
                  fontSize: '10px',
                  padding: '2px 6px'
                }}
              >
                {Math.round(meal.confidence * 100)}%
              </div>
            )}
          </div>
        )}
        
        <div style={{ flex: 1 }}>
          <div className="flex-between mb-2">
            <h4 style={{ margin: 0, fontSize: '18px' }}>
              {getMealTypeIcon(meal.mealType)} {meal.name || "Meal"}
            </h4>
            <div className="text-muted" style={{ fontSize: '14px' }}>
              {formatTime(meal.createdAt)}
            </div>
          </div>
          
          <div className="grid grid-4 mb-3">
            <div className="text-center">
              <div style={{ fontWeight: '600', color: '#667eea' }}>
                {Math.round(meal.calories || 0)}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Calories</div>
            </div>
            <div className="text-center">
              <div style={{ fontWeight: '600', color: '#10b981' }}>
                {Math.round(meal.protein || 0)}g
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Protein</div>
            </div>
            <div className="text-center">
              <div style={{ fontWeight: '600', color: '#f59e0b' }}>
                {Math.round(meal.carbs || 0)}g
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Carbs</div>
            </div>
            <div className="text-center">
              <div style={{ fontWeight: '600', color: '#ef4444' }}>
                {Math.round(meal.fat || 0)}g
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>Fat</div>
            </div>
          </div>
          
          {meal.fiber && (
            <div className="text-muted" style={{ fontSize: '14px' }}>
              Fiber: {Math.round(meal.fiber)}g • Sugar: {Math.round(meal.sugar || 0)}g
            </div>
          )}
        </div>
      </div>
      
      <div className="flex-between mt-3">
        <div className="flex" style={{ gap: '8px' }}>
          {meal.isVerified && (
            <span className="badge badge-success" style={{ fontSize: '10px' }}>
              ✓ Verified
            </span>
          )}
          <span className="badge" style={{ 
            background: '#e5e7eb', 
            color: '#6b7280',
            fontSize: '10px'
          }}>
            {meal.mealType}
          </span>
        </div>
        
        <button 
          onClick={() => setIsEditing(true)}
          style={{ 
            background: 'transparent', 
            color: '#667eea', 
            padding: '4px 8px',
            fontSize: '14px',
            border: '1px solid #667eea'
          }}
        >
          Edit
        </button>
      </div>
    </div>
  );
}

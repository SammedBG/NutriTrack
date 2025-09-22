import React, { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { exportMealsToCSV, exportUserStatsToJSON, exportNutritionReport } from "../utils/exportData";

export default function Profile() {
  const { user, reloadUser } = useContext(AuthContext);
  const [form, setForm] = useState(null);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("profile");

  useEffect(() => {
    if (user) {
      setForm({
        name: user.name || "",
        profile: {
          age: user.profile?.age || "",
          gender: user.profile?.gender || "",
          height: user.profile?.height || "",
          weight: user.profile?.weight || "",
          activityLevel: user.profile?.activityLevel || "moderately_active",
          fitnessGoal: user.profile?.fitnessGoal || "maintain_weight"
        },
        goals: {
          calories: user.goals?.calories || 2000,
          protein: user.goals?.protein || 100,
          carbs: user.goals?.carbs || 250,
          fat: user.goals?.fat || 80,
          fiber: user.goals?.fiber || 25,
          water: user.goals?.water || 8
        }
      });
    }
  }, [user]);

  const save = async () => {
    try {
      setLoading(true);
      await api.put("/user/me", form);
      setMsg("✅ Profile updated successfully!");
      await reloadUser();
      setTimeout(() => setMsg(""), 3000);
    } catch (err) {
      setMsg("❌ Save failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (!form) {
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
        <h1 style={{ margin: '0 0 8px 0', fontSize: '2rem' }}>👤 Profile Settings</h1>
        <p className="text-muted" style={{ margin: '0 0 24px 0' }}>
          Manage your personal information and nutrition goals
        </p>

        {/* Tab Navigation */}
        <div className="flex" style={{ gap: '8px', marginBottom: '24px' }}>
          {[
            { id: "profile", label: "Profile", icon: "👤" },
            { id: "goals", label: "Goals", icon: "🎯" }
          ].map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: '12px 20px',
                borderRadius: '8px',
                border: 'none',
                background: activeTab === tab.id ? '#667eea' : '#f3f4f6',
                color: activeTab === tab.id ? 'white' : '#6b7280',
                cursor: 'pointer',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}
            >
              <span>{tab.icon}</span>
              <span>{tab.label}</span>
            </button>
          ))}
        </div>

        {/* Messages */}
        {msg && (
          <div 
            className="card mb-4"
            style={{
              background: msg.includes('✅') ? '#f0fdf4' : '#fef2f2',
              border: `1px solid ${msg.includes('✅') ? '#10b981' : '#ef4444'}`,
              color: msg.includes('✅') ? '#065f46' : '#991b1b'
            }}
          >
            {msg}
          </div>
        )}

        {/* Profile Tab */}
        {activeTab === "profile" && (
          <div className="grid grid-2">
            <div className="card">
              <h3 style={{ margin: '0 0 16px 0' }}>Personal Information</h3>
              
              <div className="grid grid-2 mb-3">
                <input
                  value={form.name}
                  onChange={e => setForm({...form, name: e.target.value})}
                  placeholder="Full Name"
                />
                <select
                  value={form.profile.gender}
                  onChange={e => setForm({
                    ...form, 
                    profile: {...form.profile, gender: e.target.value}
                  })}
                >
                  <option value="">Select Gender</option>
                  <option value="male">Male</option>
                  <option value="female">Female</option>
                  <option value="other">Other</option>
                </select>
              </div>

              <div className="grid grid-3 mb-3">
                <input
                  type="number"
                  value={form.profile.age}
                  onChange={e => setForm({
                    ...form, 
                    profile: {...form.profile, age: parseInt(e.target.value) || ""}
                  })}
                  placeholder="Age"
                />
                <input
                  type="number"
                  value={form.profile.height}
                  onChange={e => setForm({
                    ...form, 
                    profile: {...form.profile, height: parseInt(e.target.value) || ""}
                  })}
                  placeholder="Height (cm)"
                />
                <input
                  type="number"
                  value={form.profile.weight}
                  onChange={e => setForm({
                    ...form, 
                    profile: {...form.profile, weight: parseInt(e.target.value) || ""}
                  })}
                  placeholder="Weight (kg)"
                />
              </div>

              <div className="grid grid-2 mb-3">
                <select
                  value={form.profile.activityLevel}
                  onChange={e => setForm({
                    ...form, 
                    profile: {...form.profile, activityLevel: e.target.value}
                  })}
                >
                  <option value="sedentary">Sedentary</option>
                  <option value="lightly_active">Lightly Active</option>
                  <option value="moderately_active">Moderately Active</option>
                  <option value="very_active">Very Active</option>
                  <option value="extremely_active">Extremely Active</option>
                </select>
                <select
                  value={form.profile.fitnessGoal}
                  onChange={e => setForm({
                    ...form, 
                    profile: {...form.profile, fitnessGoal: e.target.value}
                  })}
                >
                  <option value="lose_weight">Lose Weight</option>
                  <option value="maintain_weight">Maintain Weight</option>
                  <option value="gain_weight">Gain Weight</option>
                  <option value="build_muscle">Build Muscle</option>
                </select>
              </div>
            </div>

            <div className="card">
              <h3 style={{ margin: '0 0 16px 0' }}>Health Metrics</h3>
              
              <div className="text-center mb-4">
                <div style={{ fontSize: '48px', fontWeight: '700', color: '#667eea' }}>
                  {user.streak || 0}
                </div>
                <div style={{ fontSize: '18px', fontWeight: '600', color: '#667eea' }}>
                  Day Streak
                </div>
                <div className="text-muted">Consecutive days logged</div>
              </div>

              <div className="card" style={{ background: '#f8fafc' }}>
                <h4 style={{ margin: '0 0 12px 0' }}>💡 Tips</h4>
                <ul style={{ margin: 0, paddingLeft: '20px', color: '#64748b' }}>
                  <li>Log meals consistently to maintain your streak</li>
                  <li>Set realistic nutrition goals</li>
                  <li>Track your progress weekly</li>
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Goals Tab */}
        {activeTab === "goals" && (
          <div className="card">
            <h3 style={{ margin: '0 0 16px 0' }}>Nutrition Goals</h3>
            <p className="text-muted mb-4">Set your daily nutrition targets</p>
            
            <div className="grid grid-3 mb-3">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Calories
                </label>
                <input
                  type="number"
                  value={form.goals.calories}
                  onChange={e => setForm({
                    ...form, 
                    goals: {...form.goals, calories: parseInt(e.target.value) || 0}
                  })}
                  placeholder="2000"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Protein (g)
                </label>
                <input
                  type="number"
                  value={form.goals.protein}
                  onChange={e => setForm({
                    ...form, 
                    goals: {...form.goals, protein: parseInt(e.target.value) || 0}
                  })}
                  placeholder="100"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Carbs (g)
                </label>
                <input
                  type="number"
                  value={form.goals.carbs}
                  onChange={e => setForm({
                    ...form, 
                    goals: {...form.goals, carbs: parseInt(e.target.value) || 0}
                  })}
                  placeholder="250"
                />
              </div>
            </div>

            <div className="grid grid-3 mb-4">
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Fat (g)
                </label>
                <input
                  type="number"
                  value={form.goals.fat}
                  onChange={e => setForm({
                    ...form, 
                    goals: {...form.goals, fat: parseInt(e.target.value) || 0}
                  })}
                  placeholder="80"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Fiber (g)
                </label>
                <input
                  type="number"
                  value={form.goals.fiber}
                  onChange={e => setForm({
                    ...form, 
                    goals: {...form.goals, fiber: parseInt(e.target.value) || 0}
                  })}
                  placeholder="25"
                />
              </div>
              <div>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: '600' }}>
                  Water (glasses)
                </label>
                <input
                  type="number"
                  value={form.goals.water}
                  onChange={e => setForm({
                    ...form, 
                    goals: {...form.goals, water: parseInt(e.target.value) || 0}
                  })}
                  placeholder="8"
                />
              </div>
            </div>
          </div>
        )}

        {/* Save Button */}
        <div className="flex-center mt-4">
          <button
            onClick={save}
            disabled={loading}
            style={{
              padding: '16px 32px',
              fontSize: '16px',
              fontWeight: '600',
              minWidth: '200px'
            }}
          >
            {loading ? (
              <div className="flex-center" style={{ gap: '12px' }}>
                <div className="spinner" style={{ width: '20px', height: '20px' }}></div>
                Saving...
              </div>
            ) : (
              '💾 Save Changes'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}

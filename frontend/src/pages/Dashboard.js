import React, { useEffect, useState } from "react";
import api from "../api/api";
import MealCard from "../components/MealCard";
import { Bar } from "react-chartjs-2";
import { Chart as ChartJS, BarElement, CategoryScale, LinearScale } from "chart.js";

ChartJS.register(BarElement, CategoryScale, LinearScale);

export default function Dashboard() {
  const [meals, setMeals] = useState([]);
  const [summary, setSummary] = useState({});

  useEffect(() => {
    fetchMeals();
    fetchStats();
  }, []);

  const fetchMeals = async () => {
    const res = await api.get("/meals");
    setMeals(res.data);
  };

  const fetchStats = async () => {
    // We'll derive simple stats client-side: calories by day (last 7 days)
    const res = await api.get("/meals");
    const mealsData = res.data;
    const days = {};
    for (let i = 6; i >= 0; i--) {
      const d = new Date();
      d.setDate(d.getDate() - i);
      const key = d.toISOString().slice(0,10);
      days[key] = 0;
    }
    mealsData.forEach(m => {
      const k = new Date(m.createdAt).toISOString().slice(0,10);
      if (k in days) days[k] += (m.calories || 0);
    });
    setSummary(days);
  };

  return (
    <div style={{padding:20}}>
      <h2>Dashboard</h2>

      <section style={{marginTop:12, marginBottom:30}}>
        <h3>Last 7 days (calories)</h3>
        <div style={{maxWidth:600}}>
          <Bar
            data={{
              labels: Object.keys(summary),
              datasets: [{ label: "Calories", data: Object.values(summary) }],
            }}
            options={{ responsive: true, maintainAspectRatio: false }}
            height={200}
          />
        </div>
      </section>

      <section>
        <h3>Recent meals</h3>
        <div style={{display:"grid",gap:12}}>
          {meals.length===0 && <div>No meals yet. Add one from Add Meal.</div>}
          {meals.map(m => <MealCard key={m._id} meal={m} />)}
        </div>
      </section>
    </div>
  );
}

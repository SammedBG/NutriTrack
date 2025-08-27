import React, { useEffect, useState } from "react";
import api from "../api/api";
import MealCard from "../components/MealCard";

export default function History(){
  const [meals, setMeals] = useState([]);
  useEffect(()=> { api.get("/meals").then(r=>setMeals(r.data)); }, []);
  return (
    <div style={{padding:20}}>
      <h2>History</h2>
      {meals.length===0 && <p>No meals logged yet</p>}
      <div style={{display:"grid", gap:12}}>
        {meals.map(m=> <MealCard key={m._id} meal={m} />)}
      </div>
    </div>
  );
}

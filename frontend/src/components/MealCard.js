import React from "react";

export default function MealCard({ meal }) {
  return (
    <div style={{border:"1px solid #eee", padding:12, borderRadius:10, display:"flex", gap:12, alignItems:"center"}}>
      {meal.photoUrl && <img src={meal.photoUrl} alt={meal.name} style={{width:80,height:80,objectFit:"cover",borderRadius:8}} />}
      <div>
        <div style={{fontWeight:600}}>{meal.name || "Meal"}</div>
        <div>Calories: {Math.round(meal.calories || 0)}</div>
        <div>Protein: {Math.round(meal.protein || 0)}g</div>
      </div>
    </div>
  );
}

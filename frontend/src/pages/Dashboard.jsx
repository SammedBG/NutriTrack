import { useEffect, useState } from 'react';
import api from '../api/axios';

export default function Dashboard(){
  const [stats, setStats] = useState(null);

  useEffect(()=>{
    // we haven't implemented /stats endpoint in backend; client just shows placeholder now
    setStats({ today: { calories: 1200, protein: 80 }});
  },[]);

  return (
    <div>
      <h1>Dashboard</h1>
      {stats ? (
        <div>
          <h3>Today</h3>
          <p>Calories: {stats.today.calories}</p>
          <p>Protein: {stats.today.protein}</p>
        </div>
      ) : <p>Loading...</p>}
    </div>
  );
}

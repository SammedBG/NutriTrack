import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import api from '../api/axios';

export default function ProtectedRoute({ children }) {
  const [loading, setLoading] = useState(true);
  const [ok, setOk] = useState(false);

  useEffect(() => {
    let mounted = true;
    api.get('/auth/me')
      .then(() => mounted && setOk(true))
      .catch(() => mounted && setOk(false))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; }
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!ok) return <Navigate to="/login" replace />;
  return children;
}

import React, { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext);

  return (
    <div className="bg-white rounded shadow p-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Hello, {user?.name || "User"}</h2>
        <div className="space-x-2">
          <button onClick={logout} className="px-3 py-1 rounded bg-red-500 text-white">Logout</button>
        </div>
      </div>

      <section className="mt-6">
        <h3 className="font-medium">Quick stats (placeholder)</h3>
        <p className="mt-2 text-sm text-gray-600">Daily calories, weekly chart, and recent meals will appear here.</p>
      </section>
    </div>
  );
}

// Simplified Dashboard.jsx
import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";
import { Home, Activity, Calendar, RefreshCw, AlertCircle, Loader } from "lucide-react";
import { backendurl } from "../config/constants";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    activeListings: 0,
    pendingAppointments: 0,
    loading: true,
    error: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  async function fetchStats() {
    try {
      setRefreshing(true);
      const res = await axios.get(`${backendurl}/api/admin/stats`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      if (!res.data.success) throw new Error(res.data.message);

      setStats({
        totalProperties: res.data.stats.totalProperties || 0,
        activeListings: res.data.stats.activeListings || 0,
        pendingAppointments: res.data.stats.pendingAppointments || 0,
        loading: false,
        error: null,
      });
    } catch (e) {
      setStats((s) => ({ ...s, loading: false, error: e.message }));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => { fetchStats(); }, []);

  if (stats.loading)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );

  if (stats.error)
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p>{stats.error}</p>
        </div>
      </div>
    );

  const cards = [
    { title: "Total Properties", value: stats.totalProperties, icon: Home, color: "bg-blue-500" },
    { title: "Active Listings", value: stats.activeListings, icon: Activity, color: "bg-green-500" },
    { title: "Pending Appointments", value: stats.pendingAppointments, icon: Calendar, color: "bg-orange-500" },
  ];

  return (
    <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} className="min-h-screen pt-24 px-6 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold">Admin Dashboard</h1>
            <p className="text-gray-600 mt-2">Manage properties, appointments and listings.</p>
          </div>

          <button onClick={fetchStats} disabled={refreshing} className="flex items-center gap-2 px-5 py-3 bg-blue-600 text-white rounded-lg">
            <RefreshCw className={refreshing ? "w-4 h-4 animate-spin" : "w-4 h-4"} />
            Refresh
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {cards.map((card) => (
            <div key={card.title} className="bg-white rounded-xl shadow p-6">
              <div className={`${card.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                <card.icon className="text-white w-6 h-6" />
              </div>
              <p className="text-gray-500">{card.title}</p>
              <h2 className="text-4xl font-bold mt-2">{card.value}</h2>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
}

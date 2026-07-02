import { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

import {
  Home,
  Calendar,
  RefreshCw,
  AlertCircle,
  Loader,
  Users,
} from "lucide-react";

import { backendurl } from "../config/constants";
import homeImage from "../assets/home.png";

export default function Dashboard() {
  const [stats, setStats] = useState({
    totalProperties: 0,
    pendingAppointments: 0,
    totalUsers: 0,
    loading: true,
    error: null,
  });

  const [refreshing, setRefreshing] = useState(false);

  async function fetchStats() {
    try {
      setRefreshing(true);

      const res = await axios.get(
        `${backendurl}/api/admin/stats`,
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem(
              "token"
            )}`,
          },
        }
      );

      if (!res.data.success)
        throw new Error(res.data.message);

      setStats({
        totalProperties:
          res.data.stats.totalProperties || 0,

        pendingAppointments:
          res.data.stats.pendingAppointments || 0,

        totalUsers:
          res.data.stats.totalUsers || 0,

        loading: false,
        error: null,
      });
    } catch (e) {
      setStats((prev) => ({
        ...prev,
        loading: false,
        error: e.message,
      }));
    } finally {
      setRefreshing(false);
    }
  }

  useEffect(() => {
    fetchStats();
  }, []);

  if (stats.loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="w-10 h-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (stats.error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <AlertCircle className="w-10 h-10 text-red-500 mx-auto mb-4" />
          <p>{stats.error}</p>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen pt-24 px-6 bg-slate-100"
    >
      <div className="max-w-7xl mx-auto">

        {/* Header */}

        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-5xl font-bold text-gray-900">
              Admin Dashboard
            </h1>

            <p className="text-gray-600 mt-3">
              Manage your BuildEstate platform efficiently.
            </p>
          </div>

          <button
            onClick={fetchStats}
            disabled={refreshing}
            className="flex items-center gap-2 px-6 py-3 rounded-xl bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            <RefreshCw
              className={
                refreshing
                  ? "w-5 h-5 animate-spin"
                  : "w-5 h-5"
              }
            />
            Refresh
          </button>
        </div>

        {/* Welcome Banner */}

        <div className="bg-white rounded-3xl shadow-lg overflow-hidden mb-8">

          <div className="grid md:grid-cols-2 items-center">

            <div className="p-10">

              <h2 className="text-4xl font-bold text-gray-900 mb-4">
                Welcome Back, Admin 👋
              </h2>

              <p className="text-gray-600 text-lg">
                Track properties, appointments and platform
                activity from one dashboard.
              </p>

            </div>

            <div>
              <img
                src={homeImage}
                alt="Dashboard"
                className="w-full h-[320px] object-cover"
              />
            </div>

          </div>

        </div>

        {/* Statistics Cards */}

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <Home className="w-10 h-10 text-blue-600 mb-4" />

            <h3 className="text-gray-500">
              Total Properties
            </h3>

            <h1 className="text-4xl font-bold mt-2">
              {stats.totalProperties}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <Calendar className="w-10 h-10 text-orange-500 mb-4" />

            <h3 className="text-gray-500">
              Pending Appointments
            </h3>

            <h1 className="text-4xl font-bold mt-2">
              {stats.pendingAppointments}
            </h1>
          </div>

          <div className="bg-white rounded-2xl shadow-md p-6 hover:shadow-lg transition">
            <Users className="w-10 h-10 text-purple-600 mb-4" />

            <h3 className="text-gray-500">
              Registered Users
            </h3>

            <h1 className="text-4xl font-bold mt-2">
              {stats.totalUsers}
            </h1>
          </div>

        </div>

        {/* Portfolio Overview */}

        <div className="bg-white rounded-3xl shadow-md p-8">

          <h3 className="text-3xl font-bold mb-8">
            Portfolio Overview
          </h3>

          <div className="space-y-8">

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Total Properties
                </span>

                <span>{stats.totalProperties}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-blue-600 h-4 rounded-full"
                  style={{ width: "90%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Registered Users
                </span>

                <span>{stats.totalUsers}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-purple-600 h-4 rounded-full"
                  style={{ width: "70%" }}
                ></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between mb-2">
                <span className="font-medium">
                  Pending Appointments
                </span>

                <span>{stats.pendingAppointments}</span>
              </div>

              <div className="w-full bg-gray-200 rounded-full h-4">
                <div
                  className="bg-orange-500 h-4 rounded-full"
                  style={{ width: "50%" }}
                ></div>
              </div>
            </div>

          </div>

        </div>

      </div>
    </motion.div>
  );
}
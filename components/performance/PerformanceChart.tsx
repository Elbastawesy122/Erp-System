"use client";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { motion } from "framer-motion";
import { useEffect } from "react";
import { useChartData } from "@/lib/zustand/useChartData";

export default function OrdersComparisonChart() {
  const { getchartdata, chartData } = useChartData();

  useEffect(() => {
    getchartdata();
  }, [getchartdata]);
  

  return (
    <motion.div
      className="w-full h-full p-6 bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-md border"
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <h2 className="text-lg font-semibold text-gray-700 mb-4">
        📊 Orders Overview (This Month)
      </h2>

      <ResponsiveContainer width="100%" height="85%">
        <BarChart data={chartData} barGap={6} barSize={20}>
          <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
          <XAxis dataKey="name" tick={{ fill: "#6b7280", fontSize: 12 }} />
          <YAxis tick={{ fill: "#6b7280" }} />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              borderRadius: "12px",
              border: "1px solid #e5e7eb",
              boxShadow: "0 4px 8px rgba(0,0,0,0.1)",
            }}
          />
          <Bar
            dataKey="totalOrders"
            fill="url(#colorTotal)"
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
          />
          <Bar
            dataKey="completedOrders"
            fill="url(#colorCompleted)"
            radius={[6, 6, 0, 0]}
            animationDuration={1000}
          />

          <defs>
            <linearGradient id="colorTotal" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#6366F1" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#A5B4FC" stopOpacity={0.6} />
            </linearGradient>
            <linearGradient id="colorCompleted" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#10B981" stopOpacity={0.9} />
              <stop offset="100%" stopColor="#6EE7B7" stopOpacity={0.6} />
            </linearGradient>
          </defs>
        </BarChart>
      </ResponsiveContainer>
    </motion.div>
  );
}

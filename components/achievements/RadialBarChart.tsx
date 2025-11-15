"use client";

import { useChartData } from "@/lib/zustand/useChartData";
import { useEffect } from "react";
import {
  RadialBarChart,
  RadialBar,
  Legend,
  ResponsiveContainer,
} from "recharts";

export default function CircularProgress() {
  const { getchartdata, chartData } = useChartData();
  
  useEffect(() => {
    getchartdata();
  }, [getchartdata]);

  const today = new Date().getDate();
  const completedToday = chartData
    .find((data) => parseInt(data.name) === today)?.completedOrders || 0;

  const data = [
    {
      name: "Total Target",
      value: 15,
      fill: "#7578f3",
    },
    {
      name: "Completed",
      value: completedToday,
      fill: "#10B981",
    },
  ];


  return (
    <div className="w-full h-64 p-4 bg-white rounded-2xl shadow flex flex-col items-center justify-center">
      <h2 className="text-lg font-semibold mb-2">Daily Target</h2>

      <ResponsiveContainer width="100%" height="80%">
        <RadialBarChart
          cx="50%"
          cy="50%"
          innerRadius="70%"
          outerRadius="100%"
          barSize={20}
          data={data}
          startAngle={180}
          endAngle={0}
        >
          <RadialBar dataKey="value" cornerRadius={10} />
          <Legend iconSize={10} layout="horizontal" verticalAlign="bottom" />
        </RadialBarChart>
      </ResponsiveContainer>

      <span className="text-xl font-bold">{`${data[1].value}/${data[0].value}`}</span>
    </div>
  );
}

import { create } from "zustand";
import { chartDataRequest } from "../interface";

type chartDatatype = {
  chartData: chartDataRequest[];
  getchartdata: () => Promise<void>;
};

export const useChartData = create<chartDatatype>((set) => ({
  chartData: [],
  getchartdata: async () => {
    try {
      const res = await fetch(`/api/orders/chart`, { cache: "no-store" });
      const data = await res.json();

      if (!res.ok) {
        console.error(data.message || "Failed to fetch chart data");
        return;
      }

      set({ chartData: data || [] });
    } catch (error) {
      console.error("Fetch chart data error:", error);
    }
  },
}));

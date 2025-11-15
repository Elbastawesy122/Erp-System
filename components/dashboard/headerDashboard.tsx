"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { FilterDashboard } from "../filterDashboard";
import { useOrderStore } from "@/lib/zustand/useOrderStore";
import { Button } from "../ui/button";

type HeaderOrderProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  progress: string | undefined;
  setProgress: React.Dispatch<React.SetStateAction<string | undefined>>;
};

export const HeaderDashboard = ({
  page,
  setPage,
  progress,
  setProgress,
}: HeaderOrderProps) => {
  const progressList = ["Pending", "Completed", "In Progress"];
  const handleFilter = (selectedProgress: string) => {
    setProgress(selectedProgress);
    setPage(1);
  };

  const handleClearFilter = () => {
    setProgress(undefined);
    setPage(1);
  };

  const { totalPages } = useOrderStore();

  return (
    <div className="flex flex-col gap-6 w-full p-4 xl:flex-row xl:justify-between xl:items-center">
      <div className="flex flex-col-reverse gap-3 sm:flex-col md:flex-row xl:items-center xl:gap-4">
        <div className="flex items-center justify-center gap-2 rounded-md border w-full xl:w-auto transition-all z-10">
          <FilterDashboard
            progressList={progressList}
            onFilter={handleFilter}
          />

          {progress && (
            <Button
              onClick={handleClearFilter}
              aria-label="Clear Filter"
              className="px-3 py-1 text-xs sm:text-sm bg-red-100 text-red-700 rounded-md hover:bg-red-200 transition cursor-pointer"
            >
              Clear Filter
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col gap-4 sm:flex-col md:flex-row xl:items-center xl:gap-5">
        <div className="flex justify-between items-center gap-3 w-full xl:w-auto">
          <p className="text-base sm:text-sm whitespace-nowrap">
            Page <strong>{page}</strong> of <strong>{totalPages}</strong>
          </p>

          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              aria-label="previous"
              className="p-3 sm:p-2 border rounded-xl hover:shadow-lg active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>

            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              aria-label="next"
              className="p-3 sm:p-2 border rounded-xl hover:shadow-lg active:scale-95 transition cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

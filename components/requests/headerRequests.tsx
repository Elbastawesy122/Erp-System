"use client";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Link from "next/link";
import { useEffect } from "react";
import { isValid } from "@/lib/interface";
import { useRequestStore } from "@/lib/zustand/useRequest";
import { FilterRequest } from "../filterRequests";

type HeaderOrderProps = {
  page: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  isValid: isValid;
};

export const HeaderRequests = ({
  page,
  setPage,
  isValid,
}: HeaderOrderProps) => {
  const { totalPages, getRequests } = useRequestStore();

  useEffect(() => {
    getRequests(page);
  }, [getRequests, page]);

  const tabs = ["Approved", "Rejected", "Pending"];

  return (
    <div
      className="
        flex flex-col gap-6 w-full p-4
        xl:flex-row xl:justify-between xl:items-center
      "
    >
      <div
        className="
          flex flex-col-reverse gap-3
          sm:flex-col
          md:flex-row xl:items-center xl:gap-4
        "
      >
        <div
          className="
            flex items-center justify-center gap-2 
            rounded-md border
            w-full xl:w-auto transition-all z-10
          "
        >
          <FilterRequest tabs={tabs} />
        </div>
      </div>
      <div
        className="
          flex flex-col gap-4
          sm:flex-col
          md:flex-row xl:items-center xl:gap-5
        "
      >
        <div
          className="
            flex justify-between sm:justify-center items-center gap-3 
            w-full xl:w-auto
          "
        >
          <p className=" text-base sm:text-sm whitespace-nowrap">
            Page {page} of {totalPages}
          </p>
          <div className="flex justify-center items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(p - 1, 1))}
              disabled={page === 1}
              className="p-3 sm:p-2 border rounded-xl shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
            <button
              onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
              disabled={page === totalPages}
              className="p-3 sm:p-2 border rounded-xl shadow-md hover:shadow-lg active:scale-95 transition cursor-pointer"
            >
              <ChevronRight className="w-5 h-5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>

        {!isValid.isAdmin && (
          <Link href="/requests/new-request" className="w-full xl:w-auto">
            <button
              className="
            w-full xl:w-auto flex justify-center 
            px-8 py-4 sm:px-6 sm:py-2 
            bg-blue-600 text-white rounded-xl 
            shadow-md hover:bg-blue-700 hover:shadow-lg 
            active:scale-95 transition-all text-base sm:text-sm font-medium cursor-pointer
          "
            >
              + Add New Requests
            </button>
          </Link>
        )}
      </div>
    </div>
  );
};

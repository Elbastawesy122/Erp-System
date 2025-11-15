"use client";
import { useState, useEffect } from "react";
import { isValid } from "@/lib/interface";
import { useOrderStore } from "@/lib/zustand/useOrderStore";
import dynamic from "next/dynamic";
const HeaderDashboard = dynamic(() => import("./headerDashboard").then(mod => mod.HeaderDashboard), {
  ssr: false, 
});
const TableDashboard = dynamic(() => import("../dashboardtable").then(mod => mod.TableDashboard), {
  ssr: false, 
});

const Dashboard = ({ isValid }: { isValid: isValid }) => {
  const [page, setPage] = useState(1);
  const [progress, setProgress] = useState<string | undefined>(undefined);
  const { fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders(page, undefined, progress);
  }, [page, progress, fetchOrders]);

  return (
    <>
      {isValid.isAdmin ? (
        <section className="m-4 sm:m-6 flex flex-col gap-6">
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold">Recent Orders</h1>
            <p className="mt-1 text-sm sm:text-base">
              You are viewing the recent orders placed
            </p>
          </div>

          <HeaderDashboard
            page={page}
            setPage={setPage}
            progress={progress}
            setProgress={setProgress}
          />

          <div className="relative w-full shadow-md rounded-xl p-3 sm:p-5">
            <TableDashboard page={page} />
          </div>
        </section>
      ) : (
        <div className="flex flex-col items-center justify-center h-screen">
          <h2 className="text-2xl font-semibold mb-3 text-center">
            Sorry, you do not have permission to access this page.
          </h2>
          <p className=" mb-5 text-sm sm:text-base">
            Please contact your administrator if you believe this is an error.
          </p>
        </div>
      )}
    </>
  );
};

export default Dashboard;

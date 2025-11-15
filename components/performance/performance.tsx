"use client";
import { isValid } from "@/lib/interface";
import dynamic from "next/dynamic";
const SalesChart = dynamic(() => import("./PerformanceChart"), {
  ssr: false,
});

const Performance = ({ isValid }: { isValid: isValid }) => {
  return (
    <>
      {isValid.isAdmin ? (
        <section className="h-full">
          <SalesChart />
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

export default Performance;

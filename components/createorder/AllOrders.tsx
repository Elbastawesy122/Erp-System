"use client";
import { useEffect, useState } from "react";
import { TableDemo } from "../ordertables";
import { HeaderOrder } from "./headerorder";
import { isValid } from "@/lib/interface";
import { useOrderStore } from "@/lib/zustand/useOrderStore";

const AllOrders = ({ isValid }: { isValid: isValid }) => {
  const [page, setPage] = useState(1);
  const [status, setStatus] = useState<string | undefined>(undefined);
  const { fetchOrders } = useOrderStore();

  useEffect(() => {
    fetchOrders(page, status , undefined);
  }, [page, status, fetchOrders]);

  return (
    <section className="m-4 sm:m-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Total Orders</h1>
        <p className="mt-1 text-sm sm:text-base">
          You are viewing the total number of orders placed so far
        </p>
      </div>

      <HeaderOrder
        page={page}
        setPage={setPage}
        status={status}
        setStatus={setStatus}
        isValid={isValid}
      />

      <div className="relative w-full shadow-md rounded-xl p-3 sm:p-5">
        <div className="overflow-x-auto">
          <TableDemo page={page} isValid={isValid} />
        </div>
      </div>
    </section>
  );
};

export default AllOrders;
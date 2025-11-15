"use client";
import { useState } from "react";
import { HeaderRequests } from "./headerRequests";
import { isValid } from "@/lib/interface";
import { TableRequests } from "../requeststable";

const Requests = ({ isValid }: { isValid: isValid }) => {
    const [page, setPage] = useState(1);
  return (
    <section className="m-4 sm:m-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Total requests</h1>
        <p className=" mt-1 text-sm sm:text-base">
            Manage and review all your requests in one place.
        </p>
      </div>
      <HeaderRequests page={page} setPage={setPage} isValid={isValid} />
      <div className="relative w-full shadow-md rounded-xl p-3 sm:p-5">
        <div className="overflow-x-auto">
          <TableRequests page={page} isValid={isValid} />
        </div>
      </div>
    </section>
  );
};

export default Requests;

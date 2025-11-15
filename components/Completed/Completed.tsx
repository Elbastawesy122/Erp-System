"use client";

import { useUser } from "@/lib/zustand/useUser";
import { ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "../ui/button";
import { useRequestApprovalStore } from "@/lib/zustand/useRequestApprovalStore";
import { isValid } from "@/lib/interface";

const Completed = ({ isValid }: { isValid: isValid }) => {
  const { users, getUser } = useUser();
  const [open, setOpen] = useState<number | null>(null);
  const { acceptOrder } = useRequestApprovalStore();

  useEffect(() => {
    getUser();
  }, [getUser]);

  const toggleOpen = (id: number) => {
    setOpen(open === id ? null : id);
  };

  if (!users || users.length === 0) {
    return (
      <section className="m-4 sm:m-6 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
        <p className="w-full text-center text-2xl md:text-3xl font-semibold text-gray-400">No completed orders found.</p>
      </section>
    );
  }

  return (
    <>
      {!isValid.isAdmin ? (
        <section className="m-4 sm:m-6">
          <div className="flex flex-col gap-6">
            {users.map((order) => (
              <div
                key={order.id}
                className={`rounded-xl border transition-all duration-300 overflow-hidden ${
                  order.progress === "Completed" ? "" : "bg-green-500"
                }`}
              >
                <div
                  className="flex justify-between items-center p-4 cursor-pointer transition-colors"
                  onClick={() => toggleOpen(order.id!)}
                >
                  <h3 className="font-semibold text-lg">
                    Customer Name: {order.customerName}
                  </h3>
                  <span
                    className={`transition-transform duration-300 ${
                      open === order.id ? "rotate-180" : "rotate-0"
                    }`}
                  >
                    <ChevronDown size={22} />
                  </span>
                </div>
                <div
                  style={{
                    maxHeight: open === order.id ? "600px" : "0px",
                    overflow: "hidden",
                    transition: "max-height 0.35s ease",
                  }}
                >
                  <div className="p-4 space-y-2">
                    <div className="border-b pb-3">
                      <p>
                        <strong>Order Id:</strong> {order.id}
                      </p>
                      <p>
                        <strong>Status:</strong> {order.status}
                      </p>
                      <p>
                        <strong>Progress:</strong> {order.progress}
                      </p>
                      <p>
                        <strong>Due Date:</strong>{" "}
                        {new Date(order.dueDate).toLocaleDateString()}
                      </p>
                    </div>

                    {order.material && order.material.length > 0 && (
                      <div className="pt-3">
                        <strong>Materials:</strong>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                          {order.material.map((m) => (
                            <li key={m.id} className="px-1 py-1 rounded-md">
                              <span className="font-semibold">
                                {m.materialName}:
                              </span>{" "}
                              {m.quantity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    <div className="border-t pt-3 flex justify-center">
                      <Button
                        onClick={() => acceptOrder(order.id!)}
                        name="Completed"
                        aria-label="Completed Order"
                        disabled= {order.progress === "Completed"}
                        className="cursor-pointer bg-green-600"
                      >
                        Completed
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
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

export default Completed;

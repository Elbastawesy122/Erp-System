"use client";
import { useState, FormEvent } from "react";
import Materials from "./Materials";
import { useOrder } from "@/lib/fetchData/fetchOrders";
import { MaterialItem } from "@/lib/types";

export const NewOrder: React.FC = () => {
  const createOrder = useOrder();

  const [customerName, setCustomerName] = useState("");
  const [status, setStatus] = useState("");
  const [dueDate, setDueDate] = useState("");
  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    const orderData = {
      customerName,
      dueDate,
      status,
      material: materials.map((m) => ({
        materialName: m.materialName,
        quantity: m.quantity,
        price: m.price,
      })),
    };

    await createOrder(orderData);
  };

  return (
    <section className="m-4 sm:m-6 flex flex-col gap-6">
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold">Create New Order</h1>
        <p className=" mt-1 text-sm sm:text-base">
          You are creating a new order
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="form rounded-xl shadow-md p-6 flex flex-col gap-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="flex flex-col">
            <label htmlFor="customerName" className="text-sm font-medium mb-1">
              Customer Name
            </label>
            <input
              id="customerName"
              type="text"
              value={customerName}
              onChange={(e) => setCustomerName(e.target.value)}
              className="border outline-none rounded-md shadow-sm p-2"
              placeholder="Enter customer name"
            />
          </div>

          <div className="flex flex-col">
            <label htmlFor="status" className="text-sm font-medium mb-1">
              Status
            </label>
            <select
              id="status"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="border rounded-md shadow-sm p-2 outline-none cursor-pointer"
            >
              <option value="" disabled>
                Select order status
              </option>
              <option value="Paid" className="text-[#a1a1a1]">
                Paid
              </option>
              <option value="Pending" className="text-[#a1a1a1]">
                Pending
              </option>
              <option value="Unpaid" className="text-[#a1a1a1]">
                Unpaid
              </option>
            </select>
          </div>

          <div className="flex flex-col">
            <label htmlFor="date" className="text-sm font-medium mb-1">
              Due Date
            </label>
            <input
              id="date"
              type="date"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="border rounded-md shadow-sm p-2 cursor-pointer outline-none"
            />
          </div>
        </div>

        <Materials onChange={setMaterials} />

        <div className="flex justify-end">
          <button
            type="submit"
            aria-label="Create new order"
            className="bg-blue-600 text-white py-2 px-6 rounded-md hover:bg-blue-700 transition cursor-pointer"
          >
            Create Order
          </button>
        </div>
      </form>
    </section>
  );
};

export default NewOrder;

"use client";
import { MaterialItem } from "@/lib/types";
import { useStore } from "@/lib/zustand/useStore";
import React, { ChangeEvent, useEffect, useState } from "react";

interface MaterialsProps {
  onChange: (materials: MaterialItem[]) => void;
}

const Materials: React.FC<MaterialsProps> = ({ onChange }) => {
  const { products, fetchProducts } = useStore();

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const [materials, setMaterials] = useState<MaterialItem[]>([
    { id: 1, materialName: "Kunafa", quantity: 2, price: 50 },
  ]);

  useEffect(() => {
    onChange(materials);
  }, [materials, onChange]);

  const addMaterial = () => {
    setMaterials((prev) => [
      ...prev,
      { id: Date.now(), materialName: "", quantity: 1, price: 1 },
    ]);
  };

  const removeMaterial = (id: number) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handleChange = (
    id: number,
    field: keyof MaterialItem,
    value: string | number
  ) => {
    setMaterials((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, [field]: field === "materialName" ? value : Number(value) }
          : m
      )
    );
  };

  const totalCost = materials.reduce(
    (sum, m) => sum + m.quantity * m.price!,
    0
  );

  return (
    <section>
      <div className=" rounded-xl shadow-md">
        <div className="flex flex-col sm:flex-row justify-center sm:justify-between items-center m-4">
          <h2 className="text-xl font-semibold">Bill of Materials</h2>
          <button
            type="button"
            aria-label="Add new Item"
            onClick={addMaterial}
            className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition cursor-pointer"
          >
            + Add Item
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full border rounded-lg overflow-hidden">
            <thead className="">
              <tr className=" text-sm">
                <th className="px-4 py-2 border">Item</th>
                <th className="px-4 py-2 border">Quantity</th>
                <th className="px-4 py-2 border">Unit Price</th>
                <th className="px-4 py-2 border">Total</th>
                <th className="px-4 py-2 border">Action</th>
              </tr>
            </thead>
            <tbody>
              {materials.map((m) => (
                <tr key={m.id} className="text-center border-t">
                  <td className="px-4 py-2 border">
                    <select
                      value={m.materialName}
                      onChange={(e: ChangeEvent<HTMLSelectElement>) =>
                        handleChange(m.id!, "materialName", e.target.value)
                      }
                      className="border rounded-md shadow-sm p-2 outline-none cursor-pointer w-full"
                    >
                      <option value="" disabled>
                        Select order status
                      </option>

                      {products.map((product) => (
                        <option
                          key={product.id}
                          value={product.name}
                          className="text-[#a1a1a1]"
                        >
                          {product.name}
                        </option>
                      ))}
                    </select>
                  </td>

                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      value={m.quantity}
                      min={1}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(m.id!, "quantity", e.target.value)
                      }
                      className="w-20 text-center border rounded-md p-1"
                    />
                  </td>
                  <td className="px-4 py-2 border">
                    <input
                      type="number"
                      value={m.price}
                      min={0}
                      onChange={(e: ChangeEvent<HTMLInputElement>) =>
                        handleChange(m.id!, "price", e.target.value)
                      }
                      className="w-24 text-center border rounded-md p-1"
                    />
                  </td>
                  <td className="px-4 py-2 border font-medium">
                    ${(m.quantity * m.price!).toFixed(2)}
                  </td>
                  <td className="px-4 py-2 border">
                    <button
                      type="button"
                      aria-label="Delet Item"
                      onClick={() => removeMaterial(m.id!)}
                      className="text-red-600 hover:text-red-800 font-medium cursor-pointer"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-end mt-4">
          <p className="text-lg font-semibold">
            Total:{" "}
            <span className="text-blue-600">${totalCost.toFixed(2)}</span>
          </p>
        </div>
      </div>
    </section>
  );
};

export default Materials;

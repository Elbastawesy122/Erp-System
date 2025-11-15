"use client";
import { requestRequest } from "@/lib/interface";
import { MaterialItem } from "@/lib/types";
import { useRequestStore } from "@/lib/zustand/useRequest";
import { useStore } from "@/lib/zustand/useStore";
import { useEffect, useState } from "react";

const NewRequest: React.FC = () => {
  const { products, fetchProducts } = useStore();
  const { addRequest } = useRequestStore();

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [materials, setMaterials] = useState<MaterialItem[]>([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleMaterialChange = (materialName: string, quantity: number) => {
    setMaterials((prev) => {
      const updated = [...prev];
      const existingIndex = updated.findIndex(
        (m) => m.materialName === materialName
      );

      if (existingIndex !== -1) {
        updated[existingIndex].quantity = quantity;
      } else {
        updated.push({ materialName, quantity });
      }

      return updated.filter((m) => m.quantity > 0);
    });
  };

  const handleSubmit = async () => {
    if (!title || !description || materials.length === 0) {
      alert("Please fill in all fields and add at least one material.");
      return;
    }

    const newRequest: requestRequest = {
      title,
      description,
      materials: materials.map((m) => ({
        materialName: m.materialName,
        quantity: m.quantity,
        price: m.price ?? 0,
      })),
    };

    const result = await addRequest(newRequest);

    if (result.success) {
      confirm("Request submitted successfully ✅");
      setTitle("");
      setDescription("");
      setMaterials([]);
    } else {
      alert("Failed to submit request ❌\n" + result.message);
    }
  };

  return (
    <section className="m-4 sm:m-6 flex flex-col gap-6">
      <div className="flex flex-col md:flex-row justify-between items-center">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">Create New Request</h1>
          <p className="mt-1 text-sm sm:text-base">
            You are creating a new request
          </p>
        </div>
        <div>
          <button
            type="button"
            className="bg-green-600 text-white rounded-md px-6 py-2 hover:bg-green-700 transition cursor-pointer m-3"
            onClick={handleSubmit}
          >
            + Add Request
          </button>
        </div>
      </div>

      <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="border outline-none rounded-md shadow-sm p-2"
              placeholder="Enter title"
            />
          </div>
          <div className="flex flex-col">
            <label className="text-sm font-medium mb-1">Description</label>
            <input
              type="text"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="border outline-none rounded-md shadow-sm p-2"
              placeholder="Enter description"
            />
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
          {products.map((material) => (
            <div
              key={material.id}
              className="flex flex-col p-4 border rounded-lg shadow-sm"
            >
              <input
                type="text"
                value={material.name}
                readOnly
                className="border rounded-md p-2 mb-2 outline-none transition"
              />
              <input
                type="number"
                min={0}
                defaultValue={0}
                onChange={(e) =>
                  handleMaterialChange(material.name, Number(e.target.value))
                }
                className="border rounded-md p-2 outline-none transition"
                placeholder="Quantity"
              />
            </div>
          ))}
        </div>
      </form>
    </section>
  );
};

export default NewRequest;

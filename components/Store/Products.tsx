"use client";

import { isValid } from "@/lib/interface";
import { useStore } from "@/lib/zustand/useStore";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import { Trash2 } from "lucide-react";
import { toast } from "sonner";

type localProductsType = {
  id?: number;
  name: string;
  quantity: number;
}[];

const Products = ({ isValid }: { isValid: isValid }) => {
  const {
    products,
    fetchProducts,
    createProduct,
    updateProduct,
    deleteStore,
    loading,
    error,
  } = useStore();
  const [open, setOpen] = useState(false);
  const [localProducts, setLocalProducts] = useState<localProductsType>([]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    if (products && products.length > 0) {
      setLocalProducts(products);
    } else if (localProducts.length === 0) {
      setLocalProducts([
        { name: "Basbousa", quantity: 10 },
        { name: "Kunafa", quantity: 15 },
        { name: "Baklava", quantity: 20 },
        { name: "Maamoul", quantity: 8 },
        { name: "Qatayef", quantity: 12 },
        { name: "Atayef", quantity: 9 },
      ]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [products]);

  const handleChange = (index: number, field: string, value: string) => {
    const updated = [...localProducts];
    if (field === "name") updated[index].name = value;
    if (field === "quantity") updated[index].quantity = Number(value);
    setLocalProducts(updated);
  };

  const addProduct = () => {
    setLocalProducts([
      ...localProducts,
      { name: `Product ${localProducts.length + 1}`, quantity: 0 },
    ]);
    setOpen(true);
  };

  const handleSave = async () => {
    const invalid = localProducts.find((p) => !p.name || p.quantity <= 0);

    if (invalid) {
      toast.error(`Invalid data for ${invalid.name || "Unnamed Product"}`);
      return;
    }

    const newProducts = localProducts.filter((p) => !p.id);
    const existingProducts = localProducts.filter((p) => p.id);

    if (existingProducts.length > 0) {
      await updateProduct(existingProducts);
    }

    for (const p of newProducts) {
      await createProduct(p);
    }

    toast.success("✅ All products saved successfully!");
    setOpen(false);
  };

  const toggleEdit = async () => {
    if (open) await handleSave();
    else setOpen(true);
  };

  return (
    <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 w-full">
        {localProducts.map((product, i) => (
          <div
            key={i}
            className="flex flex-col p-4 border rounded-lg shadow-sm"
          >
            <input
              type="text"
              value={product.name}
              readOnly={!open}
              onChange={(e) => handleChange(i, "name", e.target.value)}
              className={`border rounded-md p-2 mb-2 outline-none transition ${
                open ? "cursor-auto" : " cursor-not-allowed"
              }`}
              placeholder="Product Name"
            />
            <input
              type="number"
              min={0}
              value={product.quantity}
              readOnly={!open}
              onChange={(e) => handleChange(i, "quantity", e.target.value)}
              className={`border rounded-md p-2 mb-2 outline-none transition ${
                open ? "cursor-auto" : " cursor-not-allowed"
              }`}
              placeholder="Quantity"
            />
            <Button
              onClick={() => deleteStore(product.id!)}
              aria-label="Delete Product"
              className={`cursor-pointer ${isValid.isAdmin && open? "" : "hidden"}`}
            >
              <Trash2 />
            </Button>
          </div>
        ))}
      </div>

      <div className="flex justify-center gap-4">
        <button
          type="button"
          disabled={loading}
          onClick={toggleEdit}
          aria-label="Save and Edit Changes"
          className={`bg-blue-600 text-white rounded-md px-6 py-2 hover:bg-blue-700 transition disabled:opacity-50 cursor-pointer ${
            isValid.isAdmin ? "" : "hidden"
          }`}
        >
          {loading ? "Saving..." : open ? "Save Changes" : "Edit Products"}
        </button>

        <button
          type="button"
          onClick={addProduct}
          aria-label="Add New Product"
          className={`bg-green-600 text-white rounded-md px-6 py-2 hover:bg-green-700 transition cursor-pointer ${
            isValid.isAdmin ? "" : "hidden"
          }`}
        >
          + Add Product
        </button>
      </div>

      {error && <p className="text-red-500 text-center mt-3">{error}</p>}
    </form>
  );
};

export default Products;

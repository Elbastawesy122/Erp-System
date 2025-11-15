import { create } from "zustand";
import { storeRequest } from "../interface";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type Store = {
  products: storeRequest[];
  loading: boolean;
  error: string | null;
  fetchProducts: () => Promise<void>;
  createProduct: (product: storeRequest) => Promise<void>;
  updateProduct: (product: storeRequest[]) => Promise<void>;
  deleteStore: (id: number) => Promise<void>;
  clearStore: () => void;
};

export const useStore = create<Store>((set, get) => ({
  products: [],
  loading: false,
  error: null,

  fetchProducts: async () => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://erp-system-beta-ecru.vercel.app/api/store`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch store products");

      const data = await response.json();
      set({ products: data.products || [] });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  createProduct: async (product: storeRequest) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`/api/store`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(product),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to create product");

      set({ products: [...get().products, data.product] });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  updateProduct: async (products: storeRequest[]) => {
    set({ loading: true, error: null });
    try {
      const response = await fetch(`https://erp-system-beta-ecru.vercel.app/api/store`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ products }),
      });

      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to update products");

      set({ products: data.products });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    } finally {
      set({ loading: false });
    }
  },

  deleteStore: async (id: number | undefined) => {
    try {
      const res = await fetch(`https://erp-system-beta-ecru.vercel.app/api/store/${id}`, {
        method: "DELETE",
        credentials: "include",
        cache: "no-store",
      });

      const data = await res.json();

      if (res.ok) {
        const updatedStore = get().products.filter((o) => o.id !== id);
        set({
          products: updatedStore,
        });
        alert("✅ " + data.message);
      } else {
        alert(data.message || "Delete failed");
      }
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting!");
    }
  },

  clearStore: () => set({ products: [], error: null }),
}));

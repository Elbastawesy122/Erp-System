import { create } from "zustand";
import { orderRequest } from "../interface";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type OrderStore = {
  orders: orderRequest[];
  filteredOrders: orderRequest[];
  totalPages: number;
  error: string | null;
  fetchOrders: (page?: number, status?: string, progress?: string) => Promise<void>;
  updateOrder: (
    id: number,
    request: Partial<orderRequest>
  ) => Promise<{ success: boolean; message: string }>;
  deleteOrder: (orderId: number) => Promise<void>;
};

export const useOrderStore = create<OrderStore>((set, get) => ({
  orders: [],
  filteredOrders: [],
  totalPages: 1,
  error: null,

  fetchOrders: async (page = 1, status?: string, progress?: string) => {
    try {
      const query =
        `?page=${page}` +
        (status ? `&status=${status}` : "") +
        (progress ? `&progress=${progress}` : "");
      const res = await fetch(`/api/orders${query}`);
      const data = await res.json();

      if (!res.ok) {
        console.log(data.message || "Failed to fetch orders");
        return;
      }

      set({
        orders: data.orders || [],
        filteredOrders: data.orders || [],
        totalPages: data.totalPages || 1,
      });
    } catch (error) {
      console.error("Fetch orders error:", error);
    }
  },

  updateOrder: async (
    id: number,
    request: Partial<orderRequest>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`/api/orders/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to update Order");

      set({
        orders: get().orders.map((ord) =>
          ord.id === id ? data.request ?? ord : ord
        ),
      });
      window.location.href = "/orders";
      return { success: true, message: "Request updated successfully." };
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      set({ error: message });
      return { success: false, message };
    }
  },

  deleteOrder: async (orderId: number | undefined) => {
    try {
      const res = await fetch(`/api/orders/${orderId}`, {
        method: "DELETE",
        credentials: "include",
      });

      const data = await res.json();

      if (res.ok) {
        const updatedOrders = get().orders.filter((o) => o.id !== orderId);
        set({
          orders: updatedOrders,
          filteredOrders: updatedOrders,
        });
        confirm("✅ " + data.message);
        
      } else {
        alert(data.message || "Delete failed");
      }
      window.location.href = "/orders";
    } catch (error) {
      console.error("Delete error:", error);
      alert("Something went wrong while deleting!");
    }
  },
}));

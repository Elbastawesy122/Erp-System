import { create } from "zustand";
import { orderRequest } from "../interface";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type Store = {
  users: orderRequest[];
  error: string | null;
  getUser: () => Promise<void>;
};

export const useUser = create<Store>((set) => ({
  users: [],
  error: null,

  getUser: async () => {
    try {
      const response = await fetch(`/api/user`, { cache: "no-store" });
      if (!response.ok) throw new Error("Failed to fetch user");

      const data = await response.json();

      set({ users: data.user.ordersAccepted ?? [] });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    }
  },
}));

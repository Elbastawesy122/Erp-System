import { create } from "zustand";
import { requestRequest } from "../interface";

function getErrorMessage(error: unknown): string {
  if (error instanceof Error) return error.message;
  return String(error);
}

type RequestState = {
  requests: requestRequest[];
  filteredrequests: requestRequest[];
  error: string | null;
  totalPages: number;
  addRequest: (
    request: requestRequest
  ) => Promise<{ success: boolean; message: string }>;
  getRequests: (page?: number, status?: string) => Promise<void>;
  deleteRequest: (id: number) => Promise<{ success: boolean; message: string }>;
  updateRequest: (
    id: number,
    request: Partial<requestRequest>
  ) => Promise<{ success: boolean; message: string }>;
};

export const useRequestStore = create<RequestState>((set, get) => ({
  requests: [],
  error: null,
  filteredrequests: [],
  totalPages: 1,

  addRequest: async (
    request: requestRequest
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch("/api/requests", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to create request");

      set({ requests: [...get().requests, data.newrequests] });

      window.location.href = "/requests";

      return {
        success: true,
        message: data.message || "Request submitted successfully.",
      };
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      set({ error: message });
      return { success: false, message };
    }
  },

  getRequests: async (page = 1, status?: string) => {
    try {
      const query = `?page=${page}` + (status ? `&status=${status}` : "");
      const response = await fetch(`/api/requests${query}`, {
        cache: "no-store",
      });
      const data = await response.json();
      if (!response.ok)
        throw new Error(data.message || "Failed to fetch requests");

      set({
        requests: data.requests || [],
        filteredrequests: data.requests || [],
        totalPages: data.totalPages || 1,
      });
    } catch (err: unknown) {
      set({ error: getErrorMessage(err) });
    }
  },

  updateRequest: async (
    id: number,
    request: Partial<requestRequest>
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(request),
      });

      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to update request");

      set({
        requests: get().requests.map((req) =>
          req.id === id ? data.request ?? req : req
        ),
      });

      return { success: true, message: "Request updated successfully." };
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      set({ error: message });
      return { success: false, message };
    }
  },

  deleteRequest: async (
    id: number
  ): Promise<{ success: boolean; message: string }> => {
    try {
      const response = await fetch(`/api/requests/${id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (!response.ok)
        throw new Error(data.message || "Failed to delete request");

      set({ requests: get().requests.filter((req) => req.id !== id) });
      confirm("Request Deletted successfully ✅");

      window.location.href = "/requests"

      return { success: true, message: "Request deleted successfully." };
    } catch (err: unknown) {
      const message = getErrorMessage(err);
      set({ error: message });
      return { success: false, message };
    }
  },
}));

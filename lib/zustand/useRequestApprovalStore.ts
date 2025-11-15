import { create } from "zustand";
import { toast } from "sonner";

interface RequestApprovalState {
  approveRequest: (
    id: number
  ) => Promise<{ success: boolean; message: string }>;
  acceptOrder: (
    id: number
  ) => Promise<{ success: boolean; message: string }>;
}

export const useRequestApprovalStore = create<RequestApprovalState>(() => ({
  approveRequest: async (id) => {
    try {
      const res = await fetch(`/api/requests/${id}/transactions`, {
        method: "PUT",
      });

      if (!res.ok) {
        toast.error("API route not found or invalid");
        return { success: false, message: "API route not found or invalid" };
      }

      const result = await res.json();
      toast.success("The request has been approved ✅");
      window.location.href = "/requests";
      return { success: true, message: result.message };
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("An error occurred during approval ❗");
      return { success: false, message: "Failed to approve request" };
    }
  },

  acceptOrder: async (id) => {
    try {
      const res = await fetch(`/api/orders/${id}/transactions`, {
        method: "PUT",
      });

      if (!res.ok) {
        toast.error("API route not found or invalid");
        return { success: false, message: "API route not found or invalid" };
      }

      const result = await res.json();
      toast.success("The order has been Completed ✅");
      window.location.href = "/completed";
      return { success: true, message: result.message };
    } catch (error) {
      console.error("Error approving request:", error);
      toast.error("An error occurred during approval ❗");
      return { success: false, message: "Failed to approve request" };
    }
  },
}));

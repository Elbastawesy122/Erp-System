"use client";
import { useRouter } from "next/navigation";
import { orderRequest } from "../interface";

export function useOrder(): (orderData: orderRequest) => Promise<void> {
  const router = useRouter();

  return async function createOrder(orderData) {
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(orderData),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Create order failed");
        return;
      }

      alert("✅ " + data.message);
      router.replace("/orders");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
}
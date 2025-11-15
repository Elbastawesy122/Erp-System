"use client";
import { useRouter } from "next/navigation";

export function useLogout(): () => Promise<void> {
  const router = useRouter();

  return async function logout() {
    try {
      const res = await fetch("https://erp-system-beta-ecru.vercel.app/api/user/logout", { method: "POST" });
      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Logout failed");
        return;
      }

      confirm("✅ " + data.message);
      router.replace("/user/login");
      router.refresh();           
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
}

export function useLogin(): (values: { email: string; password: string }) => Promise<void> {
  const router = useRouter();

  return async function login(values: { email: string; password: string }) {
    try {
      const res = await fetch("https://erp-system-beta-ecru.vercel.app/api/user/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Login failed");
        return;
      }

      confirm("✅ " + data.message);
      router.replace("/");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
}

export function useSignUp(): (values: { email: string; password: string; name: string , isAdmin: boolean }) => Promise<void> {
  const router = useRouter();

  return async function signup(values: { email: string; password: string; name: string , isAdmin: boolean }) {
    try {
      const res = await fetch("/api/user/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(values),
      });

      const data = await res.json();

      if (!res.ok) {
        alert(data.message || "Signup failed");
        return;
      }

      confirm("✅ " + data.message);
      router.replace("/user/login");
      router.refresh();
    } catch (error) {
      console.error(error);
      alert("Something went wrong!");
    }
  };
}
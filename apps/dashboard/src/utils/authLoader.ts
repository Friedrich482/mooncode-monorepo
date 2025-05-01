import { redirect } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;
export const protectedRouteLoader = async () => {
  try {
    const response = await fetch(`${API_URL}/auth.checkAuthStatus`, {
      credentials: "include",
    });

    if (!response.ok) {
      throw redirect("/login");
    }
  } catch (error) {
    if (error instanceof Response && error.headers.get("Location")) {
      throw error;
    }
    throw redirect("/login");
  }
};

export const authRouteLoader = async () => {
  try {
    const response = await fetch(`${API_URL}/auth.checkAuthStatus`, {
      credentials: "include",
    });
    if (response.ok) {
      return redirect("/dashboard");
    }
    return null;
  } catch {
    return null;
  }
};

import { redirect } from "react-router";

const API_URL = import.meta.env.VITE_API_URL;

// protects routes
export const protectedRouteLoader = async () => {
  try {
    const response = await fetch(`${API_URL}/auth.checkAuthStatus`, {
      credentials: "include",
    });

    if (!response.ok) {
      if (response.status >= 500 || response.status === 0) {
        throw new Error("Service temporarily unavailable");
      } else if (response.status === 401) {
        throw redirect("/login");
      } else {
        throw new Error("Authentication check failed");
      }
    }
  } catch (error) {
    if (error instanceof Response && error.headers.get("Location")) {
      throw error;
    }
  }
};

// prevents a logged in user to access an auth route (login & register)
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

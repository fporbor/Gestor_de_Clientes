import { createContext, useState, useEffect, useCallback } from "react";
import { authHeaders } from "../services/authHeaders";

export const UserContext = createContext();

const API_ME = `${import.meta.env.VITE_API_URL_USERS}/auth/me`;

export function UserProvider({ children }) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // -----------------------------
    // Cargar usuario autenticado
    // -----------------------------
    const fetchUser = useCallback(async () => {
        try {
            const res = await fetch(API_ME, { headers: authHeaders() });
            const data = await res.json();

            if (res.ok && !data.error) {
                setUser(data);
                return data;
            } else {
                setUser(null);
                return null;
            }
        } catch {
            setUser(null);
            return null;
        }
    }, []);

    // -----------------------------
    // Cargar usuario al iniciar
    // -----------------------------
    useEffect(() => {
        const token = localStorage.getItem("token");

        if (!token) {
            setLoading(false);
            return;
        }

        fetchUser().finally(() => setLoading(false));
    }, [fetchUser]);

    // -----------------------------
    // Login: guardar token y cargar usuario
    // -----------------------------
    const login = async (token) => {
        localStorage.setItem("token", token);
        return await fetchUser();
    };

    // -----------------------------
    // Logout
    // -----------------------------
    const logout = () => {
        localStorage.removeItem("token");
        setUser(null);
    };

    return (
        <UserContext.Provider value={{ user, setUser, login, logout, loading }}>
            {children}
        </UserContext.Provider>
    );
}


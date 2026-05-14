import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "./../../context/UserContext";

const API = `${import.meta.env.VITE_API_URL_USERS}/auth/login`;

export default function Login({ setToken }) {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(UserContext);

  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const login = async () => {
    setError(null);
    setLoading(true);

    try {
      const res = await fetch(API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok || data.error) {
        setError(data.error?.message || "Credenciales incorrectas");
        return;
      }

      localStorage.setItem("token", data.token);
      setToken(data.token);
      await loginContext(data.token);

    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    login();
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Iniciar sesión</h2>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          className="p-2 bg-zinc-700 text-white rounded"
        />

        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Contraseña"
          className="p-2 bg-zinc-700 text-white rounded"
        />

        <button
          type="submit"
          disabled={loading}
          className="bg-blue-600 hover:bg-blue-700 text-white p-2 rounded"
        >
          {loading ? "Cargando..." : "Entrar"}
        </button>
      </form>

      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-zinc-400">¿No tienes cuenta?</span>

        <a
          href="/register"
          className="text-blue-400 hover:text-blue-300 underline"
        >
          Crear una cuenta
        </a>
      </div>
    </div>
  );
}


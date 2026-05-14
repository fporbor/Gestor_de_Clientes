// src/components/users/register/Register.jsx
import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../../context/UserContext";

const API = "http://localhost:3400/auth/register";

export default function Register({ setToken }) {
  const navigate = useNavigate();
  const { login: loginContext } = useContext(UserContext);

  const [form, setForm]       = useState({ name: "", email: "", password: "" });
  const [error, setError]     = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (loading) return;

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
        setError(data.error?.message || "Error al registrar usuario");
        return;
      }

      // Login automático tras registro
      if (data.token) {
        localStorage.setItem("token", data.token);  // 1. guarda el token
        setToken(data.token);                         // 2. actualiza App.jsx
        await loginContext(data.token);               // 3. carga el usuario en el contexto
        navigate("/");                                // 4. navega
      }

    } catch {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6 max-w-md mx-auto">
      <h2 className="text-2xl font-bold mb-4">Crear cuenta</h2>

      {error && <p className="text-red-400 mb-3">{error}</p>}

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">

        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Nombre"
          className="p-2 bg-zinc-700 text-white rounded"
        />

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
          {loading ? "Cargando..." : "Registrarse"}
        </button>

      </form>

      <div className="mt-4 flex justify-between items-center text-sm">
        <span className="text-zinc-400">¿Ya tienes cuenta?</span>
        <a href="/login" className="text-blue-400 hover:text-blue-300 underline">
          Iniciar sesión
        </a>
      </div>
    </div>
  );
}

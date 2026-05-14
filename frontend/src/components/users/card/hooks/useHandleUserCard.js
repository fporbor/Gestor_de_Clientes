import { useState, useEffect, useContext } from "react";
import { authHeaders } from "../../../../services/authHeaders";
import { UserContext } from "../../../../context/UserContext";

export function useHandleUserCard() {
  const { user, setUser } = useContext(UserContext);

  const [avatarSrc, setAvatarSrc] = useState(null)
  const [form, setForm]           = useState({ name: "" });
  const [editing, setEditing]     = useState(false);
  const [loading, setLoading]     = useState(true);
  const [saving, setSaving]       = useState(false);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting]   = useState(false);
  const [error, setError]         = useState(null);

  // Sincronizar con el usuario cuando carga
  useEffect(() => {
    if (user) {
      setForm({ name: user.name });
      setAvatarSrc(user.avatar || null);
      setLoading(false);
    }
  }, [user]);

  // ── Nombre ──────────────────────────────────────────────────
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const resetForm = () => {
    setForm({ name: user?.name || "" });
  };

  const handleSave = async () => {
    const trimmed = form.name.trim();
    if (!trimmed) { setError("El nombre no puede estar vacío"); return; }

    setSaving(true);
    setError(null);

    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_USERS}/me`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", ...authHeaders() },
        body: JSON.stringify({ name: trimmed })
      });
      const data = await res.json();
      
      if (data.error) { setError(data.error.message); return; }

      setUser(prev => ({ ...prev, name: trimmed }));
      setEditing(false);
    } catch {
      setError("Error al actualizar el nombre");
    } finally {
      setSaving(false);
    }
  };

  // ── Avatar — subir ───────────────────────────────────────────
  const handleAvatarUpload = async (file) => {
    if (!file) return;

    setUploading(true);
    setError(null);

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL_USERS}/avatar`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
        body: formData
      });
      const data = await res.json();

      console.log("Respuesta del backend:", data);  // ← aquí, después de parsear

      if (!res.ok) {
        setError(data.error || "Error al subir avatar");
        return;
      }

      const fullUrl = `http://localhost:3400${data.avatar}`

      setUser(prev  => ({ ...prev, avatar: fullUrl }))
      setAvatarSrc(`${fullUrl}?t=${Date.now()}`)  // ← timestamp para romper caché
    } catch (err) {
      console.error(err);
      setError("Error al subir avatar");
    } finally {
      setUploading(false);
    }
  };

  // ── Avatar — borrar ──────────────────────────────────────────
  const handleAvatarDelete = async () => {
    setDeleting(true);
    setError(null);

    try {
      const res  = await fetch(`${import.meta.env.VITE_API_URL_USERS}/avatar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }
      });
      const data = await res.json();

      if (!res.ok) { setError(data.error || "Error al borrar avatar"); return; }

      setUser(prev => ({ ...prev, avatar: null }));
      setAvatarSrc(null);
    } catch (err) {
      console.error(err);
      setError("Error al borrar avatar");
    } finally {
      setDeleting(false);
    }
  };

  return {
    fields: {
      user,
      form,
      editing,
      loading,
      saving,
      uploading,
      deleting,
      error,
      avatarSrc
    },
    handleChange,
    setEditing,
    resetForm,
    handleSave,
    handleAvatarUpload,
    handleAvatarDelete
  };
}
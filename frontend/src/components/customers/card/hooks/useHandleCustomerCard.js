import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authHeaders } from "../../../../services/authHeaders";

const emptyForm = {
  name: "",
  email: "",
  phone: "",
  address: "",
  status: "active",
  dni: ""
};

const editableFields = ["name", "email", "phone", "address", "status", "dni"];

const userFields = {
  id: "ID",
  name: "Nombre",
  email: "Correo electrónico",
  phone: "Teléfono",
  address: "Dirección",
  dni: "DNI",
  userId: "ID del Usuario",
  createdAt: "Fecha de creación",
  updatedAt: "Última actualización",
  status: "Estado"
};

export function useHandleCustomerCard({ id }) {
  const navigate = useNavigate();

  const [form, setForm] = useState(emptyForm);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(!!id);

  const isNew = !id;

  useEffect(() => {
    if (!id) return;

    const loadCustomer = async () => {
      try {
        const res = await fetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`, {
          headers: authHeaders()
        });

        if (!res.ok) {
          throw new Error(`Error ${res.status}: No se pudo cargar el cliente`);
        }

        const data = await res.json();

        if (data?.error) {
          throw new Error(data.error.message);
        }

        setForm(data);
        setError(null);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    loadCustomer();
  }, [id]);

  const handleChange = (e) => {
    setError(null);
    setForm((prev) => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async () => {
    setError(null);

    if (!form.name.trim()) {
      setError('El campo "Nombre" es obligatorio');
      return;
    }

    const method = isNew ? "POST" : "PUT";
    const url = isNew ? import.meta.env.VITE_API_URL_CUSTOMERS : `${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`;

    try {
      const res = await fetch(url, {
        method,
        headers: authHeaders(),
        body: JSON.stringify(form)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data?.error?.message || data?.message || "Error al guardar el cliente");
        return;
      }

      navigate("/customers");
    } catch {
      setError("No se pudo conectar con el servidor");
    }
  };

  const goBack = () => navigate("/customers");
  const goToEdit = () => navigate(`/customers/edit/${id}`);

  return {
    fields: {
      form,
      error,
      loading,
      userFields,
      editableFields
    },

    handleChange,
    handleSubmit,
    goBack,
    goToEdit,
    setError,
    setForm
  };
}
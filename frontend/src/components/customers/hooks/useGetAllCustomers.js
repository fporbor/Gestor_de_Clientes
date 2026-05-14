import { useState, useEffect, useMemo, useRef } from "react";
import { authHeaders } from "../../../services/authHeaders";


export function useGetAllCustomers() {
  const [customers, setCustomers] = useState([]);
  const [error, setError] = useState(null);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados añadidos
  const [search, setSearch] = useState("");
  const [deleteId, setDeleteId] = useState(null);
  const menuRef = useRef(null);
  const [sortField, setSortField] = useState(null);
  const [sortDirection, setSortDirection] = useState("asc");

  //Ordenar clientes
  const handleSort = (field) => {
  if (sortField === field) {
    if (sortDirection === "asc") {
      setSortDirection("desc");
    } else if (sortDirection === "desc") {
      setSortField(null);      
      setSortDirection("asc");  
    }
  } else {
    setSortField(field);
    setSortDirection("asc");
  }
};


  // -----------------------------
  // Fetch inicial
  // -----------------------------
  const fetchCustomers = async () => {
    setLoading(true);

    try {
      const res = await fetch(import.meta.env.VITE_API_URL_CUSTOMERS, { headers: authHeaders() });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudieron cargar los clientes`);
      }

      const data = await res.json();

      if (data?.error) {
        setError(data.error.message);
      } else {
        setCustomers(data);
      }
    } catch (err) {
      setError(err.message || "Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  // -----------------------------
  // Filtrado
  // -----------------------------
const filteredCustomers = useMemo(() => {
  if (!Array.isArray(customers)) return [];

  // 1. Filtrado
  const filtered = customers.filter((c) => {
    const translatedStatus =
      c.status === "active"
        ? "activo"
        : c.status === "inactive"
        ? "inactivo"
        : c.status;

    const searchable = [
      c.name,
      c.email,
      c.phone,
      c.address,
      c.dni,
      translatedStatus
    ]
      .join(" ")
      .toLowerCase();

    return searchable.includes(search.toLowerCase());
  });

  // 2. Ordenamiento
  if (!sortField) return filtered;

  return [...filtered].sort((a, b) => {
    const valueA = String(a[sortField] || "").toLowerCase();
    const valueB = String(b[sortField] || "").toLowerCase();

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
  });
}, [customers, search, sortField, sortDirection]);



  // -----------------------------
  // Eliminar cliente
  // -----------------------------
  const handleDelete = async (id) => {
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL_CUSTOMERS}/${id}`, {
        method: "DELETE",
        headers: authHeaders()
      });

      if (!res.ok) {
        throw new Error(`Error ${res.status}: No se pudo eliminar`);
      }

      const data = await res.json();

      if (data?.error) {
        setError(data.error.message);
      } else {
        fetchCustomers();
      }
    } catch (err) {
      setError(err.message || "Error al eliminar el cliente");
    }
  };

  // -----------------------------
  // Cerrar menú al hacer click fuera
  // -----------------------------
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setOpenMenuId(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // -----------------------------
  // Retorno del hook
  // -----------------------------
  return {
    customers,
    filteredCustomers,
    loading,
    error,
    search,
    setSearch,
    deleteId,
    setDeleteId,
    handleDelete,
    menuRef,
    openMenuId,
    setOpenMenuId,
    fetchCustomers,
    handleSort,
    sortField,
    sortDirection,
    setError
  };
}


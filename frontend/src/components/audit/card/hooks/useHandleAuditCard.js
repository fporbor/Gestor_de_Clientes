// frontend/src/components/audit/hooks/useHandleAuditCard.js
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { authHeaders } from "./../../../../services/authHeaders";

export function useHandleAuditCard() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchLog = async () => {
      try {
        const res = await fetch( `${import.meta.env.VITE_API_URL_AUDIT}/${id}`, {
          method: "GET",
          headers: authHeaders()
        });

        if (!res.ok) {
          throw new Error("No se pudo cargar el registro");
        }

        const data = await res.json();
        setLog(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLog();
  }, [id]);

  const goBack = () => navigate(-1);

  const fields = {
    userId: "ID del Usuario",
    userEmail: "Email",
    action: "Acción",
    entityType: "Entidad",
    entityId: "ID de Entidad",
    serviceName: "Servicio",
    description: "Descripción",
    createdAt: "Fecha"
  };

  return {
    id,
    log,
    loading,
    error,
    goBack,
    fields
  };
}



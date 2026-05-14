import { useEffect, useState } from "react";
import { authHeaders } from "../../../services/authHeaders";

const translations = {
    actions: {
        USER_LOGIN:          "Login de Usuario",
        USER_LOGOUT:         "Logout de Usuario",
        USER_REGISTER:       "Registro de Usuario",
        USER_UPDATE:         "Actualización de Usuario",
        USER_UPDATED:        "Actualización de Usuario",
        CUSTOMER_DELETED:    "Eliminación de Cliente",
        CUSTOMER_UPDATED:    "Actualización de Cliente",
        CUSTOMER_CREATED:    "Creación de Cliente",
        USER_AVATAR_DELETED: "Eliminación de Avatar de Usuario",
        USER_AVATAR_UPDATED: "Actualización de Avatar de Usuario",
        TEST_INSERT: "Inserción de Prueba"
    },
    entities: {
        User:     "Usuario",
        Customer: "Cliente",
        Audit : "Auditoría"
    },
    serviceName: {
        "users-service":     "Servicio de Usuarios",
        "customers-service": "Servicio de Clientes",
        "audit-service":      "Servicio de Auditoría"
    }
};

export const useGetAuditLogs = () => {
    const [logs, setLogs]               = useState([]);
    const [loading, setLoading]         = useState(true);
    const [openFilters, setOpenFilters] = useState(false);
    const [filters, setFilters]         = useState({ userId: "", email: "", action: "" });
    const [search, setSearch]           = useState("");
    const [copied, setCopied]           = useState(false); 
    const [sortField, setSortField] = useState(null);
    const [sortDirection, setSortDirection] = useState("asc");

    //-- Función para manejar la ordenación ─────────────────────────
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




    // ── Traducciones ───────────────────────────────────────────
    const translateAction  = (action)  => translations.actions[action]     || action;
    const translateEntity  = (entity)  => translations.entities[entity]    || entity;
    const translateService = (service) => translations.serviceName[service] || service;

    // ── Búsqueda local sobre los logs ya cargados ──────────────
    const filteredLogs = Array.isArray(logs)
    ? logs.filter(log => {
        const translated = [
            translateAction(log.action),
            translateEntity(log.entityType),
            translateService(log.serviceName),
            log.userEmail,
            log.userId,
            log.id,
            new Date(log.createdAt).toLocaleString()
        ]
            .join(" ")
            .toLowerCase();

        return translated.includes(search.toLowerCase());
        })
    : [];

    // Ordenamiento
    const sortedLogs = [...filteredLogs].sort((a, b) => {
    if (!sortField) return 0;

    const rawA = a[sortField];
    const rawB = b[sortField];

    const numA = Number(rawA);
    const numB = Number(rawB);

    const bothNumeric = !isNaN(numA) && !isNaN(numB);

    if (bothNumeric) {
        return sortDirection === "asc" ? numA - numB : numB - numA;
    }

    // Ordenamiento alfabético para strings
    const valueA = String(rawA || "").toLowerCase();
    const valueB = String(rawB || "").toLowerCase();

    if (valueA < valueB) return sortDirection === "asc" ? -1 : 1;
    if (valueA > valueB) return sortDirection === "asc" ? 1 : -1;
    return 0;
    });


    const filteredActions = Object.keys(translations.actions).filter(key =>
    translations.actions[key].toLowerCase().includes(search.toLowerCase())
    );


    // ── Reset icono copiar ─────────────────────────────────────
    useEffect(() => {                                        // ← movido del JSX
        if (!copied) return;
        const timer = setTimeout(() => setCopied(false), 2000);
        return () => clearTimeout(timer);
    }, [copied]);

    // ── Fetch ──────────────────────────────────────────────────
    const fetchLogs = async () => {
        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL_AUDIT}`, {
                headers: authHeaders()
            });
            if (!res.ok) throw new Error("Error al obtener los registros");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    const fetchWithFilters = async (activeFilters) => {
        setLoading(true);
        const params = new URLSearchParams();
        if (activeFilters.userId) params.append("userId", activeFilters.userId);
        if (activeFilters.email)  params.append("email",  activeFilters.email);
        if (activeFilters.action) params.append("action", activeFilters.action);

        try {
            const res = await fetch(`${import.meta.env.VITE_API_URL_AUDIT}?${params.toString()}`, {
                headers: authHeaders()
            });
            if (!res.ok) throw new Error("Error al obtener los registros filtrados");
            const data = await res.json();
            setLogs(data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    // ── Filtros ────────────────────────────────────────────────
    const handleAcceptFilters = () => {
        fetchWithFilters(filters);
        setOpenFilters(false);
    };

    const handleClearFilters = () => {
        const cleared = { userId: "", email: "", action: "" };
        setFilters(cleared);
        fetchWithFilters(cleared);
        setOpenFilters(false);
    };

    // ── Copiar a Excel ─────────────────────────────────────────
    const copyToClipboard = () => {                         // ← movido del JSX
        const headers = ["ID", "ID de Usuario", "Email", "Acción", "Entidad", "Servicio", "Fecha"];
        const rows = logs.map(log => [
            log.id,
            log.userId,
            log.userEmail,
            translateAction(log.action),
            translateEntity(log.entityType),
            translateService(log.serviceName),
            new Date(log.createdAt).toLocaleString()
        ]);
        const tsv = [headers, ...rows]
            .map(row => row.join("\t"))
            .join("\n");
        navigator.clipboard.writeText(tsv)
            .then(() => setCopied(true))
            .catch(() => console.error("Error al copiar"));
    };


    useEffect(() => { fetchLogs(); }, []);

    return {
        logs,
        loading,
        filters,
        search,
        setSearch,
        setFilters,
        openFilters,
        setOpenFilters,
        translations,
        translateAction,
        translateEntity,
        translateService,
        handleAcceptFilters,
        handleClearFilters,
        filteredActions,
        filteredLogs,       // ← nuevo
        copied,             // ← nuevo
        copyToClipboard,    // ← nuevo
        fetchWithFilters,
        sortField,
        sortDirection,
        handleSort,
        sortedLogs          // ← nuevo
    };
};
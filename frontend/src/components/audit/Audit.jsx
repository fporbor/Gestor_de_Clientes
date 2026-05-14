import { useRef, useEffect,useState } from "react";
import { useGetAuditLogs } from "./hooks/useGetAuditLogs";
import { useNavigate } from "react-router-dom";
import { createPortal } from "react-dom";

// ── SearchableSelect ───────────────────────────────────────────
function SearchableSelect({ value, onChange, options = [], placeholder }) {
    const [search, setSearch] = useState("");
    const [open, setOpen] = useState(false);
    const [coords, setCoords] = useState({ top: 0, left: 0, width: 0 });

    const inputRef    = useRef(null);
    const dropdownRef = useRef(null);

    const updateCoords = () => {
        if (inputRef.current) {
            const rect = inputRef.current.getBoundingClientRect();
            setCoords({
                top:   rect.bottom + window.scrollY + 4,
                left:  rect.left   + window.scrollX,
                width: rect.width
            });
        }
    };

    useEffect(() => {
        const handler = (e) => {
            if (
                inputRef.current    && !inputRef.current.contains(e.target) &&
                dropdownRef.current && !dropdownRef.current.contains(e.target)
            ) {
                setOpen(false);
                setSearch("");
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    useEffect(() => {
        if (!open) return;
        const handle = () => updateCoords();
        window.addEventListener("scroll", handle);
        window.addEventListener("resize", handle);
        return () => {
            window.removeEventListener("scroll", handle);
            window.removeEventListener("resize", handle);
        };
    }, [open]);

    const filtered = options.filter(o =>
        o.label.toLowerCase().includes(search.toLowerCase()) ||
        o.value.toLowerCase().includes(search.toLowerCase())
    );

    const selectedLabel = value
        ? options.find(o => o.value === value)?.label || value
        : "";

    return (
        <div className="relative">
            <input
                ref={inputRef}
                type="text"
                value={open ? search : selectedLabel}
                onFocus={() => { updateCoords(); setOpen(true); }}
                onChange={(e) => {
                    setSearch(e.target.value);
                    if (!open) { updateCoords(); setOpen(true); }
                }}
                placeholder={placeholder}
                className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
            />

            {open && createPortal(
                <div
                    ref={dropdownRef}
                    data-filter-dropdown="true"
                    style={{
                        position: "absolute",
                        top:      coords.top,
                        left:     coords.left,
                        width:    coords.width,
                    }}
                    className="bg-zinc-900 border border-zinc-800 rounded-lg shadow-xl max-h-72 overflow-y-auto z-9999"
                >
                    {filtered.length === 0 && (
                        <p className="px-3 py-2 text-zinc-500 text-sm">Sin resultados</p>
                    )}
                    {filtered.map((opt) => (
                        <button
                            key={opt.value}
                            onClick={() => { onChange(opt.value); setSearch(""); setOpen(false); }}
                            className={`w-full text-left px-3 py-2.5 text-sm hover:bg-zinc-800 transition-colors
                                ${value === opt.value ? "text-white font-semibold" : "text-zinc-400"}`}
                        >
                            {opt.label}
                        </button>
                    ))}
                </div>,
                document.body
            )}
        </div>
    );
}

// ── Componente principal ───────────────────────────────────────
export default function Audit() {
    const navigate  = useNavigate();
    const filterRef = useRef(null);

    const {
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
        copied,
        copyToClipboard,
        sortField,
        sortDirection,
        handleSort,
        sortedLogs
    } = useGetAuditLogs();

    // Cerrar filtros al hacer click fuera
    useEffect(() => {
        const handleClickOutside = (e) => {
            if (filterRef.current && filterRef.current.contains(e.target)) return;
            if (e.target.closest('[data-filter-dropdown="true"]')) return;
            setOpenFilters(false);
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, [setOpenFilters]);

    if (loading) return <p className="text-zinc-300 p-6">Cargando registros...</p>;

    return (
        <div className="p-6 w-full h-full min-h-screen">

            {/* Cabecera */}
            <div className="flex items-center justify-between mb-6 relative">
                <h2 className="text-2xl font-bold text-white">Registros de Auditoría</h2>

                <div className="flex items-center gap-2 relative" ref={filterRef}>

                    {/* Buscador */}
                    <input
                        type="text"
                        placeholder="Buscar..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-64 p-2 rounded bg-zinc-900 border border-zinc-700 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                    />

                    {/* Botón filtros */}
                    <button
                        onClick={() => setOpenFilters(!openFilters)}
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg text-sm transition-colors"
                    >
                        <svg width="15" height="12" viewBox="0 0 15 12" fill="none">
                            <line x1="0"   y1="1.5"  x2="15"  y2="1.5"  stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <line x1="2.5" y1="6"    x2="12.5" y2="6"   stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                            <line x1="5"   y1="10.5" x2="10"  y2="10.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                        </svg>
                        Filtro
                    </button>

                    {/* Botón copiar */}
                    <button
                        onClick={copyToClipboard}
                        className="flex items-center gap-2 px-4 py-2 border border-zinc-700 hover:border-zinc-500 text-zinc-300 hover:text-white rounded-lg text-sm transition-colors"
                    >
                        {copied ? (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <path d="M2 7L5.5 10.5L12 3.5" stroke="#22c55e" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
                                </svg>
                                <span className="text-green-500">Copiado</span>
                            </>
                        ) : (
                            <>
                                <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                                    <rect x="5" y="5" width="8" height="8" rx="1.5" stroke="currentColor" strokeWidth="1.5"/>
                                    <path d="M9 5V3.5A1.5 1.5 0 0 0 7.5 2H3.5A1.5 1.5 0 0 0 2 3.5V7.5A1.5 1.5 0 0 0 3.5 9H5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round"/>
                                </svg>
                                Copiar tabla
                            </>
                        )}
                    </button>

                    {/* Panel filtros */}
                    {openFilters && (
                        <div className="absolute right-0 top-full mt-2 w-80 bg-zinc-950 border border-zinc-800 rounded-xl shadow-2xl z-50">

                            <div className="px-5 py-4 border-b border-zinc-800">
                                <span className="text-white font-semibold text-base">Filtros</span>
                            </div>

                            <div className="px-5 py-4 flex flex-col gap-5">

                                {/* ID de Usuario */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                        ID de Usuario
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.userId}
                                        placeholder="Ej: 12"
                                        onChange={(e) => setFilters({ ...filters, userId: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>

                                {/* Email */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                        Email
                                    </label>
                                    <input
                                        type="text"
                                        value={filters.email}
                                        placeholder="Ej: juan@gmail.com"
                                        onChange={(e) => setFilters({ ...filters, email: e.target.value })}
                                        className="w-full px-3 py-2.5 rounded-lg bg-zinc-900 border border-zinc-800 text-white text-sm placeholder-zinc-600 focus:outline-none focus:border-zinc-600 transition-colors"
                                    />
                                </div>

                                {/* Acción */}
                                <div className="flex flex-col gap-2">
                                    <label className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                        Acción
                                    </label>
                                    <SearchableSelect
                                        value={filters.action}
                                        onChange={(val) => setFilters({ ...filters, action: val })}
                                        options={Object.entries(translations.actions).map(([key, label]) => ({ value: key, label }))}
                                        placeholder="Buscar acción..."
                                    />
                                </div>
                            </div>

                            <div className="px-5 py-4 border-t border-zinc-800 flex gap-2">
                                <button
                                    onClick={handleClearFilters}
                                    className="flex-1 px-3 py-2.5 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white hover:border-zinc-500 text-sm transition-colors"
                                >
                                    Limpiar
                                </button>
                                <button
                                    onClick={handleAcceptFilters}
                                    className="flex-1 px-3 py-2.5 rounded-lg bg-white hover:bg-zinc-200 text-black font-medium text-sm transition-colors"
                                >
                                    Aplicar
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>
            <div className="overflow-y-auto max-h-[82vh] rounded-lg border border-zinc-800">        
                {/* Tabla */}
                <table className="w-full text-sm">
                    <thead className="bg-zinc-800 text-zinc-300 sticky top-0 z-10 ">
                        <tr>
                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("id")}
                            >
                            ID {sortField === "id" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("userId")}
                            >
                            Usuario {sortField === "userId" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("userEmail")}
                            >
                            Email {sortField === "userEmail" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("action")}
                            >
                            Acción {sortField === "action" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("entityType")}
                            >
                            Entidad {sortField === "entityType" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("serviceName")}
                            >
                            Servicio {sortField === "serviceName" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th
                            className="px-4 py-2 text-left cursor-pointer select-none"
                            onClick={() => handleSort("createdAt")}
                            >
                            Fecha {sortField === "createdAt" && (sortDirection === "asc" ? "▲" : "▼")}
                            </th>

                            <th></th>

                        </tr>
                    </thead>

                    <tbody className="bg-zinc-900">
                        {sortedLogs.length === 0 ? (
                            <tr>
                                <td colSpan="8" className="text-center text-zinc-400 py-4">
                                    No hay registros
                                </td>
                            </tr>
                        ) : sortedLogs.map(log => (
                            <tr key={log.id} className="border-b border-zinc-800">
                                <td className="px-4 py-3 text-white">{log.id}</td>
                                <td className="px-4 py-3 text-zinc-400">{log.userId}</td>
                                <td className="px-4 py-3 text-zinc-400">{log.userEmail}</td>
                                <td className="px-4 py-3 text-zinc-400">{translateAction(log.action)}</td>
                                <td className="px-4 py-3 text-zinc-400">{translateEntity(log.entityType)}</td>
                                <td className="px-4 py-3 text-zinc-400">{translateService(log.serviceName)}</td>
                                <td className="px-4 py-3 text-zinc-400">{new Date(log.createdAt).toLocaleString()}</td>
                                <td className="px-2 py-3">
                                    <button
                                        onClick={() => navigate(`/audit-logs/${log.id}`)}
                                        className="bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white text-sm"
                                    >
                                        Ver detalles
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
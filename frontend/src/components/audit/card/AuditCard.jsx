import { useHandleAuditCard } from "./hooks/useHandleAuditCard";

const translations = {
  actions: {
    USER_LOGIN: "Login de Usuario",
    USER_LOGOUT: "Logout de Usuario",
    USER_REGISTER: "Registro de Usuario",
    USER_UPDATE: "Actualización de Usuario",
    USER_UPDATED: "Actualización de Usuario",
    CUSTOMER_DELETED: "Eliminación de Cliente",
    CUSTOMER_UPDATED: "Actualización de Cliente",
    CUSTOMER_CREATED: "Creación de Cliente"
  },
  entities: {
    User: "Usuario",
    Customer: "Cliente"
  },
  serviceName: {
    "users-service": "Servicio de Usuarios",
    "customers-service": "Servicio de Clientes"
  }
};

const translateAction = (action) =>
  translations.actions[action] || action;

const translateEntity = (entity) =>
  translations.entities[entity] || entity;

const translateService = (service) =>
  translations.serviceName[service] || service;

export default function AuditCard() {
  const { log, loading, error, goBack, fields } = useHandleAuditCard();

  if (loading) return <p className="p-6">Cargando...</p>;
  if (error) return <p className="p-6 text-red-500">{error}</p>;
  if (!log) return <p className="p-6">No se encontró el registro.</p>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6">
        Detalles del registro #{log.id}
      </h2>

      {Object.entries(fields).map(([key, label]) => {
        let value = log[key];

        // 🔥 Aplicar traducciones según el campo
        if (key === "action") value = translateAction(value);
        if (key === "entityType") value = translateEntity(value);
        if (key === "serviceName") value = translateService(value);

        return (
          <div key={key} className="mb-3 flex items-center gap-3">
            <label className="text-sm text-zinc-300 w-32">{label}</label>

            <span className="flex-1 p-2 text-white bg-zinc-800 rounded">
              {key === "createdAt"
                ? new Date(log[key]).toLocaleString()
                : value || "—"}
            </span>
          </div>
        );
      })}

      <div className="mb-3">
        <label className="text-sm text-zinc-300 w-32 block mb-2">Metadata</label>

        <pre className="bg-zinc-900 text-green-300 p-4 rounded text-sm overflow-auto border border-zinc-700">
          {JSON.stringify(log.metadata, null, 2)}
        </pre>
      </div>

      <div className="flex gap-2 mt-6">
        <button
          onClick={goBack}
          className="bg-zinc-600 px-4 py-2 rounded text-white"
        >
          Volver
        </button>
      </div>
    </div>
  );
}


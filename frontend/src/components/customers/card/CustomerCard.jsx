import { useParams } from "react-router-dom";
import { useHandleCustomerCard } from "./hooks/useHandleCustomerCard";

function CustomerCard({ editMode = false }) {
  const { id } = useParams();

  const {
    fields: { form, error, loading, userFields, editableFields },
    handleChange,
    handleSubmit,
    goBack,
    goToEdit
  } = useHandleCustomerCard({ id });

  const isNew = !id;
  const isView = !!id && !editMode;
  const isEdit = !!id && editMode;

  if (loading) {
    return <p className="p-6">Cargando...</p>;
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">
        {isNew && "Nuevo cliente"}
        {isView && "Detalles del cliente"}
        {isEdit && "Editar cliente"}
      </h2>

      {error && <p className="text-red-500 mb-3">{error}</p>}

      {/* Campos dinámicos */}
      {editableFields
        .filter((field) => field !== "status")
        .map((field) => (
          <div key={field} className="mb-3 flex items-center gap-3">
            <label className="text-sm text-zinc-300 w-32">
              {userFields[field] || field}
            </label>

            {isView ? (
              <span className="flex-1 p-2 text-white">
                {form[field] || "—"}
              </span>
            ) : (
              <input
                name={field}
                value={form[field] ?? ""}
                onChange={handleChange}
                placeholder={userFields[field] || field}
                className="flex-1 p-2 bg-zinc-700 rounded text-white"
              />
            )}
          </div>
        ))}

      {/* Estado */}
      <div className="mb-3 flex items-center gap-3">
        <label className="text-sm text-zinc-300 w-32">
          {userFields.status || "Estado"}
        </label>

        {isView ? (
          <span
            className={`px-2 py-1 rounded text-xs ${
              form.status === "active" ? "bg-green-700" : "bg-red-700"
            }`}
          >
            {form.status === "active" ? "Activo" : "Inactivo"}
          </span>
        ) : (
          <select
            name="status"
            value={form.status}
            onChange={handleChange}
            className="flex-1 p-2 bg-zinc-700 rounded text-white"
            disabled={isNew}
          >
            <option value="active">Activo</option>
            <option value="inactive">Inactivo</option>
          </select>
        )}
      </div>

      {/* Botones */}
      <div className="flex gap-2 mt-4">
        {isView && (
          <button
            onClick={goToEdit}
            className="bg-blue-500 px-4 py-2 rounded text-white"
          >
            Editar
          </button>
        )}

        {!isView && (
          <button
            onClick={handleSubmit}
            className="bg-blue-600 px-4 py-2 rounded text-white"
          >
            Guardar
          </button>
        )}

        <button
          onClick={goBack}
          className="bg-zinc-600 px-4 py-2 rounded text-white"
        >
          {isView ? "Volver" : "Cancelar"}
        </button>
      </div>
    </div>
  );
}

export default CustomerCard;


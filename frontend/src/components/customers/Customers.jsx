import { useNavigate } from "react-router-dom";
import { useGetAllCustomers } from "./hooks/useGetAllCustomers";

const options = [
  { value: "active", label: "Activo" },
  { value: "inactive", label: "Inactivo" }
];

function Customers() {
  const navigate = useNavigate();

  const {
    filteredCustomers,
    customers,
    loading,
    error,
    sortField,
    sortDirection,
    handleSort,

    search,
    setSearch,

    deleteId,
    setDeleteId,
    handleDelete,

    menuRef,
    openMenuId,
    setOpenMenuId
  } = useGetAllCustomers();

  return (
    <div className="w-full h-screen overflow-hidden p-6 flex flex-col">
      {/* Cabecera */}
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Clientes</h2>

        <div className="flex items-center gap-4">
          <input
            type="text"
            placeholder="Buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-64 p-2 rounded bg-zinc-800 border border-zinc-600"
          />

          <button
            onClick={() => navigate("/customers/new")}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg"
          >
            + Nuevo cliente
          </button>
        </div>
      </div>

      {/* Errores */}
      {error && <p className="text-red-500 mb-4">{error}</p>}

      {/* Loading */}
      {loading && (
        <p className="text-zinc-400 mb-4">Cargando clientes...</p>
      )}
      <div className="overflow-y-auto flex-1 rounded-lg border border-zinc-800">
        {/* Tabla */}
        <table className="w-full text-sm">
          <thead className="bg-zinc-800 text-zinc-300 sticky top-0 z-10">
            <tr>
              <th
                className="px-4 py-2 text-left cursor-pointer select-none"
                onClick={() => handleSort("name")}
              >
                Nombre{" "}
                {sortField === "name" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("email")}
                className="px-4 py-2 cursor-pointer select-none"
              >
                Email{" "}
                {sortField === "email" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("phone")}
                className="px-4 py-2 cursor-pointer select-none"
              >
                Teléfono{" "}
                {sortField === "phone" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("address")}
                className="px-4 py-2 cursor-pointer select-none"
              >
                Dirección{" "}
                {sortField === "address" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("dni")}
                className="px-4 py-2 cursor-pointer select-none"
              >
                DNI{" "}
                {sortField === "dni" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th
                onClick={() => handleSort("status")}
                className="px-4 py-2 cursor-pointer select-none"
              >
                Estado{" "}
                {sortField === "status" &&
                  (sortDirection === "asc" ? "▲" : "▼")}
              </th>

              <th className="px-4 py-2 text-center"></th>

            </tr>
          </thead>

          <tbody className="bg-zinc-900">
            {/* Sin clientes */}
            {(!Array.isArray(customers) || customers.length === 0) && !loading && (
              <tr>
                <td colSpan="7" className="text-zinc-400 text-center py-4">
                  No hay clientes registrados
                </td>
              </tr>
            )}

            {/* Filtrados */}
            {filteredCustomers.map((c) => (
              <tr key={c.id} className="border-b border-zinc-800">
                <td className="px-4 py-3 font-medium">{c.name}</td>
                <td className="px-4 py-3 text-zinc-400">{c.email}</td>
                <td className="px-4 py-3 text-zinc-400">{c.phone}</td>
                <td className="px-4 py-3 text-zinc-400">{c.address}</td>
                <td className="px-4 py-3 text-zinc-400">{c.dni}</td>

                <td className="px-4 py-3 text-zinc-400">
                  {options.find((opt) => opt.value === c.status)?.label ||
                    c.status}
                </td>

                <td
                  className="px-2 py-3 relative w-12"
                  ref={openMenuId === c.id ? menuRef : null}
                >
                  <div className="flex justify-left">
                    <button
                      onClick={() =>
                        setOpenMenuId(openMenuId === c.id ? null : c.id)
                      }
                      className="p-2 rounded hover:bg-zinc-700"
                    >
                      ⋮
                    </button>
                  </div>

                  {openMenuId === c.id && (
                    <div className="absolute right-0 mt-2 w-32 bg-zinc-800 border border-zinc-700 rounded-lg shadow-lg z-50">
                      <button
                        onClick={() => navigate(`/customers/${c.id}`)}
                        className="block w-full text-left px-4 py-2 hover:bg-zinc-700 text-white text-sm"
                      >
                        Ver
                      </button>

                      <button
                        onClick={() => navigate(`/customers/edit/${c.id}`)}
                        className="block w-full text-left px-4 py-2 hover:bg-zinc-700 text-white text-sm"
                      >
                        Editar
                      </button>

                      <button
                        onClick={() => setDeleteId(c.id)}
                        className="block w-full text-left px-4 py-2 hover:bg-red-700 text-red-300 text-sm"
                      >
                        Eliminar
                      </button>
                    </div>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal de eliminación */}
      {deleteId && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-zinc-800 p-6 rounded-xl shadow-xl w-80">
            <h3 className="text-lg font-semibold mb-3 text-white">
              ¿Eliminar cliente?
            </h3>

            <p className="text-zinc-300 mb-6">
              Esta acción no se puede deshacer. ¿Estás seguro?
            </p>

            <div className="flex justify-end gap-3">
              <button
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-zinc-600 hover:bg-zinc-700 text-white rounded-lg"
              >
                Cancelar
              </button>

              <button
                onClick={() => {
                  handleDelete(deleteId);
                  setDeleteId(null);
                }}
                className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Customers;

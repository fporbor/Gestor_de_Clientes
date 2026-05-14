import { useHandleUserCard } from "./hooks/useHandleUserCard";

export default function UserCard() {
  const {
    fields: { user, form, editing, loading, saving, uploading, deleting, error, avatarSrc },
    handleChange,
    setEditing,
    resetForm,
    handleSave,
    handleAvatarUpload,
    handleAvatarDelete
  } = useHandleUserCard();

  if (loading) return <p>Cargando...</p>;
  if (error) return <p className="text-red-400">{error}</p>;

  return (
    <div className="w-full max-w-3xl mx-auto bg-surface-elevated border border-surface-border rounded-2xl p-8">

      <h2 className="text-2xl font-bold mb-6">Mis datos</h2>

      {/* Nombre + Avatar */}
      <div className="flex items-center justify-between mb-8">

        {/* Nombre */}
        <div className="flex flex-col w-full">
          <label className="text-sm text-text-muted mb-1">Nombre</label>

          {editing ? (
            <input
              name="name"
              value={form.name}
              onChange={handleChange}
              className="bg-zinc-700 text-white p-2 rounded w-full"
            />
          ) : (
            <span className="text-lg font-medium">{user.name}</span>
          )}
        </div>

        {/* Avatar */}
        <div className="flex flex-col items-center ml-6">
          <div className="w-24 h-24 rounded-full overflow-hidden border border-zinc-600">
            {avatarSrc ? (
                <img
                    src={avatarSrc}
                    alt="avatar"
                    className="w-full h-full object-cover"
                />
            ) : (
                // Placeholder con inicial si no hay avatar
                <div className="w-full h-full bg-zinc-700 flex items-center justify-center text-3xl font-bold text-white">
                    {user?.name?.charAt(0).toUpperCase()}
                </div>
            )}
          </div>

          {editing && (
            <div className="flex flex-col gap-2 mt-2">
              <label className="cursor-pointer bg-blue-600 hover:bg-blue-700 text-white px-3 py-1 rounded text-center text-sm">
                {uploading ? "Subiendo..." : "Cambiar"}
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => handleAvatarUpload(e.target.files[0])}
                />
              </label>

              {user.avatar && !user.avatar.includes("ui-avatars") && (
                <button
                  onClick={handleAvatarDelete}
                  disabled={deleting}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 rounded text-sm"
                >
                  {deleting ? "Eliminando..." : "Eliminar"}
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Datos no editables */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

        <div className="flex flex-col">
          <label className="text-sm text-text-muted mb-1">ID</label>
          <input value={user.id} disabled className="bg-zinc-800 text-zinc-400 p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-text-muted mb-1">Email</label>
          <input value={user.email} disabled className="bg-zinc-800 text-zinc-400 p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-text-muted mb-1">Rol</label>
          <input value={user.role} disabled className="bg-zinc-800 text-zinc-400 p-2 rounded" />
        </div>

        <div className="flex flex-col">
          <label className="text-sm text-text-muted mb-1">Activo</label>
          <input
            value={user.active ? "Sí" : "No"}
            disabled
            className="bg-zinc-800 text-zinc-400 p-2 rounded"
          />
        </div>

        <div className="flex flex-col md:col-span-2">
          <label className="text-sm text-text-muted mb-1">Fecha de creación</label>
          <input
            value={new Date(user.createdAt).toLocaleDateString("es-ES")}
            disabled
            className="bg-zinc-800 text-zinc-400 p-2 rounded"
          />
        </div>

      </div>

      {/* Botones */}
      <div className="flex justify-end gap-3 mt-4">
        {!editing ? (
          <button
            onClick={() => setEditing(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
          >
            Editar
          </button>
        ) : (
          <>
            <button
              onClick={handleSave}
              disabled={saving}
              className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded"
            >
              {saving ? "Guardando..." : "Guardar cambios"}
            </button>

            <button
              onClick={() => {
                resetForm();
                setEditing(false);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
            >
              Cancelar
            </button>
          </>
        )}
      </div>

    </div>
  );
}
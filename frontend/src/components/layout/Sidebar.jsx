import { NavLink, useNavigate } from 'react-router-dom'
import { useState, useContext } from 'react'
import { UserContext } from '../../context/UserContext'
import axios from 'axios'


const navItems = [
    { path: '/customers', label: 'Clientes', icon: '👥' },
    { path: '/audit-logs', label: 'Auditorias', icon: '📄' },
]

export default function Sidebar() {
    const navigate = useNavigate()
    const [showLogout, setShowLogout] = useState(false)
    const { user } = useContext(UserContext)

    const handleLogout = async () => {
    try {
        const token = localStorage.getItem("token")

        await axios.post("http://localhost:3400/auth/logout", {}, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        })

        localStorage.removeItem("token")
        window.location.reload()

    } catch (err) {
        console.error("Error en logout:", err)
        localStorage.removeItem("token")
        window.location.reload()
    }
}


    return (
        <aside className="w-56 min-h-screen bg-zinc-900 border-r border-zinc-800 flex flex-col py-6 px-3">
            <p className="text-white font-bold text-xl px-3 mb-8">App de Prácticas</p>

            <nav className="flex flex-col gap-1 flex-1">
                {navItems.map(({ path, label, icon }) => (
                    <NavLink
                        key={path}
                        to={path}
                        className={({ isActive }) =>
                            `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors
                            ${isActive
                                ? 'bg-zinc-700 text-white font-semibold'
                                : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                            }`
                        }
                    >
                        <span>{icon}</span>
                        <span>{label}</span>
                    </NavLink>
                ))}
            </nav>

            {/* Usuario */}
            <div className="relative">
                {user ? (
                    <>
                        {showLogout && (
                            <div>
                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-3 py-2 mb-1 rounded-lg text-sm text-red-400 hover:bg-red-900 hover:text-white transition-colors"
                                >
                                    <span>🚪</span>
                                    <span>Cerrar sesión</span>
                                </button>

                                <button
                                    onClick={() => navigate('/me')}
                                    className="w-full flex items-center gap-3 px-3 py-2 mb-1 rounded-lg text-sm hover:bg-red-900 hover:text-white transition-colors"
                                >
                                    <span>👤</span>
                                    <span>Información Personal</span>
                                </button>
                            </div>
                        )}

                        <button
                            onClick={() => setShowLogout(!showLogout)}
                            className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                        >
                            <span>👤</span>
                            <span>{user?.name || "Usuario"}</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate('/login')}
                        className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors"
                    >
                        <span>🔑</span>
                        <span>Iniciar sesión</span>
                    </button>
                )}
            </div>
        </aside>
    )
}

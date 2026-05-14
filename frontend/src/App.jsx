import { useState } from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'

import Register        from './components/users/Register'
import Login           from './components/users/Login'
import UserCard        from './components/users/card/UserCard'
import Customers       from './components/customers/Customers'
import Home            from './components/home/Home'
import ProtectedLayout from './components/layout/ProtectedLayout'
import Audit from './components/audit/Audit'
import AuditCard from './components/audit/card/AuditCard'
import CustomerAction  from './components/customers/card/CustomerCard' //Cambiar ruta CRUD del customers

function App() {
    const [token, setToken] = useState(localStorage.getItem('token'))

    return (
        <div className="bg-primary text-primary-text w-screen min-h-screen">
                    <Routes>

                        {/* HOME */}
                        <Route
                            path="/"
                            element={
                                token
                                    ? <ProtectedLayout><Home /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />

                        {/* LISTA DE CLIENTES */}
                        <Route
                            path="/customers"
                            element={
                                token
                                    ? <ProtectedLayout><Customers /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />

                        {/* NUEVO CLIENTE */}
                        <Route
                            path="/customers/new"
                            element={
                                token
                                    ? <ProtectedLayout><CustomerAction editMode={false} /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />

                        {/* VER CLIENTE */} 
                        <Route
                            path="/customers/:id"
                            element={
                                token
                                    ? <ProtectedLayout><CustomerAction editMode={false} /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />

                        {/* EDITAR CLIENTE */}
                        <Route
                            path="/customers/edit/:id"
                            element={
                                token
                                    ? <ProtectedLayout><CustomerAction editMode={true} /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />

                        {/* PERFIL (ver y editar en el mismo componente) */}
                        <Route
                            path="/me"
                            element={
                                token
                                    ? <ProtectedLayout><UserCard /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />
                        {/* VER AUDITORIAS */}
                        <Route
                            path="/audit-logs"
                            element={
                                token
                                    ? <ProtectedLayout><Audit /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />
                        {/* DETALLES AUDITORIA */}
                        <Route
                            path="/audit-logs/:id"
                            element={
                                token
                                    ? <ProtectedLayout><AuditCard /></ProtectedLayout>
                                    : <Navigate to="/login" />
                            }
                        />
                        {/* LOGIN / REGISTER */}
                        <Route
                            path="/login"
                            element={token ? <Navigate to="/" /> : <Login setToken={setToken} />}
                        />

                        <Route
                            path="/register"
                            element={token ? <Navigate to="/" /> : <Register setToken={setToken} />}
                        />

                        {/* DEFAULT */}
                        <Route
                            path="*"
                            element={<Navigate to={token ? "/" : "/login"} />}
                        />

                    </Routes>
        </div>
    )
}

export default App



import Sidebar from './Sidebar'

export default function ProtectedLayout({ children }) {
    return (
        <div className="flex h-screen overflow-hidden">
            <Sidebar />
            <main className="flex-1 overflow-hidden">
                {children}
            </main>
        </div>
    )
}
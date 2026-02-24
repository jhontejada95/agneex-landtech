import './Sidebar.css'

const navItems = [
    { id: 'hitl', icon: '⚡', label: 'Revisión HITL' },
    { id: 'expedients', icon: '📂', label: 'Expedientes' },
    { id: 'blockchain', icon: '🔗', label: 'Blockchain' },
    { id: 'settings', icon: '⚙️', label: 'Configuración' },
]

export default function Sidebar({ activeView, onNavigate }) {
    return (
        <aside className="sidebar glass">
            <div className="sidebar-logo">
                <span className="logo-mark">A</span>
                <span className="logo-text">LandTech</span>
            </div>
            <nav className="sidebar-nav">
                {navItems.map((item) => (
                    <button
                        key={item.id}
                        className={`nav-item ${activeView === item.id ? 'active' : ''}`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <span className="nav-icon">{item.icon}</span>
                        <span className="nav-label">{item.label}</span>
                    </button>
                ))}
            </nav>
            <div className="sidebar-footer">
                <div className="user-avatar">JT</div>
                <div className="user-info">
                    <p className="user-name">Experto Jurídico</p>
                    <p className="user-role">Revisión HITL</p>
                </div>
            </div>
        </aside>
    )
}

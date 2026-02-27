import React from 'react';
import { LayoutDashboard, UploadCloud, FolderOpen, Link, Settings, User, LogOut, ShieldAlert } from 'lucide-react';
import './Sidebar.css';

const navItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Panel Control' },
    { id: 'ingesta', icon: UploadCloud, label: 'Ingesta Docs' },
    { id: 'hitl', icon: ShieldAlert, label: 'Revisión HITL' },
    { id: 'expedients', icon: FolderOpen, label: 'Expedientes' },
    { id: 'blockchain', icon: Link, label: 'Blockchain' },
    { id: 'settings', icon: Settings, label: 'Configuración' },
];

export default function Sidebar({ activeView, onNavigate, user, onLogout }) {
    if (!user) return null;

    const filteredNavItems = navItems.filter(item => {
        if (!user.role || user.role === 'Admin') return true;
        if (user.role === 'Analyst') {
            return item.id !== 'settings';
        }
        if (user.role === 'Client') {
            return ['dashboard', 'expedients', 'blockchain'].includes(item.id);
        }
        return true;
    });

    return (
        <aside className="sidebar glass border-r-0 rounded-none w-80 flex flex-col">
            <div className="sidebar-logo flex items-center p-8">
                <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center mr-3 shadow-glow">
                    <span className="text-white font-black text-xl leading-none">A</span>
                </div>
                <span className="text-2xl font-black text-main tracking-tighter uppercase">Agneex LandTech</span>
            </div>

            <nav className="flex-1 px-4 space-y-2 overflow-y-auto">
                {filteredNavItems.map((item) => (
                    <button
                        key={item.id}
                        className={`w-full flex items-center px-4 py-4 rounded-2xl transition-all duration-300 font-bold group ${activeView === item.id
                            ? 'bg-indigo-500/10 text-indigo-500 shadow-glow border-2 border-indigo-500/20'
                            : 'text-dim hover:bg-white/5 border-2 border-transparent hover:text-main'
                            }`}
                        onClick={() => onNavigate(item.id)}
                    >
                        <item.icon className={`w-5 h-5 mr-4 transition-transform group-hover:scale-110 ${activeView === item.id ? 'text-indigo-500' : 'text-dim'}`} />
                        <span className="text-sm tracking-tight">{item.label}</span>
                    </button>
                ))}
            </nav>

            <div className="p-6 mt-auto">
                <div className="glass p-4 flex flex-col gap-4 bg-indigo-500/5 border border-transparent hover:border-indigo-500/20 transition-all">
                    <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xs shadow-glow">
                            {user.name ? user.name.split(' ').map(n => n[0]).join('') : 'U'}
                        </div>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-main font-bold text-sm truncate">{user.name || 'Usuario'}</p>
                            <p className="text-[10px] text-dim font-black uppercase tracking-widest">{user.role || user.tier}</p>
                        </div>
                    </div>
                    <button
                        onClick={onLogout}
                        className="w-full flex items-center justify-center gap-2 py-2 rounded-xl bg-red-500/10 text-red-500 hover:bg-red-500/20 transition-all font-bold text-xs"
                    >
                        <LogOut size={14} /> CERRAR SESIÓN
                    </button>
                </div>
            </div>
        </aside>
    );
}

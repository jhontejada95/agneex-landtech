import React from 'react';
import { User, CreditCard, BarChart3, Settings, LogOut, ShieldCheck, Zap, Globe, FileText, ChevronRight } from 'lucide-react';

const UserDashboard = ({ user, onLogout, onNavigate }) => {
    const docsUsed = user?.docsUsed || 0;
    const docsLimit = user?.docsLimit || (user?.plan === 'starter' ? 3 : 100);
    const tier = user?.tier || user?.plan || 'starter';
    const usagePercentage = (docsUsed / docsLimit) * 100;

    const stats = [
        { label: 'Ingestas Realizadas', value: docsUsed, icon: FileText, color: 'text-indigo-500' },
        { label: 'Blockchain Notaria', value: 12, icon: ShieldCheck, color: 'text-emerald-500' },
        { label: 'Tier Actual', value: tier, icon: Zap, color: 'text-amber-500' },
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div>
                    <h1 className="text-3xl font-black text-main tracking-tighter uppercase">Panel de Control</h1>
                    <p className="text-dim font-medium">Gestiona tu suscripción y monitorea el uso de la IA</p>
                </div>
                <div className="flex items-center gap-4">
                    <button
                        onClick={() => onNavigate('ingesta')}
                        className="px-6 py-3 btn-pill btn-primary text-sm"
                    >
                        NUEVO ANÁLISIS <Zap className="ml-2 w-4 h-4 fill-current" />
                    </button>
                    <button
                        onClick={onLogout}
                        className="p-3 glass rounded-2xl text-dim hover:text-red-500 transition-colors border-transparent"
                    >
                        <LogOut className="w-6 h-6" />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {stats.map((stat, idx) => (
                    <div key={idx} className="glass p-8 space-y-4 relative overflow-hidden group">
                        <div className={`p-3 rounded-2xl glass w-fit ${stat.color} shadow-glow`}>
                            <stat.icon className="w-6 h-6" />
                        </div>
                        <div>
                            <p className="text-xs font-black uppercase tracking-widest text-dim">{stat.label}</p>
                            <p className="text-3xl font-black text-main mt-1 tracking-tighter">{stat.value}</p>
                        </div>
                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <stat.icon className="w-20 h-20" />
                        </div>
                    </div>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Usage Card */}
                <div className="glass p-8 space-y-8">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-main flex items-center tracking-tighter">
                            <BarChart3 className="w-6 h-6 mr-3 text-indigo-500" /> CONSUMO DE RECURSOS
                        </h3>
                        <span className="text-xs font-black px-3 py-1 glass rounded-full text-indigo-500 border-indigo-500/20">
                            TIER {String(tier).toUpperCase()}
                        </span>
                    </div>

                    <div className="space-y-4">
                        <div className="flex justify-between text-xs font-black uppercase tracking-widest text-dim">
                            <span>Documentos IA</span>
                            <span className="text-main">{user.docsUsed} / {user.docsLimit}</span>
                        </div>
                        <div className="w-full h-4 glass-inset rounded-full overflow-hidden p-1">
                            <div
                                className="h-full bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full transition-all duration-1000 shadow-glow"
                                style={{ width: `${usagePercentage}%` }}
                            ></div>
                        </div>
                        <p className="text-sm text-dim font-medium italic">
                            Has utilizado el {usagePercentage.toFixed(1)}% de tu cupo mensual.
                        </p>
                    </div>

                    <button className="w-full py-4 glass text-indigo-500 font-bold rounded-2xl hover:bg-indigo-500/5 transition-all flex items-center justify-center border-indigo-500/20">
                        AUMENTAR CUPO (UPGRADE) <ChevronRight className="ml-2 w-5 h-5" />
                    </button>
                </div>

                {/* Billing / Subscription */}
                <div className="glass p-8 space-y-8 bg-gradient-to-br from-indigo-500/5 to-transparent">
                    <div className="flex items-center justify-between">
                        <h3 className="text-xl font-black text-main flex items-center tracking-tighter">
                            <CreditCard className="w-6 h-6 mr-3 text-indigo-500" /> FACTURACIÓN
                        </h3>
                    </div>

                    <div className="space-y-6">
                        <div className="flex items-center p-4 glass-inset rounded-2xl group cursor-pointer hover:border-indigo-500/20 transition-all border-transparent">
                            <div className="p-3 rounded-xl glass mr-4">
                                <Zap className="w-5 h-5 text-amber-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-main font-bold">Plan Professional</p>
                                <p className="text-xs text-dim">$49.00 USD / Mes</p>
                            </div>
                            <span className="text-xs font-black text-emerald-500 uppercase px-3 py-1 glass rounded-full border-emerald-500/20">Activo</span>
                        </div>

                        <div className="flex items-center p-4 glass-inset rounded-2xl group cursor-pointer hover:border-indigo-500/20 transition-all border-transparent">
                            <div className="p-3 rounded-xl glass mr-4">
                                <Globe className="w-5 h-5 text-indigo-500" />
                            </div>
                            <div className="flex-1">
                                <p className="text-main font-bold">Unico Análisis (Código)</p>
                                <p className="text-xs text-dim">$15.00 USD / Doc</p>
                            </div>
                            <div className="p-2 glass rounded-lg text-dim group-hover:text-indigo-500 transition-colors">
                                <ChevronRight className="w-5 h-5" />
                            </div>
                        </div>
                    </div>

                    <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10">
                        <p className="text-xs text-dim text-center font-medium">Próximo cobro: 26 de Marzo, 2025</p>
                    </div>
                </div>
            </div>

            {/* Strategic Opportunities Layer */}
            <div className="glass p-8 space-y-6 border-indigo-500/20 bg-gradient-to-r from-indigo-500/5 to-transparent">
                <div className="flex items-center justify-between">
                    <h3 className="text-xl font-black text-main flex items-center tracking-tighter">
                        <ShieldCheck className="w-6 h-6 mr-3 text-indigo-500" /> OPORTUNIDADES ESTRATÉGICAS (CAPEX)
                    </h3>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-dim animate-pulse italic">Análisis IA en tiempo real</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    <div className="p-4 glass-inset rounded-2xl border-emerald-500/20 group cursor-pointer hover:bg-emerald-500/5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-emerald-500 uppercase px-2 py-0.5 glass rounded-full border-emerald-500/20">Alta Viabilidad ROI</span>
                            <span className="text-xs font-mono text-dim">#0042</span>
                        </div>
                        <p className="text-sm font-bold text-main">Predio "La Esperanza" - Zona A</p>
                        <p className="text-[10px] text-dim mt-1 uppercase">Viabilidad CAPEX: 94%</p>
                    </div>
                    <div className="p-4 glass-inset rounded-2xl border-indigo-500/10 group cursor-pointer hover:bg-indigo-500/5 transition-all">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-indigo-500 uppercase px-2 py-0.5 glass rounded-full border-indigo-500/10">Baja Fricción Legal</span>
                            <span className="text-xs font-mono text-dim">#0038</span>
                        </div>
                        <p className="text-sm font-bold text-main">Sector Industrial Perímetro Norte</p>
                        <p className="text-[10px] text-dim mt-1 uppercase">Viabilidad CAPEX: 88%</p>
                    </div>
                    <div className="p-4 glass-inset rounded-2xl border-amber-500/10 group opacity-60">
                        <div className="flex justify-between items-start mb-2">
                            <span className="text-[10px] font-black text-amber-500 uppercase px-2 py-0.5 glass rounded-full border-amber-500/10">Revisión Estratégica</span>
                            <span className="text-xs font-mono text-dim">#0045</span>
                        </div>
                        <p className="text-sm font-bold text-main">Desarrollo Logístico Sur</p>
                        <p className="text-[10px] text-dim mt-1 uppercase">Viabilidad CAPEX: 62%</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default UserDashboard;

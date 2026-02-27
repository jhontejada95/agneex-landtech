import React from 'react';
import { Box, Globe, Shield, Activity, HardHat, Layers, Maximize2, Move } from 'lucide-react';

const GemeloDigital = ({ record, onBack }) => {
    if (!record) return null;

    const bimData = record.bim_metadata ? JSON.parse(record.bim_metadata) : {};

    return (
        <div className="w-full max-w-6xl mx-auto p-6 space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <button
                        onClick={onBack}
                        className="p-3 glass rounded-2xl text-dim hover:text-indigo-500 transition-colors"
                    >
                        <Move className="w-6 h-6 rotate-180" />
                    </button>
                    <div>
                        <h1 className="text-3xl font-black text-main tracking-tighter uppercase">Gemelo Digital (Twin)</h1>
                        <p className="text-dim font-medium uppercase text-xs tracking-widest flex items-center gap-2">
                            Expediente #{record.id} <span className="text-indigo-500">•</span> {record.document_name}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-3">
                    <span className="px-4 py-2 glass rounded-full text-xs font-black text-emerald-500 border-emerald-500/20">
                        WEB3 VERIFIED
                    </span>
                    <span className="px-4 py-2 glass rounded-full text-xs font-black text-indigo-500 border-indigo-500/20 uppercase tracking-widest">
                        BIM / GIS ACTIVATED
                    </span>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Visualizer Panel (Main) */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="glass aspect-video relative overflow-hidden group rounded-3xl border-indigo-500/10">
                        {/* Simulation of a 3D/BIM Visualizer */}
                        <div className="absolute inset-0 bg-gradient-to-br from-indigo-900/40 to-transparent flex flex-col items-center justify-center">
                            <Box className="w-32 h-32 text-indigo-500/20 group-hover:scale-110 transition-transform duration-700" />
                            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
                                <p className="text-indigo-400 font-black text-sm uppercase tracking-[0.3em] opacity-40">BIM ENVIRONMENT 3D</p>
                            </div>

                            {/* Grid Overlay */}
                            <div className="absolute inset-0 opacity-10 pointer-events-none"
                                style={{ backgroundImage: 'linear-gradient(#6366f1 1px, transparent 1px), linear-gradient(90deg, #6366f1 1px, transparent 1px)', size: '20px 20px' }}>
                            </div>

                            {/* Simulation of HUD elements */}
                            <div className="absolute top-6 left-6 space-y-2">
                                <div className="p-3 glass rounded-xl border-white/5 bg-indigo-500/5">
                                    <p className="text-[10px] font-black text-dim tracking-tighter uppercase mb-2">INFRAESTRUCTURA BIM</p>
                                    <div className="flex items-center gap-4">
                                        <div className="flex flex-col">
                                            <span className="text-xs text-main font-black">ÁREA: {bimData.projected_area || '450m2'}</span>
                                            <span className="text-[10px] text-dim">{bimData.project_type || 'Industrial'}</span>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Controls Simulation */}
                        <div className="absolute bottom-6 left-6 right-6 flex items-center justify-between">
                            <div className="flex gap-2">
                                <button className="p-3 glass rounded-xl hover:text-indigo-500 transition-all"><Move className="w-5 h-5" /></button>
                                <button className="p-3 glass rounded-xl hover:text-indigo-500 transition-all"><Maximize2 className="w-5 h-5" /></button>
                                <button className="p-3 glass rounded-xl hover:text-indigo-500 transition-all"><Layers className="w-5 h-5" /></button>
                            </div>
                            <div className="flex items-center gap-2 px-3 py-1.5 glass rounded-xl border-emerald-500/20">
                                <div className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse shadow-glow"></div>
                                <span className="text-[10px] font-black text-emerald-500 uppercase">SIN COLISIONES GIS</span>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-6">
                        <div className="glass p-6 space-y-3">
                            <h4 className="flex items-center text-xs font-black tracking-widest text-dim uppercase">
                                <Globe className="w-4 h-4 mr-2 text-indigo-500" /> Coordenadas GIS
                            </h4>
                            <div className="space-y-1">
                                <p className="text-sm font-mono text-main tracking-tight">Lat: 4.5709° N</p>
                                <p className="text-sm font-mono text-main tracking-tight">Long: 74.2973° W</p>
                            </div>
                        </div>
                        <div className="glass p-6 space-y-3">
                            <h4 className="flex items-center text-xs font-black tracking-widest text-dim uppercase">
                                <Shield className="w-4 h-4 mr-2 text-emerald-500" /> Estado UPME
                            </h4>
                            <p className="text-sm font-black text-indigo-500 uppercase">{record.upme_clearance_status}</p>
                        </div>
                    </div>
                </div>

                {/* Sidebar Stats */}
                <div className="space-y-6">
                    {/* CAPEX CARD */}
                    <div className="glass p-8 bg-gradient-to-br from-indigo-500/10 to-transparent border-indigo-500/20 relative overflow-hidden group">
                        <div className="absolute -right-4 -top-4 opacity-5 group-hover:opacity-10 transition-opacity">
                            <Activity className="w-32 h-32" />
                        </div>

                        <div className="flex flex-col items-center text-center space-y-4">
                            <div className="p-4 glass rounded-3xl text-indigo-500 shadow-glow mb-2">
                                <HardHat className="w-8 h-8" />
                            </div>
                            <div>
                                <h3 className="text-xs font-black text-dim tracking-[0.2em] uppercase">Viabilidad CAPEX</h3>
                                <div className="text-5xl font-black text-main my-2 tracking-tighter">
                                    {Math.round(record.capex_score * 100)}%
                                </div>
                                <p className={`text-xs font-black uppercase px-4 py-1.5 rounded-full inline-block ${record.capex_score > 0.8 ? 'text-emerald-500 glass border-emerald-500/20' : 'text-amber-500 glass border-amber-500/20'
                                    }`}>
                                    {record.opportunity_tag || 'En Revisión'}
                                </p>
                            </div>
                        </div>
                    </div>

                    {/* Infrastructure Summary */}
                    <div className="glass p-8 space-y-6 border-indigo-500/10">
                        <h3 className="text-sm font-black text-main flex items-center uppercase tracking-tighter leading-none">
                            <Layers className="w-5 h-5 mr-3 text-indigo-500" /> Resumen del Proyecto
                        </h3>

                        <div className="space-y-4">
                            <div className="flex justify-between items-center p-3 glass-inset rounded-2xl border-transparent hover:border-indigo-500/10 transition-all">
                                <span className="text-[10px] font-black text-dim uppercase">Inversión Estimada</span>
                                <span className="text-xs font-black text-main">{bimData.estimated_capex || 'USD 1.2M'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 glass-inset rounded-2xl border-transparent hover:border-indigo-500/10 transition-all">
                                <span className="text-[10px] font-black text-dim uppercase">Tipo de Activo</span>
                                <span className="text-xs font-black text-main">{bimData.project_type || 'Industrial'}</span>
                            </div>
                            <div className="flex justify-between items-center p-3 glass-inset rounded-2xl border-transparent hover:border-indigo-500/10 transition-all">
                                <span className="text-[10px] font-black text-dim uppercase">Integración BIM</span>
                                <span className="text-[10px] font-black text-emerald-500 uppercase px-2 py-0.5 glass rounded-full border-emerald-500/20">ACTIVA</span>
                            </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-indigo-500/5 space-y-2">
                            <p className="text-[10px] text-dim font-black uppercase">Prueba de Inmutabilidad</p>
                            <p className="text-[9px] font-mono text-indigo-400 break-all opacity-60">
                                {record.blockchain_tx_hash || 'PENDIENTE_NOTARIZACION'}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GemeloDigital;

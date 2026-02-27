import React, { useState, useEffect } from 'react';
import { Database, FileText, AlertTriangle, CheckCircle, Search, RefreshCw, Globe } from 'lucide-react';

const Expedientes = ({ onViewTwin }) => {
    const [expedientes, setExpedientes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [errorMsg, setErrorMsg] = useState(null);

    const fetchExpedientes = async () => {
        setIsLoading(true);
        setErrorMsg(null);
        try {
            const response = await fetch('http://127.0.0.1:8000/v1/expedientes');
            if (!response.ok) throw new Error("Fallo al obtener datos del servidor.");
            const data = await response.json();
            setExpedientes(data);
        } catch (error) {
            console.error(error);
            setErrorMsg("No se pudo conectar con la base de datos.");
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchExpedientes();
    }, []);

    return (
        <div className="w-full h-full p-8 animate-fade-in text-slate-200">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Database className="w-8 h-8 mr-3 text-indigo-400" />
                        Registro de Expedientes
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Historial de documentos procesados por el motor de análisis y sus resultados.
                    </p>
                </div>
                <button
                    onClick={fetchExpedientes}
                    className="flex items-center px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            {errorMsg ? (
                <div className="p-4 rounded-lg bg-red-500/10 border border-red-500/30 text-red-300 flex items-center">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    {errorMsg}
                </div>
            ) : (
                <div className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md overflow-hidden relative shadow-2xl">
                    <div className="flex bg-slate-900/50 p-4 border-b border-white/10 items-center">
                        <div className="relative w-64">
                            <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" />
                            <input
                                type="text"
                                placeholder="Buscar entidad..."
                                className="w-full bg-slate-800/50 border border-slate-700 rounded-lg pl-9 pr-4 py-2 text-sm focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600 text-slate-200"
                            />
                        </div>
                    </div>

                    <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                            <thead>
                                <tr className="border-b border-slate-700/50 bg-slate-800/20 text-xs uppercase tracking-wider text-slate-400">
                                    <th className="px-6 py-4 font-medium">ID</th>
                                    <th className="px-6 py-4 font-medium">Documento</th>
                                    <th className="px-6 py-4 font-medium">Entidad</th>
                                    <th className="px-6 py-4 font-medium">Tipo</th>
                                    <th className="px-6 py-4 font-medium">Score</th>
                                    <th className="px-6 py-4 font-medium">Estado UPME</th>
                                    <th className="px-6 py-4 font-medium">Estado (HITL)</th>
                                    <th className="px-6 py-4 font-medium text-amber-400">Capex Viability</th>
                                    <th className="px-6 py-4 font-medium text-indigo-400">Gemelo Digital</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-800/50">
                                {isLoading ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                            Cargando expedientes desde SQLite...
                                        </td>
                                    </tr>
                                ) : expedientes.length === 0 ? (
                                    <tr>
                                        <td colSpan="7" className="px-6 py-12 text-center text-slate-500">
                                            Aún no hay documentos procesados. Usa el Módulo de Ingesta para comenzar.
                                        </td>
                                    </tr>
                                ) : (
                                    expedientes.map((exp) => (
                                        <tr key={exp.id} className="hover:bg-white/5 transition-colors cursor-pointer group">
                                            <td className="px-6 py-4 text-xs font-mono text-slate-500 group-hover:text-indigo-400">
                                                #{String(exp.id).padStart(4, '0')}
                                            </td>
                                            <td className="px-6 py-4 font-medium text-slate-300 flex items-center">
                                                <FileText className="w-4 h-4 mr-2 text-slate-500" />
                                                <span className="truncate max-w-[200px]" title={exp.document_name}>{exp.document_name}</span>
                                            </td>
                                            <td className="px-6 py-4 text-slate-300">
                                                {exp.entity_identified}
                                            </td>
                                            <td className="px-6 py-4 text-sm text-slate-400">
                                                {exp.document_type}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center">
                                                    <div className="w-16 h-1.5 bg-slate-800 rounded-full mr-2 overflow-hidden">
                                                        <div
                                                            className={`h-full ${exp.confidence_score > 0.8 ? 'bg-green-500' : 'bg-yellow-500'}`}
                                                            style={{ width: `${exp.confidence_score * 100}%` }}
                                                        ></div>
                                                    </div>
                                                    <span className="text-xs text-slate-400">{Math.round(exp.confidence_score * 100)}%</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {exp.upme_clearance_status === "INTERSECCION_DETECTADA" ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-orange-500/10 text-orange-400 border border-orange-500/20">
                                                        <AlertTriangle className="w-3 h-3 mr-1" /> Riesgo
                                                    </span>
                                                ) : exp.upme_clearance_status === "LIBRE_DE_EXCLUSION" ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> Limpio
                                                    </span>
                                                ) : (
                                                    <span className="text-xs text-slate-500">-</span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                {exp.requires_human_review ? (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                                        <AlertTriangle className="w-3 h-3 mr-1" />
                                                        Revisión Pendiente
                                                    </span>
                                                ) : (
                                                    <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-500/10 text-green-400 border border-green-500/20">
                                                        <CheckCircle className="w-3 h-3 mr-1" />
                                                        Alineado
                                                    </span>
                                                )}
                                            </td>
                                            <td className="px-6 py-4">
                                                <div className="flex flex-col gap-1">
                                                    <div className="flex items-center">
                                                        <div className="w-16 h-1.5 bg-slate-800 rounded-full mr-2 overflow-hidden">
                                                            <div
                                                                className={`h-full ${exp.capex_score > 0.8 ? 'bg-indigo-500' : 'bg-amber-500'}`}
                                                                style={{ width: `${exp.capex_score * 100}%` }}
                                                            ></div>
                                                        </div>
                                                        <span className="text-xs text-white font-bold">{Math.round(exp.capex_score * 100)}%</span>
                                                    </div>
                                                    <span className="text-[10px] text-slate-500 uppercase tracking-tighter">{exp.opportunity_tag}</span>
                                                </div>
                                            </td>
                                            <td className="px-6 py-4">
                                                {exp.is_twin_ready ? (
                                                    <button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            onViewTwin(exp);
                                                        }}
                                                        className="inline-flex items-center px-2.5 py-1rounded-full text-[10px] font-bold bg-indigo-500 text-white hover:bg-indigo-600 transition-all shadow-glow-sm"
                                                    >
                                                        <Globe className="w-3 h-3 mr-1" />
                                                        ABRIR TWIN
                                                    </button>
                                                ) : (
                                                    <span className="text-[10px] text-slate-600 italic">No disponible</span>
                                                )}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Expedientes;

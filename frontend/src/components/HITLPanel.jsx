import React, { useState, useEffect } from 'react';
import { AlertTriangle, CheckCircle, Eye, CornerUpRight, MapPin, XCircle, FileDigit, ShieldAlert, ShieldCheck, Loader2, Globe } from 'lucide-react';
import { UPME_CATEGORIES_LABELS, API_BASE_URL } from '../constants';

const HITLPanel = ({ data, onReset }) => {
    const [upmeData, setUpmeData] = useState(null);
    const [loadingUpme, setLoadingUpme] = useState(true);
    const [notarizeStatus, setNotarizeStatus] = useState('idle'); // 'idle' | 'loading' | 'success' | 'error'
    const [blockchainTx, setBlockchainTx] = useState(null);
    const [errorMessage, setErrorMessage] = useState(null);

    useEffect(() => {
        if (data?.record_id) {
            setLoadingUpme(true);
            setErrorMessage(null);
            fetch(`${API_BASE_URL}/v1/upme-check/${data.record_id}`)
                .then(res => res.json())
                .then(resData => {
                    setUpmeData(resData);
                    setLoadingUpme(false);
                })
                .catch(err => {
                    console.error(err);
                    setLoadingUpme(false);
                });
        }
    }, [data]);

    const handleNotarize = async () => {
        if (!data?.record_id) return;
        setNotarizeStatus('loading');
        setErrorMessage(null);
        try {
            const res = await fetch(`${API_BASE_URL}/v1/notarize/${data.record_id}`, {
                method: 'POST'
            });
            const resData = await res.json();
            if (res.ok) {
                setBlockchainTx(resData);
                setNotarizeStatus('success');
            } else {
                throw new Error(resData.detail || "Error en notarización");
            }
        } catch (err) {
            console.error(err);
            setNotarizeStatus('error');
            setErrorMessage(err.message);
        }
    };

    if (!data || !data.hitl_alert) return null;

    const { analysis_summary: summary, hitl_alert: alert } = data;

    return (
        <div className="w-full max-w-5xl mx-auto p-6 animate-fade-in mt-6">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white flex items-center">
                        Resultados de Análisis del Servidor (FastAPI)
                        <span className="ml-3 text-xs font-semibold px-2 py-1 bg-indigo-500/20 text-indigo-300 rounded-full border border-indigo-500/30">
                            Score: {Math.round(summary.confidence_score * 100)}%
                        </span>
                    </h2>
                    <p className="text-slate-400 mt-1">Nombre Orig.: {data.document_name} <span className="text-slate-600 text-xs ml-2">(ID: #{data.record_id})</span></p>
                </div>
                <button onClick={onReset} className="text-sm px-4 py-2 border border-slate-600 hover:border-slate-400 text-slate-300 hover:text-white rounded-lg transition-colors backdrop-blur-sm bg-slate-800/50">
                    Procesar Otro Archivo
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* Columna Izquierda: Metadata básica y UPME */}
                <div className="col-span-1 space-y-6">
                    <div className="p-5 rounded-xl border border-white/10 bg-white/5 backdrop-blur-md">
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Entidad Extraída</h3>
                        <div className="flex items-center text-slate-200 font-medium">
                            <MapPin className="w-5 h-5 text-indigo-400 mr-2 flex-shrink-0" />
                            <span className="truncate" title={summary.entity_identified}>{summary.entity_identified}</span>
                        </div>

                        <div className="mt-6">
                            <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-3">Clasificación Base</h3>
                            <p className="text-slate-300">{summary.document_type}</p>
                        </div>

                        {summary.file_size && (
                            <div className="mt-6 pt-4 border-t border-white/10">
                                <div className="flex items-center text-slate-400 text-sm">
                                    <FileDigit className="w-4 h-4 mr-2 text-slate-400" />
                                    Payload Verificado ({summary.file_size})
                                </div>
                            </div>
                        )}
                    </div>

                    {/* Widget UPME */}
                    <div className="p-5 rounded-xl border border-sky-500/20 bg-sky-900/10 backdrop-blur-md relative overflow-hidden group">
                        <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm group-hover:blur-none transition-all duration-500 pointer-events-none">
                            <Globe className="w-24 h-24 text-sky-400" />
                        </div>
                        <h3 className="text-sm uppercase tracking-wider text-sky-400/80 font-semibold mb-4 flex items-center">
                            <Globe className="w-4 h-4 mr-2" /> Cartografía UPME
                        </h3>

                        {loadingUpme ? (
                            <div className="flex items-center text-sky-300/70 text-sm py-2">
                                <Loader2 className="w-5 h-5 mr-3 animate-spin text-sky-400" /> Consultando Bases GIS...
                            </div>
                        ) : upmeData ? (
                            <div className="animate-fade-in-up">
                                {upmeData.upme_status === "INTERSECCION_DETECTADA" ? (
                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center text-orange-400 font-medium text-lg">
                                            <ShieldAlert className="w-6 h-6 mr-2" /> Zona de Exclusión
                                        </div>
                                        <p className="text-slate-300 text-sm pr-4">
                                            {upmeData.message}
                                        </p>
                                    </div>
                                ) : (
                                    <div className="space-y-3 relative z-10">
                                        <div className="flex items-center text-emerald-400 font-medium text-lg">
                                            <ShieldCheck className="w-6 h-6 mr-2" /> Libre de Exclusión
                                        </div>
                                        <p className="text-slate-300 text-sm pr-4">
                                            {upmeData.message}
                                        </p>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="text-slate-500 text-sm">No se pudo consultar UPME.</div>
                        )}
                    </div>

                    {/* Checklist LegalTech Dinámico (Categorías UPME) */}
                    <div className="p-5 rounded-xl border border-white/5 bg-white/5 backdrop-blur-md">
                        <h3 className="text-sm uppercase tracking-wider text-slate-500 font-semibold mb-4">Checklist de Validación Selección</h3>
                        <div className="space-y-3 max-h-60 overflow-y-auto pr-2 custom-scrollbar">
                            {data.validations && data.validations.length > 0 ? (
                                data.validations.map((val, idx) => {
                                    const label = UPME_CATEGORIES_LABELS[val.id] || val.id;
                                    return (
                                        <div key={idx} className="flex flex-col space-y-1 mb-2">
                                            <div className="flex items-center justify-between text-xs">
                                                <span className="text-slate-400 font-medium">{label}</span>
                                                {val.status === "pass" ? (
                                                    <span className="flex items-center text-emerald-500 font-bold">
                                                        <CheckCircle className="w-3 h-3 mr-1" /> OK
                                                    </span>
                                                ) : (
                                                    <span className="flex items-center text-red-500 font-bold uppercase tracking-tighter">
                                                        <AlertTriangle className="w-3 h-3 mr-1" /> REVISAR
                                                    </span>
                                                )}
                                            </div>
                                            {val.status !== "pass" && (
                                                <p className="text-[10px] text-red-400/80 italic pl-1">
                                                    {val.message}
                                                </p>
                                            )}
                                        </div>
                                    );
                                })
                            ) : (
                                <p className="text-xs text-slate-500 italic">No se seleccionaron categorías adicionales.</p>
                            )}
                        </div>
                    </div>
                </div>

                {/* Columna Derecha: Alerta HITL u Obstáculo UPME */}
                <div className="col-span-1 md:col-span-2">
                    {alert.requires_human_review ? (
                        <div className="p-6 rounded-xl border border-red-500/30 bg-red-500/10 backdrop-blur-sm shadow-[0_0_30px_rgba(239,68,68,0.1)] relative overflow-hidden h-full">
                            <div className="absolute top-0 left-0 w-1 h-full bg-red-500 shadow-[0_0_10px_rgba(239,68,68,1)]"></div>

                            <div className="flex flex-col h-full justify-between">
                                <div className="flex items-start mb-6">
                                    <div className="p-2 bg-red-500/20 rounded-lg mr-4 border border-red-500/30">
                                        <AlertTriangle className="w-6 h-6 text-red-400 animate-pulse" />
                                    </div>
                                    <div>
                                        <div className="flex items-center mb-1">
                                            <h3 className="text-lg font-bold text-red-50">{alert.alert_type.replace('_', ' ')}</h3>
                                            <span className="ml-3 text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 bg-red-500/20 text-red-300 rounded border border-red-500/40">
                                                High Severity
                                            </span>
                                        </div>
                                        <p className="text-red-200/80 leading-relaxed">
                                            {alert.description}
                                        </p>
                                    </div>
                                </div>

                                <div className="flex space-x-3 mt-auto">
                                    <button className="flex-1 flex justify-center items-center py-2.5 px-4 bg-red-600 hover:bg-red-500 text-white rounded-lg font-medium transition-colors shadow-lg">
                                        <CornerUpRight className="w-4 h-4 mr-2" />
                                        Revisar Linderos
                                    </button>
                                    <button className="flex-1 flex justify-center items-center py-2.5 px-4 bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-600 rounded-lg font-medium transition-colors">
                                        <CheckCircle className="w-4 h-4 mr-2" />
                                        Forzar Aprobación
                                    </button>
                                    <button onClick={onReset} className="flex items-center justify-center p-2.5 bg-slate-800 hover:bg-slate-700 text-slate-400 hover:text-red-400 border border-slate-600 rounded-lg transition-colors">
                                        <XCircle className="w-5 h-5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ) : upmeData?.upme_status === "INTERSECCION_DETECTADA" ? (
                        <div className="p-8 rounded-xl border border-orange-500/30 bg-orange-500/10 flex flex-col items-center justify-center text-center h-full relative overflow-hidden backdrop-blur-sm shadow-[0_0_30px_rgba(249,115,22,0.1)]">
                            <div className="absolute top-0 left-0 w-1 h-full bg-orange-500 shadow-[0_0_10px_rgba(249,115,22,1)]"></div>
                            <ShieldAlert className="w-16 h-16 text-orange-400 mb-4" />
                            <h3 className="text-2xl font-bold text-white mb-2">Revisión Geográfica Requerida</h3>
                            <p className="text-slate-300 max-w-md">El documento no presenta ambigüedades jurídicas, pero se ha detectado una intersección con zonas de exclusión UPME.</p>
                            <button className="mt-8 px-8 py-2.5 rounded-lg bg-orange-600 hover:bg-orange-500 text-white font-medium transition-all shadow-[0_0_15px_rgba(249,115,22,0.3)] flex items-center">
                                <ShieldAlert className="w-4 h-4 mr-2" /> Auditar Riesgo Territorial
                            </button>
                        </div>
                    ) : (
                        <div className="p-8 rounded-xl border border-emerald-500/30 bg-emerald-500/10 flex flex-col items-center justify-center text-center h-full">
                            {notarizeStatus === 'success' ? (
                                <div className="space-y-4 w-full">
                                    <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-lg text-emerald-300 text-sm">
                                        <p className="font-bold flex items-center mb-1">
                                            <CheckCircle className="w-4 h-4 mr-2" /> Documento Notarizado
                                        </p>
                                        <p className="opacity-80">El hash del expediente ha sido anclado a Arbitrum Sepolia.</p>
                                    </div>
                                    <div className="flex space-x-3">
                                        <a
                                            href={blockchainTx?.url}
                                            target="_blank"
                                            rel="noreferrer"
                                            className="flex-1 px-8 py-2.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white font-medium transition-all flex items-center justify-center shadow-lg"
                                        >
                                            <Globe className="w-4 h-4 mr-2" /> Ver en Arbiscan
                                        </a>
                                        <button onClick={onReset} className="px-6 py-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-slate-600 transition-all">
                                            Finalizar
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h3 className="text-2xl font-bold text-white mb-2">Análisis Limpio</h3>
                                    <p className="text-slate-300">El motor IA determinó que el documento no presenta ambigüedades jurídicas ni operativas de alto riesgo.</p>
                                    <button
                                        onClick={handleNotarize}
                                        disabled={notarizeStatus === 'loading'}
                                        className="mt-8 px-8 py-2.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-medium transition-all flex items-center shadow-[0_0_15px_rgba(16,185,129,0.3)] hover:shadow-[0_0_25px_rgba(16,185,129,0.5)] disabled:opacity-50 disabled:cursor-wait"
                                    >
                                        {notarizeStatus === 'loading' ? (
                                            <>
                                                <Loader2 className="w-4 h-4 mr-2 animate-spin" /> Notarizando...
                                            </>
                                        ) : (
                                            <>
                                                <CheckCircle className="w-4 h-4 mr-2" /> Continuar a Notarización Web3
                                            </>
                                        )}
                                    </button>
                                    {errorMessage && (
                                        <div className="mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-xs flex items-center">
                                            <XCircle className="w-4 h-4 mr-2 flex-shrink-0" />
                                            {errorMessage}
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default HITLPanel;

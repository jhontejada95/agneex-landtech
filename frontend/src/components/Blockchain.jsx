import React, { useState, useEffect } from 'react';
import { Share2, Link as LinkIcon, ExternalLink, ShieldCheck, Database, RefreshCw, AlertTriangle } from 'lucide-react';

const Blockchain = () => {
    const [records, setRecords] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    const fetchBlockchainRecords = async () => {
        setIsLoading(true);
        try {
            const res = await fetch('http://127.0.0.1:8000/v1/expedientes');
            const data = await res.json();
            // Solo documentos notarizados
            setRecords(data.filter(r => r.blockchain_tx_hash));
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchBlockchainRecords();
    }, []);

    return (
        <div className="w-full h-full p-8 animate-fade-in text-slate-200">
            <div className="flex justify-between items-end mb-8">
                <div>
                    <h1 className="text-3xl font-bold text-white flex items-center">
                        <Share2 className="w-8 h-8 mr-3 text-indigo-400" />
                        Libro Mayor Blockchain (Web3)
                    </h1>
                    <p className="text-slate-400 mt-2">
                        Evidencia inmutable de notarización en Arbitrum Sepolia.
                    </p>
                </div>
                <button
                    onClick={fetchBlockchainRecords}
                    className="flex items-center px-4 py-2 bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 rounded-lg transition-colors"
                >
                    <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                    Actualizar
                </button>
            </div>

            {isLoading ? (
                <div className="flex justify-center items-center h-64 text-slate-500">
                    Sincronizando con Arbitrum Node...
                </div>
            ) : records.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 p-12 rounded-xl border border-white/5 bg-white/5 backdrop-blur-sm text-center">
                    <Database className="w-12 h-12 text-slate-700 mb-4" />
                    <p className="text-slate-500 max-w-xs">No se han encontrado registros notarizados en la red aún.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {records.map((record) => (
                        <div key={record.id} className="p-6 rounded-xl border border-indigo-500/30 bg-indigo-500/5 backdrop-blur-sm hover:shadow-[0_0_20px_rgba(99,102,241,0.15)] transition-all group relative overflow-hidden">
                            <div className="absolute top-0 right-0 p-4 opacity-10 blur-sm group-hover:blur-none transition-all">
                                <ShieldCheck className="w-16 h-16 text-indigo-400" />
                            </div>

                            <div className="flex items-center justify-between mb-4">
                                <span className="text-[10px] font-mono text-indigo-400/80 uppercase tracking-widest">EXP-#{String(record.id).padStart(4, '0')}</span>
                                <ShieldCheck className="w-5 h-5 text-emerald-400" />
                            </div>

                            <h3 className="text-lg font-bold text-white mb-1 truncate pr-8" title={record.document_name}>
                                {record.document_name}
                            </h3>
                            <p className="text-slate-400 text-sm mb-4">{record.entity_identified}</p>

                            <div className="space-y-3 pt-4 border-t border-white/10">
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 uppercase tracking-tighter">Hash de Tx</span>
                                    <span className="text-indigo-300 font-mono truncate max-w-[120px]" title={record.blockchain_tx_hash}>
                                        {record.blockchain_tx_hash}
                                    </span>
                                </div>
                                <div className="flex justify-between items-center text-xs">
                                    <span className="text-slate-500 uppercase tracking-tighter">Red</span>
                                    <span className="text-slate-300">Arbitrum Sepolia</span>
                                </div>
                            </div>

                            <a
                                href={record.blockchain_url}
                                target="_blank"
                                rel="noreferrer"
                                className="mt-6 w-full py-2.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600 hover:text-white text-indigo-300 border border-indigo-500/30 flex items-center justify-center transition-all text-sm font-medium"
                            >
                                <ExternalLink className="w-4 h-4 mr-2" />
                                Explorador de Bloques
                            </a>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Blockchain;

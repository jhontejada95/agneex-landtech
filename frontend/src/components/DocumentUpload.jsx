import React, { useState, useCallback } from 'react';
import { UploadCloud, CheckCircle, AlertTriangle, FileText, Globe, CornerUpRight, Loader2 } from 'lucide-react';
import { LEGAL_CATEGORIES, UPME_CATEGORIES, API_BASE_URL } from '../constants';

const DocumentUpload = ({ onUploadSuccess }) => {
    const [isDragging, setIsDragging] = useState(false);
    const [isUploading, setIsUploading] = useState(false);
    const [isSelectionDone, setIsSelectionDone] = useState(false);
    const [fileName, setFileName] = useState('');
    const [errorMsg, setErrorMsg] = useState('');
    const [selectedCategories, setSelectedCategories] = useState([
        ...LEGAL_CATEGORIES.map(c => c.id),
        ...UPME_CATEGORIES.map(c => c.id)
    ]);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === 'dragenter' || e.type === 'dragover') {
            setIsDragging(true);
        } else if (e.type === 'dragleave') {
            setIsDragging(false);
        }
    }, []);

    const toggleCategory = (id) => {
        setSelectedCategories(prev =>
            prev.includes(id) ? prev.filter(c => c !== id) : [...prev, id]
        );
    };

    const processFile = async (file) => {
        if (!file) return;
        setFileName(file.name);
        setIsUploading(true);
        setErrorMsg('');

        try {
            const formData = new FormData();
            formData.append('file', file);
            formData.append('selected_categories', JSON.stringify(selectedCategories));

            const response = await fetch(`${API_BASE_URL}/v1/ingest`, {
                method: 'POST',
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Error HTTP del Servidor: ${response.status}`);
            }

            const responseData = await response.json();
            onUploadSuccess({ ...responseData, selected_categories: selectedCategories });
        } catch (error) {
            console.error("Fallo la subida:", error);
            setErrorMsg("Error conectando con la API de IA. Revisa si el backend FastAPI está encendido.");
        } finally {
            setIsUploading(false);
        }
    };

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDragging(false);

        if (!isSelectionDone) {
            setErrorMsg("Por favor, termina la selección de categorías y haz clic en 'LISTO' antes de cargar.");
            return;
        }

        const files = e.dataTransfer.files;
        if (files && files[0]) {
            processFile(files[0]);
        }
    }, [isSelectionDone, selectedCategories]);

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            processFile(e.target.files[0]);
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-6xl mx-auto space-y-6">
            {errorMsg && (
                <div className="w-full p-4 border border-red-500/30 bg-red-500/10 rounded-2xl flex items-center text-red-500 animate-shake glass">
                    <AlertTriangle className="w-5 h-5 mr-3" />
                    <p className="font-bold">{errorMsg}</p>
                </div>
            )}

            {!isSelectionDone ? (
                <div className="w-full space-y-8 animate-fade-in">
                    <div className="text-center">
                        <h2 className="text-3xl font-black text-main mb-2 tracking-tighter uppercase">Configuración del Motor IA</h2>
                        <p className="text-dim font-medium text-lg">Selecciona los módulos de análisis antes de cargar el expediente</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        {/* Legal Analysis */}
                        <div className="p-8 glass bg-gradient-to-br from-indigo-500/5 to-transparent">
                            <h3 className="text-xl font-bold text-indigo-500 mb-6 flex items-center tracking-tight">
                                <FileText className="w-6 h-6 mr-3" /> Diagnóstico Jurídico
                            </h3>
                            <div className="grid grid-cols-1 gap-3">
                                {LEGAL_CATEGORIES.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedCategories.includes(cat.id)
                                            ? 'bg-indigo-500/10 border-indigo-500 shadow-glow text-main'
                                            : 'bg-transparent border-transparent hover:border-indigo-500/30 text-dim'
                                            }`}
                                    >
                                        <div className={`w-6 h-6 rounded-lg border-2 mr-4 flex items-center justify-center transition-all ${selectedCategories.includes(cat.id) ? 'bg-indigo-500 border-indigo-500 scale-110 shadow-glow' : 'border-indigo-500/20'
                                            }`}>
                                            {selectedCategories.includes(cat.id) && <CheckCircle className="w-4 h-4 text-white" />}
                                        </div>
                                        <span className="text-sm font-bold tracking-tight">{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* UPME Categories */}
                        <div className="p-8 glass bg-gradient-to-br from-emerald-500/5 to-transparent">
                            <h3 className="text-xl font-bold text-emerald-500 mb-6 flex items-center tracking-tight">
                                <Globe className="w-6 h-6 mr-3" /> Categorías UPME
                            </h3>
                            <div className="grid grid-cols-2 gap-3 max-h-[440px] overflow-y-auto pr-2 custom-scrollbar">
                                {UPME_CATEGORIES.map((cat) => (
                                    <div
                                        key={cat.id}
                                        onClick={() => toggleCategory(cat.id)}
                                        className={`flex items-center p-4 rounded-2xl border-2 cursor-pointer transition-all duration-300 ${selectedCategories.includes(cat.id)
                                            ? 'bg-emerald-500/10 border-emerald-500 shadow-glow text-main'
                                            : 'bg-transparent border-transparent hover:border-emerald-500/30 text-dim'
                                            }`}
                                    >
                                        <div className={`w-5 h-5 rounded-lg border-2 mr-3 flex items-center justify-center transition-all ${selectedCategories.includes(cat.id) ? 'bg-emerald-500 border-emerald-500 scale-110 shadow-glow' : 'border-emerald-500/20'
                                            }`}>
                                            {selectedCategories.includes(cat.id) && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                                        </div>
                                        <span className="text-[11px] font-bold leading-none">{cat.label}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>

                    <div className="flex justify-center pt-6">
                        <button
                            onClick={() => {
                                if (selectedCategories.length === 0) {
                                    setErrorMsg("Debes seleccionar al menos una categoría de validación.");
                                    return;
                                }
                                setIsSelectionDone(true);
                                setErrorMsg("");
                            }}
                            className="group relative px-16 py-5 bg-gradient-to-r from-indigo-600 via-purple-600 to-emerald-600 text-white font-black rounded-2xl transition-all duration-500 transform hover:scale-105 shadow-[0_0_40px_rgba(99,102,241,0.4)] hover:shadow-[0_0_60px_rgba(16,185,129,0.5)] active:scale-95 flex items-center text-xl tracking-tighter overflow-hidden"
                        >
                            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500"></div>
                            <span className="relative z-10 uppercase">Listo: Comenzar Carga</span>
                            <CornerUpRight className="relative z-10 ml-4 w-7 h-7 transform group-hover:translate-x-2 transition-transform duration-300" />
                        </button>
                    </div>
                </div>
            ) : (
                <div className="w-full animate-scale-in">
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-2xl font-black text-main flex items-center tracking-tighter uppercase">
                            <UploadCloud className="w-8 h-8 mr-4 text-indigo-500" /> Lanzar Expediente
                            <span className="ml-6 text-[10px] font-black uppercase tracking-widest text-indigo-500 border-2 border-indigo-500/30 px-4 py-1.5 rounded-full bg-indigo-500/10 shadow-glow">
                                {selectedCategories.length} Módulos Activos
                            </span>
                        </h2>
                        <button
                            onClick={() => setIsSelectionDone(false)}
                            className="text-xs font-black uppercase tracking-widest text-dim hover:text-main transition-all flex items-center glass px-6 py-3 border-transparent hover:border-indigo-500/30 group"
                        >
                            <FileText className="w-4 h-4 mr-2 group-hover:scale-110 transition-transform" /> Ajustar Categorías
                        </button>
                    </div>

                    <div
                        className={`w-full p-24 border-4 border-dashed rounded-[3rem] transition-all duration-700 ease-in-out glass flex flex-col items-center justify-center cursor-pointer relative overflow-hidden group min-h-[450px]
                        ${isDragging ? 'border-indigo-500 bg-indigo-500/5 scale-[1.01] shadow-glow' : 'border-indigo-500/20 hover:border-indigo-500/50'}`}
                        onDragEnter={handleDrag}
                        onDragLeave={handleDrag}
                        onDragOver={handleDrag}
                        onDrop={handleDrop}
                    >
                        <input
                            type="file"
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                            onChange={handleChange}
                            accept=".pdf,.doc,.docx"
                        />

                        {isUploading ? (
                            <div className="flex flex-col items-center select-none text-center">
                                <div className="relative mb-10 scale-125">
                                    <div className="absolute inset-0 bg-indigo-500 blur-3xl opacity-30 animate-pulse"></div>
                                    <Loader2 className="w-24 h-24 text-indigo-500 animate-spin relative z-10" />
                                </div>
                                <h3 className="text-3xl font-black text-main mb-3 tracking-tighter uppercase">Analizando Célula IA...</h3>
                                <p className="text-dim text-sm font-mono tracking-widest uppercase">{fileName}</p>
                                <div className="mt-10 w-80 h-1.5 glass-inset rounded-full overflow-hidden p-0.5">
                                    <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-500 rounded-full w-2/3 animate-[loading-shimmer_1.5s_infinite] shadow-glow"></div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col items-center select-none text-center px-6">
                                <div className="p-8 rounded-[2.5rem] bg-indigo-500/10 border-2 border-indigo-500/20 group-hover:bg-indigo-500/20 group-hover:border-indigo-500/50 mb-8 transition-all duration-500 transform group-hover:scale-110 group-hover:rotate-3 shadow-2xl">
                                    <UploadCloud className="w-20 h-20 text-indigo-500 group-hover:text-indigo-600 transition-colors" />
                                </div>
                                <h3 className="text-4xl font-black text-main mb-3 tracking-tighter uppercase font-outline-2">Transferir Archivo</h3>
                                <p className="text-dim text-xl mb-12 max-w-lg font-medium leading-relaxed">
                                    Suelta el documento aquí para iniciar el <span className="text-indigo-500">procesamiento multivariable</span> en el clúster legal.
                                </p>
                                <button className="px-12 py-5 btn-pill btn-primary text-xl">
                                    EXPLORAR DISCO LOCAL
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default DocumentUpload;

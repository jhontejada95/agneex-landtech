import React, { useState } from 'react';
import { Send, Building, Mail, User, Loader2, CheckCircle2 } from 'lucide-react';

const ContactForm = ({ onSend, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const handleSubmit = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate sending email/form
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                onSend();
            }, 3000);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#05050a] text-slate-200 relative overflow-hidden">
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-dim hover:text-white font-bold flex items-center gap-2 transition-colors z-10"
            >
                ← VOLVER A LOS PLANES
            </button>

            <div className="w-full max-w-lg z-10 animate-fade-in">
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-black text-white tracking-tight mb-2">Contacto Enterprise</h1>
                    <p className="text-slate-400 font-medium">Déjanos tus datos y un arquitecto de soluciones te contactará para diseñar tu infraestructura personalizada.</p>
                </div>

                <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative">
                    {isSuccess ? (
                        <div className="flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-sm rounded-2xl border border-green-500/30 py-16 px-6 animate-fade-in z-20">
                            <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(74,222,128,0.3)] border border-green-500/30">
                                <CheckCircle2 size={40} className="text-green-400" />
                            </div>
                            <h2 className="text-3xl font-black text-white mb-2 tracking-tighter">¡Mensaje Enviado!</h2>
                            <p className="text-green-200 text-center px-6 font-medium mt-2">Nuestro equipo revisará tu solicitud y te contactará en breve.</p>
                            <div className="mt-10 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-xs font-bold text-dim uppercase tracking-widest flex items-center gap-2">
                                <Loader2 className="w-3 h-3 animate-spin" /> Redirigiendo al inicio
                            </div>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-5">
                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Nombre Completo</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/50 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 text-white focus:border-indigo-500 outline-none transition-colors"
                                        placeholder="Ej. Ana García"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Email Corporativo</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/50 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="email"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 text-white focus:border-indigo-500 outline-none transition-colors"
                                        placeholder="ana@empresa.com"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Empresa / Institución</label>
                                <div className="relative group">
                                    <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/50 group-focus-within:text-indigo-500 transition-colors" />
                                    <input
                                        type="text"
                                        className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/30 border border-white/10 text-white focus:border-indigo-500 outline-none transition-colors"
                                        placeholder="Nombre de la empresa"
                                        required
                                    />
                                </div>
                            </div>

                            <div className="space-y-2">
                                <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Volumen Estimado de Análisis / mes</label>
                                <select className="w-full py-4 px-4 rounded-xl bg-black/30 border border-white/10 text-white focus:border-indigo-500 outline-none transition-colors appearance-none" required>
                                    <option value="" disabled selected>Seleccione una opción</option>
                                    <option value="1">100 - 500 expedientes</option>
                                    <option value="2">500 - 2,000 expedientes</option>
                                    <option value="3">Más de 2,000 expedientes</option>
                                    <option value="4">Integración API masiva</option>
                                </select>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-glow mt-8 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando...</>
                                ) : (
                                    <>Enviar Solicitud <Send className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default ContactForm;

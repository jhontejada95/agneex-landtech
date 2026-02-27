import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Loader2, UserPlus, User, Building } from 'lucide-react';

const Register = ({ onRegister, planId, onBack }) => {
    const [name, setName] = useState('');
    const [empresa, setEmpresa] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);

        // Simulando creación de usuario (delay de 1.5s)
        setTimeout(() => {
            // Asignar rol basado en el plan para ver diferencias en el dashboard
            let simulatedRole = 'Client';
            if (planId === 'professional') simulatedRole = 'Analyst';
            if (planId === 'business') simulatedRole = 'Admin';

            const userData = { email, name, role: simulatedRole, plan: planId };
            setIsLoading(false);
            onRegister(userData, planId);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-app transition-colors duration-500 relative">
            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-dim hover:text-main font-bold flex items-center gap-2 transition-colors z-10"
            >
                ← VOLVER
            </button>
            <div className="w-full max-w-md space-y-8 animate-fade-in z-10">
                <div className="text-center">
                    <div className="inline-flex p-4 rounded-3xl glass mb-6 shadow-glow bg-indigo-500/10">
                        <UserPlus className="w-12 h-12 text-indigo-400" />
                    </div>
                    <h1 className="text-4xl font-black text-white tracking-tighter uppercase">Crear Cuenta</h1>
                    <p className="text-indigo-200 mt-2 font-medium">
                        {planId === 'starter' ? 'Activa tu entorno gratuito' : `Creando cuenta para Plan ${planId.charAt(0).toUpperCase() + planId.slice(1)}`}
                    </p>
                </div>

                <div className="bg-white/[0.03] border border-indigo-500/20 rounded-3xl p-10 space-y-6 backdrop-blur-xl shadow-2xl">
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 ml-2">Nombre Completo</label>
                            <div className="relative group">
                                <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                                <input
                                    type="text"
                                    value={name}
                                    onChange={(e) => setName(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 focus:bg-black/60 outline-none text-white placeholder-slate-500 transition-all font-medium"
                                    placeholder="Juan Pérez"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 ml-2">Empresa / Firma</label>
                            <div className="relative group">
                                <Building className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                                <input
                                    type="text"
                                    value={empresa}
                                    onChange={(e) => setEmpresa(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 focus:bg-black/60 outline-none text-white placeholder-slate-500 transition-all font-medium"
                                    placeholder="Mi Empresa SAS"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 ml-2">Email corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 focus:bg-black/60 outline-none text-white placeholder-slate-500 transition-all font-medium"
                                    placeholder="nombre@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-indigo-300 ml-2">Crear Clave de acceso</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-400 group-focus-within:text-indigo-300 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 rounded-xl bg-black/40 border border-white/10 focus:border-indigo-400 focus:bg-black/60 outline-none text-white placeholder-slate-500 transition-all font-medium"
                                    placeholder="••••••••"
                                    required
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute right-4 top-1/2 -translate-y-1/2 text-dim hover:text-indigo-500 transition-colors"
                                >
                                    {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-pill btn-primary py-5 text-lg group relative overflow-hidden mt-4"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin mx-auto" />
                            ) : (
                                <span>CONTINUAR</span>
                            )}
                        </button>
                    </form>
                </div>
            </div>
            {/* Background decors from login */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-500/10 blur-[100px] rounded-full"></div>
                <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[100px] rounded-full"></div>
            </div>
        </div>
    );
};

export default Register;

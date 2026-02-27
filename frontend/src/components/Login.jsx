import React, { useState } from 'react';
import { Lock, Mail, Eye, EyeOff, Loader2, ShieldCheck } from 'lucide-react';

const Login = ({ onLogin }) => {
    const [email, setEmail] = useState('demo@agneex.com');
    const [password, setPassword] = useState('agneex2025');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        // Simulación de login (será reemplazado por llamada real /v1/login)
        setTimeout(() => {
            if (email === 'demo@agneex.com' && password === 'agneex2025') {
                onLogin({ name: 'Usuario Demo', email, tier: 'Professional', docsUsed: 42, docsLimit: 100 });
            } else {
                setError('Credenciales inválidas. Intenta demo@agneex.com / agneex2025');
            }
            setIsLoading(false);
        }, 1500);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-app transition-colors duration-500">
            <div className="w-full max-w-md space-y-8 animate-fade-in">
                <div className="text-center">
                    <div className="inline-flex p-4 rounded-3xl glass mb-6 shadow-glow">
                        <ShieldCheck className="w-12 h-12 text-indigo-500" />
                    </div>
                    <h1 className="text-4xl font-black text-main tracking-tighter uppercase">Agneex LandTech</h1>
                    <p className="text-dim mt-2 font-medium">Ingresa a la plataforma de inteligencia predial</p>
                </div>

                <div className="glass p-10 space-y-6">
                    {error && (
                        <div className="p-4 rounded-xl bg-red-500/10 border border-red-500/30 text-red-500 text-sm font-bold animate-shake text-center">
                            {error}
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-dim ml-2">Email corporativo</label>
                            <div className="relative group">
                                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/50 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type="email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    className="w-full pl-12 pr-4 py-4 rounded-2xl glass-inset bg-transparent border-transparent focus:border-indigo-500/30 outline-none text-main transition-all font-medium"
                                    placeholder="nombre@empresa.com"
                                    required
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-xs font-black uppercase tracking-widest text-dim ml-2">Clave de acceso</label>
                            <div className="relative group">
                                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-indigo-500/50 group-focus-within:text-indigo-500 transition-colors" />
                                <input
                                    type={showPassword ? 'text' : 'password'}
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    className="w-full pl-12 pr-12 py-4 rounded-2xl glass-inset bg-transparent border-transparent focus:border-indigo-500/30 outline-none text-main transition-all font-medium"
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

                        <div className="flex items-center justify-between px-2 text-xs font-bold">
                            <label className="flex items-center text-dim cursor-pointer hover:text-main transition-colors">
                                <input type="checkbox" className="mr-2 accent-indigo-500" /> Recordarme
                            </label>
                            <a href="#" className="text-indigo-500 hover:text-indigo-400 transition-colors">¿Olvidaste tu clave?</a>
                        </div>

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="w-full btn-pill btn-primary py-5 text-lg group relative overflow-hidden"
                        >
                            {isLoading ? (
                                <Loader2 className="w-6 h-6 animate-spin" />
                            ) : (
                                <>
                                    <span>INICIAR SESIÓN</span>
                                    <ShieldCheck className="ml-3 w-5 h-5 transform group-hover:scale-110 transition-transform" />
                                </>
                            )}
                        </button>
                    </form>
                </div>

                <p className="text-center text-dim text-sm font-medium">
                    ¿No tienes una cuenta? <a href="#" className="text-indigo-500 font-bold hover:underline">Contactar a Ventas</a>
                </p>
            </div>
        </div>
    );
};

export default Login;

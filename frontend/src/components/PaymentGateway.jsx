import React, { useState } from 'react';
import { CreditCard, Loader2, CheckCircle2, ShieldCheck, Lock } from 'lucide-react';

const PaymentGateway = ({ planId, onPaymentSuccess, onBack }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isSuccess, setIsSuccess] = useState(false);

    const planPrices = {
        professional: { price: '$49', name: 'Professional' },
        business: { price: '$199', name: 'Business' }
    };

    const details = planPrices[planId] || planPrices.professional;

    const handlePayment = (e) => {
        e.preventDefault();
        setIsLoading(true);
        // Simulate payment process
        setTimeout(() => {
            setIsLoading(false);
            setIsSuccess(true);
            setTimeout(() => {
                onPaymentSuccess();
            }, 1000);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex items-center justify-center p-6 bg-[#05050a] text-slate-200 relative overflow-hidden">
            {/* Ambient Background */}
            <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/10 blur-[120px] rounded-full pointer-events-none"></div>
            <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 blur-[120px] rounded-full pointer-events-none"></div>

            <button
                onClick={onBack}
                className="absolute top-8 left-8 text-dim hover:text-white font-bold flex items-center gap-2 transition-colors z-10"
            >
                ← CANCELAR TRANSACCIÓN
            </button>

            <div className="w-full max-w-4xl grid md:grid-cols-2 gap-8 z-10 animate-fade-in">
                {/* Resumen del Pedido */}
                <div className="bg-white/[0.02] border border-white/5 rounded-3xl p-8 backdrop-blur-xl flex flex-col justify-center">
                    <h2 className="text-2xl font-black text-white mb-2 tracking-tight">Resumen de Suscripción</h2>
                    <p className="text-slate-400 mb-8 font-medium">Estás a punto de activar la infraestructura predial.</p>

                    <div className="p-6 rounded-2xl bg-black/30 border border-white/5 mb-8 text-center">
                        <div className="text-indigo-400 font-bold mb-2">Plan Seleccionado</div>
                        <div className="text-4xl font-black text-white">{details.name}</div>
                    </div>

                    <div className="space-y-4 mb-8">
                        <div className="flex justify-between text-slate-300 font-medium">
                            <span>Suscripción Mensual</span>
                            <span>{details.price}.00</span>
                        </div>
                        <div className="flex justify-between text-slate-300 font-medium">
                            <span>Impuestos (0%)</span>
                            <span>$0.00</span>
                        </div>
                        <div className="flex justify-between text-white font-black text-xl pt-4 border-t border-white/10">
                            <span>Total a pagar</span>
                            <span>{details.price}.00 USD</span>
                        </div>
                    </div>

                    <div className="flex items-center justify-center gap-2 text-sm text-slate-500 font-medium">
                        <Lock size={14} /> Pagos seguros encriptados a 256-bit
                    </div>
                </div>

                {/* Pasarela simulada */}
                <div className="bg-white/[0.04] border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative">
                    {isSuccess ? (
                        <div className="absolute inset-0 flex flex-col items-center justify-center bg-green-500/10 backdrop-blur-sm rounded-3xl border border-green-500/30 animate-fade-in">
                            <CheckCircle2 size={64} className="text-green-400 mb-4" />
                            <h2 className="text-2xl font-bold text-white mb-2">¡Pago Exitoso!</h2>
                            <p className="text-green-200">Activando tu entorno de trabajo...</p>
                        </div>
                    ) : (
                        <form onSubmit={handlePayment} className="flex flex-col h-full justify-between">
                            <div>
                                <h3 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
                                    <CreditCard className="text-indigo-400" /> Método de Pago
                                </h3>

                                <div className="space-y-4">
                                    <div className="space-y-1">
                                        <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Número de Tarjeta</label>
                                        <input
                                            type="text"
                                            placeholder="•••• •••• •••• ••••"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 outline-none transition-colors"
                                            required
                                            defaultValue="4242 4242 4242 4242"
                                            readOnly
                                        />
                                    </div>
                                    <div className="grid grid-cols-2 gap-4">
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Vencimiento</label>
                                            <input
                                                type="text"
                                                placeholder="MM/AA"
                                                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 outline-none transition-colors"
                                                required
                                                defaultValue="12/28"
                                                readOnly
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">CVC</label>
                                            <input
                                                type="text"
                                                placeholder="123"
                                                className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 outline-none transition-colors"
                                                required
                                                defaultValue="123"
                                                readOnly
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-1 mt-4 border-t border-white/5 pt-4">
                                        <label className="text-xs uppercase font-bold text-dim ml-2 tracking-wider">Nombre en la tarjeta</label>
                                        <input
                                            type="text"
                                            placeholder="Juan Pérez"
                                            className="w-full bg-black/30 border border-white/10 rounded-xl py-3 px-4 text-white focus:border-indigo-500 outline-none transition-colors"
                                            required
                                            defaultValue="Dato de Prueba"
                                            readOnly
                                        />
                                    </div>
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isLoading}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-glow mt-8 flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <><Loader2 className="w-5 h-5 animate-spin" /> Procesando pago...</>
                                ) : (
                                    <>Pagar {details.price} <ShieldCheck className="w-5 h-5" /></>
                                )}
                            </button>
                        </form>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PaymentGateway;

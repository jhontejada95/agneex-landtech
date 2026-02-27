import React from 'react';
import { ArrowLeft, CheckCircle2, Zap, Shield, Database, Cpu } from 'lucide-react';

const plansData = {
    starter: {
        name: 'Starter',
        price: '$0',
        period: '/mes',
        desc: 'Para explorar la tecnología algorítmica y validar el valor de la plataforma.',
        features: [
            '3 Análisis de Expedientes AI por mes',
            'Visualización interactiva del Gemelo Digital',
            'Alertas Básicas de restricciones UPME',
            'Exportación de reportes en PDF simple'
        ],
        idealFor: 'Analistas independientes y pequeños inversores.',
        icon: <Zap size={48} className="text-indigo-400" />
    },
    professional: {
        name: 'Professional',
        price: '$49',
        period: '/mes',
        desc: 'Para analistas y firmas en crecimiento que requieren volumen y seguridad criptográfica.',
        features: [
            '100 Análisis de Expedientes AI por mes',
            'Notarización Web3 Garantizada en Arbitrum',
            'Panel de Control y Analítica Avanzada',
            'Soporte Técnico Dedicado (24h SLA)',
            'Historial inmutable de auditorías'
        ],
        idealFor: 'Abogados inmobiliarios y consultores de tierras.',
        icon: <Shield size={48} className="text-indigo-500" />
    },
    business: {
        name: 'Business',
        price: '$199',
        period: '/mes',
        desc: 'Para firmas legales y fondos de inversión estructurados.',
        features: [
            '500 Análisis de Expedientes AI por mes',
            'Cuentas Multi-Usuario (hasta 5 asientos)',
            'Notarización Web3 en Lote (Batch)',
            'Soporte Prioritario 24/7 (Chat y Teléfono)',
            'Integración con bases de datos catastrales locales'
        ],
        idealFor: 'Fondos de inversión, desarrolladoras medianas.',
        icon: <Database size={48} className="text-indigo-600" />
    },
    enterprise: {
        name: 'Enterprise',
        price: 'Custom',
        period: '',
        desc: 'Infraestructura a gran escala y dedicada.',
        features: [
            'Volúmenes de Ingesta Ilimitados',
            'API REST para Integraciones Internas (ERP/CRM)',
            'SLA de disponibilidad del 99.9%',
            'Modelos IA Personalizados y fine-tuning',
            'Asesoría técnica y legal dedicada',
            'Despliegue On-Premise opcional'
        ],
        idealFor: 'Grandes corporaciones corporativas, bancos, entes gubernamentales.',
        icon: <Cpu size={48} className="text-purple-500" />
    }
};

const PlanDetails = ({ planId, onBack, onProceed }) => {
    const plan = plansData[planId] || plansData['starter'];

    return (
        <div className="min-h-screen bg-[#05050a] text-slate-200 font-sans p-6 flex flex-col items-center justify-center">
            <div className="w-full max-w-4xl">
                <button
                    onClick={onBack}
                    className="flex items-center gap-2 text-indigo-400 hover:text-indigo-300 transition-colors mb-12 font-medium"
                >
                    <ArrowLeft size={20} /> Volver a los planes
                </button>

                <div className="bg-white/[0.02] border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-xl shadow-2xl relative overflow-hidden">
                    {/* Decorative gradient blob inside card */}
                    <div className="absolute -top-32 -right-32 w-64 h-64 bg-indigo-600/20 blur-[80px] rounded-full pointer-events-none"></div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 relative z-10 gap-8">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-indigo-500/10 border border-indigo-500/20 rounded-2xl flex items-center justify-center">
                                {plan.icon}
                            </div>
                            <div>
                                <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">{plan.name}</h1>
                                <p className="text-indigo-200 mt-2 font-medium">{plan.idealFor}</p>
                            </div>
                        </div>
                        <div className="text-left md:text-right">
                            <div className="text-5xl font-black text-white">{plan.price}<span className="text-xl text-slate-400 font-medium">{plan.period}</span></div>
                        </div>
                    </div>

                    <p className="text-xl text-slate-300 leading-relaxed max-w-2xl mb-12 relative z-10">
                        {plan.desc}
                    </p>

                    <div className="grid md:grid-cols-2 gap-8 relative z-10 mb-12">
                        <div>
                            <h3 className="text-xl font-bold text-white mb-6 uppercase tracking-wider text-sm border-b border-white/10 pb-4">Características Incluidas</h3>
                            <ul className="space-y-4">
                                {plan.features.map((feature, i) => (
                                    <li key={i} className="flex items-start gap-4">
                                        <CheckCircle2 size={24} className="text-indigo-400 flex-shrink-0" />
                                        <span className="text-slate-300 text-lg leading-snug">{feature}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        <div className="bg-black/20 rounded-2xl p-8 border border-white/5 flex flex-col justify-center">
                            <h3 className="text-xl font-bold text-white mb-4">
                                {planId === 'enterprise' ? '¿Hablamos de tu proyecto?' : '¿Listo para empezar?'}
                            </h3>
                            <p className="text-slate-400 mb-8">
                                {planId === 'enterprise'
                                    ? 'Déjanos tus datos y un arquitecto de soluciones se pondrá en contacto contigo.'
                                    : 'Regístrate en el portal y activa tu entorno de trabajo seguro en segundos.'}
                            </p>
                            <button
                                onClick={() => onProceed(planId)}
                                className="w-full bg-indigo-600 hover:bg-indigo-500 text-white font-bold py-4 rounded-xl transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] transform hover:-translate-y-1 mt-auto"
                            >
                                {planId === 'starter' && 'Crear Cuenta Gratis'}
                                {(planId === 'professional' || planId === 'business') && `Adquirir Plan ${plan.name}`}
                                {planId === 'enterprise' && 'Completar Formulario de Contacto'}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PlanDetails;

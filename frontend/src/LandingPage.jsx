import React, { useEffect, useRef } from 'react';
import { Shield, Map, Zap, Cpu, ArrowRight, Layout, Database, CheckCircle2, Search, FileText, UserCheck, Link as LinkIcon } from 'lucide-react';
import './LandingPage.css';

// Usando las imágenes generadas por el sistema
import heroImg from './assets/hero_landtech_future_1772152865063.png';
import aiImg from './assets/ai_legal_analysis_1772152878706.png';
import digitalTwinImg from './assets/digital_twin_gis_1772152893315.png';
import blockchainImg from './assets/blockchain_trust_notarization_1772152907242.png';

const LandingPage = ({ onNavigate }) => {
    // Intersection Observer for scroll animations
    const observerRef = useRef(null);

    useEffect(() => {
        observerRef.current = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('is-visible');
                }
            });
        }, { threshold: 0.1, rootMargin: "0px 0px -50px 0px" });

        const elements = document.querySelectorAll('.fade-in-section');
        elements.forEach(el => observerRef.current.observe(el));

        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return (
        <div className="landing-container">
            {/* Background Effects */}
            <div className="bg-gradient-mesh"></div>
            <div className="bg-blobs">
                <div className="blob blob-1"></div>
                <div className="blob blob-2"></div>
                <div className="blob blob-3"></div>
            </div>

            {/* Navigation */}
            <nav className="landing-nav glass-nav fade-in-section">
                <div className="logo" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Shield size={24} color="#7c3aed" /> <span className="logo-text">AGNEEX LANDTECH</span>
                </div>
                <div className="nav-links">
                    <a href="#problem" className="nav-link">El Desafío</a>
                    <a href="#solution" className="nav-link">La Solución</a>
                    <a href="#ecosystem" className="nav-link">Ecosistema</a>
                    <a href="#pricing" className="nav-link">Planes</a>
                    <button onClick={() => onNavigate('login')} className="login-btn glow-btn">Acceso Portal</button>
                </div>
            </nav>

            {/* Chapter 1: The Hook (Hero) */}
            <header className="hero fade-in-section">
                <div className="hero-content">
                    <div className="badge-glow">
                        <span className="live-dot"></span> Infraestructura Predial Inteligente
                    </div>
                    <h1>
                        El Ecosistema Definitivo de <br />
                        <span className="gradient-text gradient-shift">Inteligencia Jurídico-Territorial</span>
                    </h1>
                    <p className="hero-subtitle">
                        Transformamos la debida diligencia inmobiliaria analizando miles de folios con IA,
                        cruzando datos en Gemelos Digitales 3D y blindando el riesgo con Notarización Web3.
                    </p>
                    <div className="cta-group">
                        <button onClick={() => onNavigate('login')} className="btn-primary glow-btn" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                            Iniciar Prueba Gratuita <ArrowRight size={20} />
                        </button>
                        <a href="#solution" className="btn-secondary glass-btn">Descubrir Cómo</a>
                    </div>
                </div>

                <div className="hero-visual fade-in-section" style={{ transitionDelay: '0.2s' }}>
                    <div className="image-frame">
                        <div className="frame-overlay text-overlay-top">Gemelo Digital Activo</div>
                        <img src={heroImg} alt="Agneex LandTech Future" />
                        <div className="frame-overlay text-overlay-bottom">
                            <span className="status-indicator"></span> Sincronizado
                        </div>
                    </div>
                </div>
            </header>

            {/* Chapter 2: The Problem (Context) */}
            <section id="problem" className="story-section fade-in-section">
                <div className="story-text">
                    <span className="chapter-label">01 / EL PROBLEMA</span>
                    <h2>La inversión inmobiliaria<br />opera a ciegas.</h2>
                    <p>
                        Semanas de análisis manual de folios de matrícula, riesgos ocultos en las bases de datos de la UPME,
                        fraudes documentales sofisticados y la falta de un contexto territorial unificado provocan sobrecostos
                        inmanejables y retrasos críticos en el desarrollo de proyectos.<br /><br />
                        Las decisiones que involucran millones de dólares no pueden depender de procesos fragmentados del pasado.
                        La falta de transparencia destruye la viabilidad financiera de cualquier desarrollo inmobiliario o energético
                        antes de poner el primer ladrillo.
                    </p>
                    <div className="mt-8">
                        <a href="#solution" className="btn-secondary glass-btn">Descubrir la solución</a>
                    </div>
                </div>
            </section>

            {/* Chapter 3: The Solution (Process) */}
            <section id="solution" className="story-section alternate fade-in-section">
                <div className="story-text">
                    <span className="chapter-label">02 / LA FÓRMULA AGNEEX</span>
                    <h2>De la incertidumbre<br />a la precisión matemática.</h2>
                    <p>Hemos construido un pipeline que audita, visualiza y asegura tus activos en tiempo récord.</p>
                </div>

                <div className="process-timeline">
                    <div className="timeline-step fade-in-section">
                        <div className="step-content">
                            <div className="step-icon"><FileText size={28} /></div>
                            <h3>1. Ingesta Total (IA)</h3>
                            <p>Carga de manera masiva cientos de PDFs y escaneos de títulos. Nuestro motor de Inteligencia Artificial (NLU) extrae gravámenes, enajenaciones, embargos y anotaciones críticas en segundos, eliminando por completo la fatiga humana y acelerando el análisis inicial estructurando datos caóticos.</p>
                        </div>
                        <div className="step-visual">
                            <img src={aiImg} alt="Análisis IA" />
                        </div>
                    </div>

                    <div className="timeline-step fade-in-section reverse">
                        <div className="step-content">
                            <div className="step-icon"><Map size={28} /></div>
                            <h3>2. Contexto Espacial (BIM/GIS)</h3>
                            <p>Mapeamos la realidad jurídica directamente sobre un Gemelo Digital del terreno. Cruza de forma interactiva los límites prediales con restricciones de infraestructura, zonas de reserva ambiental, o restricciones UPME en un entorno 3D. Descubre sobreposiciones territoriales antes de comprometer capital.</p>
                        </div>
                        <div className="step-visual">
                            <img src={digitalTwinImg} alt="Gemelo Digital" />
                        </div>
                    </div>

                    <div className="timeline-step fade-in-section">
                        <div className="step-content">
                            <div className="step-icon"><Shield size={28} /></div>
                            <h3>3. Sello Inmutable (Web3)</h3>
                            <p>El veredicto final de viabilidad y todos los hallazgos críticos se hashean y se registran en la blockchain. Al aprovechar esta tecnología de registro inmutable, garantizamos un certificado criptográfico 100% transparente. Ningún actor o alteración posterior puede modificar el historial documentado de la auditoría.</p>
                        </div>
                        <div className="step-visual">
                            <img src={blockchainImg} alt="Blockchain Notarization" />
                        </div>
                    </div>
                </div>
            </section>

            {/* Chapter 4: The Core Engine (Ecosystem) */}
            <section id="ecosystem" className="ecosystem-section fade-in-section">
                <div className="text-center mb-16">
                    <span className="chapter-label justify-center">03 / EL MOTOR</span>
                    <h2 className="text-4xl md:text-5xl font-black mb-6">Auditoría Híbrida Inteligente</h2>
                    <p className="text-dim max-w-2xl mx-auto text-lg">
                        La IA hace el trabajo pesado, pero el control absoluto reside en nuestros analistas expertos. Ese es el poder del modelo HITL (Human-in-the-Loop).
                    </p>
                </div>

                <div className="bento-grid">
                    <div className="bento-item glass-panel fade-in-section" style={{ transitionDelay: '0.1s' }}>
                        <Cpu className="bento-icon" />
                        <h4>Detección de Patrones</h4>
                        <p>Nuestros algoritmos están entrenados con expedientes históricos para identificar secuencias de anotaciones que estadísticamente resultan en contingencias insalvables, alertándote de inmediato.</p>
                    </div>
                    <div className="bento-item glass-panel fade-in-section" style={{ transitionDelay: '0.2s' }}>
                        <UserCheck className="bento-icon" />
                        <h4>Precisión Validada</h4>
                        <p>Panel de revisión ultra-optimizado. Los abogados y analistas se enfocan exclusivamente en auditar las anomalías complejas ("red flags"), escalando radicalmente la capacidad operativa.</p>
                    </div>
                    <div className="bento-item glass-panel col-span-full md:col-span-2 flex flex-col md:flex-row items-start md:items-center gap-8 fade-in-section" style={{ transitionDelay: '0.3s' }}>
                        <div className="flex-1">
                            <h4>Cálculo de CAPEX de Riesgo</h4>
                            <p>Vamos más allá del diagnóstico. Nuestro motor cuantifica el costo monetario estimado de solucionar las alertas encontradas (ej. levantamientos o saneamiento), dándote el impacto real sobre el flujo de caja antes de que decidas invertir.</p>
                            <button onClick={() => onNavigate('login')} className="mt-8 btn-primary glow-btn">Evaluar un Proyecto Ahora</button>
                        </div>
                        <Database size={80} className="text-indigo-500/50 self-center" />
                    </div>
                </div>
            </section>

            {/* Chapter 5: The Ask (Pricing) */}
            <section id="pricing" className="pricing-section fade-in-section">
                <span className="chapter-label justify-center">04 / ACCESO AL SISTEMA</span>
                <h2>Invierte con certeza.<br />Escala sin fricción.</h2>

                <div className="pricing-grid">
                    <div className="pricing-card glass-panel fade-in-section cursor-pointer hover:border-indigo-400 transition-colors group" onClick={() => onNavigate('plan_details', 'starter')}>
                        <div className="tier-header">
                            <h3>Starter</h3>
                            <div className="price">$0<span>/mes</span></div>
                        </div>
                        <p className="tier-desc">Para explorar la tecnología algorítmica.</p>
                        <ul className="features-list">
                            <li><CheckCircle2 size={18} className="check-icon" /> 3 Análisis de Expedientes / mes</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Visualización de Gemelo Digital</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Alertas Básicas UPME</li>
                        </ul>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate('plan_details', 'starter'); }} className="btn-secondary glass-btn w-full group-hover:bg-white/10 mt-auto">Ver Detalles</button>
                    </div>

                    <div className="pricing-card glass-panel popular fade-in-section cursor-pointer group" style={{ transitionDelay: '0.2s' }} onClick={() => onNavigate('plan_details', 'professional')}>
                        <div className="popular-badge">RECOMMENDED</div>
                        <div className="tier-header">
                            <h3>Professional</h3>
                            <div className="price">$49<span>/mes</span></div>
                        </div>
                        <p className="tier-desc">Para analistas y firmas en crecimiento.</p>
                        <ul className="features-list">
                            <li><CheckCircle2 size={18} className="check-icon" /> 100 Análisis de Expedientes / mes</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Notarización Web3 Garantizada</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Panel Control y Analítica Avanzada</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Soporte Dedicado</li>
                        </ul>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate('plan_details', 'professional'); }} className="btn-primary glow-btn w-full mt-auto">Ver Detalles</button>
                    </div>

                    <div className="pricing-card glass-panel fade-in-section cursor-pointer hover:border-indigo-400 transition-colors group" style={{ transitionDelay: '0.3s' }} onClick={() => onNavigate('plan_details', 'business')}>
                        <div className="tier-header">
                            <h3>Business</h3>
                            <div className="price">$199<span>/mes</span></div>
                        </div>
                        <p className="tier-desc">Para firmas legales y fondos de inversión.</p>
                        <ul className="features-list">
                            <li><CheckCircle2 size={18} className="check-icon" /> 500 Análisis de Expedientes / mes</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Cuentas Multi-Usuario</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Notarización Web3 en Lote</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Soporte Prioritario 24/7</li>
                        </ul>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate('plan_details', 'business'); }} className="btn-secondary glass-btn w-full group-hover:bg-white/10 mt-auto">Ver Detalles</button>
                    </div>

                    <div className="pricing-card glass-panel fade-in-section cursor-pointer hover:border-indigo-400 transition-colors group" style={{ transitionDelay: '0.4s' }} onClick={() => onNavigate('plan_details', 'enterprise')}>
                        <div className="tier-header">
                            <h3>Enterprise</h3>
                            <div className="price">Custom</div>
                        </div>
                        <p className="tier-desc">Infraestructura a gran escala.</p>
                        <ul className="features-list">
                            <li><CheckCircle2 size={18} className="check-icon" /> Ingesta Ilimitada</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> API para Integraciones Internas</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> SLA del 99.9%</li>
                            <li><CheckCircle2 size={18} className="check-icon" /> Modelos IA Personalizados</li>
                        </ul>
                        <button onClick={(e) => { e.stopPropagation(); onNavigate('plan_details', 'enterprise'); }} className="btn-secondary glass-btn w-full group-hover:bg-white/10 mt-auto">Ver Detalles</button>
                    </div>
                </div>
            </section>

            {/* Footer */}
            <footer className="landing-footer fade-in-section">
                <div className="footer-content">
                    <div className="logo"><Shield size={24} color="#7c3aed" /> AGNEEX LANDTECH</div>
                    <div className="footer-links">
                        <a href="#">Privacidad</a>
                        <a href="#">Términos</a>
                        <a href="#">Soporte</a>
                    </div>
                </div>
                <div className="footer-bottom">
                    <p>© 2026 Agneex LandTech - Infraestructura Trustless para Bienes Raíces.</p>
                </div>
            </footer>
        </div>
    );
};

export default LandingPage;

import { useState, useEffect } from 'react';
import './App.css';
import HITLDashboard from './components/HITLDashboard';
import Sidebar from './components/Sidebar';
import DocumentUpload from './components/DocumentUpload';
import HITLPanel from './components/HITLPanel';
import Expedientes from './components/Expedientes';
import Blockchain from './components/Blockchain';
import ThemeToggle from './components/ThemeToggle';
import Login from './components/Login';
import UserDashboard from './components/UserDashboard';
import GemeloDigital from './components/GemeloDigital';
import LandingPage from './LandingPage';
import PlanDetails from './components/PlanDetails';
import Register from './components/Register';
import PaymentGateway from './components/PaymentGateway';
import ContactForm from './components/ContactForm';

function App() {
    const [user, setUser] = useState(null);
    const [activeView, setActiveView] = useState('landing');
    const [analysisData, setAnalysisData] = useState(null);
    const [selectedExpediente, setSelectedExpediente] = useState(null);
    const [selectedPlanId, setSelectedPlanId] = useState('starter');

    const handleNavigate = (view, payload = null) => {
        setActiveView(view);
        if (view === 'plan_details' && payload) {
            setSelectedPlanId(payload);
        }
    };

    const handlePlanProceed = (planId) => {
        if (planId === 'enterprise') {
            setActiveView('contact');
        } else {
            setActiveView('register');
        }
    };

    const handleRegister = (userData, planId) => {
        if (planId === 'starter') {
            const enhancedUser = { ...userData, tier: 'starter', docsUsed: 0, docsLimit: 3 };
            setUser(enhancedUser);
            localStorage.setItem('user', JSON.stringify(enhancedUser));
            setActiveView('dashboard');
        } else {
            setActiveView('payment');
        }
    };

    const handlePaymentSuccess = () => {
        const enhancedUser = {
            email: 'user@example.com',
            name: 'Nuevo Cliente',
            role: selectedPlanId === 'business' ? 'Admin' : 'Analyst',
            plan: selectedPlanId,
            tier: selectedPlanId,
            docsUsed: 0,
            docsLimit: selectedPlanId === 'business' ? 500 : 100
        };
        setUser(enhancedUser);
        localStorage.setItem('user', JSON.stringify(enhancedUser));
        setActiveView('dashboard');
    };

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
            setUser(JSON.parse(savedUser));
            setActiveView('dashboard');
        } else {
            setActiveView('landing');
        }
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setActiveView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
        setActiveView('landing');
    };

    const handleUploadSuccess = (data) => {
        setAnalysisData(data);
        setActiveView('ingesta');
    };

    const handleReset = () => {
        setAnalysisData(null);
    };

    if (!user && !['landing', 'login', 'plan_details', 'register', 'payment', 'contact'].includes(activeView)) {
        setActiveView('landing');
    }

    if (activeView === 'landing' && !user) {
        return <LandingPage onNavigate={handleNavigate} />;
    }

    if (activeView === 'login' && !user) {
        return <Login onLogin={handleLogin} onBack={() => setActiveView('landing')} />;
    }

    if (activeView === 'plan_details' && !user) {
        return <PlanDetails planId={selectedPlanId} onBack={() => setActiveView('landing')} onProceed={handlePlanProceed} />;
    }

    if (activeView === 'register' && !user) {
        return <Register planId={selectedPlanId} onRegister={handleRegister} onBack={() => setActiveView('plan_details')} />;
    }

    if (activeView === 'payment' && !user) {
        return <PaymentGateway planId={selectedPlanId} onPaymentSuccess={handlePaymentSuccess} onBack={() => setActiveView('landing')} />;
    }

    if (activeView === 'contact' && !user) {
        return <ContactForm onSend={() => setActiveView('landing')} onBack={() => setActiveView('plan_details')} />;
    }

    return (
        <div className="app-layout min-h-screen bg-app text-main transition-colors duration-500 selection:bg-indigo-500/30 selection:text-indigo-200">
            <ThemeToggle />
            <Sidebar activeView={activeView} onNavigate={setActiveView} user={user} onLogout={handleLogout} />

            <main className="app-main relative flex flex-col w-full min-h-full overflow-y-auto">
                {activeView === 'dashboard' && <UserDashboard user={user} onLogout={handleLogout} onNavigate={setActiveView} />}

                {activeView === 'hitl' && <HITLDashboard />}

                {activeView === 'blockchain' && <Blockchain />}

                {activeView === 'digital_twin' && (
                    <GemeloDigital
                        record={selectedExpediente}
                        onBack={() => setActiveView('expedients')}
                    />
                )}

                {activeView === 'expedients' && (
                    <Expedientes
                        onViewTwin={(exp) => {
                            setSelectedExpediente(exp);
                            setActiveView('digital_twin');
                        }}
                    />
                )}

                {activeView === 'ingesta' && (
                    <div className="container mx-auto flex flex-col items-center justify-center py-12">
                        {!analysisData ? (
                            <div className="w-full max-w-4xl flex flex-col items-center animate-fade-in-up">
                                <div className="text-center mb-12">
                                    <h1 className="text-4xl md:text-5xl font-black text-main mb-4 tracking-tighter uppercase">
                                        Módulo de Ingesta IA
                                    </h1>
                                    <p className="text-dim max-w-xl mx-auto text-lg font-medium">
                                        Carga documentos para análisis multivariable. Nuestro motor procesará el contenido e identificará riesgos en tiempo real.
                                    </p>
                                </div>
                                <DocumentUpload onUploadSuccess={handleUploadSuccess} />
                            </div>
                        ) : (
                            <HITLPanel data={analysisData} onReset={handleReset} />
                        )}
                    </div>
                )}
            </main>
        </div>
    );
}

export default App;

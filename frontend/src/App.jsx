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

function App() {
    const [user, setUser] = useState(null);
    const [activeView, setActiveView] = useState('dashboard');
    const [analysisData, setAnalysisData] = useState(null);
    const [selectedExpediente, setSelectedExpediente] = useState(null);

    useEffect(() => {
        const savedUser = localStorage.getItem('user');
        if (savedUser) setUser(JSON.parse(savedUser));
    }, []);

    const handleLogin = (userData) => {
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        setActiveView('dashboard');
    };

    const handleLogout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    const handleUploadSuccess = (data) => {
        setAnalysisData(data);
        setActiveView('ingesta');
    };

    const handleReset = () => {
        setAnalysisData(null);
    };

    if (!user) {
        return <Login onLogin={handleLogin} />;
    }

    return (
        <div className="app-layout min-h-screen bg-app text-main transition-colors duration-500 selection:bg-indigo-500/30 selection:text-indigo-200">
            <ThemeToggle />
            <Sidebar activeView={activeView} onNavigate={setActiveView} user={user} />

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

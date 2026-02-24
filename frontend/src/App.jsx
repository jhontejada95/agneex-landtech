import { useState } from 'react'
import './App.css'
import HITLDashboard from './components/HITLDashboard'
import Sidebar from './components/Sidebar'

function App() {
    const [activeView, setActiveView] = useState('hitl')

    return (
        <div className="app-layout">
            <Sidebar activeView={activeView} onNavigate={setActiveView} />
            <main className="app-main">
                {activeView === 'hitl' && <HITLDashboard />}
            </main>
        </div>
    )
}

export default App
